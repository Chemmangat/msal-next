# v4.0.2 Feature Examples

This document provides practical examples of the new features in v4.0.2.

---

## 1. Complete TypeScript Types

### Basic Usage

```tsx
'use client';

import { useUserProfile } from '@chemmangat/msal-next';

export default function UserProfilePage() {
  const { profile, loading, error } = useUserProfile();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="profile">
      <h1>{profile.displayName}</h1>
      
      {/* Basic fields */}
      <p>Email: {profile.mail}</p>
      <p>Job Title: {profile.jobTitle}</p>
      
      {/* NEW in v4.0.2 - Complete fields */}
      <p>Department: {profile.department}</p>
      <p>Company: {profile.companyName}</p>
      <p>Employee ID: {profile.employeeId}</p>
      <p>Preferred Language: {profile.preferredLanguage}</p>
      
      {/* Location information */}
      <div className="location">
        <h2>Location</h2>
        <p>Office: {profile.officeLocation}</p>
        <p>City: {profile.city}</p>
        <p>State: {profile.state}</p>
        <p>Country: {profile.country}</p>
        <p>Postal Code: {profile.postalCode}</p>
      </div>
      
      {/* Contact information */}
      <div className="contact">
        <h2>Contact</h2>
        <p>Mobile: {profile.mobilePhone}</p>
        {profile.businessPhones?.map((phone, i) => (
          <p key={i}>Business Phone {i + 1}: {phone}</p>
        ))}
      </div>
      
      {/* Profile details */}
      {profile.aboutMe && (
        <div className="about">
          <h2>About</h2>
          <p>{profile.aboutMe}</p>
        </div>
      )}
      
      {profile.interests && profile.interests.length > 0 && (
        <div className="interests">
          <h2>Interests</h2>
          <ul>
            {profile.interests.map((interest, i) => (
              <li key={i}>{interest}</li>
            ))}
          </ul>
        </div>
      )}
      
      {profile.skills && profile.skills.length > 0 && (
        <div className="skills">
          <h2>Skills</h2>
          <ul>
            {profile.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Generic Type Support

```tsx
'use client';

import { useUserProfile, UserProfile } from '@chemmangat/msal-next';

// Define custom profile with organization-specific fields
interface MyCompanyProfile extends UserProfile {
  customEmployeeLevel: string;
  customDivision: string;
  customCostCenter: string;
}

export default function CustomProfilePage() {
  // Use generic type parameter
  const { profile, loading } = useUserProfile<MyCompanyProfile>();

  if (loading) return <div>Loading...</div>;
  if (!profile) return null;

  return (
    <div>
      <h1>{profile.displayName}</h1>
      
      {/* Standard fields - fully typed */}
      <p>Department: {profile.department}</p>
      <p>Employee ID: {profile.employeeId}</p>
      
      {/* Custom fields - also fully typed! */}
      <p>Level: {profile.customEmployeeLevel}</p>
      <p>Division: {profile.customDivision}</p>
      <p>Cost Center: {profile.customCostCenter}</p>
    </div>
  );
}
```

---

## 2. Enhanced Error Handling

### Basic Error Handling

```tsx
'use client';

import { useMsalAuth, wrapMsalError } from '@chemmangat/msal-next';
import { useState } from 'react';

export default function LoginPage() {
  const { loginRedirect } = useMsalAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await loginRedirect(['User.Read']);
    } catch (err) {
      const msalError = wrapMsalError(err);
      
      // Check if user just cancelled (not a real error)
      if (msalError.isUserCancellation()) {
        console.log('User cancelled login');
        return;
      }
      
      // Display user-friendly error message
      setError(msalError.message);
      
      // Log detailed error in development
      if (process.env.NODE_ENV === 'development') {
        console.error(msalError.toConsoleString());
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign In</button>
      
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
```

### Advanced Error Handling with Fix Instructions

```tsx
'use client';

import { useMsalAuth, wrapMsalError, MsalError } from '@chemmangat/msal-next';
import { useState } from 'react';

export default function AdvancedLoginPage() {
  const { loginRedirect } = useMsalAuth();
  const [error, setError] = useState<MsalError | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await loginRedirect(['User.Read']);
    } catch (err) {
      const msalError = wrapMsalError(err);
      
      if (msalError.isUserCancellation()) {
        return;
      }
      
      setError(msalError);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign In</button>
      
      {error && (
        <div className="error-details">
          <h3>Authentication Error</h3>
          <p><strong>Error:</strong> {error.message}</p>
          
          {error.code && (
            <p><strong>Code:</strong> {error.code}</p>
          )}
          
          {error.fix && (
            <div className="fix-instructions">
              <h4>How to fix:</h4>
              <pre>{error.fix}</pre>
            </div>
          )}
          
          {error.docs && (
            <p>
              <a href={error.docs} target="_blank" rel="noopener noreferrer">
                View Documentation
              </a>
            </p>
          )}
          
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
```

### Error Handling in Token Acquisition

```tsx
'use client';

import { useMsalAuth, wrapMsalError } from '@chemmangat/msal-next';
import { useEffect, useState } from 'react';

export default function ProtectedDataPage() {
  const { acquireToken, isAuthenticated } = useMsalAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        // Get token with error handling
        const token = await acquireToken(['User.Read', 'Mail.Read']);
        
        // Use token to fetch data
        const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        const msalError = wrapMsalError(err);
        
        // Check if interaction is required
        if (msalError.requiresInteraction()) {
          // User needs to consent or re-authenticate
          setError('Additional consent required. Please sign in again.');
        } else {
          setError(msalError.message);
        }
        
        console.error(msalError.toConsoleString());
      }
    };

    fetchData();
  }, [isAuthenticated, acquireToken]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return <div>{/* Render data */}</div>;
}
```

---

## 3. Configuration Validation

### Automatic Validation (Default)

Configuration validation runs automatically in development mode when you use MSALProvider:

```tsx
// app/layout.tsx
import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID!}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}

// Console output in development:
// ✅ MSAL configuration validated successfully
// OR
// 🔍 MSAL Configuration Validation
// ⚠️  Warnings (should fix)
// [detailed warnings with fix instructions]
```

### Manual Validation

```tsx
'use client';

import { validateConfig, displayValidationResults } from '@chemmangat/msal-next';
import { useEffect } from 'react';

export default function ConfigCheckPage() {
  useEffect(() => {
    // Validate configuration manually
    const result = validateConfig({
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
      redirectUri: window.location.origin,
      scopes: ['User.Read', 'Mail.Read'],
    });

    // Display results in console
    displayValidationResults(result);

    // Check validation result
    if (!result.valid) {
      console.error('Configuration has errors:', result.errors);
    }

    if (result.warnings.length > 0) {
      console.warn('Configuration has warnings:', result.warnings);
    }
  }, []);

  return <div>Check console for configuration validation results</div>;
}
```

### Custom Validation UI

```tsx
'use client';

import { validateConfig, ValidationResult } from '@chemmangat/msal-next';
import { useState, useEffect } from 'react';

export default function ConfigValidationPage() {
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const result = validateConfig({
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
      redirectUri: window.location.origin,
    });

    setValidation(result);
  }, []);

  if (!validation) return <div>Validating configuration...</div>;

  return (
    <div className="config-validation">
      <h1>Configuration Validation</h1>

      {validation.valid ? (
        <div className="success">
          ✅ Configuration is valid!
        </div>
      ) : (
        <div className="errors">
          <h2>❌ Errors (must fix)</h2>
          {validation.errors.map((error, i) => (
            <div key={i} className="error-item">
              <h3>{error.field}</h3>
              <p>{error.message}</p>
              <pre>{error.fix}</pre>
            </div>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="warnings">
          <h2>⚠️  Warnings (should fix)</h2>
          {validation.warnings.map((warning, i) => (
            <div key={i} className="warning-item">
              <h3>{warning.field}</h3>
              <p>{warning.message}</p>
              <pre>{warning.fix}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 4. Combined Example: Complete User Dashboard

```tsx
'use client';

import { 
  useUserProfile, 
  useMsalAuth, 
  wrapMsalError,
  UserProfile 
} from '@chemmangat/msal-next';
import { useState } from 'react';

export default function UserDashboard() {
  const { isAuthenticated, loginRedirect, logoutRedirect } = useMsalAuth();
  const { profile, loading, error: profileError, refetch } = useUserProfile();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await loginRedirect(['User.Read']);
    } catch (err) {
      const msalError = wrapMsalError(err);
      if (!msalError.isUserCancellation()) {
        setAuthError(msalError.message);
        console.error(msalError.toConsoleString());
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRedirect();
    } catch (err) {
      const msalError = wrapMsalError(err);
      setAuthError(msalError.message);
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <h1>Welcome</h1>
        <button onClick={handleLogin}>Sign In with Microsoft</button>
        {authError && <div className="error">{authError}</div>}
      </div>
    );
  }

  // Loading profile
  if (loading) {
    return <div className="loading">Loading your profile...</div>;
  }

  // Profile error
  if (profileError) {
    return (
      <div className="error-page">
        <h1>Error Loading Profile</h1>
        <p>{profileError.message}</p>
        <button onClick={refetch}>Try Again</button>
        <button onClick={handleLogout}>Sign Out</button>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return <div>No profile data available</div>;
  }

  // Success - show complete profile
  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {profile.displayName}!</h1>
        <button onClick={handleLogout}>Sign Out</button>
      </header>

      <div className="profile-grid">
        {/* Basic Information */}
        <section className="card">
          <h2>Basic Information</h2>
          <dl>
            <dt>Name:</dt>
            <dd>{profile.displayName}</dd>
            
            <dt>Email:</dt>
            <dd>{profile.mail}</dd>
            
            <dt>Username:</dt>
            <dd>{profile.userPrincipalName}</dd>
            
            <dt>Job Title:</dt>
            <dd>{profile.jobTitle || 'Not specified'}</dd>
          </dl>
        </section>

        {/* Organization - NEW in v4.0.2 */}
        <section className="card">
          <h2>Organization</h2>
          <dl>
            <dt>Company:</dt>
            <dd>{profile.companyName || 'Not specified'}</dd>
            
            <dt>Department:</dt>
            <dd>{profile.department || 'Not specified'}</dd>
            
            <dt>Employee ID:</dt>
            <dd>{profile.employeeId || 'Not specified'}</dd>
            
            <dt>Employee Type:</dt>
            <dd>{profile.employeeType || 'Not specified'}</dd>
          </dl>
        </section>

        {/* Location - NEW in v4.0.2 */}
        <section className="card">
          <h2>Location</h2>
          <dl>
            <dt>Office:</dt>
            <dd>{profile.officeLocation || 'Not specified'}</dd>
            
            <dt>City:</dt>
            <dd>{profile.city || 'Not specified'}</dd>
            
            <dt>State:</dt>
            <dd>{profile.state || 'Not specified'}</dd>
            
            <dt>Country:</dt>
            <dd>{profile.country || 'Not specified'}</dd>
          </dl>
        </section>

        {/* Contact - NEW in v4.0.2 */}
        <section className="card">
          <h2>Contact</h2>
          <dl>
            <dt>Mobile:</dt>
            <dd>{profile.mobilePhone || 'Not specified'}</dd>
            
            <dt>Preferred Language:</dt>
            <dd>{profile.preferredLanguage || 'Not specified'}</dd>
            
            {profile.businessPhones && profile.businessPhones.length > 0 && (
              <>
                <dt>Business Phones:</dt>
                <dd>
                  <ul>
                    {profile.businessPhones.map((phone, i) => (
                      <li key={i}>{phone}</li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </section>
      </div>

      {authError && (
        <div className="error-banner">{authError}</div>
      )}
    </div>
  );
}
```

---

## 5. TypeScript Type Checking Examples

```tsx
import { UserProfile, useUserProfile } from '@chemmangat/msal-next';

// Example 1: Type-safe field access
function displayUserInfo(profile: UserProfile) {
  // All fields are type-safe!
  console.log(profile.displayName);      // ✅ string
  console.log(profile.department);       // ✅ string | undefined
  console.log(profile.preferredLanguage);// ✅ string | undefined
  console.log(profile.employeeId);       // ✅ string | undefined
  console.log(profile.interests);        // ✅ string[] | undefined
  
  // TypeScript will catch errors:
  // console.log(profile.nonExistentField); // ❌ Error!
}

// Example 2: Custom profile extension
interface ExtendedProfile extends UserProfile {
  customField1: string;
  customField2: number;
}

function useExtendedProfile() {
  const { profile } = useUserProfile<ExtendedProfile>();
  
  if (profile) {
    // Standard fields
    console.log(profile.department);     // ✅ Type-safe
    console.log(profile.employeeId);     // ✅ Type-safe
    
    // Custom fields
    console.log(profile.customField1);   // ✅ Type-safe
    console.log(profile.customField2);   // ✅ Type-safe
  }
}

// Example 3: Conditional rendering based on fields
function ProfileSection({ profile }: { profile: UserProfile }) {
  return (
    <div>
      {/* TypeScript knows these fields exist */}
      {profile.department && <p>Department: {profile.department}</p>}
      {profile.companyName && <p>Company: {profile.companyName}</p>}
      {profile.interests && profile.interests.length > 0 && (
        <ul>
          {profile.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

These examples demonstrate the practical usage of all new features in v4.0.2. Copy and adapt them for your specific use case!
