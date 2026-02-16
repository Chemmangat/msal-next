import MsalProviderWrapper from '@/components/MsalProviderWrapper';
import './globals.css';

export const metadata = {
  title: 'MSAL Next.js Boilerplate',
  description: 'Clean MSAL authentication boilerplate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MsalProviderWrapper>{children}</MsalProviderWrapper>
      </body>
    </html>
  );
}
