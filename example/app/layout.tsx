import { MsalAuthProvider } from '@chemmangat/msal-next';
import './globals.css';

export const metadata = {
  title: '@chemmangat/msal-next Example',
  description: 'Example app demonstrating @chemmangat/msal-next package',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MsalAuthProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_TENANT_ID}
          authorityType={process.env.NEXT_PUBLIC_AUTHORITY_TYPE as any || 'common'}
          redirectUri={process.env.NEXT_PUBLIC_REDIRECT_URI}
          scopes={process.env.NEXT_PUBLIC_SCOPES?.split(',') || ['User.Read']}
          enableLogging={process.env.NODE_ENV === 'development'}
          loadingComponent={
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100vh' 
            }}>
              <div>Loading authentication...</div>
            </div>
          }
        >
          {children}
        </MsalAuthProvider>
      </body>
    </html>
  );
}
