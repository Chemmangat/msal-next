'use client';

import { useMsalAuth } from '@chemmangat/msal-next';
import { useState } from 'react';

export default function Home() {
  const {
    isAuthenticated,
    account,
    inProgress,
    loginPopup,
    loginRedirect,
    logoutPopup,
    acquireToken,
  } = useMsalAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (useRedirect = false) => {
    try {
      setError(null);
      if (useRedirect) {
        await loginRedirect();
      } else {
        await loginPopup();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logoutPopup();
      setProfile(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await acquireToken(['User.Read']);
      
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (inProgress) {
    return (
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div>Authentication in progress...</div>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>@chemmangat/msal-next Example</h1>
      
      {error && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!isAuthenticated ? (
        <div>
          <p>You are not signed in.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => handleLogin(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#0078d4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Sign In (Popup)
            </button>
            <button 
              onClick={() => handleLogin(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#106ebe',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Sign In (Redirect)
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome!</h2>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <p><strong>Name:</strong> {account?.name}</p>
            <p><strong>Email:</strong> {account?.username}</p>
            <p><strong>Account ID:</strong> {account?.localAccountId}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={fetchProfile}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#107c10',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Loading...' : 'Fetch Profile from Graph API'}
            </button>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#d13438',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>

          {profile && (
            <div>
              <h3>Profile Data from Microsoft Graph</h3>
              <pre style={{ 
                padding: '1rem', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
