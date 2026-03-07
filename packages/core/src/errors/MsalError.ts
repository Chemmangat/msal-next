/**
 * Enhanced error handling for MSAL authentication
 * Provides actionable error messages and fix instructions
 */

/**
 * Common MSAL error codes and their solutions
 */
export const MSAL_ERROR_SOLUTIONS: Record<string, { message: string; fix: string; docs?: string }> = {
  // Redirect URI mismatch
  'AADSTS50011': {
    message: 'Redirect URI mismatch',
    fix: `Your redirect URI doesn't match what's configured in Azure AD.

Fix:
1. Go to Azure Portal → Azure Active Directory → App registrations
2. Select your app → Authentication
3. Under "Single-page application", add your redirect URI:
   • http://localhost:3000 (for development)
   • https://yourdomain.com (for production)
4. Click "Save"

Current redirect URI: ${typeof window !== 'undefined' ? window.location.origin : 'unknown'}`,
    docs: 'https://learn.microsoft.com/en-us/azure/active-directory/develop/reply-url'
  },

  // Consent required
  'AADSTS65001': {
    message: 'Admin consent required',
    fix: `Your app requires admin consent for the requested permissions.

Fix:
1. Go to Azure Portal → Azure Active Directory → App registrations
2. Select your app → API permissions
3. Click "Grant admin consent for [Your Organization]"
4. Confirm the consent

Alternatively, ask your Azure AD administrator to grant consent.`,
    docs: 'https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-admin-consent'
  },

  // Invalid client
  'AADSTS700016': {
    message: 'Invalid client application',
    fix: `The application ID (client ID) is not found in the directory.

Fix:
1. Verify your NEXT_PUBLIC_AZURE_AD_CLIENT_ID in .env.local
2. Ensure the app registration exists in Azure Portal
3. Check that you're using the correct tenant

Current client ID: Check your environment variables`,
    docs: 'https://learn.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes'
  },

  // Invalid tenant
  'AADSTS90002': {
    message: 'Invalid tenant',
    fix: `The tenant ID is invalid or not found.

Fix:
1. Verify your NEXT_PUBLIC_AZURE_AD_TENANT_ID in .env.local
2. Ensure you're using the correct tenant ID (GUID format)
3. For multi-tenant apps, use authorityType: 'common' instead

Current tenant ID: Check your environment variables`,
    docs: 'https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-national-cloud'
  },

  // User cancelled
  'user_cancelled': {
    message: 'User cancelled authentication',
    fix: 'The user closed the authentication window or cancelled the login process. This is normal user behavior.',
    docs: undefined
  },

  // No token in cache
  'no_token_request_cache_error': {
    message: 'No cached token request',
    fix: `This usually happens when the page is refreshed during authentication.

This is normal and will be handled automatically. If the issue persists:
1. Clear your browser cache and cookies
2. Try logging in again
3. Ensure cookies are enabled in your browser`,
    docs: undefined
  },

  // Interaction required
  'interaction_required': {
    message: 'User interaction required',
    fix: `The token cannot be acquired silently and requires user interaction.

This is normal behavior. The app will redirect you to sign in.`,
    docs: undefined
  },

  // Consent required
  'consent_required': {
    message: 'User consent required',
    fix: `Additional consent is required for the requested permissions.

This is normal behavior. You'll be prompted to grant consent.`,
    docs: undefined
  },
};

/**
 * Enhanced MSAL error class with actionable messages
 */
export class MsalError extends Error {
  /** Original error code from MSAL */
  public readonly code?: string;

  /** Actionable fix instructions */
  public readonly fix?: string;

  /** Documentation link */
  public readonly docs?: string;

  /** Original error object */
  public readonly originalError?: unknown;

  constructor(error: unknown) {
    const errorInfo = MsalError.parseError(error);
    
    super(errorInfo.message);
    this.name = 'MsalError';
    this.code = errorInfo.code;
    this.fix = errorInfo.fix;
    this.docs = errorInfo.docs;
    this.originalError = error;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MsalError);
    }
  }

  /**
   * Parse error and extract actionable information
   */
  private static parseError(error: unknown): {
    message: string;
    code?: string;
    fix?: string;
    docs?: string;
  } {
    // Handle MSAL errors
    if (error && typeof error === 'object') {
      const err = error as any;
      
      // Extract error code
      const errorCode = err.errorCode || err.error || err.code;
      
      // Check if we have a solution for this error code
      if (errorCode && MSAL_ERROR_SOLUTIONS[errorCode]) {
        const solution = MSAL_ERROR_SOLUTIONS[errorCode];
        return {
          message: solution.message,
          code: errorCode,
          fix: solution.fix,
          docs: solution.docs,
        };
      }

      // Check error message for known error codes
      const errorMessage = err.errorMessage || err.message || String(error);
      for (const [code, solution] of Object.entries(MSAL_ERROR_SOLUTIONS)) {
        if (errorMessage.includes(code)) {
          return {
            message: solution.message,
            code,
            fix: solution.fix,
            docs: solution.docs,
          };
        }
      }

      // Return generic error with original message
      return {
        message: errorMessage || 'Authentication error occurred',
        code: errorCode,
      };
    }

    // Fallback for unknown errors
    return {
      message: 'An unexpected authentication error occurred',
    };
  }

  /**
   * Format error for console logging with colors (development only)
   */
  public toConsoleString(): string {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isDev) {
      return this.message;
    }

    let output = `\n🚨 MSAL Authentication Error\n`;
    output += `\nError: ${this.message}\n`;
    
    if (this.code) {
      output += `Code: ${this.code}\n`;
    }

    if (this.fix) {
      output += `\n💡 How to fix:\n${this.fix}\n`;
    }

    if (this.docs) {
      output += `\n📚 Documentation: ${this.docs}\n`;
    }

    return output;
  }

  /**
   * Check if error is a user cancellation (not a real error)
   */
  public isUserCancellation(): boolean {
    return this.code === 'user_cancelled';
  }

  /**
   * Check if error requires user interaction
   */
  public requiresInteraction(): boolean {
    return this.code === 'interaction_required' || this.code === 'consent_required';
  }
}

/**
 * Wrap MSAL errors with enhanced error information
 * 
 * @example
 * ```tsx
 * try {
 *   await loginRedirect();
 * } catch (error) {
 *   const msalError = wrapMsalError(error);
 *   
 *   if (msalError.isUserCancellation()) {
 *     // User cancelled, ignore
 *     return;
 *   }
 *   
 *   console.error(msalError.toConsoleString());
 *   throw msalError;
 * }
 * ```
 */
export function wrapMsalError(error: unknown): MsalError {
  if (error instanceof MsalError) {
    return error;
  }
  return new MsalError(error);
}

/**
 * Check if error is a missing environment variable error
 */
export function isMissingEnvVarError(varName: string): boolean {
  const value = process.env[varName];
  return !value || value.trim() === '';
}

/**
 * Create error for missing environment variable
 */
export function createMissingEnvVarError(varName: string): MsalError {
  const error = {
    errorCode: 'missing_env_var',
    errorMessage: `Missing environment variable: ${varName}`,
    message: `${varName} not found`,
  };

  const fix = `Environment variable ${varName} is not set.

Fix:
1. Copy .env.local.example to .env.local (if it exists)
2. Add the following to your .env.local file:

   ${varName}=your-value-here

3. Get the value from Azure Portal:
   • Go to Azure Active Directory → App registrations
   • Select your app
   • Copy the ${varName.includes('CLIENT_ID') ? 'Application (client) ID' : 'Directory (tenant) ID'}

4. Restart your development server

Note: Environment variables starting with NEXT_PUBLIC_ are exposed to the browser.`;

  return new MsalError({
    ...error,
    fix,
    docs: 'https://nextjs.org/docs/basic-features/environment-variables',
  });
}
