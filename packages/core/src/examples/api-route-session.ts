// Example: app/api/auth/session/route.ts
// This is an example API route for managing server-side sessions

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/session
 * Set session cookies after successful authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, token } = body;

    if (!account) {
      return NextResponse.json(
        { error: 'Account data is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // Set account cookie
    cookieStore.set('msal.account', JSON.stringify(account), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Set token cookie (optional, be careful with token storage)
    if (token) {
      cookieStore.set('msal.token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session API] Error setting session:', error);
    return NextResponse.json(
      { error: 'Failed to set session' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clear session cookies on logout
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete('msal.account');
    cookieStore.delete('msal.token');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session API] Error clearing session:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/session
 * Get current session data
 */
export async function GET() {
  try {
    const cookieStore = await cookies();

    const accountCookie = cookieStore.get('msal.account');
    const tokenCookie = cookieStore.get('msal.token');

    if (!accountCookie?.value) {
      return NextResponse.json({
        isAuthenticated: false,
      });
    }

    const account = JSON.parse(accountCookie.value);

    return NextResponse.json({
      isAuthenticated: true,
      account: {
        username: account.username,
        name: account.name,
        homeAccountId: account.homeAccountId,
      },
      hasToken: !!tokenCookie?.value,
    });
  } catch (error) {
    console.error('[Session API] Error reading session:', error);
    return NextResponse.json(
      { error: 'Failed to read session' },
      { status: 500 }
    );
  }
}
