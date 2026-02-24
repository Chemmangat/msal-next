/**
 * Retry configuration for token acquisition
 */
export interface RetryConfig {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Initial delay in milliseconds
   * @default 1000
   */
  initialDelay?: number;

  /**
   * Maximum delay in milliseconds
   * @default 10000
   */
  maxDelay?: number;

  /**
   * Backoff multiplier
   * @default 2
   */
  backoffMultiplier?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Exponential backoff retry utility for token acquisition
 * 
 * @example
 * ```tsx
 * const token = await retryWithBackoff(
 *   () => acquireTokenSilent(scopes),
 *   { maxRetries: 3, debug: true }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    debug = false,
  } = config;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (debug && attempt > 0) {
        console.log(`[TokenRetry] Attempt ${attempt + 1}/${maxRetries + 1}`);
      }

      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        if (debug) {
          console.error('[TokenRetry] All retry attempts failed');
        }
        break;
      }

      // Check if error is retryable
      if (!isRetryableError(error as Error)) {
        if (debug) {
          console.log('[TokenRetry] Non-retryable error, aborting');
        }
        throw error;
      }

      if (debug) {
        console.warn(`[TokenRetry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      }

      // Wait before retrying
      await sleep(delay);

      // Exponential backoff
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();

  // Network errors are retryable
  if (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch') ||
    message.includes('connection')
  ) {
    return true;
  }

  // Server errors (5xx) are retryable
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return true;
  }

  // Rate limiting is retryable
  if (message.includes('429') || message.includes('rate limit')) {
    return true;
  }

  // Token refresh errors are retryable
  if (message.includes('token') && message.includes('expired')) {
    return true;
  }

  return false;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a retry wrapper for a function
 * 
 * @example
 * ```tsx
 * const acquireTokenWithRetry = createRetryWrapper(acquireToken, {
 *   maxRetries: 3,
 *   debug: true
 * });
 * 
 * const token = await acquireTokenWithRetry(scopes);
 * ```
 */
export function createRetryWrapper<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  config: RetryConfig = {}
): (...args: TArgs) => Promise<TReturn> {
  return (...args: TArgs) => {
    return retryWithBackoff(() => fn(...args), config);
  };
}
