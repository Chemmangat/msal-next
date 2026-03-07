/**
 * Zero-Config Protected Routes - Complete Example
 * v4.0.0 Killer Feature
 */

// ============================================================================
// 1. Setup Provider (app/layout.tsx)
// ============================================================================

import { MSALProvider } from '@chemmangat/msal-next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <MSALProvider
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
          tenantId={process.env.NEXT_PUBLIC_TENANT_ID}
          protection={{
            defaultRedirectTo: '/login',
            defaultLoading: <div>Loading...</div>,
            debug: true
          }}
        >
          {children}
        </MSALProvider>
      </body>
    </html>
  );
}

// ============================================================================
// 2. Basic Protected Page (app/dashboard/page.tsx)
// ============================================================================

// Just export auth config - that's it!
export const auth = { required: true };

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This page is automatically protected!</p>
    </div>
  );
}

// ============================================================================
// 3. Role-Based Protection (app/admin/page.tsx)
// ============================================================================

export const auth = {
  required: true,
  roles: ['admin', 'superadmin']
};

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Only admins can see this</p>
    </div>
  );
}

// ============================================================================
// 4. Custom Redirect (app/profile/page.tsx)
// ============================================================================

export const auth = {
  required: true,
  redirectTo: '/custom-login',
  loading: <div className="spinner">Checking auth...</div>
};

export default function ProfilePage() {
  return <div>Profile</div>;
}

// ============================================================================
// 5. Custom Validation (app/internal/page.tsx)
// ============================================================================

export const auth = {
  required: true,
  validate: (account) => {
    // Only allow company emails
    return account.username.endsWith('@company.com');
  },
  unauthorized: (
    <div>
      <h1>Access Denied</h1>
      <p>Only company emails are allowed</p>
    </div>
  )
};

export default function InternalPage() {
  return <div>Internal Tools</div>;
}

// ============================================================================
// 6. Public Page (app/page.tsx)
// ============================================================================

// No auth export = public page
export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This page is public</p>
    </div>
  );
}

// ============================================================================
// 7. Login Page (app/login/page.tsx)
// ============================================================================

'use client';

import { MicrosoftSignInButton, useMsalAuth } from '@chemmangat/msal-next';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated } = useMsalAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, returnUrl, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Sign In</h1>
        <MicrosoftSignInButton />
      </div>
    </div>
  );
}

// ============================================================================
// 8. Advanced: Multiple Roles with Custom Logic
// ============================================================================

export const auth = {
  required: true,
  validate: async (account) => {
    const userRoles = account.idTokenClaims?.roles || [];
    
    // Must have at least one of these roles
    const requiredRoles = ['admin', 'editor', 'viewer'];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      return false;
    }
    
    // Additional async validation (e.g., check database)
    const response = await fetch('/api/check-access', {
      method: 'POST',
      body: JSON.stringify({ userId: account.homeAccountId })
    });
    
    const { hasAccess } = await response.json();
    return hasAccess;
  },
  loading: <div>Verifying access...</div>,
  unauthorized: <div>You don't have the required permissions</div>
};

export default function AdvancedProtectedPage() {
  return <div>Advanced Protected Content</div>;
}

// ============================================================================
// 9. Manual Usage (if you need more control)
// ============================================================================

'use client';

import { withPageAuth } from '@chemmangat/msal-next';

function MyPage() {
  return <div>Protected</div>;
}

// Manually wrap with auth
export default withPageAuth(MyPage, {
  required: true,
  roles: ['admin']
});

// ============================================================================
// 10. Comparison: Before vs After
// ============================================================================

// ❌ BEFORE (v3.x) - 50+ lines of boilerplate
/*
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // ... more boilerplate
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  return <div>Protected</div>;
}
*/

// ✅ AFTER (v4.0) - 1 line!
export const auth = { required: true };

export default function Dashboard() {
  return <div>Protected</div>;
}
