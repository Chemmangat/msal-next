/**
 * Zero-Config Protected Routes - Core Component
 * v4.0.0 Killer Feature
 */

'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useMsalAuth } from '../hooks/useMsalAuth';
import { useTenant } from '../hooks/useTenant';
import { validateTenantAccess } from '../utils/tenantValidator';
import { PageAuthConfig } from './types';

interface ProtectedPageProps {
  children: ReactNode;
  config: PageAuthConfig;
  defaultRedirectTo?: string;
  defaultLoading?: ReactNode;
  defaultUnauthorized?: ReactNode;
  debug?: boolean;
}

/**
 * Internal component that wraps pages with auth protection
 * This is automatically used when you export `auth` from your page
 */
export function ProtectedPage({
  children,
  config,
  defaultRedirectTo = '/login',
  defaultLoading,
  defaultUnauthorized,
  debug = false
}: ProtectedPageProps) {
  const router = useRouter();
  const { isAuthenticated, account, inProgress } = useMsalAuth();
  const tenantInfo = useTenant();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (debug) {
        console.log('[ProtectedPage] Checking auth...', {
          isAuthenticated,
          inProgress,
          config
        });
      }

      // Wait for MSAL to finish initialization
      if (inProgress) {
        return;
      }

      // Check if auth is required
      if (!config.required) {
        setIsAuthorized(true);
        setIsValidating(false);
        return;
      }

      // Check authentication
      if (!isAuthenticated || !account) {
        if (debug) {
          console.log('[ProtectedPage] Not authenticated, redirecting...');
        }
        
        const redirectPath = config.redirectTo || defaultRedirectTo;
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`${redirectPath}?returnUrl=${returnUrl}`);
        return;
      }

      // Check roles if specified
      if (config.roles && config.roles.length > 0) {
        const userRoles = (account.idTokenClaims as any)?.roles || [];
        const hasRequiredRole = config.roles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          if (debug) {
            console.log('[ProtectedPage] Missing required role', {
              required: config.roles,
              user: userRoles
            });
          }
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }
      }

      // Tenant validation (v5.1.0)
      if (config.tenant && account) {
        const tenantResult = validateTenantAccess(account, config.tenant);
        if (!tenantResult.allowed) {
          if (debug) {
            console.log('[ProtectedPage] Tenant validation failed:', tenantResult.reason);
          }
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }
      }

      // Custom validation
      if (config.validate) {        try {
          const isValid = await config.validate(account);
          if (!isValid) {
            if (debug) {
              console.log('[ProtectedPage] Custom validation failed');
            }
            setIsAuthorized(false);
            setIsValidating(false);
            return;
          }
        } catch (error) {
          console.error('[ProtectedPage] Validation error:', error);
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }
      }

      // All checks passed
      if (debug) {
        console.log('[ProtectedPage] Authorization successful');
      }
      setIsAuthorized(true);
      setIsValidating(false);
    }

    checkAuth();
  }, [isAuthenticated, account, inProgress, config, router, defaultRedirectTo, debug, tenantInfo]);

  // Show loading state
  if (isValidating || inProgress) {
    if (config.loading) {
      return <>{config.loading}</>;
    }
    if (defaultLoading) {
      return <>{defaultLoading}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show unauthorized state
  if (!isAuthorized) {
    if (config.unauthorized) {
      return <>{config.unauthorized}</>;
    }
    if (defaultUnauthorized) {
      return <>{defaultUnauthorized}</>;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
