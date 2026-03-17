'use client'

import { createContext, useContext } from 'react'
import { MsalAuthProvider } from './MsalAuthProvider'
import type { MsalAuthProviderProps, MultiTenantConfig } from '../types'
import type { AuthProtectionConfig } from '../protection/types'

interface MSALProviderProps extends MsalAuthProviderProps {
  /**
   * Zero-Config Protected Routes configuration (v4.0.0)
   */
  protection?: AuthProtectionConfig;
  /**
   * Called when a user's tenant is denied access (v5.1.0)
   */
  onTenantDenied?: (reason: string) => void;
}

// Context for protection config
const ProtectionConfigContext = createContext<AuthProtectionConfig | undefined>(undefined);

// Context for multi-tenant config (v5.1.0)
const TenantConfigContext = createContext<MultiTenantConfig | undefined>(undefined);

export function useProtectionConfig() {
  return useContext(ProtectionConfigContext);
}

/**
 * Access the multi-tenant configuration from anywhere in the tree (v5.1.0).
 *
 * @example
 * ```tsx
 * const tenantConfig = useTenantConfig();
 * console.log(tenantConfig?.allowList);
 * ```
 */
export function useTenantConfig(): MultiTenantConfig | undefined {
  return useContext(TenantConfigContext);
}

/**
 * Pre-configured MSALProvider component for Next.js App Router layouts.
 *
 * @remarks
 * Already marked as 'use client' internally — safe to import in server layouts.
 *
 * @example
 * ```tsx
 * // app/layout.tsx (Server Component)
 * import { MSALProvider } from '@chemmangat/msal-next'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <MSALProvider
 *           clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
 *           tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
 *           multiTenant={{ type: 'multi', allowList: ['contoso.com'] }}
 *         >
 *           {children}
 *         </MSALProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function MSALProvider({ children, protection, onTenantDenied, ...props }: MSALProviderProps) {
  return (
    <ProtectionConfigContext.Provider value={protection}>
      <TenantConfigContext.Provider value={props.multiTenant}>
        <MsalAuthProvider {...props} onTenantDenied={onTenantDenied}>{children}</MsalAuthProvider>
      </TenantConfigContext.Provider>
    </ProtectionConfigContext.Provider>
  )
}
