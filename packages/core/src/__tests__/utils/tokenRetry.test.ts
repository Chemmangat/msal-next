import { describe, it, expect, vi } from 'vitest';
import { retryWithBackoff, createRetryWrapper } from '../../utils/tokenRetry';

describe('tokenRetry', () => {
  describe('retryWithBackoff', () => {
    it('should return result on first success', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxRetries: 2,
        initialDelay: 10,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 2,
          initialDelay: 10,
        })
      ).rejects.toThrow('Network error');

      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should not retry non-retryable errors', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 2,
          initialDelay: 10,
        })
      ).rejects.toThrow('Invalid credentials');

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');

      const startTime = Date.now();
      await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 50,
        backoffMultiplier: 2,
      });
      const duration = Date.now() - startTime;

      // Should wait at least 50ms + 100ms = 150ms
      expect(duration).toBeGreaterThanOrEqual(150);
    });
  });

  describe('createRetryWrapper', () => {
    it('should create a retry wrapper function', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const wrapped = createRetryWrapper(fn, { maxRetries: 2 });

      const result = await wrapped('arg1', 'arg2');

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should retry wrapped function', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');

      const wrapped = createRetryWrapper(fn, {
        maxRetries: 2,
        initialDelay: 10,
      });

      const result = await wrapped();

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
