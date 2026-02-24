import { describe, it, expect } from 'vitest';
import { createMsalConfig } from '../../utils/createMsalConfig';

describe('createMsalConfig', () => {
  it('should create config with minimal options', () => {
    const config = createMsalConfig({
      clientId: 'test-client-id',
    });

    expect(config.auth.clientId).toBe('test-client-id');
    expect(config.auth.authority).toBe('https://login.microsoftonline.com/common');
    expect(config.cache.cacheLocation).toBe('sessionStorage');
  });

  it('should use tenant authority when specified', () => {
    const config = createMsalConfig({
      clientId: 'test-client-id',
      tenantId: 'test-tenant-id',
      authorityType: 'tenant',
    });

    expect(config.auth.authority).toBe('https://login.microsoftonline.com/test-tenant-id');
  });

  it('should throw error when clientId is missing', () => {
    expect(() => {
      createMsalConfig({} as any);
    }).toThrow('clientId is required');
  });

  it('should throw error when tenantId is missing for tenant authority', () => {
    expect(() => {
      createMsalConfig({
        clientId: 'test-client-id',
        authorityType: 'tenant',
      });
    }).toThrow('tenantId is required');
  });

  it('should use custom redirect URI', () => {
    const config = createMsalConfig({
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
    });

    expect(config.auth.redirectUri).toBe('https://example.com/callback');
  });

  it('should use localStorage when specified', () => {
    const config = createMsalConfig({
      clientId: 'test-client-id',
      cacheLocation: 'localStorage',
    });

    expect(config.cache.cacheLocation).toBe('localStorage');
  });

  it('should use custom MSAL config when provided', () => {
    const customConfig = {
      auth: {
        clientId: 'custom-client-id',
        authority: 'https://custom.authority.com',
      },
      cache: {
        cacheLocation: 'memoryStorage' as const,
      },
    };

    const config = createMsalConfig({
      clientId: 'test-client-id',
      msalConfig: customConfig as any,
    });

    expect(config).toBe(customConfig);
  });
});
