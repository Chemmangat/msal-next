/**
 * Development-mode configuration validator
 * Helps developers catch common configuration mistakes early
 */

import { MsalAuthConfig } from '../types';

export interface ValidationResult {
  valid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  fix: string;
}

export interface ValidationError {
  field: string;
  message: string;
  fix: string;
}

// Cache validation results to only run once
let validationCache: ValidationResult | null = null;
let hasDisplayedResults = false;

/**
 * Validate MSAL configuration in development mode
 * 
 * @remarks
 * This function only runs in development mode and caches results.
 * It checks for common configuration mistakes and provides helpful warnings.
 * 
 * @example
 * ```tsx
 * const result = validateConfig({
 *   clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
 *   tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
 * });
 * 
 * if (!result.valid) {
 *   console.warn('Configuration issues detected');
 * }
 * ```
 */
export function validateConfig(config: MsalAuthConfig): ValidationResult {
  // Only run in development
  if (process.env.NODE_ENV !== 'development') {
    return { valid: true, warnings: [], errors: [] };
  }

  // Return cached result if available
  if (validationCache) {
    return validationCache;
  }

  const warnings: ValidationWarning[] = [];
  const errors: ValidationError[] = [];

  // Validate client ID
  if (!config.clientId) {
    errors.push({
      field: 'clientId',
      message: 'Client ID is missing',
      fix: `Add NEXT_PUBLIC_AZURE_AD_CLIENT_ID to your .env.local file.

Get it from: Azure Portal → App registrations → Your app → Application (client) ID`,
    });
  } else if (isPlaceholderValue(config.clientId)) {
    warnings.push({
      field: 'clientId',
      message: 'Client ID appears to be a placeholder',
      fix: `Replace the placeholder with your actual Application (client) ID from Azure Portal.

Current value: ${config.clientId}
Expected format: 12345678-1234-1234-1234-123456789012 (GUID)`,
    });
  } else if (!isValidGuid(config.clientId)) {
    warnings.push({
      field: 'clientId',
      message: 'Client ID format is invalid',
      fix: `Client ID should be a GUID (UUID) format.

Current value: ${config.clientId}
Expected format: 12345678-1234-1234-1234-123456789012

Get the correct value from: Azure Portal → App registrations → Your app`,
    });
  }

  // Validate tenant ID (if provided)
  if (config.tenantId) {
    if (isPlaceholderValue(config.tenantId)) {
      warnings.push({
        field: 'tenantId',
        message: 'Tenant ID appears to be a placeholder',
        fix: `Replace the placeholder with your actual Directory (tenant) ID from Azure Portal.

Current value: ${config.tenantId}
Expected format: 87654321-4321-4321-4321-210987654321 (GUID)

Or remove tenantId and use authorityType: 'common' for multi-tenant apps.`,
      });
    } else if (!isValidGuid(config.tenantId)) {
      warnings.push({
        field: 'tenantId',
        message: 'Tenant ID format is invalid',
        fix: `Tenant ID should be a GUID (UUID) format.

Current value: ${config.tenantId}
Expected format: 87654321-4321-4321-4321-210987654321

Get the correct value from: Azure Portal → Azure Active Directory → Properties → Tenant ID`,
      });
    }
  }

  // Validate redirect URI
  if (config.redirectUri) {
    if (isProductionUrl(config.redirectUri) && !config.redirectUri.startsWith('https://')) {
      errors.push({
        field: 'redirectUri',
        message: 'Production redirect URI must use HTTPS',
        fix: `Change your redirect URI to use HTTPS in production.

Current value: ${config.redirectUri}
Should be: ${config.redirectUri.replace('http://', 'https://')}

HTTP is only allowed for localhost development.`,
      });
    }

    if (!isValidUrl(config.redirectUri)) {
      errors.push({
        field: 'redirectUri',
        message: 'Redirect URI is not a valid URL',
        fix: `Provide a valid URL for redirectUri.

Current value: ${config.redirectUri}
Expected format: https://yourdomain.com or http://localhost:3000`,
      });
    }
  }

  // Validate scopes
  if (config.scopes && config.scopes.length > 0) {
    const invalidScopes = config.scopes.filter(scope => !isValidScope(scope));
    if (invalidScopes.length > 0) {
      warnings.push({
        field: 'scopes',
        message: 'Some scopes have invalid format',
        fix: `Invalid scopes: ${invalidScopes.join(', ')}

Scopes should be in format: "Resource.Permission" (e.g., "User.Read", "Mail.Read")

Common scopes:
• User.Read - Read user profile
• Mail.Read - Read user mail
• Calendars.Read - Read user calendars
• Files.Read - Read user files`,
      });
    }
  }

  // Check for missing environment variables
  if (typeof window !== 'undefined') {
    const clientIdFromEnv = process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID;
    const tenantIdFromEnv = process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID;

    if (!clientIdFromEnv) {
      warnings.push({
        field: 'environment',
        message: 'NEXT_PUBLIC_AZURE_AD_CLIENT_ID not found in environment',
        fix: `Add NEXT_PUBLIC_AZURE_AD_CLIENT_ID to your .env.local file:

NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id-here

Then restart your development server.`,
      });
    }

    if (!tenantIdFromEnv && config.authorityType === 'tenant') {
      warnings.push({
        field: 'environment',
        message: 'NEXT_PUBLIC_AZURE_AD_TENANT_ID not found but authorityType is "tenant"',
        fix: `Either:
1. Add NEXT_PUBLIC_AZURE_AD_TENANT_ID to your .env.local file, OR
2. Change authorityType to 'common' for multi-tenant support

For single-tenant apps:
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id-here`,
      });
    }
  }

  const result: ValidationResult = {
    valid: errors.length === 0,
    warnings,
    errors,
  };

  // Cache the result
  validationCache = result;

  return result;
}

/**
 * Display validation results in console with colors and emojis
 */
export function displayValidationResults(result: ValidationResult): void {
  // Only display once
  if (hasDisplayedResults || process.env.NODE_ENV !== 'development') {
    return;
  }

  hasDisplayedResults = true;

  // Don't display if everything is valid and no warnings
  if (result.valid && result.warnings.length === 0) {
    console.log('✅ MSAL configuration validated successfully');
    return;
  }

  console.group('🔍 MSAL Configuration Validation');

  // Display errors
  if (result.errors.length > 0) {
    console.group('❌ Errors (must fix)');
    result.errors.forEach(error => {
      console.error(`\n${error.field}:`);
      console.error(`  ${error.message}`);
      console.error(`\n  Fix:\n  ${error.fix.split('\n').join('\n  ')}`);
    });
    console.groupEnd();
  }

  // Display warnings
  if (result.warnings.length > 0) {
    console.group('⚠️  Warnings (should fix)');
    result.warnings.forEach(warning => {
      console.warn(`\n${warning.field}:`);
      console.warn(`  ${warning.message}`);
      console.warn(`\n  Fix:\n  ${warning.fix.split('\n').join('\n  ')}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Check if value is a common placeholder
 */
function isPlaceholderValue(value: string): boolean {
  const placeholders = [
    'your-client-id',
    'your-tenant-id',
    'your-client-id-here',
    'your-tenant-id-here',
    'client-id',
    'tenant-id',
    'replace-me',
    'changeme',
    'placeholder',
    'example',
    'xxx',
    '000',
  ];

  const lowerValue = value.toLowerCase();
  return placeholders.some(placeholder => lowerValue.includes(placeholder));
}

/**
 * Validate GUID format
 */
function isValidGuid(value: string): boolean {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return guidRegex.test(value);
}

/**
 * Check if URL is a production URL (not localhost)
 */
function isProductionUrl(url: string): boolean {
  return !url.includes('localhost') && !url.includes('127.0.0.1');
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate scope format
 */
function isValidScope(scope: string): boolean {
  // Scopes should be in format: Resource.Permission or https://resource/scope
  return /^([a-zA-Z0-9]+\.[a-zA-Z0-9]+|https?:\/\/.+)$/.test(scope);
}

/**
 * Reset validation cache (for testing)
 */
export function resetValidationCache(): void {
  validationCache = null;
  hasDisplayedResults = false;
}
