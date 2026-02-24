'use client';

import { Component, ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  /**
   * Content to render when no error
   */
  children: ReactNode;

  /**
   * Custom error fallback component
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;

  /**
   * Callback when error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for catching authentication errors
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MsalAuthProvider clientId="...">
 *     <App />
 *   </MsalAuthProvider>
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, debug } = this.props;

    if (debug) {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Error info:', errorInfo);
    }

    onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.reset);
      }

      return (
        <div
          style={{
            padding: '20px',
            margin: '20px',
            border: '1px solid #DC3545',
            borderRadius: '4px',
            backgroundColor: '#F8D7DA',
            color: '#721C24',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Authentication Error</h2>
          <p style={{ margin: '0 0 10px 0' }}>{error.message}</p>
          <button
            onClick={this.reset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#DC3545',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}
