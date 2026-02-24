/**
 * Debug logger configuration
 */
export interface DebugLoggerConfig {
  /**
   * Enable debug mode
   * @default false
   */
  enabled?: boolean;

  /**
   * Prefix for log messages
   * @default '[MSAL-Next]'
   */
  prefix?: string;

  /**
   * Show timestamps
   * @default true
   */
  showTimestamp?: boolean;

  /**
   * Log level
   * @default 'info'
   */
  level?: 'error' | 'warn' | 'info' | 'debug';
}

class DebugLogger {
  private config: Required<DebugLoggerConfig>;

  constructor(config: DebugLoggerConfig = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      prefix: config.prefix ?? '[MSAL-Next]',
      showTimestamp: config.showTimestamp ?? true,
      level: config.level ?? 'info',
    };
  }

  private shouldLog(level: string): boolean {
    if (!this.config.enabled) return false;

    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = this.config.showTimestamp ? `[${new Date().toISOString()}]` : '';
    const prefix = this.config.prefix;
    const levelStr = `[${level.toUpperCase()}]`;

    let formatted = `${timestamp} ${prefix} ${levelStr} ${message}`;

    if (data !== undefined) {
      formatted += '\n' + JSON.stringify(data, null, 2);
    }

    return formatted;
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  group(label: string): void {
    if (this.config.enabled) {
      console.group(`${this.config.prefix} ${label}`);
    }
  }

  groupEnd(): void {
    if (this.config.enabled) {
      console.groupEnd();
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  setLevel(level: DebugLoggerConfig['level']): void {
    if (level) {
      this.config.level = level;
    }
  }
}

// Global logger instance
let globalLogger: DebugLogger | null = null;

/**
 * Get or create the global debug logger
 * 
 * @example
 * ```tsx
 * const logger = getDebugLogger({ enabled: true, level: 'debug' });
 * logger.info('User logged in', { username: 'user@example.com' });
 * ```
 */
export function getDebugLogger(config?: DebugLoggerConfig): DebugLogger {
  if (!globalLogger) {
    globalLogger = new DebugLogger(config);
  } else if (config) {
    // Update config if provided
    if (config.enabled !== undefined) {
      globalLogger.setEnabled(config.enabled);
    }
    if (config.level) {
      globalLogger.setLevel(config.level);
    }
  }

  return globalLogger;
}

/**
 * Create a scoped logger with a custom prefix
 * 
 * @example
 * ```tsx
 * const logger = createScopedLogger('GraphAPI', { enabled: true });
 * logger.info('Fetching user profile');
 * ```
 */
export function createScopedLogger(scope: string, config?: DebugLoggerConfig): DebugLogger {
  return new DebugLogger({
    ...config,
    prefix: `[MSAL-Next:${scope}]`,
  });
}
