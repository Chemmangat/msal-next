'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMsalAuth } from './useMsalAuth';
import { useGraphApi } from './useGraphApi';

export interface UseRolesReturn {
  /**
   * User's Azure AD roles
   */
  roles: string[];

  /**
   * User's Azure AD groups
   */
  groups: string[];

  /**
   * Whether roles/groups are loading
   */
  loading: boolean;

  /**
   * Error if fetch failed
   */
  error: Error | null;

  /**
   * Check if user has a specific role
   */
  hasRole: (role: string) => boolean;

  /**
   * Check if user is in a specific group
   */
  hasGroup: (groupId: string) => boolean;

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles: string[]) => boolean;

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles: (roles: string[]) => boolean;

  /**
   * Refetch roles and groups
   */
  refetch: () => Promise<void>;
}

// Simple in-memory cache
const rolesCache = new Map<string, { roles: string[]; groups: string[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching user's Azure AD roles and groups
 * 
 * @example
 * ```tsx
 * const { roles, hasRole } = useRoles();
 * if (hasRole('Admin')) {
 *   // Show admin content
 * }
 * ```
 */
export function useRoles(): UseRolesReturn {
  const { isAuthenticated, account } = useMsalAuth();
  const graph = useGraphApi();
  const [roles, setRoles] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRolesAndGroups = useCallback(async () => {
    if (!isAuthenticated || !account) {
      setRoles([]);
      setGroups([]);
      return;
    }

    const cacheKey = account.homeAccountId;

    // Check cache
    const cached = rolesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setRoles(cached.roles);
      setGroups(cached.groups);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract roles from ID token claims
      const idTokenClaims = account.idTokenClaims as any;
      const tokenRoles = idTokenClaims?.roles || [];

      // Fetch user's groups from Graph API
      const groupsResponse = await graph.get<{ value: Array<{ id: string }> }>('/me/memberOf', {
        scopes: ['User.Read', 'Directory.Read.All'],
      });

      const userGroups = groupsResponse.value.map((group) => group.id);

      // Cache the data
      rolesCache.set(cacheKey, {
        roles: tokenRoles,
        groups: userGroups,
        timestamp: Date.now(),
      });

      setRoles(tokenRoles);
      setGroups(userGroups);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('[Roles] Failed to fetch roles/groups:', error);
      
      // Fallback to token claims only
      const idTokenClaims = account.idTokenClaims as any;
      const tokenRoles = idTokenClaims?.roles || [];
      setRoles(tokenRoles);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, account, graph]);

  const hasRole = useCallback(
    (role: string): boolean => {
      return roles.includes(role);
    },
    [roles]
  );

  const hasGroup = useCallback(
    (groupId: string): boolean => {
      return groups.includes(groupId);
    },
    [groups]
  );

  const hasAnyRole = useCallback(
    (checkRoles: string[]): boolean => {
      return checkRoles.some((role) => roles.includes(role));
    },
    [roles]
  );

  const hasAllRoles = useCallback(
    (checkRoles: string[]): boolean => {
      return checkRoles.every((role) => roles.includes(role));
    },
    [roles]
  );

  useEffect(() => {
    fetchRolesAndGroups();
  }, [fetchRolesAndGroups]);

  return {
    roles,
    groups,
    loading,
    error,
    hasRole,
    hasGroup,
    hasAnyRole,
    hasAllRoles,
    refetch: fetchRolesAndGroups,
  };
}
