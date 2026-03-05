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

  /**
   * Enable performance tracking
   * @default false
   */
  enablePerformance?: boolean;

  /**
   * Enable network request logging
   * @default false
   */
  enableNetworkLogs?: boolean;

  /**
   * Maximum log history size
   * @default 100
   */
  maxHistorySize?: number;
}

/**
 * Log entry for history tracking
 */
export interface LogEntry {
  timestamp: number;
  level: string;
  message: string;
  data?: any;
}

/**
 * Performance timing entry
 */
export interface PerformanceTiming {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class DebugLogger {
  private config: Required<DebugLoggerConfig>;
  private logHistory: LogEntry[] = [];
  private performanceTimings: Map<string, PerformanceTiming> = new Map();

  constructor(config: DebugLoggerConfig = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      prefix: config.prefix ?? '[MSAL-Next]',
      showTimestamp: config.showTimestamp ?? true,
      level: config.level ?? 'info',
      enablePerformance: config.enablePerformance ?? false,
      enableNetworkLogs: config.enableNetworkLogs ?? false,
      maxHistorySize: config.maxHistorySize ?? 100,
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

  private addToHistory(level: string, message: string, data?: any): void {
    if (this.logHistory.length >= this.config.maxHistorySize) {
      this.logHistory.shift(); // Remove oldest entry
    }

    this.logHistory.push({
      timestamp: Date.now(),
      level,
      message,
      data,
    });
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, data));
      this.addToHistory('error', message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
      this.addToHistory('warn', message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data));
      this.addToHistory('info', message, data);
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, data));
      this.addToHistory('debug', message, data);
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

  /**
   * Start performance timing for an operation
   */
  startTiming(operation: string): void {
    if (this.config.enablePerformance) {
      this.performanceTimings.set(operation, {
        operation,
        startTime: performance.now(),
      });
      this.debug(`⏱️ Started: ${operation}`);
    }
  }

  /**
   * End performance timing for an operation
   */
  endTiming(operation: string): number | undefined {
    if (this.config.enablePerformance) {
      const timing = this.performanceTimings.get(operation);
      if (timing) {
        timing.endTime = performance.now();
        timing.duration = timing.endTime - timing.startTime;
        this.info(`⏱️ Completed: ${operation} (${timing.duration.toFixed(2)}ms)`);
        return timing.duration;
      }
    }
    return undefined;
  }

  /**
   * Log network request
   */
  logRequest(method: string, url: string, options?: any): void {
    if (this.config.enableNetworkLogs) {
      this.debug(`🌐 ${method} ${url}`, options);
    }
  }

  /**
   * Log network response
   */
  logResponse(method: string, url: string, status: number, data?: any): void {
    if (this.config.enableNetworkLogs) {
      const statusEmoji = status >= 200 && status < 300 ? '✅' : '❌';
      this.debug(`${statusEmoji} ${method} ${url} - ${status}`, data);
    }
  }

  /**
   * Get log history
   */
  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  /**
   * Get performance timings
   */
  getPerformanceTimings(): PerformanceTiming[] {
    return Array.from(this.performanceTimings.values());
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Clear performance timings
   */
  clearTimings(): void {
    this.performanceTimings.clear();
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      config: this.config,
      history: this.logHistory,
      performanceTimings: Array.from(this.performanceTimings.values()),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Download logs as a file
   */
  downloadLogs(filename: string = 'msal-next-debug-logs.json'): void {
    if (typeof window === 'undefined') return;

    const logs = this.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
 * const logger = getDebugLogger({ 
 *   enabled: true, 
 *   level: 'debug',
 *   enablePerformance: true,
 *   enableNetworkLogs: true
 * });
 * 
 * logger.startTiming('token-acquisition');
 * // ... do work
 * logger.endTiming('token-acquisition');
 * 
 * logger.logRequest('GET', '/me');
 * logger.info('User logged in', { username: 'user@example.com' });
 * 
 * // Export logs for debugging
 * logger.downloadLogs();
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
 * const logger = createScopedLogger('GraphAPI', { 
 *   enabled: true,
 *   enableNetworkLogs: true
 * });
 * logger.info('Fetching user profile');
 * ```
 */
export function createScopedLogger(scope: string, config?: DebugLoggerConfig): DebugLogger {
  return new DebugLogger({
    ...config,
    prefix: `[MSAL-Next:${scope}]`,
  });
}
