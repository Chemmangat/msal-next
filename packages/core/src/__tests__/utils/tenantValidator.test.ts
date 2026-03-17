import { describe, it, expect } from 'vitest';
import { validateTenantAccess } from '../../utils/tenantValidator';
import type { MultiTenantConfig } from '../../types';

function makeAccount(overrides: Record<string, any> = {}) {
  const { idTokenClaims: claimsOverride, ...rest } = overrides;
  return {
    homeAccountId: 'home-id',
    environment: 'login.microsoftonline.com',
    tenantId: 'resource-tenant-id',
    username: 'user@contoso.com',
    localAccountId: 'local-id',
    name: 'Test User',
    idTokenClaims: {
      tid: 'resource-tenant-id',
      iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0',
      preferred_username: 'user@contoso.com',
      amr: [],
      ...claimsOverride,
    },
    ...rest,
  } as any;
}

describe('validateTenantAccess', () => {
  describe('allowList', () => {
    it('allows access when tenant domain is in allowList', () => {
      const result = validateTenantAccess(makeAccount(), { allowList: ['contoso.com'] });
      expect(result.allowed).toBe(true);
    });

    it('allows access when tenant ID is in allowList', () => {
      const result = validateTenantAccess(makeAccount(), {
        allowList: ['resource-tenant-id'],
      });
      expect(result.allowed).toBe(true);
    });

    it('denies access when tenant is not in allowList', () => {
      const result = validateTenantAccess(makeAccount(), {
        allowList: ['fabrikam.com'],
      });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('not in the allowed list');
    });

    it('allows access when allowList is empty (no restriction)', () => {
      const result = validateTenantAccess(makeAccount(), { allowList: [] });
      expect(result.allowed).toBe(true);
    });
  });

  describe('blockList', () => {
    it('denies access when tenant domain is in blockList', () => {
      const result = validateTenantAccess(makeAccount(), {
        blockList: ['contoso.com'],
      });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('blocked');
    });

    it('denies access when tenant ID is in blockList', () => {
      const result = validateTenantAccess(makeAccount(), {
        blockList: ['resource-tenant-id'],
      });
      expect(result.allowed).toBe(false);
    });

    it('blockList takes precedence over allowList', () => {
      const result = validateTenantAccess(makeAccount(), {
        allowList: ['contoso.com'],
        blockList: ['contoso.com'],
      });
      expect(result.allowed).toBe(false);
    });

    it('allows access when blockList does not match', () => {
      const result = validateTenantAccess(makeAccount(), {
        blockList: ['fabrikam.com'],
      });
      expect(result.allowed).toBe(true);
    });
  });

  describe('requireType', () => {
    it('allows Member when requireType is Member', () => {
      // Member: home tenant === resource tenant
      const account = makeAccount({
        tenantId: 'same-tenant',
        idTokenClaims: {
          tid: 'same-tenant',
          iss: 'https://login.microsoftonline.com/same-tenant/v2.0',
          preferred_username: 'user@contoso.com',
          amr: [],
        },
      });
      const result = validateTenantAccess(account, { requireType: 'Member' });
      expect(result.allowed).toBe(true);
    });

    it('denies Guest when requireType is Member', () => {
      const account = makeAccount({
        tenantId: 'resource-tenant',
        idTokenClaims: {
          tid: 'resource-tenant',
          iss: 'https://login.microsoftonline.com/home-tenant/v2.0',
          preferred_username: 'guest@fabrikam.com',
          amr: [],
        },
      });
      const result = validateTenantAccess(account, { requireType: 'Member' });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Guest');
    });

    it('allows Guest when requireType is Guest', () => {
      const account = makeAccount({
        tenantId: 'resource-tenant',
        idTokenClaims: {
          tid: 'resource-tenant',
          iss: 'https://login.microsoftonline.com/home-tenant/v2.0',
          preferred_username: 'guest@fabrikam.com',
          amr: [],
        },
      });
      const result = validateTenantAccess(account, { requireType: 'Guest' });
      expect(result.allowed).toBe(true);
    });

    it('denies Member when requireType is Guest', () => {
      const account = makeAccount({
        tenantId: 'same-tenant',
        idTokenClaims: {
          tid: 'same-tenant',
          iss: 'https://login.microsoftonline.com/same-tenant/v2.0',
          preferred_username: 'user@contoso.com',
          amr: [],
        },
      });
      const result = validateTenantAccess(account, { requireType: 'Guest' });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('guest');
    });
  });

  describe('requireMFA', () => {
    it('allows when amr contains mfa', () => {
      const account = makeAccount({
        idTokenClaims: { tid: 'resource-tenant-id', iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0', preferred_username: 'user@contoso.com', amr: ['pwd', 'mfa'] },
      });
      const result = validateTenantAccess(account, { requireMFA: true });
      expect(result.allowed).toBe(true);
    });

    it('allows when amr contains ngcmfa', () => {
      const account = makeAccount({
        idTokenClaims: { tid: 'resource-tenant-id', iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0', preferred_username: 'user@contoso.com', amr: ['ngcmfa'] },
      });
      const result = validateTenantAccess(account, { requireMFA: true });
      expect(result.allowed).toBe(true);
    });

    it('denies when amr does not contain mfa', () => {
      const account = makeAccount({
        idTokenClaims: { tid: 'resource-tenant-id', iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0', preferred_username: 'user@contoso.com', amr: ['pwd'] },
      });
      const result = validateTenantAccess(account, { requireMFA: true });
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('MFA');
    });

    it('allows when requireMFA is false regardless of amr', () => {
      const account = makeAccount({
        idTokenClaims: { tid: 'resource-tenant-id', iss: 'https://login.microsoftonline.com/resource-tenant-id/v2.0', preferred_username: 'user@contoso.com', amr: [] },
      });
      const result = validateTenantAccess(account, { requireMFA: false });
      expect(result.allowed).toBe(true);
    });
  });

  describe('combined rules', () => {
    it('allows when all rules pass', () => {
      const account = makeAccount({
        tenantId: 'same-tenant',
        idTokenClaims: {
          tid: 'same-tenant',
          iss: 'https://login.microsoftonline.com/same-tenant/v2.0',
          preferred_username: 'user@contoso.com',
          amr: ['mfa'],
        },
      });
      const config: MultiTenantConfig = {
        allowList: ['contoso.com'],
        requireType: 'Member',
        requireMFA: true,
      };
      const result = validateTenantAccess(account, config);
      expect(result.allowed).toBe(true);
    });

    it('denies when any rule fails', () => {
      const account = makeAccount({
        tenantId: 'same-tenant',
        idTokenClaims: {
          tid: 'same-tenant',
          iss: 'https://login.microsoftonline.com/same-tenant/v2.0',
          preferred_username: 'user@contoso.com',
          amr: [], // no MFA
        },
      });
      const config: MultiTenantConfig = {
        allowList: ['contoso.com'],
        requireMFA: true,
      };
      const result = validateTenantAccess(account, config);
      expect(result.allowed).toBe(false);
    });
  });

  describe('empty config', () => {
    it('allows access with empty config', () => {
      const result = validateTenantAccess(makeAccount(), {});
      expect(result.allowed).toBe(true);
    });
  });
});
