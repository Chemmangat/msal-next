'use client';

import { useMsalAuth } from '../hooks/useMsalAuth';
import { CSSProperties, useState, useEffect, useRef } from 'react';

export interface MicrosoftSignInButtonProps {
  /**
   * Button text
   * @default 'Sign in with Microsoft'
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
   * Scopes to request
   */
  scopes?: string[];
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Custom styles
   */
  style?: CSSProperties;
  
  /**
   * Callback on successful login
   */
  onSuccess?: () => void;
  
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
}

export function MicrosoftSignInButton({
  text = 'Sign in with Microsoft',
  variant = 'dark',
  size = 'medium',
  scopes,
  className = '',
  style,
  onSuccess,
  onError,
}: MicrosoftSignInButtonProps) {
  const { loginRedirect, inProgress, isAuthenticated } = useMsalAuth();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset loading state when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading]);

  const handleClick = async () => {
    // Prevent multiple clicks and clicks when already authenticated
    if (inProgress || isLoading || isAuthenticated) {
      return;
    }

    setIsLoading(true);
    
    try {
      await loginRedirect(scopes);
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
      // Reset loading state on error
      setIsLoading(false);
    }
    
    // Safety timeout: reset loading state if redirect doesn't happen
    // This handles edge cases where redirect fails silently
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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

  const isDisabled = inProgress || isLoading;

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    fontWeight: 600,
    borderRadius: '2px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: isDisabled ? 0.6 : 1,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
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
