/**
 * Signal Validator Utility - Business Impact Playbook Foundation
 * Validates signal data integrity for role-outcome mapping and dependency linkage
 * Session 1: Data Model Foundation + Migration
 */

import { Signal, Dependency, Stakeholder } from '../types'
import { RoleOutcomeGenerator } from './roleOutcomeGenerator'

/**
 * Signal validation result interface
 */
export interface SignalValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  orphanedSignals?: Signal[]
}

/**
 * Comprehensive signal validation utilities for Business Impact Playbook
 * Ensures data integrity for role-outcome mapping and dependency relationships
 */
export const SignalValidator = {
  /**
   * Validate signal array for Business Impact Playbook requirements
   * Checks dependency linkage, signal types, and data completeness
   *
   * @param {Signal[]} signals - Array of signals to validate
   * @param {Dependency[]} dependencies - Array of dependencies for linkage validation
   * @param {Stakeholder[]} stakeholders - Array of stakeholders for full chain validation
   * @returns {SignalValidationResult} Comprehensive validation result
   */
  validateSignalsForPlaybook: (
    signals: Signal[],
    dependencies: Dependency[] = [],
    _stakeholders: Stakeholder[] = []
  ): SignalValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []
    const orphanedSignals: Signal[] = []

    // Validate each signal
    signals.forEach((signal, index) => {
      const signalErrors = SignalValidator.validateSingleSignal(signal, index)
      errors.push(...signalErrors)

      // Check dependency linkage for KPI and Business signals
      if (signal.type === 'kpi' || signal.type === 'business') {
        if (!signal.dependencyId) {
          warnings.push(
            `${signal.type.toUpperCase()} signal "${signal.name}" missing dependencyId - cannot generate role-outcome mapping`
          )
        } else {
          const linkedDependency = dependencies.find(
            dep => dep.id === signal.dependencyId
          )
          if (!linkedDependency) {
            errors.push(
              `${signal.type.toUpperCase()} signal "${signal.name}" references non-existent dependency "${signal.dependencyId}"`
            )
            orphanedSignals.push(signal)
          }
        }
      }

      // Process/System signals should NOT have dependency linkage
      if (
        (signal.type === 'process' || signal.type === 'system') &&
        signal.dependencyId
      ) {
        warnings.push(
          `${signal.type.toUpperCase()} signal "${signal.name}" has dependencyId but ${signal.type} signals are step-level only`
        )
      }
    })

    // Check for duplicate signal names
    const signalNames = signals.map(s => s.name.toLowerCase())
    const duplicateNames = signalNames.filter(
      (name, index) => name && signalNames.indexOf(name) !== index
    )
    if (duplicateNames.length > 0) {
      errors.push(
        `Duplicate signal names found: ${[...new Set(duplicateNames)].join(', ')}`
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      orphanedSignals: orphanedSignals.length > 0 ? orphanedSignals : undefined,
    }
  },

  /**
   * Validate single signal for required fields and data integrity
   * Core validation logic for individual signal objects
   *
   * @param {Signal} signal - Signal to validate
   * @param {number} index - Signal index for error reporting
   * @returns {string[]} Array of validation errors
   */
  validateSingleSignal: (signal: Signal, index: number): string[] => {
    const errors: string[] = []
    const position = `Signal ${index + 1}${signal.name ? ` (${signal.name})` : ''}`

    // Required fields validation
    if (!signal.name || signal.name.trim() === '') {
      errors.push(`${position}: name is required`)
    }

    if (
      !signal.type ||
      !['business', 'process', 'system', 'kpi'].includes(signal.type)
    ) {
      errors.push(
        `${position}: type must be one of: business, process, system, kpi`
      )
    }

    // KPI-specific validation
    if (signal.type === 'kpi') {
      if (!signal.metricName || signal.metricName.trim() === '') {
        errors.push(`${position}: KPI signals require metricName`)
      }
      if (!signal.threshold || signal.threshold.trim() === '') {
        errors.push(`${position}: KPI signals require threshold`)
      }
    }

    // Business signal validation
    if (signal.type === 'business') {
      if (!signal.description || signal.description.trim() === '') {
        errors.push(`${position}: Business signals require description`)
      }
    }

    return errors
  },

  /**
   * Validate dependency chain for role-outcome mapping
   * Ensures complete stakeholder → dependency → signal chain
   *
   * @param {Stakeholder[]} stakeholders - Array of stakeholders
   * @param {Dependency[]} dependencies - Array of dependencies
   * @param {Signal[]} signals - Array of signals
   * @returns {SignalValidationResult} Chain validation result
   */
  validateRoleOutcomeChain: (
    stakeholders: Stakeholder[],
    dependencies: Dependency[],
    signals: Signal[]
  ): SignalValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Find orphaned dependencies (no stakeholder link)
    const orphanedDependencies = dependencies.filter(
      dep =>
        dep.stakeholderId &&
        !stakeholders.find(sh => sh.id === dep.stakeholderId)
    )
    if (orphanedDependencies.length > 0) {
      errors.push(
        `Dependencies reference non-existent stakeholders: ${orphanedDependencies.map(d => d.expectation || d.id).join(', ')}`
      )
    }

    // Find dependencies without signal mappings
    const kpiBusinessSignals = signals.filter(
      s => s.type === 'kpi' || s.type === 'business'
    )
    const unmappedDependencies = dependencies.filter(
      dep => !kpiBusinessSignals.find(signal => signal.dependencyId === dep.id)
    )
    if (unmappedDependencies.length > 0) {
      warnings.push(
        `Dependencies without signal mappings: ${unmappedDependencies.map(d => d.expectation || d.id).join(', ')}`
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  },

  /**
   * Get signals that can be used for role-outcome mapping
   * Filters signals with proper dependency linkage for Business Impact Playbook
   *
   * @param {Signal[]} signals - Array of signals to filter
   * @param {Dependency[]} dependencies - Array of dependencies for validation
   * @returns {Signal[]} Signals suitable for role-outcome mapping
   */
  getPlaybookEligibleSignals: (
    signals: Signal[],
    dependencies: Dependency[]
  ): Signal[] => {
    return signals.filter(signal => {
      // Only KPI and Business signals are eligible
      if (signal.type !== 'kpi' && signal.type !== 'business') {
        return false
      }

      // Must have dependency linkage
      if (!signal.dependencyId) {
        return false
      }

      // Dependency must exist
      const linkedDependency = dependencies.find(
        dep => dep.id === signal.dependencyId
      )
      if (!linkedDependency) {
        return false
      }

      return true
    })
  },

  /**
   * Get validation summary for UI display
   * Provides user-friendly validation status for methodology workflow
   *
   * @param {SignalValidationResult} result - Validation result
   * @returns {string} Human-readable validation summary
   */
  getValidationSummary: (result: SignalValidationResult): string => {
    if (result.isValid && result.warnings.length === 0) {
      return 'All signals valid and ready for Business Impact Playbook'
    }

    if (result.isValid && result.warnings.length > 0) {
      return `Signals valid with ${result.warnings.length} warning(s) - partial playbook possible`
    }

    return `${result.errors.length} error(s) found - signals require correction`
  },

  /**
   * Comprehensive role-outcome validation using RoleOutcomeGenerator
   * Provides complete Business Impact Playbook readiness assessment
   *
   * @param {Stakeholder[]} stakeholders - Array of stakeholders
   * @param {Dependency[]} dependencies - Array of dependencies
   * @param {Signal[]} signals - Array of signals
   * @returns {SignalValidationResult & { playbookReadiness: object }} Enhanced validation with playbook readiness
   */
  validateForPlaybookGeneration: (
    stakeholders: Stakeholder[],
    dependencies: Dependency[],
    signals: Signal[]
  ): SignalValidationResult & {
    playbookReadiness: ReturnType<
      typeof RoleOutcomeGenerator.validateRoleOutcomeChain
    >
  } => {
    // Run standard signal validation
    const signalValidation = SignalValidator.validateSignalsForPlaybook(
      signals,
      dependencies,
      stakeholders
    )

    // Run comprehensive role-outcome chain validation
    const playbookReadiness = RoleOutcomeGenerator.validateRoleOutcomeChain(
      stakeholders,
      dependencies,
      signals
    )

    return {
      ...signalValidation,
      playbookReadiness,
    }
  },
}
