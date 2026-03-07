'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMsalAuth } from './useMsalAuth';
import { useGraphApi } from './useGraphApi';
import { sanitizeError } from '../utils/validation';
import { UserProfile, UseUserProfileReturn } from '../types/userProfile';

// Simple in-memory cache with size limit
const profileCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Prevent memory leaks

/**
 * Enforce cache size limit using LRU strategy
 */
function enforceCacheLimit(): void {
  if (profileCache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries
    const entries = Array.from(profileCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, profileCache.size - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => {
      const cached = profileCache.get(key);
      // Revoke blob URL before removing from cache
      if (cached?.data.photo) {
        URL.revokeObjectURL(cached.data.photo);
      }
      profileCache.delete(key);
    });
  }
}

/**
 * Hook for fetching and caching user profile from MS Graph
 * 
 * @remarks
 * Supports generic type parameter for custom profile fields.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { profile, loading } = useUserProfile();
 * console.log(profile?.department); // Now available!
 * 
 * // With custom fields
 * interface MyProfile extends UserProfile {
 *   customField: string;
 * }
 * const { profile } = useUserProfile<MyProfile>();
 * ```
 */
export function useUserProfile<T extends UserProfile = UserProfile>(): UseUserProfileReturn<T> {
  const { isAuthenticated, account } = useMsalAuth();
  const graph = useGraphApi();
  const [profile, setProfile] = useState<T | null>(null);
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
      setProfile(cached.data as T);
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

      const profileData: T = {
        id: userData.id,
        displayName: userData.displayName,
        givenName: userData.givenName,
        surname: userData.surname,
        userPrincipalName: userData.userPrincipalName,
        mail: userData.mail,
        jobTitle: userData.jobTitle,
        department: userData.department,
        companyName: userData.companyName,
        officeLocation: userData.officeLocation,
        mobilePhone: userData.mobilePhone,
        businessPhones: userData.businessPhones,
        preferredLanguage: userData.preferredLanguage,
        employeeId: userData.employeeId,
        employeeHireDate: userData.employeeHireDate,
        employeeType: userData.employeeType,
        country: userData.country,
        city: userData.city,
        state: userData.state,
        streetAddress: userData.streetAddress,
        postalCode: userData.postalCode,
        usageLocation: userData.usageLocation,
        manager: userData.manager,
        aboutMe: userData.aboutMe,
        birthday: userData.birthday,
        interests: userData.interests,
        skills: userData.skills,
        schools: userData.schools,
        pastProjects: userData.pastProjects,
        responsibilities: userData.responsibilities,
        mySite: userData.mySite,
        faxNumber: userData.faxNumber,
        accountEnabled: userData.accountEnabled,
        ageGroup: userData.ageGroup,
        userType: userData.userType,
        photo: photoUrl,
        ...userData, // Include any additional fields from the API
      } as T;

      // Cache the profile
      profileCache.set(cacheKey, {
        data: profileData,
        timestamp: Date.now(),
      });

      // Enforce cache size limit
      enforceCacheLimit();

      setProfile(profileData);
    } catch (err) {
      const error = err as Error;
      const sanitizedMessage = sanitizeError(error);
      const sanitizedError = new Error(sanitizedMessage);
      setError(sanitizedError);
      console.error('[UserProfile] Failed to fetch profile:', sanitizedMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, account, graph]);

  const clearCache = useCallback(() => {
    if (account) {
      const cached = profileCache.get(account.homeAccountId);
      // Revoke blob URL before clearing
      if (cached?.data.photo) {
        URL.revokeObjectURL(cached.data.photo);
      }
      profileCache.delete(account.homeAccountId);
    }
    // Revoke current profile photo URL
    if (profile?.photo) {
      URL.revokeObjectURL(profile.photo);
    }
    setProfile(null);
  }, [account, profile]);

  useEffect(() => {
    fetchProfile();

    // Cleanup: revoke blob URLs to prevent memory leaks
    return () => {
      if (profile?.photo) {
        URL.revokeObjectURL(profile.photo);
      }
    };
  }, [fetchProfile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (profile?.photo) {
        URL.revokeObjectURL(profile.photo);
      }
    };
  }, [profile?.photo]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    clearCache,
  };
}
