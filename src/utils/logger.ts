/**
 * Development Logger - Comprehensive logging system for BOS prototype
 * Provides structured logging with levels, context, and debugging utilities
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export interface LogContext {
  component?: string
  operation?: string
  flowId?: string
  stepId?: string
  userId?: string
  sessionId?: string
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
  data?: unknown
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel = LogLevel.INFO
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = import.meta.env.MODE === 'development'

  private constructor() {
    // Set development log level
    if (this.isDevelopment) {
      this.logLevel = LogLevel.DEBUG
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    data?: unknown
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      data,
    }

    // Store in memory for debugging
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    return entry
  }

  private formatLogMessage(entry: LogEntry): string {
    const levelStr = LogLevel[entry.level]
    const contextStr = entry.context
      ? `[${Object.entries(entry.context)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ')}]`
      : ''

    return `[${entry.timestamp}] ${levelStr}: ${entry.message} ${contextStr}`
  }

  error(
    message: string,
    context?: LogContext,
    error?: Error,
    data?: unknown
  ): void {
    if (!this.shouldLog(LogLevel.ERROR)) return

    const entry = this.createLogEntry(
      LogLevel.ERROR,
      message,
      context,
      error,
      data
    )

    if (this.isDevelopment) {
      console.error(this.formatLogMessage(entry), error || '', data || '')
    }
  }

  warn(message: string, context?: LogContext, data?: unknown): void {
    if (!this.shouldLog(LogLevel.WARN)) return

    const entry = this.createLogEntry(
      LogLevel.WARN,
      message,
      context,
      undefined,
      data
    )

    if (this.isDevelopment) {
      console.warn(this.formatLogMessage(entry), data || '')
    }
  }

  info(message: string, context?: LogContext, data?: unknown): void {
    if (!this.shouldLog(LogLevel.INFO)) return

    const entry = this.createLogEntry(
      LogLevel.INFO,
      message,
      context,
      undefined,
      data
    )

    if (this.isDevelopment) {
      console.info(this.formatLogMessage(entry), data || '')
    }
  }

  debug(message: string, context?: LogContext, data?: unknown): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    const entry = this.createLogEntry(
      LogLevel.DEBUG,
      message,
      context,
      undefined,
      data
    )

    if (this.isDevelopment) {
      console.debug(this.formatLogMessage(entry), data || '')
    }
  }

  trace(message: string, context?: LogContext, data?: unknown): void {
    if (!this.shouldLog(LogLevel.TRACE)) return

    const entry = this.createLogEntry(
      LogLevel.TRACE,
      message,
      context,
      undefined,
      data
    )

    if (this.isDevelopment) {
      console.trace(this.formatLogMessage(entry), data || '')
    }
  }

  // BOS-specific logging methods
  bosMethodology(
    message: string,
    step: 'stakeholders' | 'dependencies' | 'impacts' | 'telemetry' | 'signals',
    flowId?: string,
    stepId?: string,
    data?: unknown
  ): void {
    this.debug(
      `BOS Methodology - ${step}: ${message}`,
      {
        component: 'BOS',
        operation: step,
        flowId,
        stepId,
      },
      data
    )
  }

  dataValidation(
    message: string,
    operation: string,
    valid: boolean,
    errors?: string[],
    data?: unknown
  ): void {
    const level = valid ? LogLevel.DEBUG : LogLevel.WARN
    const entry = this.createLogEntry(
      level,
      `Data Validation - ${operation}: ${message}`,
      {
        component: 'DataValidation',
        operation,
      },
      undefined,
      { valid, errors, data }
    )

    if (this.shouldLog(level) && this.isDevelopment) {
      const logFn = valid ? console.debug : console.warn
      logFn(this.formatLogMessage(entry), { valid, errors, data })
    }
  }

  performance(
    operation: string,
    duration: number,
    context?: LogContext,
    data?: unknown
  ): void {
    this.debug(
      `Performance - ${operation}: ${duration}ms`,
      {
        component: 'Performance',
        operation,
        ...context,
      },
      data
    )
  }

  // Development utilities
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  getLogStats(): { total: number; byLevel: Record<string, number> } {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
    }

    for (const log of this.logs) {
      const levelName = LogLevel[log.level]
      stats.byLevel[levelName] = (stats.byLevel[levelName] || 0) + 1
    }

    return stats
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Convenience exports
export const log = {
  error: (
    message: string,
    context?: LogContext,
    error?: Error,
    data?: unknown
  ) => logger.error(message, context, error, data),
  warn: (message: string, context?: LogContext, data?: unknown) =>
    logger.warn(message, context, data),
  info: (message: string, context?: LogContext, data?: unknown) =>
    logger.info(message, context, data),
  debug: (message: string, context?: LogContext, data?: unknown) =>
    logger.debug(message, context, data),
  trace: (message: string, context?: LogContext, data?: unknown) =>
    logger.trace(message, context, data),
  bos: (
    message: string,
    step: 'stakeholders' | 'dependencies' | 'impacts' | 'telemetry' | 'signals',
    flowId?: string,
    stepId?: string,
    data?: unknown
  ) => logger.bosMethodology(message, step, flowId, stepId, data),
  validation: (
    message: string,
    operation: string,
    valid: boolean,
    errors?: string[],
    data?: unknown
  ) => logger.dataValidation(message, operation, valid, errors, data),
  perf: (
    operation: string,
    duration: number,
    context?: LogContext,
    data?: unknown
  ) => logger.performance(operation, duration, context, data),
}

// Performance timing utility
export function withTiming<T>(
  operation: string,
  fn: () => T,
  context?: LogContext
): T {
  const start = performance.now()
  try {
    const result = fn()
    const duration = performance.now() - start
    log.perf(operation, duration, context)
    return result
  } catch (error) {
    const duration = performance.now() - start
    log.error(
      `${operation} failed after ${duration}ms`,
      context,
      error as Error
    )
    throw error
  }
}

// Async performance timing utility
export async function withTimingAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    log.perf(operation, duration, context)
    return result
  } catch (error) {
    const duration = performance.now() - start
    log.error(
      `${operation} failed after ${duration}ms`,
      context,
      error as Error
    )
    throw error
  }
}
