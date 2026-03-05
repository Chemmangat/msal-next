'use client'

import { MsalAuthProvider } from './MsalAuthProvider'
import type { MsalAuthProviderProps } from '../types'

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
export function MSALProvider({ children, ...props }: MsalAuthProviderProps) {
  return <MsalAuthProvider {...props}>{children}</MsalAuthProvider>
}
