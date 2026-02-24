'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMsalAuth } from './useMsalAuth';
import { useGraphApi } from './useGraphApi';

export interface UserProfile {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  userPrincipalName: string;
  mail: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  photo?: string;
}

export interface UseUserProfileReturn {
  /**
   * User profile data
   */
  profile: UserProfile | null;

  /**
   * Whether profile is loading
   */
  loading: boolean;

  /**
   * Error if profile fetch failed
   */
  error: Error | null;

  /**
   * Refetch user profile
   */
  refetch: () => Promise<void>;

  /**
   * Clear cached profile
   */
  clearCache: () => void;
}

// Simple in-memory cache
const profileCache = new Map<string, { data: UserProfile; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook for fetching and caching user profile from MS Graph
 * 
 * @example
 * ```tsx
 * const { profile, loading } = useUserProfile();
 * ```
 */
export function useUserProfile(): UseUserProfileReturn {
  const { isAuthenticated, account } = useMsalAuth();
  const graph = useGraphApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !account) {
      setProfile(null);
      return;
    }

    const cacheKey = account.homeAccountId;

    // Check cache
    const cached = profileCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setProfile(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user profile
      const userData = await graph.get<any>('/me', {
        scopes: ['User.Read'],
      });

      // Try to fetch user photo
      let photoUrl: string | undefined;
      try {
        const photoBlob = await graph.get<Blob>('/me/photo/$value', {
          scopes: ['User.Read'],
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        if (photoBlob) {
          photoUrl = URL.createObjectURL(photoBlob as any);
        }
      } catch (photoError) {
        // Photo might not exist, that's okay
        console.debug('[UserProfile] Photo not available');
      }

      const profileData: UserProfile = {
        id: userData.id,
        displayName: userData.displayName,
        givenName: userData.givenName,
        surname: userData.surname,
        userPrincipalName: userData.userPrincipalName,
        mail: userData.mail,
        jobTitle: userData.jobTitle,
        officeLocation: userData.officeLocation,
        mobilePhone: userData.mobilePhone,
        businessPhones: userData.businessPhones,
        photo: photoUrl,
      };

      // Cache the profile
      profileCache.set(cacheKey, {
        data: profileData,
        timestamp: Date.now(),
      });

      setProfile(profileData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('[UserProfile] Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, account, graph]);

  const clearCache = useCallback(() => {
    if (account) {
      profileCache.delete(account.homeAccountId);
    }
    setProfile(null);
  }, [account]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    clearCache,
  };
}
