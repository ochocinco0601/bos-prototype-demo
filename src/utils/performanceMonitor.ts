/**
 * Performance Monitor - Real-time performance tracking and analysis
 * Monitors rendering, data operations, and BOS methodology processing
 */

import { logger, LogContext } from './logger'
import { errorMonitor } from './errorMonitor'

export interface PerformanceMetric {
  id: string
  name: string
  timestamp: string
  duration: number
  category: 'render' | 'data' | 'methodology' | 'ui' | 'api'
  context?: LogContext
  threshold?: number
  exceeded: boolean
  metadata?: Record<string, unknown>
}

export interface PerformanceStats {
  total: number
  averageDuration: number
  slowestOperation: PerformanceMetric | null
  fastestOperation: PerformanceMetric | null
  byCategory: Record<
    string,
    {
      count: number
      averageDuration: number
      totalDuration: number
    }
  >
  exceedingThreshold: PerformanceMetric[]
  recent: PerformanceMetric[]
}

export interface PerformanceThresholds {
  render: number // React component render
  dataValidation: number // BOS data validation
  dataTransformation: number // Data processing
  uiInteraction: number // User interactions
  persistence: number // Save/load operations
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private activeTimers: Map<
    string,
    { start: number; name: string; category: string; context?: LogContext }
  > = new Map()
  private maxMetrics = 1000
  private isDevelopment = import.meta.env.MODE === 'development'

  // Default performance thresholds (in milliseconds)
  private thresholds: PerformanceThresholds = {
    render: 16, // 60 FPS = 16ms per frame
    dataValidation: 100, // Data validation should be fast
    dataTransformation: 200, // Complex transformations
    uiInteraction: 50, // UI should feel snappy
    persistence: 500, // Storage operations
  }

  private constructor() {
    this.setupPerformanceObserver()
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  private setupPerformanceObserver(): void {
    if (!this.isDevelopment || !window.PerformanceObserver) return

    try {
      // Monitor long tasks (>50ms)
      const longTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: 'Long Task',
            duration: entry.duration,
            category: 'ui',
            context: {
              component: 'Browser',
              operation: 'longTask',
            },
            threshold: 50,
            metadata: {
              startTime: entry.startTime,
              entryType: entry.entryType,
            },
          })
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })

      // Monitor navigation performance
      const navigationObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming
          this.recordMetric({
            name: 'Page Load',
            duration: navEntry.loadEventEnd - navEntry.navigationStart,
            category: 'ui',
            context: {
              component: 'Navigation',
              operation: 'pageLoad',
            },
            threshold: 3000,
            metadata: {
              domContentLoaded:
                navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
              firstPaint: navEntry.loadEventStart - navEntry.navigationStart,
            },
          })
        }
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
    } catch (error) {
      logger.warn(
        'Performance observer setup failed',
        { component: 'PerformanceMonitor' },
        error
      )
    }
  }

  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
    logger.debug(
      'Performance thresholds updated',
      { component: 'PerformanceMonitor' },
      thresholds
    )
  }

  startTimer(
    name: string,
    category: keyof PerformanceThresholds | 'api',
    context?: LogContext
  ): string {
    const timerId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    this.activeTimers.set(timerId, {
      start: performance.now(),
      name,
      category,
      context,
    })

    return timerId
  }

  endTimer(
    timerId: string,
    metadata?: Record<string, unknown>
  ): PerformanceMetric | null {
    const timer = this.activeTimers.get(timerId)
    if (!timer) {
      logger.warn(`Timer not found: ${timerId}`, {
        component: 'PerformanceMonitor',
      })
      return null
    }

    const duration = performance.now() - timer.start
    this.activeTimers.delete(timerId)

    const threshold =
      this.thresholds[timer.category as keyof PerformanceThresholds] || 1000

    const metric = this.recordMetric({
      name: timer.name,
      duration,
      category: timer.category as any,
      context: timer.context,
      threshold,
      metadata,
    })

    return metric
  }

  recordMetric(params: {
    name: string
    duration: number
    category: 'render' | 'data' | 'methodology' | 'ui' | 'api'
    context?: LogContext
    threshold?: number
    metadata?: Record<string, unknown>
  }): PerformanceMetric {
    const metric: PerformanceMetric = {
      id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      timestamp: new Date().toISOString(),
      duration: params.duration,
      category: params.category,
      context: params.context,
      threshold: params.threshold,
      exceeded: params.threshold ? params.duration > params.threshold : false,
      metadata: params.metadata,
    }

    // Store metric
    this.metrics.push(metric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Log performance issue if threshold exceeded
    if (metric.exceeded) {
      const message = `Performance threshold exceeded: ${metric.name} took ${metric.duration.toFixed(2)}ms (threshold: ${metric.threshold}ms)`

      logger.warn(
        message,
        {
          component: 'PerformanceMonitor',
          operation: metric.name,
          category: metric.category,
          ...metric.context,
        },
        {
          duration: metric.duration,
          threshold: metric.threshold,
          ratio: metric.duration / (metric.threshold || 1),
          metadata: metric.metadata,
        }
      )

      // Capture as error if significantly over threshold
      if (metric.threshold && metric.duration > metric.threshold * 2) {
        errorMonitor.capturePerformanceError(
          message,
          metric.name,
          metric.duration,
          metric.threshold,
          metric.context
        )
      }
    } else if (this.isDevelopment) {
      logger.debug(
        `Performance: ${metric.name} completed in ${metric.duration.toFixed(2)}ms`,
        {
          component: 'PerformanceMonitor',
          category: metric.category,
          ...metric.context,
        }
      )
    }

    return metric
  }

  // BOS-specific performance tracking
  measureBOSValidation<T>(
    step: 'stakeholders' | 'dependencies' | 'impacts' | 'telemetry' | 'signals',
    flowId: string,
    fn: () => T
  ): T {
    const timerId = this.startTimer(`BOS Validation - ${step}`, 'methodology', {
      component: 'BOS',
      operation: step,
      flowId,
    })

    try {
      const result = fn()
      this.endTimer(timerId)
      return result
    } catch (error) {
      this.endTimer(timerId, { error: true })
      throw error
    }
  }

  async measureBOSValidationAsync<T>(
    step: 'stakeholders' | 'dependencies' | 'impacts' | 'telemetry' | 'signals',
    flowId: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const timerId = this.startTimer(`BOS Validation - ${step}`, 'methodology', {
      component: 'BOS',
      operation: step,
      flowId,
    })

    try {
      const result = await fn()
      this.endTimer(timerId)
      return result
    } catch (error) {
      this.endTimer(timerId, { error: true })
      throw error
    }
  }

  measureDataOperation<T>(
    operation: string,
    category: 'data' | 'render',
    fn: () => T,
    context?: LogContext
  ): T {
    const timerId = this.startTimer(
      operation,
      category === 'data' ? 'dataValidation' : 'render',
      context
    )

    try {
      const result = fn()
      this.endTimer(timerId)
      return result
    } catch (error) {
      this.endTimer(timerId, { error: true })
      throw error
    }
  }

  async measureDataOperationAsync<T>(
    operation: string,
    category: 'data' | 'render',
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const timerId = this.startTimer(
      operation,
      category === 'data' ? 'dataValidation' : 'render',
      context
    )

    try {
      const result = await fn()
      this.endTimer(timerId)
      return result
    } catch (error) {
      this.endTimer(timerId, { error: true })
      throw error
    }
  }

  // Analytics
  getStats(): PerformanceStats {
    const now = Date.now()
    const recentThreshold = now - 5 * 60 * 1000 // Last 5 minutes

    const stats: PerformanceStats = {
      total: this.metrics.length,
      averageDuration: 0,
      slowestOperation: null,
      fastestOperation: null,
      byCategory: {},
      exceedingThreshold: this.metrics.filter(m => m.exceeded),
      recent: this.metrics.filter(
        m => new Date(m.timestamp).getTime() > recentThreshold
      ),
    }

    if (this.metrics.length === 0) return stats

    // Calculate averages and extremes
    let totalDuration = 0
    let slowest = this.metrics[0]
    let fastest = this.metrics[0]

    for (const metric of this.metrics) {
      totalDuration += metric.duration

      if (metric.duration > slowest.duration) {
        slowest = metric
      }
      if (metric.duration < fastest.duration) {
        fastest = metric
      }

      // Category stats
      if (!stats.byCategory[metric.category]) {
        stats.byCategory[metric.category] = {
          count: 0,
          averageDuration: 0,
          totalDuration: 0,
        }
      }
      stats.byCategory[metric.category].count++
      stats.byCategory[metric.category].totalDuration += metric.duration
    }

    stats.averageDuration = totalDuration / this.metrics.length
    stats.slowestOperation = slowest
    stats.fastestOperation = fastest

    // Calculate category averages
    for (const category in stats.byCategory) {
      const categoryStats = stats.byCategory[category]
      categoryStats.averageDuration =
        categoryStats.totalDuration / categoryStats.count
    }

    return stats
  }

  getMetricsByCategory(category: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.category === category)
  }

  getSlowOperations(threshold?: number): PerformanceMetric[] {
    const defaultThreshold = threshold || 100
    return this.metrics.filter(m => m.duration > defaultThreshold)
  }

  clearMetrics(): void {
    this.metrics = []
    this.activeTimers.clear()
    logger.info('Performance metrics cleared', {
      component: 'PerformanceMonitor',
    })
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2)
  }

  // Development utilities
  generateReport(): string {
    const stats = this.getStats()

    let report = '📊 Performance Report\n'
    report += '='.repeat(50) + '\n\n'

    report += `Total Operations: ${stats.total}\n`
    report += `Average Duration: ${stats.averageDuration.toFixed(2)}ms\n`
    report += `Operations Exceeding Threshold: ${stats.exceedingThreshold.length}\n`
    report += `Recent Operations (5min): ${stats.recent.length}\n\n`

    if (stats.slowestOperation) {
      report += `Slowest Operation: ${stats.slowestOperation.name} (${stats.slowestOperation.duration.toFixed(2)}ms)\n`
    }
    if (stats.fastestOperation) {
      report += `Fastest Operation: ${stats.fastestOperation.name} (${stats.fastestOperation.duration.toFixed(2)}ms)\n`
    }

    report += '\nBy Category:\n'
    for (const [category, categoryStats] of Object.entries(stats.byCategory)) {
      report += `  ${category}: ${categoryStats.count} ops, avg ${categoryStats.averageDuration.toFixed(2)}ms\n`
    }

    if (stats.exceedingThreshold.length > 0) {
      report += '\n⚠️ Performance Issues:\n'
      for (const metric of stats.exceedingThreshold.slice(0, 10)) {
        report += `  ${metric.name}: ${metric.duration.toFixed(2)}ms (threshold: ${metric.threshold}ms)\n`
      }
    }

    return report
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Convenience functions
export function measurePerformance<T>(
  name: string,
  category: 'render' | 'data' | 'methodology' | 'ui' | 'api',
  fn: () => T,
  context?: LogContext
): T {
  const timerId = performanceMonitor.startTimer(name, category as any, context)
  try {
    const result = fn()
    performanceMonitor.endTimer(timerId)
    return result
  } catch (error) {
    performanceMonitor.endTimer(timerId, { error: true })
    throw error
  }
}

export async function measurePerformanceAsync<T>(
  name: string,
  category: 'render' | 'data' | 'methodology' | 'ui' | 'api',
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const timerId = performanceMonitor.startTimer(name, category as any, context)
  try {
    const result = await fn()
    performanceMonitor.endTimer(timerId)
    return result
  } catch (error) {
    performanceMonitor.endTimer(timerId, { error: true })
    throw error
  }
}
