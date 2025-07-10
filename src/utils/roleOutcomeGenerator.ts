/**
 * Role-Outcome Generator
 *
 * Business Impact Playbook Session 3 - Core business logic for generating
 * role-outcome mappings from stakeholder dependencies and signal linkages.
 *
 * Implements simplified 1-to-1 goal-to-signal mapping approach for prototype feasibility.
 * KPI and Business signals link to dependencies, Process and System signals remain step-level.
 */

import {
  Stakeholder,
  Dependency,
  Signal,
  RoleOutcomeMapping,
} from '../types/index'

/**
 * Role-Outcome Generation Result
 * Contains both successful mappings and validation metadata
 */
export interface RoleOutcomeGenerationResult {
  mappings: RoleOutcomeMapping[]
  totalStakeholders: number
  totalDependencies: number
  linkedSignals: number
  unlinkedDependencies: number
  orphanedSignals: number
  warnings: string[]
  errors: string[]
}

/**
 * Role-Outcome Generator Class
 *
 * Core business logic for Business Impact Playbook generation.
 * Processes stakeholder → dependency → signal chain to create role-outcome mappings.
 */
export class RoleOutcomeGenerator {
  /**
   * Generate role-outcome mappings from BOS methodology data
   *
   * Algorithm:
   * 1. Create base mapping for each stakeholder → dependency pair
   * 2. Enhance with signal linkage where available (KPI/Business signals only)
   * 3. Track orphaned signals and unlinked dependencies for validation
   *
   * @param stakeholders - Array of stakeholders from BOS methodology Step 1
   * @param dependencies - Array of dependencies from BOS methodology Step 2
   * @param signals - Array of signals from BOS methodology Step 5
   * @returns Complete role-outcome generation result with mappings and metadata
   */
  static generateRoleOutcomeMappings(
    stakeholders: Stakeholder[],
    dependencies: Dependency[],
    signals: Signal[]
  ): RoleOutcomeGenerationResult {
    const mappings: RoleOutcomeMapping[] = []
    const warnings: string[] = []
    const errors: string[] = []

    // Track signal linkage for validation
    const linkedSignalIds = new Set<string>()
    const processedDependencyIds = new Set<string>()

    // Process each dependency to create base role-outcome mappings
    dependencies.forEach(dependency => {
      const stakeholder = stakeholders.find(
        s => s.id === dependency.stakeholderId
      )

      if (!stakeholder) {
        warnings.push(
          `Dependency "${dependency.expectation}" has no linked stakeholder`
        )
        return
      }

      // Create base mapping for stakeholder → dependency relationship
      const baseMapping: RoleOutcomeMapping = {
        id: `mapping-${dependency.id}`,
        stakeholderId: stakeholder.id!,
        dependencyId: dependency.id!,
        stakeholderName: stakeholder.name,
        stakeholderRole: stakeholder.role || 'Undefined Role',
        goalExpectation: dependency.expectation,
        // Signal fields will be populated if linkage exists
        signalId: undefined,
        signalName: undefined,
        signalType: undefined,
        signalMetric: undefined,
        signalThreshold: undefined,
      }

      // Look for signal linkage (KPI and Business signals only)
      const linkedSignal = signals.find(
        signal =>
          signal.dependencyId === dependency.id &&
          (signal.type === 'kpi' || signal.type === 'business')
      )

      if (linkedSignal) {
        // Enhance mapping with signal data
        baseMapping.signalId = linkedSignal.id
        baseMapping.signalName = linkedSignal.name
        baseMapping.signalType = linkedSignal.type as 'kpi' | 'business'
        baseMapping.signalMetric = linkedSignal.metricName
        baseMapping.signalThreshold = linkedSignal.threshold

        linkedSignalIds.add(linkedSignal.id!)
      }

      mappings.push(baseMapping)
      processedDependencyIds.add(dependency.id!)
    })

    // Validate orphaned signals (KPI/Business signals without dependency linkage)
    const orphanedSignals = signals.filter(
      signal =>
        (signal.type === 'kpi' || signal.type === 'business') &&
        signal.dependencyId &&
        !linkedSignalIds.has(signal.id!)
    )

    orphanedSignals.forEach(signal => {
      warnings.push(
        `Signal "${signal.name}" (${signal.type}) has dependencyId but no valid dependency link`
      )
    })

    // Calculate validation metrics
    const totalStakeholders = stakeholders.length
    const totalDependencies = dependencies.length
    const linkedSignals = linkedSignalIds.size
    const unlinkedDependencies = dependencies.filter(
      dep => !signals.some(signal => signal.dependencyId === dep.id)
    ).length
    const orphanedSignalCount = orphanedSignals.length

    return {
      mappings,
      totalStakeholders,
      totalDependencies,
      linkedSignals,
      unlinkedDependencies,
      orphanedSignals: orphanedSignalCount,
      warnings,
      errors,
    }
  }

  /**
   * Validate role-outcome mapping data integrity
   *
   * Performs comprehensive validation of the stakeholder → dependency → signal chain
   * to ensure Business Impact Playbook generation will succeed.
   *
   * @param stakeholders - Stakeholder array
   * @param dependencies - Dependency array
   * @param signals - Signal array
   * @returns Validation result with detailed feedback
   */
  static validateRoleOutcomeChain(
    stakeholders: Stakeholder[],
    dependencies: Dependency[],
    signals: Signal[]
  ): {
    isValid: boolean
    score: number
    feedback: string[]
    suggestions: string[]
  } {
    const feedback: string[] = []
    const suggestions: string[] = []
    let validationScore = 0
    let maxScore = 0

    // Validate stakeholder completeness
    maxScore += 10
    if (stakeholders.length > 0) {
      validationScore += 5
      const completeStakeholders = stakeholders.filter(s => s.name && s.role)
      if (completeStakeholders.length === stakeholders.length) {
        validationScore += 5
        feedback.push(
          `✓ All ${stakeholders.length} stakeholders have complete data`
        )
      } else {
        feedback.push(
          `⚠ ${stakeholders.length - completeStakeholders.length} stakeholders missing name/role`
        )
        suggestions.push(
          'Complete stakeholder names and roles for better role-outcome mapping'
        )
      }
    } else {
      feedback.push('✗ No stakeholders defined')
      suggestions.push('Add stakeholders to enable role-outcome mapping')
    }

    // Validate dependency linkage
    maxScore += 15
    if (dependencies.length > 0) {
      validationScore += 5
      const linkedDependencies = dependencies.filter(d => d.stakeholderId)
      if (linkedDependencies.length === dependencies.length) {
        validationScore += 10
        feedback.push(
          `✓ All ${dependencies.length} dependencies linked to stakeholders`
        )
      } else {
        validationScore += 5
        feedback.push(
          `⚠ ${dependencies.length - linkedDependencies.length} dependencies not linked to stakeholders`
        )
        suggestions.push(
          'Link all dependencies to stakeholders for complete role-outcome mapping'
        )
      }
    } else {
      feedback.push('✗ No dependencies defined')
      suggestions.push(
        'Add stakeholder dependencies to enable role-outcome mapping'
      )
    }

    // Validate signal linkage and distribution
    maxScore += 25
    if (signals.length > 0) {
      validationScore += 5

      const kpiBusinessSignals = signals.filter(
        s => s.type === 'kpi' || s.type === 'business'
      )
      const linkedSignals = kpiBusinessSignals.filter(s => s.dependencyId)
      const processSystemSignals = signals.filter(
        s => s.type === 'process' || s.type === 'system'
      )

      if (linkedSignals.length > 0) {
        validationScore += 10
        feedback.push(
          `✓ ${linkedSignals.length} KPI/Business signals linked to dependencies`
        )
      }

      if (processSystemSignals.length > 0) {
        validationScore += 5
        feedback.push(
          `✓ ${processSystemSignals.length} Process/System signals remain step-level`
        )
      }

      if (
        kpiBusinessSignals.length > 0 &&
        linkedSignals.length === kpiBusinessSignals.length
      ) {
        validationScore += 5
        feedback.push(`✓ All KPI/Business signals properly linked`)
      } else if (kpiBusinessSignals.length > 0) {
        feedback.push(
          `⚠ ${kpiBusinessSignals.length - linkedSignals.length} KPI/Business signals not linked`
        )
        suggestions.push(
          'Link KPI/Business signals to dependencies for role-outcome mapping'
        )
      }
    } else {
      feedback.push('✗ No signals defined')
      suggestions.push('Add signals to complete role-outcome mapping')
    }

    const finalScore = Math.round((validationScore / maxScore) * 100)
    const isValid = finalScore >= 50 // Minimum threshold for basic functionality

    return {
      isValid,
      score: finalScore,
      feedback,
      suggestions,
    }
  }

  /**
   * Generate role-outcome mapping summary statistics
   *
   * Provides high-level metrics for Business Impact Playbook generation status.
   * Used for progress tracking and validation feedback.
   *
   * @param result - Role-outcome generation result
   * @returns Summary statistics object
   */
  static generateSummaryStats(result: RoleOutcomeGenerationResult): {
    coveragePercentage: number
    linkageEfficiency: number
    dataCompleteness: number
    qualityScore: number
    readinessLevel: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  } {
    const {
      mappings,
      totalStakeholders,
      totalDependencies,
      linkedSignals,
      unlinkedDependencies,
      orphanedSignals,
    } = result

    // Calculate coverage percentage (how many stakeholders have role-outcome mappings)
    const coveragePercentage =
      totalStakeholders > 0
        ? Math.round((mappings.length / totalStakeholders) * 100)
        : 0

    // Calculate linkage efficiency (how many dependencies have signal linkage)
    const linkageEfficiency =
      totalDependencies > 0
        ? Math.round((linkedSignals / totalDependencies) * 100)
        : 0

    // Calculate data completeness (overall data quality)
    const dataCompleteness = Math.round(
      (totalStakeholders > 0 ? 25 : 0) +
        (totalDependencies > 0 ? 25 : 0) +
        (linkedSignals > 0 ? 25 : 0) +
        (unlinkedDependencies + orphanedSignals === 0 ? 25 : 0)
    )

    // Calculate quality score (weighted average of all metrics)
    const qualityScore = Math.round(
      coveragePercentage * 0.3 +
        linkageEfficiency * 0.4 +
        dataCompleteness * 0.3
    )

    // Determine readiness level
    let readinessLevel: 'Poor' | 'Fair' | 'Good' | 'Excellent'
    if (qualityScore >= 90) readinessLevel = 'Excellent'
    else if (qualityScore >= 70) readinessLevel = 'Good'
    else if (qualityScore >= 50) readinessLevel = 'Fair'
    else readinessLevel = 'Poor'

    return {
      coveragePercentage,
      linkageEfficiency,
      dataCompleteness,
      qualityScore,
      readinessLevel,
    }
  }
}
