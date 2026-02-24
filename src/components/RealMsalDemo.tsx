'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { MsalAuthProvider, useMsalAuth, MicrosoftSignInButton, SignOutButton, UserAvatar, useUserProfile } from '../../packages/core/src/index';

interface RealMsalDemoProps {
  clientId: string;
  onReset: () => void;
}

export function RealMsalDemo({ clientId, onReset }: RealMsalDemoProps) {
  return (
    <MsalAuthProvider 
      clientId={clientId}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
      enableLogging={true}
    >
      <DemoContent onReset={onReset} />
    </MsalAuthProvider>
  );
}

function DemoContent({ onReset }: { onReset: () => void }) {
  const { isAuthenticated, inProgress, account } = useMsalAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [showFullProfile, setShowFullProfile] = React.useState(false);

  return (
    <div className="bg-dark-elevated border border-dark-border rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Demo Header */}
      <div className="px-6 py-4 border-b border-dark-border bg-dark-bg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm text-dark-muted">Live Demo - Real MSAL</span>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-dark-muted hover:text-dark-text transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Demo Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {!isAuthenticated && !inProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MicrosoftSignInButton 
              variant="dark"
              size="large"
              onSuccess={() => console.log('Signed in successfully!')}
              onError={(error: Error) => console.error('Sign in failed:', error)}
            />
            <p className="text-sm text-dark-muted mt-4">
              Click to sign in with your real Microsoft account
            </p>
          </motion.div>
        )}

        {inProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-dark-text font-semibold">Authenticating...</p>
            <p className="text-sm text-dark-muted mt-2">Connecting to Microsoft</p>
          </motion.div>
        )}

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Banner */}
            <div className="bg-accent-success/10 border border-accent-success/30 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-accent-success flex-shrink-0" />
              <div>
                <p className="text-accent-success font-semibold">Authentication Successful!</p>
                <p className="text-xs text-dark-muted mt-1">Signed in as: {account?.username}</p>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
              {profileLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full mx-auto mb-2 animate-spin" />
                  <p className="text-sm text-dark-muted">Loading profile...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar size={64} />
                    <div>
                      <h3 className="text-lg font-semibold text-dark-text">
                        {profile?.displayName || account?.name || 'User'}
                      </h3>
                      <p className="text-sm text-dark-muted">
                        {profile?.mail || account?.username}
                      </p>
                    </div>
                  </div>
                  
                  {profile && (
                    <div className="space-y-2 text-sm">
                      {profile.jobTitle && (
                        <div className="flex justify-between">
                          <span className="text-dark-muted">Job Title:</span>
                          <span className="text-dark-text">{profile.jobTitle}</span>
                        </div>
                      )}
                      {profile.officeLocation && (
                        <div className="flex justify-between">
                          <span className="text-dark-muted">Office:</span>
                          <span className="text-dark-text">{profile.officeLocation}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-dark-muted">Status:</span>
                        <span className="text-accent-success">● Active</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFullProfile(true)}
                className="flex-1 px-4 py-3 bg-dark-bg border border-dark-border text-dark-text rounded-lg font-semibold hover:bg-dark-border transition-colors"
              >
                View Full Profile
              </button>
              <div className="flex-1">
                <SignOutButton 
                  variant="light"
                  onSuccess={() => console.log('Signed out successfully!')}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Full Profile Modal */}
            <AnimatePresence>
              {showFullProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowFullProfile(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-dark-elevated border border-dark-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-dark-elevated border-b border-dark-border px-6 py-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-dark-text">Full Profile</h3>
                      <button
                        onClick={() => setShowFullProfile(false)}
                        className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-dark-muted" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Profile Header */}
                      <div className="flex items-center gap-4">
                        <UserAvatar size={80} />
                        <div>
                          <h4 className="text-2xl font-bold text-dark-text">
                            {profile?.displayName || account?.name || 'User'}
                          </h4>
                          <p className="text-dark-muted">{profile?.mail || account?.username}</p>
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-semibold text-dark-muted uppercase mb-3">Account Information</h5>
                          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 space-y-3">
                            <ProfileField label="User ID" value={profile?.id || account?.homeAccountId} />
                            <ProfileField label="Username" value={account?.username} />
                            <ProfileField label="Email" value={profile?.mail} />
                            <ProfileField label="Display Name" value={profile?.displayName} />
                            <ProfileField label="Given Name" value={profile?.givenName} />
                            <ProfileField label="Surname" value={profile?.surname} />
                            <ProfileField label="User Principal Name" value={profile?.userPrincipalName} />
                          </div>
                        </div>

                        {(profile?.jobTitle || profile?.officeLocation) && (
                          <div>
                            <h5 className="text-sm font-semibold text-dark-muted uppercase mb-3">Work Information</h5>
                            <div className="bg-dark-bg border border-dark-border rounded-lg p-4 space-y-3">
                              <ProfileField label="Job Title" value={profile?.jobTitle} />
                              <ProfileField label="Office Location" value={profile?.officeLocation} />
                              <ProfileField label="Mobile Phone" value={profile?.mobilePhone} />
                              {profile?.businessPhones && profile.businessPhones.length > 0 && (
                                <ProfileField label="Business Phones" value={profile.businessPhones.join(', ')} />
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <h5 className="text-sm font-semibold text-dark-muted uppercase mb-3">Account Details</h5>
                          <div className="bg-dark-bg border border-dark-border rounded-lg p-4 space-y-3">
                            <ProfileField label="Account Type" value={account?.idTokenClaims?.['aud'] ? 'Azure AD' : 'Unknown'} />
                            <ProfileField label="Tenant ID" value={account?.tenantId} />
                            <ProfileField label="Environment" value={account?.environment} />
                            <ProfileField label="Local Account ID" value={account?.localAccountId} />
                          </div>
                        </div>
                      </div>

                      {/* Raw Data */}
                      <div>
                        <h5 className="text-sm font-semibold text-dark-muted uppercase mb-3">Raw Profile Data (JSON)</h5>
                        <div className="bg-dark-bg border border-dark-border rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs text-dark-text">
                            <code>{JSON.stringify({ account, profile }, null, 2)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Snippet */}
            <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
              <p className="text-xs text-dark-muted mb-2">This is the actual code running:</p>
              <pre className="text-xs overflow-x-auto">
                <code className="text-accent-primary">{`import { useMsalAuth, useUserProfile } from '@chemmangat/msal-next';

const { isAuthenticated, account } = useMsalAuth();
const { profile } = useUserProfile();

// Real data from your Microsoft account!
console.log(account.username); // ${account?.username}
console.log(profile.displayName); // ${profile?.displayName || 'Loading...'}`}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


function ProfileField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-dark-muted font-medium min-w-[140px]">{label}:</span>
      <span className="text-sm text-dark-text text-right break-all">{value}</span>
    </div>
  );
}
