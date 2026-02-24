'use client';

import { useCallback } from 'react';
import { useMsalAuth } from './useMsalAuth';

export interface GraphApiOptions extends RequestInit {
  /**
   * Scopes required for the API call
   * @default ['User.Read']
   */
  scopes?: string[];

  /**
   * API version
   * @default 'v1.0'
   */
  version?: 'v1.0' | 'beta';

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export interface UseGraphApiReturn {
  /**
   * Make a GET request to MS Graph API
   */
  get: <T = any>(endpoint: string, options?: GraphApiOptions) => Promise<T>;

  /**
   * Make a POST request to MS Graph API
   */
  post: <T = any>(endpoint: string, body?: any, options?: GraphApiOptions) => Promise<T>;

  /**
   * Make a PUT request to MS Graph API
   */
  put: <T = any>(endpoint: string, body?: any, options?: GraphApiOptions) => Promise<T>;

  /**
   * Make a PATCH request to MS Graph API
   */
  patch: <T = any>(endpoint: string, body?: any, options?: GraphApiOptions) => Promise<T>;

  /**
   * Make a DELETE request to MS Graph API
   */
  delete: <T = any>(endpoint: string, options?: GraphApiOptions) => Promise<T>;

  /**
   * Make a custom request to MS Graph API
   */
  request: <T = any>(endpoint: string, options?: GraphApiOptions) => Promise<T>;
}

/**
 * Hook for making authenticated requests to MS Graph API
 * 
 * @example
 * ```tsx
 * const graph = useGraphApi();
 * const user = await graph.get('/me');
 * ```
 */
export function useGraphApi(): UseGraphApiReturn {
  const { acquireToken } = useMsalAuth();

  const request = useCallback(
    async <T = any>(endpoint: string, options: GraphApiOptions = {}): Promise<T> => {
      const {
        scopes = ['User.Read'],
        version = 'v1.0',
        debug = false,
        ...fetchOptions
      } = options;

      try {
        // Acquire access token
        const token = await acquireToken(scopes);

        // Build URL
        const baseUrl = `https://graph.microsoft.com/${version}`;
        const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        if (debug) {
          console.log('[GraphAPI] Request:', { url, method: fetchOptions.method || 'GET' });
        }

        // Make request
        const response = await fetch(url, {
          ...fetchOptions,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Graph API error (${response.status}): ${errorText}`);
        }

        // Handle empty responses
        if (response.status === 204 || response.headers.get('content-length') === '0') {
          return null as T;
        }

        const data = await response.json();

        if (debug) {
          console.log('[GraphAPI] Response:', data);
        }

        return data as T;
      } catch (error) {
        console.error('[GraphAPI] Request failed:', error);
        throw error;
      }
    },
    [acquireToken]
  );

  const get = useCallback(
    <T = any>(endpoint: string, options: GraphApiOptions = {}): Promise<T> => {
      return request<T>(endpoint, { ...options, method: 'GET' });
    },
    [request]
  );

  const post = useCallback(
    <T = any>(endpoint: string, body?: any, options: GraphApiOptions = {}): Promise<T> => {
      return request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    [request]
  );

  const put = useCallback(
    <T = any>(endpoint: string, body?: any, options: GraphApiOptions = {}): Promise<T> => {
      return request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    [request]
  );

  const patch = useCallback(
    <T = any>(endpoint: string, body?: any, options: GraphApiOptions = {}): Promise<T> => {
      return request<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    [request]
  );

  const deleteRequest = useCallback(
    <T = any>(endpoint: string, options: GraphApiOptions = {}): Promise<T> => {
      return request<T>(endpoint, { ...options, method: 'DELETE' });
    },
    [request]
  );

  return {
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
    request,
  };
}
