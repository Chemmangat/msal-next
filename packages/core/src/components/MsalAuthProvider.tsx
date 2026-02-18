'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { useEffect, useState, useRef } from 'react';
import { MsalAuthProviderProps } from '../types';
import { createMsalConfig } from '../utils/createMsalConfig';

export function MsalAuthProvider({ children, loadingComponent, ...config }: MsalAuthProviderProps) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const instanceRef = useRef<PublicClientApplication | null>(null);

  useEffect(() => {
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
        if (response) {
          console.log('[MSAL] Redirect authentication successful');
        }

        // Optional: Set up event callbacks
        instance.addEventCallback((event: EventMessage) => {
          if (event.eventType === EventType.LOGIN_SUCCESS) {
            const payload = event.payload as AuthenticationResult;
            console.log('[MSAL] Login successful:', payload.account?.username);
          }
          
          if (event.eventType === EventType.LOGIN_FAILURE) {
            console.error('[MSAL] Login failed:', event.error);
          }

          if (event.eventType === EventType.LOGOUT_SUCCESS) {
            console.log('[MSAL] Logout successful');
          }
        });

        instanceRef.current = instance;
        setMsalInstance(instance);
      } catch (error) {
        console.error('[MSAL] Initialization failed:', error);
        throw error;
      }
    };

    initializeMsal();
  }, []); // Empty dependency array - only initialize once

  if (!msalInstance) {
    return <>{loadingComponent || <div>Loading authentication...</div>}</>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
