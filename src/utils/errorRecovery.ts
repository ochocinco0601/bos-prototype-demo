/**
 * Error Recovery System - Automated recovery mechanisms for critical failures
 * Handles graceful degradation and automatic recovery from common error scenarios
 */

import { Flow } from '../types'
import { errorMonitor, ErrorCategory, ErrorSeverity } from './errorMonitor'
import { logger } from './logger'
import { BackupManager } from '../data/backupManager'
import { SchemaValidator } from '../data/schemaValidator'

export interface RecoveryAction {
  id: string
  type: 'data_restore' | 'data_repair' | 'feature_disable' | 'fallback_mode'
  description: string
  automatic: boolean
  executed: boolean
  timestamp?: string
  result?: 'success' | 'failure' | 'partial'
  details?: string
}

export interface RecoveryPlan {
  errorId: string
  category: ErrorCategory
  severity: ErrorSeverity
  actions: RecoveryAction[]
  status: 'pending' | 'executing' | 'completed' | 'failed'
  fallbackData?: Flow[]
}

class ErrorRecoveryManager {
  private static instance: ErrorRecoveryManager
  private recoveryPlans: Map<string, RecoveryPlan> = new Map()
  private isDevelopment = import.meta.env.MODE === 'development'

  private constructor() {}

  static getInstance(): ErrorRecoveryManager {
    if (!ErrorRecoveryManager.instance) {
      ErrorRecoveryManager.instance = new ErrorRecoveryManager()
    }
    return ErrorRecoveryManager.instance
  }

  /**
   * Create recovery plan for critical errors
   */
  createRecoveryPlan(
    errorId: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context?: any
  ): RecoveryPlan {
    const plan: RecoveryPlan = {
      errorId,
      category,
      severity,
      actions: this.generateRecoveryActions(category, severity, context),
      status: 'pending',
    }

    this.recoveryPlans.set(errorId, plan)

    logger.info(`Recovery plan created for error ${errorId}`, {
      component: 'ErrorRecovery',
      operation: 'createPlan',
      category,
      severity,
      actionsCount: plan.actions.length,
    })

    return plan
  }

  /**
   * Execute recovery plan automatically or manually
   */
  async executeRecoveryPlan(errorId: string, force = false): Promise<boolean> {
    const plan = this.recoveryPlans.get(errorId)
    if (!plan) {
      logger.error(`Recovery plan not found for error ${errorId}`, {
        component: 'ErrorRecovery',
        operation: 'executePlan',
      })
      return false
    }

    plan.status = 'executing'
    let successCount = 0
    let totalActions = 0

    logger.info(`Executing recovery plan for error ${errorId}`, {
      component: 'ErrorRecovery',
      operation: 'executePlan',
      actionsCount: plan.actions.length,
    })

    for (const action of plan.actions) {
      if (!action.automatic && !force) {
        logger.debug(`Skipping manual action: ${action.description}`, {
          component: 'ErrorRecovery',
          action: action.id,
        })
        continue
      }

      totalActions++
      const success = await this.executeAction(action)
      if (success) {
        successCount++
      }
    }

    const overallSuccess = totalActions > 0 && successCount === totalActions
    plan.status = overallSuccess ? 'completed' : 'failed'

    if (overallSuccess) {
      errorMonitor.markAsRecovered(
        errorId,
        `Automated recovery: ${successCount}/${totalActions} actions successful`
      )
    }

    logger.info(`Recovery plan execution completed for error ${errorId}`, {
      component: 'ErrorRecovery',
      operation: 'executePlan',
      success: overallSuccess,
      successfulActions: successCount,
      totalActions,
    })

    return overallSuccess
  }

  /**
   * Execute individual recovery action
   */
  private async executeAction(action: RecoveryAction): Promise<boolean> {
    logger.debug(`Executing recovery action: ${action.description}`, {
      component: 'ErrorRecovery',
      action: action.id,
      type: action.type,
    })

    action.timestamp = new Date().toISOString()
    action.executed = true

    try {
      switch (action.type) {
        case 'data_restore':
          return await this.executeDataRestore(action)
        case 'data_repair':
          return await this.executeDataRepair(action)
        case 'feature_disable':
          return await this.executeFeatureDisable(action)
        case 'fallback_mode':
          return await this.executeFallbackMode(action)
        default:
          action.result = 'failure'
          action.details = `Unknown action type: ${action.type}`
          return false
      }
    } catch (error) {
      action.result = 'failure'
      action.details = error instanceof Error ? error.message : 'Unknown error'
      logger.error(
        `Recovery action failed: ${action.description}`,
        {
          component: 'ErrorRecovery',
          action: action.id,
        },
        error as Error
      )
      return false
    }
  }

  private async executeDataRestore(action: RecoveryAction): Promise<boolean> {
    try {
      // Get latest backup
      const backups = BackupManager.getAllBackups()
      if (backups.length === 0) {
        action.result = 'failure'
        action.details = 'No backups available for restoration'
        return false
      }

      const latestBackup = backups[0]
      const restoreResult = BackupManager.restoreFromBackup(latestBackup.id)

      if (restoreResult.success && restoreResult.data) {
        action.result = 'success'
        action.details = `Restored from backup: ${latestBackup.id}`

        // Store fallback data in recovery plan
        const plan = Array.from(this.recoveryPlans.values()).find(p =>
          p.actions.some(a => a.id === action.id)
        )
        if (plan) {
          plan.fallbackData = restoreResult.data
        }

        return true
      } else {
        action.result = 'failure'
        action.details = restoreResult.error || 'Restore operation failed'
        return false
      }
    } catch (error) {
      action.result = 'failure'
      action.details = `Restore error: ${error}`
      return false
    }
  }

  private async executeDataRepair(action: RecoveryAction): Promise<boolean> {
    try {
      // Attempt to repair corrupted data using schema validator
      const corruptedData = localStorage.getItem('bos_flows')
      if (!corruptedData) {
        action.result = 'failure'
        action.details = 'No data found to repair'
        return false
      }

      // Try to validate and recover partial data
      const validation = SchemaValidator.validateImportData(corruptedData)
      if (validation.recoveredData) {
        // Save recovered data
        localStorage.setItem(
          'bos_flows',
          JSON.stringify(validation.recoveredData)
        )
        action.result = 'partial'
        action.details = `Recovered ${validation.recoveredData.length} flows from corrupted data`
        return true
      } else {
        action.result = 'failure'
        action.details = 'Data too corrupted to repair'
        return false
      }
    } catch (error) {
      action.result = 'failure'
      action.details = `Repair error: ${error}`
      return false
    }
  }

  private async executeFeatureDisable(
    action: RecoveryAction
  ): Promise<boolean> {
    try {
      // Store disabled features in localStorage
      const disabledFeatures = JSON.parse(
        localStorage.getItem('bos_disabled_features') || '[]'
      )
      const featureName =
        action.description.match(/Disable (\w+)/)?.[1] || 'unknown'

      if (!disabledFeatures.includes(featureName)) {
        disabledFeatures.push(featureName)
        localStorage.setItem(
          'bos_disabled_features',
          JSON.stringify(disabledFeatures)
        )
      }

      action.result = 'success'
      action.details = `Feature ${featureName} disabled successfully`
      return true
    } catch (error) {
      action.result = 'failure'
      action.details = `Feature disable error: ${error}`
      return false
    }
  }

  private async executeFallbackMode(action: RecoveryAction): Promise<boolean> {
    try {
      // Enable fallback mode with basic functionality
      const fallbackConfig = {
        enabled: true,
        timestamp: new Date().toISOString(),
        features: ['basic_flow_viewing', 'data_export'],
        disabled: [
          'flow_editing',
          'methodology_validation',
          'complex_features',
        ],
      }

      localStorage.setItem('bos_fallback_mode', JSON.stringify(fallbackConfig))

      action.result = 'success'
      action.details = 'Fallback mode enabled with basic functionality'
      return true
    } catch (error) {
      action.result = 'failure'
      action.details = `Fallback mode error: ${error}`
      return false
    }
  }

  /**
   * Generate appropriate recovery actions based on error context
   */
  private generateRecoveryActions(
    category: ErrorCategory,
    severity: ErrorSeverity,
    _context?: any
  ): RecoveryAction[] {
    const actions: RecoveryAction[] = []

    switch (category) {
      case ErrorCategory.DATA_CORRUPTION:
        actions.push({
          id: `restore_${Date.now()}`,
          type: 'data_restore',
          description: 'Restore data from latest backup',
          automatic: severity === ErrorSeverity.CRITICAL,
          executed: false,
        })
        actions.push({
          id: `repair_${Date.now()}`,
          type: 'data_repair',
          description: 'Attempt to repair corrupted data',
          automatic: true,
          executed: false,
        })
        break

      case ErrorCategory.PERSISTENCE:
        actions.push({
          id: `fallback_${Date.now()}`,
          type: 'fallback_mode',
          description: 'Enable fallback mode with local-only operations',
          automatic: severity === ErrorSeverity.CRITICAL,
          executed: false,
        })
        break

      case ErrorCategory.BOS_METHODOLOGY:
        actions.push({
          id: `disable_validation_${Date.now()}`,
          type: 'feature_disable',
          description: 'Disable methodology validation temporarily',
          automatic: severity === ErrorSeverity.HIGH,
          executed: false,
        })
        break

      case ErrorCategory.UI_INTERACTION:
        actions.push({
          id: `disable_ui_${Date.now()}`,
          type: 'feature_disable',
          description: 'Disable problematic UI features',
          automatic: severity === ErrorSeverity.HIGH,
          executed: false,
        })
        break

      case ErrorCategory.PERFORMANCE:
        actions.push({
          id: `disable_monitoring_${Date.now()}`,
          type: 'feature_disable',
          description: 'Disable performance monitoring',
          automatic: false,
          executed: false,
        })
        break
    }

    // Always add fallback mode as last resort for critical errors
    if (severity === ErrorSeverity.CRITICAL) {
      actions.push({
        id: `emergency_fallback_${Date.now()}`,
        type: 'fallback_mode',
        description: 'Emergency fallback mode - minimal functionality only',
        automatic: true,
        executed: false,
      })
    }

    return actions
  }

  /**
   * Check if system is in fallback mode
   */
  isInFallbackMode(): boolean {
    try {
      const fallbackConfig = localStorage.getItem('bos_fallback_mode')
      if (!fallbackConfig) return false

      const config = JSON.parse(fallbackConfig)
      return config.enabled === true
    } catch {
      return false
    }
  }

  /**
   * Get disabled features list
   */
  getDisabledFeatures(): string[] {
    try {
      return JSON.parse(localStorage.getItem('bos_disabled_features') || '[]')
    } catch {
      return []
    }
  }

  /**
   * Check if specific feature is disabled
   */
  isFeatureDisabled(featureName: string): boolean {
    return this.getDisabledFeatures().includes(featureName)
  }

  /**
   * Re-enable disabled feature
   */
  enableFeature(featureName: string): boolean {
    try {
      const disabledFeatures = this.getDisabledFeatures()
      const updatedFeatures = disabledFeatures.filter(f => f !== featureName)
      localStorage.setItem(
        'bos_disabled_features',
        JSON.stringify(updatedFeatures)
      )

      logger.info(`Feature re-enabled: ${featureName}`, {
        component: 'ErrorRecovery',
        operation: 'enableFeature',
      })

      return true
    } catch (error) {
      logger.error(
        `Failed to enable feature: ${featureName}`,
        {
          component: 'ErrorRecovery',
          operation: 'enableFeature',
        },
        error as Error
      )
      return false
    }
  }

  /**
   * Exit fallback mode
   */
  exitFallbackMode(): boolean {
    try {
      localStorage.removeItem('bos_fallback_mode')
      localStorage.removeItem('bos_disabled_features')

      logger.info('Exited fallback mode', {
        component: 'ErrorRecovery',
        operation: 'exitFallbackMode',
      })

      return true
    } catch (error) {
      logger.error(
        'Failed to exit fallback mode',
        {
          component: 'ErrorRecovery',
          operation: 'exitFallbackMode',
        },
        error as Error
      )
      return false
    }
  }

  /**
   * Get all recovery plans
   */
  getAllRecoveryPlans(): RecoveryPlan[] {
    return Array.from(this.recoveryPlans.values())
  }

  /**
   * Get recovery plan by error ID
   */
  getRecoveryPlan(errorId: string): RecoveryPlan | undefined {
    return this.recoveryPlans.get(errorId)
  }

  /**
   * Clear completed recovery plans
   */
  clearCompletedPlans(): void {
    for (const [errorId, plan] of this.recoveryPlans.entries()) {
      if (plan.status === 'completed' || plan.status === 'failed') {
        this.recoveryPlans.delete(errorId)
      }
    }

    logger.debug('Cleared completed recovery plans', {
      component: 'ErrorRecovery',
      operation: 'clearCompleted',
    })
  }

  /**
   * Automatic error detection and recovery
   */
  async handleCriticalError(
    errorId: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context?: any
  ): Promise<boolean> {
    // Only auto-handle critical errors
    if (severity !== ErrorSeverity.CRITICAL) {
      return false
    }

    this.createRecoveryPlan(errorId, category, severity, context)
    return await this.executeRecoveryPlan(errorId, false)
  }
}

// Export singleton instance
export const errorRecovery = ErrorRecoveryManager.getInstance()

// Auto-setup error recovery integration
if (typeof window !== 'undefined') {
  // Listen for critical errors and trigger automatic recovery
  window.addEventListener('error', async event => {
    const errorId = `auto_${Date.now()}`
    await errorRecovery.handleCriticalError(
      errorId,
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    )
  })

  window.addEventListener('unhandledrejection', async event => {
    const errorId = `auto_promise_${Date.now()}`
    await errorRecovery.handleCriticalError(
      errorId,
      ErrorCategory.UNKNOWN,
      ErrorSeverity.CRITICAL,
      {
        reason: event.reason,
        promise: 'UnhandledPromiseRejection',
      }
    )
  })
}
