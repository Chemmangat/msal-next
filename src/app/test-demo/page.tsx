'use client';

import { useState } from 'react';
import { MSALProvider, useMsalAuth, MicrosoftSignInButton, SignOutButton, UserAvatar, useUserProfile, useGraphApi } from '@chemmangat/msal-next';
import { CheckCircle, XCircle, Loader2, User, Mail, Briefcase, MapPin } from 'lucide-react';

export default function TestDemoPage() {
  const [clientId, setClientId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-elevated border border-dark-border rounded-xl p-8">
          <h1 className="text-2xl font-bold text-dark-text mb-6">Configure MSAL Test</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Azure AD Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="12345678-1234-1234-1234-123456789012"
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Azure AD Tenant ID (optional)
              </label>
              <input
                type="text"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                placeholder="87654321-4321-4321-4321-210987654321"
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <button
              onClick={() => clientId && setIsConfigured(true)}
              disabled={!clientId}
              className="w-full px-4 py-3 bg-accent-primary hover:bg-accent-primary/90 disabled:bg-dark-border disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MSALProvider
      clientId={clientId}
      tenantId={tenantId || undefined}
      enableLogging={true}
      scopes={['User.Read', 'User.ReadBasic.All']}
    >
      <TestContent onReset={() => setIsConfigured(false)} />
    </MSALProvider>
  );
}

function TestContent({ onReset }: { onReset: () => void }) {
  const { isAuthenticated, inProgress, account, loginRedirect, logoutRedirect, acquireToken } = useMsalAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const graph = useGraphApi();
  const [tokenTest, setTokenTest] = useState<{ success: boolean; token?: string; error?: string } | null>(null);

  const testTokenAcquisition = async () => {
    try {
      const token = await acquireToken(['User.Read']);
      setTokenTest({ success: true, token: token.substring(0, 50) + '...' });
    } catch (error: any) {
      setTokenTest({ success: false, error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-text mb-2">
                @chemmangat/msal-next Test Demo
              </h1>
              <p className="text-dark-muted">v3.1.9 - Production Package Test</p>
            </div>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-dark-bg border border-dark-border text-dark-text rounded-lg hover:bg-dark-border transition-colors"
            >
              Reset Config
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatusCard
            title="Authentication"
            status={isAuthenticated ? 'success' : inProgress ? 'loading' : 'idle'}
            message={isAuthenticated ? 'Authenticated' : inProgress ? 'In Progress' : 'Not Authenticated'}
          />
          <StatusCard
            title="Profile Loading"
            status={profileLoading ? 'loading' : profile ? 'success' : profileError ? 'error' : 'idle'}
            message={profileLoading ? 'Loading...' : profile ? 'Loaded' : profileError ? 'Error' : 'Not Loaded'}
          />
          <StatusCard
            title="Package Status"
            status="success"
            message="Bundle Loaded"
          />
        </div>

        {/* Main Content */}
        {!isAuthenticated && !inProgress && (
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-dark-text mb-4">Sign In to Test</h2>
            <p className="text-dark-muted mb-8">
              Click the button below to test the authentication flow
            </p>
            <MicrosoftSignInButton
              variant="dark"
              size="large"
              onSuccess={() => console.log('✅ Sign in successful')}
              onError={(error) => console.error('❌ Sign in failed:', error)}
            />
          </div>
        )}

        {inProgress && (
          <div className="bg-dark-elevated border border-dark-border rounded-xl p-12 text-center">
            <Loader2 className="w-12 h-12 text-accent-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dark-text mb-2">Authenticating...</h2>
            <p className="text-dark-muted">Please wait while we connect to Microsoft</p>
          </div>
        )}

        {isAuthenticated && (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-accent-success/10 border border-accent-success/30 rounded-xl p-6 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-accent-success flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-accent-success mb-1">
                  Authentication Successful! ✨
                </h3>
                <p className="text-sm text-dark-muted">
                  Package is working correctly. All components loaded successfully.
                </p>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-dark-text mb-4">User Profile</h3>
              
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                </div>
              ) : profileError ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
                  Error loading profile: {profileError.message}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <UserAvatar size={80} showTooltip={false} />
                    <div>
                      <h4 className="text-2xl font-bold text-dark-text">
                        {profile?.displayName || account?.name || 'User'}
                      </h4>
                      <p className="text-dark-muted">{profile?.mail || account?.username}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField
                      icon={<User className="w-5 h-5" />}
                      label="Display Name"
                      value={profile?.displayName}
                    />
                    <ProfileField
                      icon={<Mail className="w-5 h-5" />}
                      label="Email"
                      value={profile?.mail}
                    />
                    <ProfileField
                      icon={<Briefcase className="w-5 h-5" />}
                      label="Job Title"
                      value={profile?.jobTitle}
                    />
                    <ProfileField
                      icon={<MapPin className="w-5 h-5" />}
                      label="Office Location"
                      value={profile?.officeLocation}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Token Test */}
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-dark-text mb-4">Token Acquisition Test</h3>
              <button
                onClick={testTokenAcquisition}
                className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg font-semibold transition-all mb-4"
              >
                Test acquireToken()
              </button>
              
              {tokenTest && (
                <div className={`p-4 rounded-lg ${tokenTest.success ? 'bg-accent-success/10 border border-accent-success/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  {tokenTest.success ? (
                    <div>
                      <p className="text-accent-success font-semibold mb-2">✅ Token acquired successfully</p>
                      <code className="text-xs text-dark-muted break-all">{tokenTest.token}</code>
                    </div>
                  ) : (
                    <p className="text-red-500">❌ {tokenTest.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Account Details */}
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-dark-text mb-4">Account Details</h3>
              <div className="bg-dark-bg border border-dark-border rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-dark-text">
                  <code>{JSON.stringify(account, null, 2)}</code>
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <SignOutButton
                variant="light"
                onSuccess={() => console.log('✅ Sign out successful')}
              />
            </div>
          </div>
        )}

        {/* Package Info */}
        <div className="mt-6 bg-dark-elevated border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-dark-text mb-4">Package Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-dark-muted">Package:</span>
              <span className="text-dark-text ml-2 font-mono">@chemmangat/msal-next</span>
            </div>
            <div>
              <span className="text-dark-muted">Version:</span>
              <span className="text-dark-text ml-2 font-mono">3.1.9</span>
            </div>
            <div>
              <span className="text-dark-muted">Bundle Size (Client):</span>
              <span className="text-dark-text ml-2 font-mono">~23KB (minified)</span>
            </div>
            <div>
              <span className="text-dark-muted">Bundle Size (Server):</span>
              <span className="text-dark-text ml-2 font-mono">~1.3KB (minified)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, status, message }: { title: string; status: 'success' | 'error' | 'loading' | 'idle'; message: string }) {
  const icons = {
    success: <CheckCircle className="w-6 h-6 text-accent-success" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    loading: <Loader2 className="w-6 h-6 text-accent-primary animate-spin" />,
    idle: <div className="w-6 h-6 rounded-full bg-dark-border" />,
  };

  return (
    <div className="bg-dark-elevated border border-dark-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        {icons[status]}
        <h3 className="font-semibold text-dark-text">{title}</h3>
      </div>
      <p className="text-sm text-dark-muted">{message}</p>
    </div>
  );
}

function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2 text-dark-muted">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-dark-text font-semibold">{value || 'N/A'}</p>
    </div>
  );
}
