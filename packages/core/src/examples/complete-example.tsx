/**
 * Complete Example - Showcasing all features of @chemmangat/msal-next
 * 
 * This example demonstrates:
 * - Authentication flow
 * - User profile display
 * - Role-based access control
 * - MS Graph API calls
 * - Error handling
 * - Debug logging
 */

'use client';

import {
  MsalAuthProvider,
  MicrosoftSignInButton,
  SignOutButton,
  UserAvatar,
  AuthStatus,
  AuthGuard,
  ErrorBoundary,
  useMsalAuth,
  useUserProfile,
  useRoles,
  useGraphApi,
  getDebugLogger,
} from '@chemmangat/msal-next';
import { useState } from 'react';

// Initialize debug logger
const logger = getDebugLogger({
  enabled: process.env.NODE_ENV === 'development',
  level: 'debug',
});

/**
 * Root App Component with Provider
 */
export function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Authentication Error</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
      onError={(error) => logger.error('Auth error occurred', error)}
    >
      <MsalAuthProvider
        clientId={process.env.NEXT_PUBLIC_MSAL_CLIENT_ID!}
        tenantId={process.env.NEXT_PUBLIC_MSAL_TENANT_ID}
        scopes={['User.Read', 'Mail.Read']}
        enableLogging={true}
        onInitialized={(instance) => {
          logger.info('MSAL initialized', {
            accounts: instance.getAllAccounts().length,
          });
        }}
      >
        <MainContent />
      </MsalAuthProvider>
    </ErrorBoundary>
  );
}

/**
 * Main Content - Shows different views based on auth state
 */
function MainContent() {
  const { isAuthenticated } = useMsalAuth();

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <Header />
      
      {isAuthenticated ? (
        <AuthenticatedView />
      ) : (
        <UnauthenticatedView />
      )}
    </div>
  );
}

/**
 * Header with Auth Status
 */
function Header() {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #ccc'
    }}>
      <h1>@chemmangat/msal-next Demo</h1>
      <AuthStatus showDetails />
    </header>
  );
}

/**
 * View for unauthenticated users
 */
function UnauthenticatedView() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Welcome!</h2>
      <p>Sign in to access your profile and data</p>
      <MicrosoftSignInButton
        variant="dark"
        size="large"
        onSuccess={() => logger.info('User signed in successfully')}
        onError={(error) => logger.error('Sign in failed', error)}
      />
    </div>
  );
}

/**
 * View for authenticated users
 */
function AuthenticatedView() {
  return (
    <div>
      <UserProfileSection />
      <RoleBasedContent />
      <GraphApiDemo />
      <SignOutSection />
    </div>
  );
}

/**
 * User Profile Section
 */
function UserProfileSection() {
  const { account } = useMsalAuth();
  const { profile, loading, error, refetch } = useUserProfile();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <p>Error loading profile: {error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <section style={{ 
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h2>Your Profile</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <UserAvatar size={80} />
        <div>
          <h3>{profile?.displayName}</h3>
          <p>Email: {profile?.mail}</p>
          <p>Job Title: {profile?.jobTitle || 'N/A'}</p>
          <p>Office: {profile?.officeLocation || 'N/A'}</p>
          <p>Account ID: {account?.homeAccountId}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * Role-Based Content
 */
function RoleBasedContent() {
  const { roles, groups, hasRole, hasAnyRole, loading } = useRoles();

  if (loading) {
    return <div>Loading roles...</div>;
  }

  return (
    <section style={{ 
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h2>Your Roles & Permissions</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <h3>Roles:</h3>
        {roles.length > 0 ? (
          <ul>
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        ) : (
          <p>No roles assigned</p>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h3>Groups:</h3>
        <p>{groups.length} group(s)</p>
      </div>

      <div>
        <h3>Access Levels:</h3>
        {hasRole('Admin') && (
          <div style={{ padding: '10px', backgroundColor: '#d4edda', marginBottom: '10px' }}>
            ✅ Admin Access
          </div>
        )}
        {hasAnyRole(['Editor', 'Contributor']) && (
          <div style={{ padding: '10px', backgroundColor: '#d1ecf1', marginBottom: '10px' }}>
            ✅ Editor Access
          </div>
        )}
        {!hasRole('Admin') && !hasAnyRole(['Editor', 'Contributor']) && (
          <div style={{ padding: '10px', backgroundColor: '#fff3cd' }}>
            ℹ️ Viewer Access
          </div>
        )}
      </div>

      {/* Protected content example */}
      {hasRole('Admin') && (
        <AuthGuard>
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff',
            border: '2px solid #28a745',
            borderRadius: '4px'
          }}>
            <h4>🔒 Admin-Only Content</h4>
            <p>This content is only visible to administrators.</p>
          </div>
        </AuthGuard>
      )}
    </section>
  );
}

/**
 * MS Graph API Demo
 */
function GraphApiDemo() {
  const graph = useGraphApi();
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info('Fetching emails from MS Graph');
      
      const response = await graph.get<{ value: any[] }>('/me/messages', {
        scopes: ['Mail.Read'],
        debug: true,
      });

      setEmails(response.value.slice(0, 5)); // Show first 5
      logger.info('Emails fetched successfully', { count: response.value.length });
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      logger.error('Failed to fetch emails', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ 
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <h2>MS Graph API Demo</h2>
      <p>Fetch your recent emails using MS Graph API</p>
      
      <button
        onClick={fetchEmails}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0078D4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px',
        }}
      >
        {loading ? 'Loading...' : 'Fetch Emails'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          Error: {error}
        </div>
      )}

      {emails.length > 0 && (
        <div>
          <h3>Recent Emails:</h3>
          <ul>
            {emails.map((email) => (
              <li key={email.id} style={{ marginBottom: '10px' }}>
                <strong>{email.subject}</strong>
                <br />
                <small>From: {email.from?.emailAddress?.address}</small>
                <br />
                <small>Received: {new Date(email.receivedDateTime).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/**
 * Sign Out Section
 */
function SignOutSection() {
  const { account } = useMsalAuth();

  return (
    <section style={{ 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <p>Signed in as: <strong>{account?.username}</strong></p>
      <SignOutButton
        variant="light"
        size="medium"
        onSuccess={() => logger.info('User signed out successfully')}
      />
    </section>
  );
}

export default App;
