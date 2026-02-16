'use client';

import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/config/authConfig';
import { ReactNode, useEffect, useState } from 'react';

export default function MsalProviderWrapper({ children }: { children: ReactNode }) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    const instance = new PublicClientApplication(msalConfig);
    instance.initialize().then(() => {
      setMsalInstance(instance);
    });
  }, []);

  if (!msalInstance) {
    return <div>Loading...</div>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
