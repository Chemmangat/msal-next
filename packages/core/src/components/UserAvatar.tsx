'use client';

import { CSSProperties, useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

export interface UserAvatarProps {
  /**
   * Avatar size in pixels
   * @default 40
   */
  size?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: CSSProperties;

  /**
   * Show user name tooltip on hover
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Fallback image URL if MS Graph photo fails
   */
  fallbackImage?: string;
}

/**
 * UserAvatar component that displays user photo from MS Graph with fallback initials
 * 
 * @example
 * ```tsx
 * <UserAvatar size={48} />
 * ```
 */
export function UserAvatar({
  size = 40,
  className = '',
  style,
  showTooltip = true,
  fallbackImage,
}: UserAvatarProps) {
  const { profile, loading } = useUserProfile();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    if (profile?.photo) {
      setPhotoUrl(profile.photo);
    }
  }, [profile?.photo]);

  const getInitials = () => {
    if (!profile) return '?';
    
    const { givenName, surname, displayName } = profile;
    
    if (givenName && surname) {
      return `${givenName[0]}${surname[0]}`.toUpperCase();
    }
    
    if (displayName) {
      const parts = displayName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    
    return '?';
  };

  const baseStyles: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.4}px`,
    fontWeight: 600,
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#0078D4',
    color: '#FFFFFF',
    overflow: 'hidden',
    userSelect: 'none',
    ...style,
  };

  const displayName = profile?.displayName || 'User';

  if (loading) {
    return (
      <div
        className={className}
        style={{ ...baseStyles, backgroundColor: '#E1E1E1' }}
        aria-label="Loading user avatar"
      >
        <span style={{ fontSize: `${size * 0.3}px` }}>...</span>
      </div>
    );
  }

  if (photoUrl && !photoError) {
    return (
      <div
        className={className}
        style={baseStyles}
        title={showTooltip ? displayName : undefined}
        aria-label={`${displayName} avatar`}
      >
        <img
          src={photoUrl}
          alt={displayName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => {
            setPhotoError(true);
            if (fallbackImage) {
              setPhotoUrl(fallbackImage);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={baseStyles}
      title={showTooltip ? displayName : undefined}
      aria-label={`${displayName} avatar`}
    >
      {getInitials()}
    </div>
  );
}
