'use client'

import { createContext, useContext } from 'react'
import { MsalAuthProvider } from './MsalAuthProvider'
import type { MsalAuthProviderProps } from '../types'
import type { AuthProtectionConfig } from '../protection/types'

interface MSALProviderProps extends MsalAuthProviderProps {
  /**
   * Zero-Config Protected Routes configuration (v4.0.0)
   * @example
   * ```tsx
   * <MSALProvider
   *   clientId="..."
   *   protection={{
   *     defaultRedirectTo: '/login',
   *     defaultLoading: <Spinner />,
   *     debug: true
   *   }}
   * >
   * ```
   */
  protection?: AuthProtectionConfig;
}

// Context for protection config
const ProtectionConfigContext = createContext<AuthProtectionConfig | undefined>(undefined);

export function useProtectionConfig() {
  return useContext(ProtectionConfigContext);
}

/**
 * Pre-configured MSALProvider component for Next.js App Router layouts.
 * This component is already marked as 'use client', so you can use it directly
 * in your server-side layout.tsx without needing to create a separate client component.
 * 
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { MSALProvider } from '@chemmangat/msal-next'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <MSALProvider
 *           clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
 *           tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
 *         >
 *           {children}
 *         </MSALProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function MSALProvider({ children, protection, ...props }: MSALProviderProps) {
  return (
    <ProtectionConfigContext.Provider value={protection}>
      <MsalAuthProvider {...props}>{children}</MsalAuthProvider>
    </ProtectionConfigContext.Provider>
  )
}
