/**
 * Schema Validator - Strict type validation for BOS data structures
 * Provides runtime validation to prevent data corruption and type errors
 */

import {
  Flow,
  Stage,
  Step,
  Service,
  Stakeholder,
  ImpactCategory,
} from '../types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export interface ImportValidationResult extends ValidationResult {
  data?: Flow[]
  recoveredData?: Flow[]
}

/**
 * Runtime type checking for BOS data structures
 * Protects against corrupted imports and malformed data
 */
export class SchemaValidator {
  /**
   * Validate complete import data with recovery options
   */
  static validateImportData(data: unknown): ImportValidationResult {
    const result: ImportValidationResult = {
      valid: false,
      errors: [],
      warnings: [],
    }

    if (!data) {
      result.errors.push('No data provided')
      return result
    }

    // Handle different import formats
    let flows: unknown[]

    if (Array.isArray(data)) {
      flows = data
    } else if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>
      if (Array.isArray(obj.flows)) {
        flows = obj.flows
      } else if (obj.methodology) {
        // Legacy format - attempt conversion
        result.warnings.push('Legacy format detected, attempting conversion')
        flows = [obj as unknown]
      } else {
        result.errors.push('Unrecognized data format')
        return result
      }
    } else {
      result.errors.push('Invalid data type')
      return result
    }

    // Validate each flow
    const validatedFlows: Flow[] = []
    const recoveredFlows: Flow[] = []

    for (let i = 0; i < flows.length; i++) {
      const flowResult = this.validateFlow(flows[i], `Flow ${i + 1}`)

      if (flowResult.valid && flowResult.data) {
        validatedFlows.push(flowResult.data)
        // Propagate warnings from valid flows
        if (flowResult.warnings.length > 0) {
          result.warnings.push(...flowResult.warnings)
        }
      } else if (flowResult.recoveredData) {
        recoveredFlows.push(flowResult.recoveredData)
        result.warnings.push(
          `${flowResult.errors.join(', ')} - partial recovery attempted`
        )
      } else {
        result.errors.push(`Flow ${i + 1}: ${flowResult.errors.join(', ')}`)
      }
    }

    if (validatedFlows.length > 0) {
      result.valid = true
      result.data = validatedFlows
      if (recoveredFlows.length > 0) {
        result.recoveredData = recoveredFlows
      }
    } else if (recoveredFlows.length > 0) {
      result.valid = false
      result.recoveredData = recoveredFlows
      result.errors.unshift('No valid flows found, but recovery data available')
    }

    return result
  }

  /**
   * Validate single flow with recovery
   */
  static validateFlow(
    data: unknown,
    context = 'Flow'
  ): ValidationResult & { data?: Flow; recoveredData?: Flow } {
    const result: ValidationResult & { data?: Flow; recoveredData?: Flow } = {
      valid: false,
      errors: [],
      warnings: [],
    }

    if (!data || typeof data !== 'object') {
      result.errors.push(`${context}: Invalid flow data type`)
      return result
    }

    const obj = data as Record<string, unknown>

    // Required fields validation
    if (!obj.id || typeof obj.id !== 'string') {
      if (obj.id === undefined) {
        obj.id = `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        result.warnings.push(`${context}: Generated missing ID`)
      } else {
        result.errors.push(`${context}: Invalid ID`)
        return result
      }
    }

    if (!obj.name || typeof obj.name !== 'string') {
      if (obj.name === undefined) {
        obj.name = 'Untitled Flow'
        result.warnings.push(`${context}: Generated missing name`)
      } else {
        result.errors.push(`${context}: Invalid name`)
        return result
      }
    }

    // Validate stages
    if (!Array.isArray(obj.stages)) {
      if (obj.stages === undefined) {
        obj.stages = []
        result.warnings.push(`${context}: Initialized empty stages array`)
      } else {
        result.errors.push(`${context}: Invalid stages format`)
        return result
      }
    }

    const validatedStages: Stage[] = []
    for (let i = 0; i < obj.stages.length; i++) {
      const stageResult = this.validateStage(
        obj.stages[i],
        `${context} Stage ${i + 1}`
      )
      if (stageResult.valid && stageResult.data) {
        validatedStages.push(stageResult.data)
      } else if (stageResult.recoveredData) {
        validatedStages.push(stageResult.recoveredData)
        result.warnings.push(`Stage ${i + 1}: ${stageResult.errors.join(', ')}`)
      } else {
        result.errors.push(`Stage ${i + 1}: ${stageResult.errors.join(', ')}`)
      }
    }

    const flow: Flow = {
      id: obj.id as string,
      name: obj.name as string,
      description:
        typeof obj.description === 'string' ? obj.description : undefined,
      stages: validatedStages,
    }

    if (result.errors.length === 0) {
      result.valid = true
      result.data = flow
    } else if (result.warnings.length > 0) {
      // Attempt recovery
      result.recoveredData = flow
    }

    return result
  }

  /**
   * Validate stage structure
   */
  static validateStage(
    data: unknown,
    context = 'Stage'
  ): ValidationResult & { data?: Stage; recoveredData?: Stage } {
    const result: ValidationResult & { data?: Stage; recoveredData?: Stage } = {
      valid: false,
      errors: [],
      warnings: [],
    }

    if (!data || typeof data !== 'object') {
      result.errors.push(`${context}: Invalid stage data type`)
      return result
    }

    const obj = data as Record<string, unknown>

    // Generate missing required fields
    if (!obj.id || typeof obj.id !== 'string') {
      obj.id = `stage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      result.warnings.push(`${context}: Generated missing ID`)
    }

    if (!obj.name || typeof obj.name !== 'string') {
      obj.name = 'Untitled Stage'
      result.warnings.push(`${context}: Generated missing name`)
    }

    if (!Array.isArray(obj.steps)) {
      obj.steps = []
      result.warnings.push(`${context}: Initialized empty steps array`)
    }

    const validatedSteps: Step[] = []
    for (let i = 0; i < obj.steps.length; i++) {
      const stepResult = this.validateStep(
        obj.steps[i],
        `${context} Step ${i + 1}`
      )
      if (stepResult.valid && stepResult.data) {
        validatedSteps.push(stepResult.data)
      } else if (stepResult.recoveredData) {
        validatedSteps.push(stepResult.recoveredData)
        result.warnings.push(`Step ${i + 1}: ${stepResult.errors.join(', ')}`)
      } else {
        result.errors.push(`Step ${i + 1}: ${stepResult.errors.join(', ')}`)
      }
    }

    const stage: Stage = {
      id: obj.id as string,
      name: obj.name as string,
      steps: validatedSteps,
    }

    result.valid = result.errors.length === 0
    if (result.valid || result.warnings.length > 0) {
      result.data = stage
      if (!result.valid) {
        result.recoveredData = stage
      }
    }

    return result
  }

  /**
   * Validate step with BOS methodology fields
   */
  static validateStep(
    data: unknown,
    context = 'Step'
  ): ValidationResult & { data?: Step; recoveredData?: Step } {
    const result: ValidationResult & { data?: Step; recoveredData?: Step } = {
      valid: false,
      errors: [],
      warnings: [],
    }

    if (!data || typeof data !== 'object') {
      result.errors.push(`${context}: Invalid step data type`)
      return result
    }

    const obj = data as Record<string, unknown>

    // Generate missing required fields
    if (!obj.id || typeof obj.id !== 'string') {
      obj.id = `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      result.warnings.push(`${context}: Generated missing ID`)
    }

    if (!obj.name || typeof obj.name !== 'string') {
      obj.name = 'Untitled Step'
      result.warnings.push(`${context}: Generated missing name`)
    }

    // Validate BOS methodology fields with defaults
    const stakeholders = this.validateStakeholders(obj.stakeholders)
    const dependencies = this.validateStringRecord(
      obj.dependencies,
      'dependencies'
    )
    const impacts = this.validateImpactCategories(obj.impacts)
    const telemetry = this.validateStringRecord(obj.telemetry, 'telemetry')
    const signals = this.validateStringRecord(obj.signals, 'signals')
    const services = this.validateServices(obj.services)

    const step: Step = {
      id: obj.id as string,
      name: obj.name as string,
      description:
        typeof obj.description === 'string' ? obj.description : undefined,
      stakeholders: stakeholders,
      dependencies: dependencies,
      impacts: impacts,
      telemetry: telemetry,
      signals: signals,
      score: typeof obj.score === 'number' ? obj.score : 0,
      services: services,
    }

    result.valid = true
    result.data = step

    return result
  }

  /**
   * Validate stakeholders array
   */
  private static validateStakeholders(data: unknown): Stakeholder[] {
    if (!Array.isArray(data)) return []

    return data
      .filter(
        (item): item is Record<string, unknown> =>
          item && typeof item === 'object'
      )
      .map(item => ({
        name: typeof item.name === 'string' ? item.name : 'Unknown',
        role: typeof item.role === 'string' ? item.role : 'Unknown',
        type: ['people', 'business', 'vendor'].includes(item.type as string)
          ? (item.type as 'people' | 'business' | 'vendor')
          : 'people',
      }))
  }

  /**
   * Validate services array
   */
  private static validateServices(data: unknown): Service[] {
    if (!Array.isArray(data)) return []

    return data
      .filter(
        (item): item is Record<string, unknown> =>
          item && typeof item === 'object'
      )
      .map(item => ({
        name: typeof item.name === 'string' ? item.name : 'Unknown Service',
        technical_description:
          typeof item.technical_description === 'string'
            ? item.technical_description
            : 'No description',
        technical_flow:
          typeof item.technical_flow === 'string'
            ? item.technical_flow
            : 'No flow defined',
      }))
  }

  /**
   * Validate impact categories
   */
  private static validateImpactCategories(data: unknown): {
    [key: string]: ImpactCategory
  } {
    if (!data || typeof data !== 'object') return {}

    const obj = data as Record<string, unknown>
    const result: { [key: string]: ImpactCategory } = {}

    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        const impact = value as Record<string, unknown>
        result[key] = {
          financial:
            typeof impact.financial === 'string' ? impact.financial : '',
          legal: typeof impact.legal === 'string' ? impact.legal : '',
          operational:
            typeof impact.operational === 'string' ? impact.operational : '',
          customer_experience:
            typeof impact.customer_experience === 'string'
              ? impact.customer_experience
              : '',
        }
      }
    }

    return result
  }

  /**
   * Validate generic string record
   */
  private static validateStringRecord(
    data: unknown,
    _fieldName: string
  ): { [key: string]: any } {
    if (!data || typeof data !== 'object') return {}
    return data as { [key: string]: any }
  }
}
