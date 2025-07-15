/**
 * Data Validation Manager (Phase 1.3)
 * Handles data validation, format checking, and completeness analysis
 * Extracted from App.tsx for better code organization
 */

import { Flow, Step } from '../types'

/**
 * Centralized data validation management for BOS prototype
 * Handles import validation, data structure checking, and methodology scoring
 */
export const DataValidationManager = {
  /**
   * Validate import data structure
   * Checks if imported data matches expected format
   *
   * @param {any} data - Data to validate
   * @returns {Object} Validation result with success status and error message
   */
  validateImportData: (data: any): { valid: boolean; error?: string } => {
    if (!data) {
      return { valid: false, error: 'No data provided' }
    }

    if (data.flows && Array.isArray(data.flows)) {
      return { valid: true }
    }

    if (Array.isArray(data)) {
      return { valid: true }
    }

    if (data.methodology) {
      return { valid: true }
    }

    return { valid: false, error: 'Unrecognized data format' }
  },

  /**
   * Validate single flow structure
   * Comprehensive validation of flow data structure and completeness
   *
   * @param {Flow} flow - Flow to validate
   * @returns {Object} Validation result with errors and warnings
   */
  validateFlow: (
    flow: Flow
  ): { valid: boolean; errors: string[]; warnings: string[] } => {
    const errors: string[] = []
    const warnings: string[] = []

    if (!flow.id) errors.push('Flow ID is required')
    if (!flow.name) errors.push('Flow name is required')
    if (!flow.stages || flow.stages.length === 0) {
      warnings.push('Flow has no stages')
    }

    flow.stages?.forEach((stage, stageIndex) => {
      if (!stage.id) errors.push(`Stage ${stageIndex} missing ID`)
      if (!stage.name) errors.push(`Stage ${stageIndex} missing name`)

      stage.steps?.forEach((step, stepIndex) => {
        if (!step.id)
          errors.push(`Step ${stepIndex} in stage ${stageIndex} missing ID`)
        if (!step.name)
          errors.push(`Step ${stepIndex} in stage ${stageIndex} missing name`)

        if (step.stakeholders.length === 0) {
          warnings.push(`Step "${step.name}" has no stakeholders`)
        }

        if (Object.keys(step.dependencies).length === 0) {
          warnings.push(`Step "${step.name}" has no dependencies`)
        }
      })
    })

    return { valid: errors.length === 0, errors, warnings }
  },

  /**
   * Calculate methodology score for a step
   * Determines completion percentage based on BOS methodology steps
   *
   * @param {Step} step - Step to calculate score for
   * @returns {number} Methodology completion score (0-100)
   */
  calculateMethodologyScore: (step: Step): number => {
    let completedSteps = 0
    const totalSteps = 5

    if (step.stakeholders && step.stakeholders.length > 0) completedSteps++
    if (step.dependencies && Object.keys(step.dependencies).length > 0)
      completedSteps++
    if (step.impacts && Object.keys(step.impacts).length > 0) completedSteps++
    if (step.telemetry && Object.keys(step.telemetry).length > 0)
      completedSteps++
    if (step.signals && Object.keys(step.signals).length > 0) completedSteps++

    return Math.round((completedSteps / totalSteps) * 100)
  },

  /**
   * Validate all flows in array
   * Comprehensive validation of multiple flows with summary statistics
   *
   * @param {Flow[]} flows - Array of flows to validate
   * @returns {Object} Validation result with summary statistics
   */
  validateAllFlows: (flows: Flow[]): { valid: boolean; summary: any } => {
    let totalErrors = 0
    let totalWarnings = 0
    const flowResults = flows.map(flow => {
      const result = DataValidationManager.validateFlow(flow)
      totalErrors += result.errors.length
      totalWarnings += result.warnings.length
      return { flowName: flow.name, ...result }
    })

    return {
      valid: totalErrors === 0,
      summary: {
        totalFlows: flows.length,
        validFlows: flowResults.filter(r => r.valid).length,
        totalErrors,
        totalWarnings,
        flowResults,
      },
    }
  },
}
