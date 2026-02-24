'use client';

import { useMsalAuth } from '../hooks/useMsalAuth';
import { CSSProperties } from 'react';

export interface SignOutButtonProps {
  /**
   * Button text
   * @default 'Sign out'
   */
  text?: string;
  
  /**
   * Button variant
   * @default 'dark'
   */
  variant?: 'dark' | 'light';
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Use redirect flow instead of popup
   * @default false
   */
  useRedirect?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: CSSProperties;
  
  /**
   * Callback on successful logout
   */
  onSuccess?: () => void;
  
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
}

/**
 * SignOutButton component with Microsoft branding
 * 
 * @example
 * ```tsx
 * <SignOutButton variant="light" />
 * ```
 */
export function SignOutButton({
  text = 'Sign out',
  variant = 'dark',
  size = 'medium',
  useRedirect = false,
  className = '',
  style,
  onSuccess,
  onError,
}: SignOutButtonProps) {
  const { logoutPopup, logoutRedirect, inProgress } = useMsalAuth();

  const handleClick = async () => {
    try {
      if (useRedirect) {
        await logoutRedirect();
      } else {
        await logoutPopup();
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
      height: '36px',
    },
    medium: {
      padding: '10px 20px',
      fontSize: '15px',
      height: '41px',
    },
    large: {
      padding: '12px 24px',
      fontSize: '16px',
      height: '48px',
    },
  };

  const variantStyles = {
    dark: {
      backgroundColor: '#2F2F2F',
      color: '#FFFFFF',
      border: '1px solid #8C8C8C',
    },
    light: {
      backgroundColor: '#FFFFFF',
      color: '#5E5E5E',
      border: '1px solid #8C8C8C',
    },
  };

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontWeight: 600,
    borderRadius: '2px',
    cursor: inProgress ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: inProgress ? 0.6 : 1,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      onClick={handleClick}
      disabled={inProgress}
      className={className}
      style={baseStyles}
      aria-label={text}
    >
      <MicrosoftLogo />
      <span>{text}</span>
    </button>
  );
}

function MicrosoftLogo() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="#F25022" />
      <rect x="11" width="10" height="10" fill="#7FBA00" />
      <rect y="11" width="10" height="10" fill="#00A4EF" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
