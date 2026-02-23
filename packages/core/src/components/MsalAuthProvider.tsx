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

        // Handle redirect promise
        const response = await instance.handleRedirectPromise();
        if (response && config.enableLogging) {
          console.log('[MSAL] Redirect authentication successful');
        }

        // Set up event callbacks
        const enableLogging = config.enableLogging || false;
        instance.addEventCallback((event: EventMessage) => {
          if (event.eventType === EventType.LOGIN_SUCCESS) {
            if (enableLogging) {
              const payload = event.payload as AuthenticationResult;
              console.log('[MSAL] Login successful:', payload.account?.username);
            }
          }
          
          if (event.eventType === EventType.LOGIN_FAILURE) {
            // Always log errors regardless of enableLogging
            console.error('[MSAL] Login failed:', event.error);
          }

          if (event.eventType === EventType.LOGOUT_SUCCESS) {
            if (enableLogging) {
              console.log('[MSAL] Logout successful');
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
