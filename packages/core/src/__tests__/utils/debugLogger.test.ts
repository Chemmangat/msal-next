import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDebugLogger, createScopedLogger } from '../../utils/debugLogger';

describe('debugLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDebugLogger', () => {
    it('should not log when disabled', () => {
      const logger = getDebugLogger({ enabled: false });
      const spy = vi.spyOn(console, 'info');

      logger.info('test message');

      expect(spy).not.toHaveBeenCalled();
    });

    it('should log when enabled', () => {
      const logger = getDebugLogger({ enabled: true });
      const spy = vi.spyOn(console, 'info');

      logger.info('test message');

      expect(spy).toHaveBeenCalled();
    });

    it('should respect log level', () => {
      const logger = getDebugLogger({ enabled: true, level: 'warn' });
      const infoSpy = vi.spyOn(console, 'info');
      const warnSpy = vi.spyOn(console, 'warn');

      logger.info('info message');
      logger.warn('warn message');

      expect(infoSpy).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('should format messages correctly', () => {
      const logger = getDebugLogger({
        enabled: true,
        level: 'info',
      });
      const spy = vi.spyOn(console, 'info');

      logger.info('test message');

      expect(spy).toHaveBeenCalled();
      const callArg = spy.mock.calls[0][0];
      expect(callArg).toContain('[MSAL-Next]');
      expect(callArg).toContain('[INFO]');
    });
  });

  describe('createScopedLogger', () => {
    it('should create logger with scoped prefix', () => {
      const logger = createScopedLogger('GraphAPI', {
        enabled: true,
        showTimestamp: false,
      });
      const spy = vi.spyOn(console, 'info');

      logger.info('test message');

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[MSAL-Next:GraphAPI]'));
    });
  });
});
