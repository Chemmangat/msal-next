'use client';

import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';

export default function Home() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e: Error) => {
      console.error('Login failed:', e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e: Error) => {
      console.error('Logout failed:', e);
    });
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>MSAL Next.js Boilerplate</h1>
      
      {!isAuthenticated ? (
        <div>
          <p>You are not signed in.</p>
          <button onClick={handleLogin}>Sign In</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {accounts[0].name}!</p>
          <p>Email: {accounts[0].username}</p>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </main>
  );
}
