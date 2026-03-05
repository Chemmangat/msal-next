/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validate account data structure from cookie
 */
export interface ValidatedAccountData {
  homeAccountId: string;
  username: string;
  name?: string;
}

/**
 * Safely parse and validate JSON from untrusted sources
 */
export function safeJsonParse<T>(
  jsonString: string,
  validator: (data: any) => data is T
): T | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (validator(parsed)) {
      return parsed;
    }
    console.warn('[Validation] JSON validation failed');
    return null;
  } catch (error) {
    console.error('[Validation] JSON parse error:', error);
    return null;
  }
}

/**
 * Validate account data structure
 */
export function isValidAccountData(data: any): data is ValidatedAccountData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.homeAccountId === 'string' &&
    data.homeAccountId.length > 0 &&
    typeof data.username === 'string' &&
    data.username.length > 0 &&
    (data.name === undefined || typeof data.name === 'string')
  );
}

/**
 * Sanitize error messages to prevent information disclosure
 */
export function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    // Remove sensitive information from error messages
    const message = error.message;
    
    // Remove potential tokens or secrets (anything that looks like a JWT or long hex string)
    const sanitized = message
      .replace(/[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/g, '[TOKEN_REDACTED]')
      .replace(/[a-f0-9]{32,}/gi, '[SECRET_REDACTED]')
      .replace(/Bearer\s+[^\s]+/gi, 'Bearer [REDACTED]');
    
    return sanitized;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Validate redirect URI to prevent open redirect vulnerabilities
 */
export function isValidRedirectUri(uri: string, allowedOrigins: string[]): boolean {
  try {
    const url = new URL(uri);
    
    // Check if the origin is in the allowed list
    return allowedOrigins.some(allowed => {
      const allowedUrl = new URL(allowed);
      return url.origin === allowedUrl.origin;
    });
  } catch {
    return false;
  }
}

/**
 * Validate scope strings to prevent injection
 */
export function isValidScope(scope: string): boolean {
  // Scopes should only contain alphanumeric characters, dots, hyphens, and underscores
  return /^[a-zA-Z0-9._-]+$/.test(scope);
}

/**
 * Validate array of scopes
 */
export function validateScopes(scopes: string[]): boolean {
  return Array.isArray(scopes) && scopes.every(isValidScope);
}
