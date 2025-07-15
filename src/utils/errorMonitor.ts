/**
 * Development Error Monitor - Comprehensive error tracking and reporting
 * Captures, categorizes, and reports errors for debugging and monitoring
 */

import { logger, LogContext } from './logger'

export enum ErrorCategory {
  VALIDATION = 'validation',
  DATA_CORRUPTION = 'data_corruption',
  PERSISTENCE = 'persistence',
  BOS_METHODOLOGY = 'bos_methodology',
  UI_INTERACTION = 'ui_interaction',
  PERFORMANCE = 'performance',
  UNKNOWN = 'unknown',
}

export enum ErrorSeverity {
  CRITICAL = 'critical', // Data loss, system unusable
  HIGH = 'high', // Major functionality broken
  MEDIUM = 'medium', // Feature partially broken
  LOW = 'low', // Minor issues, workarounds available
}

export interface ErrorReport {
  id: string
  timestamp: string
  category: ErrorCategory
  severity: ErrorSeverity
  message: string
  stack?: string
  context?: LogContext
  userAgent?: string
  url?: string
  componentStack?: string
  errorBoundary?: string
  recoverable: boolean
  recovered: boolean
  recoveryAction?: string
  additionalData?: Record<string, unknown>
}

export interface ErrorStats {
  total: number
  byCategory: Record<ErrorCategory, number>
  bySeverity: Record<ErrorSeverity, number>
  recent: ErrorReport[]
  critical: ErrorReport[]
}

class ErrorMonitor {
  private static instance: ErrorMonitor
  private errors: ErrorReport[] = []
  private maxErrors = 500
  private isDevelopment = import.meta.env.MODE === 'development'

  private constructor() {
    this.setupGlobalErrorHandling()
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  private setupGlobalErrorHandling(): void {
    // Global error handler for unhandled errors
    window.addEventListener('error', event => {
      this.captureError({
        error: event.error,
        message: event.message,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.HIGH,
        context: {
          component: 'Global',
          operation: 'unhandledError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', event => {
      this.captureError({
        error: event.reason,
        message: `Unhandled Promise Rejection: ${event.reason}`,
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.HIGH,
        context: {
          component: 'Global',
          operation: 'unhandledPromiseRejection',
        },
      })
    })
  }

  captureError(params: {
    error?: Error
    message: string
    category: ErrorCategory
    severity: ErrorSeverity
    context?: LogContext
    recoverable?: boolean
    recovered?: boolean
    recoveryAction?: string
    additionalData?: Record<string, unknown>
  }): string {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const report: ErrorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      category: params.category,
      severity: params.severity,
      message: params.message,
      stack: params.error?.stack,
      context: params.context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      recoverable: params.recoverable ?? true,
      recovered: params.recovered ?? false,
      recoveryAction: params.recoveryAction,
      additionalData: params.additionalData,
    }

    // Store error
    this.errors.push(report)
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Log error
    logger.error(
      `[${params.category}] ${params.message}`,
      {
        errorId,
        severity: params.severity,
        recoverable: params.recoverable,
        ...params.context,
      },
      params.error,
      params.additionalData
    )

    // Development-specific handling
    if (this.isDevelopment) {
      this.logErrorToConsole(report)
    }

    return errorId
  }

  private logErrorToConsole(report: ErrorReport): void {
    const style = this.getConsoleStyle(report.severity)
    console.group(
      `%c🚨 ${report.severity.toUpperCase()} ERROR - ${report.category}`,
      style
    )
    console.log('Message:', report.message)
    console.log('Context:', report.context)
    console.log('Stack:', report.stack)
    console.log('Additional Data:', report.additionalData)
    console.log('Full Report:', report)
    console.groupEnd()
  }

  private getConsoleStyle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'background: #d32f2f; color: white; font-weight: bold; padding: 2px 8px;'
      case ErrorSeverity.HIGH:
        return 'background: #f57c00; color: white; font-weight: bold; padding: 2px 8px;'
      case ErrorSeverity.MEDIUM:
        return 'background: #fbc02d; color: black; font-weight: bold; padding: 2px 8px;'
      case ErrorSeverity.LOW:
        return 'background: #388e3c; color: white; font-weight: bold; padding: 2px 8px;'
      default:
        return 'background: #616161; color: white; font-weight: bold; padding: 2px 8px;'
    }
  }

  // BOS-specific error handling
  captureValidationError(
    message: string,
    validationErrors: string[],
    data: unknown,
    context?: LogContext
  ): string {
    return this.captureError({
      message,
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      context: {
        component: 'Validation',
        validationErrors: validationErrors.join(', '),
        ...context,
      },
      recoverable: true,
      additionalData: { validationErrors, data },
    })
  }

  captureDataCorruption(
    message: string,
    corruptedData: unknown,
    context?: LogContext
  ): string {
    return this.captureError({
      message,
      category: ErrorCategory.DATA_CORRUPTION,
      severity: ErrorSeverity.CRITICAL,
      context: {
        component: 'DataIntegrity',
        ...context,
      },
      recoverable: false,
      additionalData: { corruptedData },
    })
  }

  capturePersistenceError(
    message: string,
    operation: string,
    error?: Error,
    context?: LogContext
  ): string {
    return this.captureError({
      error,
      message,
      category: ErrorCategory.PERSISTENCE,
      severity: ErrorSeverity.HIGH,
      context: {
        component: 'Persistence',
        operation,
        ...context,
      },
      recoverable: true,
    })
  }

  captureBOSMethodologyError(
    message: string,
    step: string,
    data: unknown,
    context?: LogContext
  ): string {
    return this.captureError({
      message,
      category: ErrorCategory.BOS_METHODOLOGY,
      severity: ErrorSeverity.MEDIUM,
      context: {
        component: 'BOSMethodology',
        step,
        ...context,
      },
      recoverable: true,
      additionalData: { step, data },
    })
  }

  captureUIError(
    message: string,
    component: string,
    error?: Error,
    context?: LogContext
  ): string {
    return this.captureError({
      error,
      message,
      category: ErrorCategory.UI_INTERACTION,
      severity: ErrorSeverity.LOW,
      context: {
        component,
        operation: 'ui_interaction',
        ...context,
      },
      recoverable: true,
    })
  }

  capturePerformanceError(
    message: string,
    operation: string,
    duration: number,
    threshold: number,
    context?: LogContext
  ): string {
    return this.captureError({
      message,
      category: ErrorCategory.PERFORMANCE,
      severity:
        duration > threshold * 2 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      context: {
        component: 'Performance',
        operation,
        ...context,
      },
      recoverable: true,
      additionalData: { duration, threshold, ratio: duration / threshold },
    })
  }

  // Error recovery
  markAsRecovered(errorId: string, recoveryAction: string): void {
    const error = this.errors.find(e => e.id === errorId)
    if (error) {
      error.recovered = true
      error.recoveryAction = recoveryAction

      logger.info(`Error recovered: ${error.message}`, {
        errorId,
        recoveryAction,
        category: error.category,
      })
    }
  }

  // Analytics and reporting
  getErrorStats(): ErrorStats {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    const stats: ErrorStats = {
      total: this.errors.length,
      byCategory: {} as Record<ErrorCategory, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      recent: this.errors.filter(
        e => new Date(e.timestamp).getTime() > oneHourAgo
      ),
      critical: this.errors.filter(e => e.severity === ErrorSeverity.CRITICAL),
    }

    // Count by category and severity
    for (const error of this.errors) {
      stats.byCategory[error.category] =
        (stats.byCategory[error.category] || 0) + 1
      stats.bySeverity[error.severity] =
        (stats.bySeverity[error.severity] || 0) + 1
    }

    return stats
  }

  getErrorById(errorId: string): ErrorReport | undefined {
    return this.errors.find(e => e.id === errorId)
  }

  getErrorsByCategory(category: ErrorCategory): ErrorReport[] {
    return this.errors.filter(e => e.category === category)
  }

  getErrorsBySeverity(severity: ErrorSeverity): ErrorReport[] {
    return this.errors.filter(e => e.severity === severity)
  }

  clearErrors(): void {
    this.errors = []
    logger.info('Error monitor cleared', { component: 'ErrorMonitor' })
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2)
  }

  // Health check
  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'critical'
    issues: string[]
    recommendations: string[]
  } {
    const stats = this.getErrorStats()
    const criticalCount = stats.critical.length
    const recentCount = stats.recent.length

    let status: 'healthy' | 'degraded' | 'critical' = 'healthy'
    const issues: string[] = []
    const recommendations: string[] = []

    if (criticalCount > 0) {
      status = 'critical'
      issues.push(`${criticalCount} critical errors detected`)
      recommendations.push('Address critical errors immediately')
    } else if (recentCount > 10) {
      status = 'degraded'
      issues.push(`${recentCount} errors in the last hour`)
      recommendations.push('Monitor error patterns and consider fixes')
    }

    if (stats.byCategory[ErrorCategory.DATA_CORRUPTION] > 0) {
      status = 'critical'
      issues.push('Data corruption detected')
      recommendations.push('Validate data integrity and restore from backup')
    }

    return { status, issues, recommendations }
  }
}

// Export singleton instance
export const errorMonitor = ErrorMonitor.getInstance()

// Convenience functions
export const captureError = {
  validation: (
    message: string,
    errors: string[],
    data: unknown,
    context?: LogContext
  ) => errorMonitor.captureValidationError(message, errors, data, context),

  dataCorruption: (message: string, data: unknown, context?: LogContext) =>
    errorMonitor.captureDataCorruption(message, data, context),

  persistence: (
    message: string,
    operation: string,
    error?: Error,
    context?: LogContext
  ) => errorMonitor.capturePersistenceError(message, operation, error, context),

  bosMethodology: (
    message: string,
    step: string,
    data: unknown,
    context?: LogContext
  ) => errorMonitor.captureBOSMethodologyError(message, step, data, context),

  ui: (
    message: string,
    component: string,
    error?: Error,
    context?: LogContext
  ) => errorMonitor.captureUIError(message, component, error, context),

  performance: (
    message: string,
    operation: string,
    duration: number,
    threshold: number,
    context?: LogContext
  ) =>
    errorMonitor.capturePerformanceError(
      message,
      operation,
      duration,
      threshold,
      context
    ),
}
