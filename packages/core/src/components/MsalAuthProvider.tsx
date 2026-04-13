'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { useEffect, useState, useRef } from 'react';
import { MsalAuthProviderProps } from '../types';
import { createMsalConfig } from '../utils/createMsalConfig';
import { validateConfig, displayValidationResults } from '../utils/configValidator';
import { wrapMsalError } from '../errors/MsalError';
import { TokenRefreshManager } from './TokenRefreshManager';
import { validateTenantAccess } from '../utils/tenantValidator';

// Module-level variable to store the MSAL instance
let globalMsalInstance: PublicClientApplication | null = null;

// ---------------------------------------------------------------------------
// Session cookie helpers — keep middleware in sync automatically
// ---------------------------------------------------------------------------

/** Writes the msal.account cookie so Next.js middleware can read it server-side. */
function writeMsalSessionCookie(account: AccountInfo): void {
  try {
    const data = encodeURIComponent(JSON.stringify({
      homeAccountId: account.homeAccountId,
      username: account.username,
      name: account.name ?? '',
    }));
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `msal.account=${data}; path=/; SameSite=Lax${secure}`;
  } catch {
    // Non-fatal — middleware will fall back to unauthenticated state
  }
}

/** Clears the msal.account cookie on logout. */
function clearMsalSessionCookie(): void {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `msal.account=; path=/; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`;
  } catch {
    // Non-fatal
  }
}

/**
 * Get the current MSAL instance
 * @returns The MSAL instance or null if not initialized
 */
export function getMsalInstance(): PublicClientApplication | null {
  return globalMsalInstance;
}

export function MsalAuthProvider({ 
  children, 
  loadingComponent, 
  onInitialized,
  autoRefreshToken = false,
  refreshBeforeExpiry = 300,
  onTenantDenied,
  ...config 
}: MsalAuthProviderProps & { onTenantDenied?: (reason: string) => void }) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const instanceRef = useRef<PublicClientApplication | null>(null);

  // Extract these from config for use in TokenRefreshManager
  const { scopes = ['User.Read'], enableLogging = false } = config;

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
        // Validate configuration in development mode
        if (process.env.NODE_ENV === 'development') {
          const validationResult = validateConfig(config);
          displayValidationResults(validationResult);
        }

        const msalConfig = createMsalConfig(config);
        const instance = new PublicClientApplication(msalConfig);
        
        await instance.initialize();

        // Handle redirect promise
        // msal-browser v5 changed handleRedirectPromise to accept an options object
        try {
          const isMsalV5 = (() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const pkg = require('@azure/msal-browser/package.json');
              return parseInt(pkg.version.split('.')[0], 10) >= 5;
            } catch { return false; }
          })();

          const response = await (isMsalV5
            ? (instance.handleRedirectPromise as Function)({
                navigateToLoginRequestUrl: config.navigateToLoginRequestUrl ?? false,
              })
            : instance.handleRedirectPromise());
          
          if (response) {
            if (config.enableLogging) {
              console.log('[MSAL] Redirect authentication successful');
            }
            
            // Set the active account after successful redirect
            if (response.account) {
              instance.setActiveAccount(response.account);
              // Auto-sync session cookie
              writeMsalSessionCookie(response.account);

              // Tenant validation (v5.1.0)
              if (config.multiTenant) {
                const validation = validateTenantAccess(response.account, config.multiTenant);
                if (!validation.allowed) {
                  // Sign the user out silently so they don't stay in a broken state
                  try { await instance.logoutRedirect({ account: response.account }); } catch {}
                  const reason = validation.reason || 'Tenant access denied.';
                  if (onTenantDenied) {
                    onTenantDenied(reason);
                  } else {
                    console.error('[MSAL] Tenant access denied:', reason);
                  }
                  return;
                }
              }
            }
            
            // Clean URL hash
            if (window.location.hash) {
              // Remove hash without triggering a page reload
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
        } catch (redirectError: any) {
          const msalError = wrapMsalError(redirectError);
          
          // Handle specific MSAL errors gracefully
          if (msalError.code === 'no_token_request_cache_error') {
            // This error occurs when there's no cached token request (e.g., page refresh during auth)
            // It's safe to ignore as it just means there's no pending redirect
            if (config.enableLogging) {
              console.log('[MSAL] No pending redirect found (this is normal)');
            }
          } else if (msalError.isUserCancellation()) {
            // User cancelled the authentication flow
            if (config.enableLogging) {
              console.log('[MSAL] User cancelled authentication');
            }
          } else {
            // Log other errors but don't throw - allow app to continue
            if (process.env.NODE_ENV === 'development') {
              console.error(msalError.toConsoleString());
            } else {
              console.error('[MSAL] Redirect handling error:', msalError.message);
            }
          }
          
          // Clean up URL even on error if there's a hash
          if (window.location.hash && (window.location.hash.includes('code=') || window.location.hash.includes('error='))) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }

        // Set active account if there's an existing account in cache
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0 && !instance.getActiveAccount()) {
          instance.setActiveAccount(accounts[0]);
          // Restore session cookie in case it was cleared (e.g. browser restart with localStorage cache)
          writeMsalSessionCookie(accounts[0]);
        }

        // Set up event callbacks
        const loggingEnabled = config.enableLogging || false;
        instance.addEventCallback((event: EventMessage) => {
          if (event.eventType === EventType.LOGIN_SUCCESS) {
            // msal-browser v5: LOGIN_SUCCESS payload is AccountInfo, not AuthenticationResult
            // msal-browser v3/v4: payload is AuthenticationResult with an .account property
            const payload = event.payload as AccountInfo | AuthenticationResult;
            const account = 'account' in payload ? (payload as AuthenticationResult).account : payload as AccountInfo;
            if (account) {
              instance.setActiveAccount(account);
              // Auto-sync session cookie so middleware works out of the box
              writeMsalSessionCookie(account);
            }
            if (loggingEnabled) {
              console.log('[MSAL] Login successful:', account?.username);
            }
          }
          
          // EventType.LOGIN_FAILURE was removed in msal-browser v5; login failures now
          // surface as ACQUIRE_TOKEN_FAILURE. Support both for v3/v4 backward compat.
          if (
            event.eventType === EventType.ACQUIRE_TOKEN_FAILURE ||
            // LOGIN_FAILURE may be undefined in v5 — guard with optional chaining
            (EventType as any).LOGIN_FAILURE !== undefined &&
            event.eventType === (EventType as any).LOGIN_FAILURE
          ) {
            // Always log auth errors regardless of enableLogging
            console.error('[MSAL] Authentication failed:', event.error);
          }

          if (event.eventType === EventType.LOGOUT_SUCCESS) {
            // Clear active account on logout
            instance.setActiveAccount(null);
            // Clear session cookie
            clearMsalSessionCookie();
            if (loggingEnabled) {
              console.log('[MSAL] Logout successful');
            }
          }

          // LOGOUT_END covers cases where logout completes without a server round-trip
          if ((EventType as any).LOGOUT_END !== undefined &&
              event.eventType === (EventType as any).LOGOUT_END) {
            clearMsalSessionCookie();
          }

          if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
            const payload = event.payload as AuthenticationResult;
            // Ensure active account is set
            if (payload?.account && !instance.getActiveAccount()) {
              instance.setActiveAccount(payload.account);
            }
          }

          if (event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
            if (loggingEnabled) {
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

  return (
    <MsalProvider instance={msalInstance}>
      {autoRefreshToken && (
        <TokenRefreshManager
          enabled={autoRefreshToken}
          refreshBeforeExpiry={refreshBeforeExpiry}
          scopes={scopes}
          enableLogging={enableLogging}
        />
      )}
      {children}
    </MsalProvider>
  );
}
