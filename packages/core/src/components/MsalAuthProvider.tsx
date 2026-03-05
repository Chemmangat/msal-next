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

  useEffect(() => {
    // SSR safety guard
    if (typeof window === 'undefined') {
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
        
        // Only handle redirect promise if NOT in a popup window
        if (!isInPopup) {
          try {
            const response = await instance.handleRedirectPromise();
            if (response) {
              if (config.enableLogging) {
                console.log('[MSAL] Redirect authentication successful');
              }
              // Set the active account after successful redirect
              if (response.account) {
                instance.setActiveAccount(response.account);
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
          }
        } else {
          // In popup window - just handle the redirect without processing
          if (config.enableLogging) {
            console.log('[MSAL] Running in popup window, skipping redirect handling');
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

  if (!msalInstance) {
    return <>{loadingComponent || <div>Loading authentication...</div>}</>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
