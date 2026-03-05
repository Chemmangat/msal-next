'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { useEffect, useState, useRef } from 'react';
import { MsalAuthProviderProps } from '../types';
import { createMsalConfig } from '../utils/createMsalConfig';

// Module-level variable to store the MSAL instance
let globalMsalInstance: PublicClientApplication | null = null;

/**
 * Get the current MSAL instance
 * @returns The MSAL instance or null if not initialized
 */
export function getMsalInstance(): PublicClientApplication | null {
  return globalMsalInstance;
}

export function MsalAuthProvider({ children, loadingComponent, onInitialized, ...config }: MsalAuthProviderProps) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const instanceRef = useRef<PublicClientApplication | null>(null);

  // Early popup detection - before any rendering
  const isInPopup = typeof window !== 'undefined' && window.opener && window.opener !== window;

  useEffect(() => {
    // SSR safety guard
    if (typeof window === 'undefined') {
      return;
    }

    // If we're in a popup, don't initialize the full provider
    // MSAL will handle the popup internally
    if (isInPopup) {
      if (config.enableLogging) {
        console.log('[MSAL] Detected popup window - minimal initialization');
      }
      return;
    }

    // Prevent multiple initializations
    if (instanceRef.current) {
      return;
    }

    const initializeMsal = async () => {
      try {
        const msalConfig = createMsalConfig(config);
        const instance = new PublicClientApplication(msalConfig);
        
        await instance.initialize();

        // Check if we're in a popup window
        const isInPopup = window.opener && window.opener !== window;
        
        // Always handle redirect promise, but handle differently for popup vs main window
        try {
          const response = await instance.handleRedirectPromise();
          
          if (response) {
            if (config.enableLogging) {
              console.log('[MSAL] Redirect authentication successful', isInPopup ? '(popup)' : '(main)');
            }
            
            // Set the active account after successful redirect
            if (response.account) {
              instance.setActiveAccount(response.account);
            }
            
            // Only clean URL in main window, not in popup (popup will close automatically)
            if (!isInPopup && window.location.hash) {
              // Remove hash without triggering a page reload
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
        } catch (redirectError: any) {
          // Handle specific MSAL errors gracefully
          if (redirectError?.errorCode === 'no_token_request_cache_error') {
            // This error occurs when there's no cached token request (e.g., page refresh during auth)
            // It's safe to ignore as it just means there's no pending redirect
            if (config.enableLogging) {
              console.log('[MSAL] No pending redirect found (this is normal)');
            }
          } else if (redirectError?.errorCode === 'user_cancelled') {
            // User cancelled the authentication flow
            if (config.enableLogging) {
              console.log('[MSAL] User cancelled authentication');
            }
          } else {
            // Log other errors but don't throw - allow app to continue
            console.error('[MSAL] Redirect handling error:', redirectError);
          }
          
          // Clean up URL even on error if there's a hash (only in main window)
          if (!isInPopup && window.location.hash && (window.location.hash.includes('code=') || window.location.hash.includes('error='))) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }

        // Set active account if there's an existing account in cache
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0 && !instance.getActiveAccount()) {
          instance.setActiveAccount(accounts[0]);
        }

        // Set up event callbacks
        const enableLogging = config.enableLogging || false;
        instance.addEventCallback((event: EventMessage) => {
          if (event.eventType === EventType.LOGIN_SUCCESS) {
            const payload = event.payload as AuthenticationResult;
            // Set active account on successful login
            if (payload?.account) {
              instance.setActiveAccount(payload.account);
            }
            if (enableLogging) {
              console.log('[MSAL] Login successful:', payload.account?.username);
            }
          }
          
          if (event.eventType === EventType.LOGIN_FAILURE) {
            // Always log errors regardless of enableLogging
            console.error('[MSAL] Login failed:', event.error);
          }

          if (event.eventType === EventType.LOGOUT_SUCCESS) {
            // Clear active account on logout
            instance.setActiveAccount(null);
            if (enableLogging) {
              console.log('[MSAL] Logout successful');
            }
          }

          if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
            const payload = event.payload as AuthenticationResult;
            // Ensure active account is set
            if (payload?.account && !instance.getActiveAccount()) {
              instance.setActiveAccount(payload.account);
            }
          }

          if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
            if (enableLogging) {
              console.error('[MSAL] Token acquisition failed:', event.error);
            }
          }
        });

        instanceRef.current = instance;
        globalMsalInstance = instance;
        setMsalInstance(instance);

        // Call onInitialized callback if provided
        if (onInitialized) {
          onInitialized(instance);
        }
      } catch (error) {
        console.error('[MSAL] Initialization failed:', error);
        throw error;
      }
    };

    initializeMsal();
  }, []); // Empty dependency array - only initialize once

  // SSR safety guard - render children or loading component on server
  if (typeof window === 'undefined') {
    return <>{loadingComponent || <div>Loading authentication...</div>}</>;
  }

  // If we're in a popup window, render nothing (MSAL handles it)
  if (isInPopup) {
    return <div style={{ display: 'none' }}>Completing authentication...</div>;
  }

  if (!msalInstance) {
    return <>{loadingComponent || <div>Loading authentication...</div>}</>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
