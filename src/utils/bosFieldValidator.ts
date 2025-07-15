/**
 * BOS Field Validation Framework
 * Provides comprehensive validation for BOS methodology fields
 * Enables safe addition of new step fields and data structure modifications
 */

import { Step } from '../types'
import { logger } from './logger'

export interface FieldValidationRule {
  fieldPath: string
  required: boolean
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  validator?: (value: any) => boolean
  errorMessage?: string
  warningMessage?: string
  suggestions?: string[]
}

export interface FieldValidationResult {
  field: string
  valid: boolean
  value: any
  errors: string[]
  warnings: string[]
  suggestions: string[]
  score: number
}

export interface BOSFieldValidationSummary {
  stepId: string
  overallScore: number
  totalFields: number
  validFields: number
  criticalErrors: string[]
  warnings: string[]
  suggestions: string[]
  fieldResults: FieldValidationResult[]
  completionStatus: {
    stakeholders: number
    dependencies: number
    impacts: number
    telemetry: number
    signals: number
  }
}

/**
 * BOS Field Validation Framework
 * Provides structured validation for all BOS methodology fields
 */
export class BOSFieldValidator {
  private static instance: BOSFieldValidator
  private validationRules: Map<string, FieldValidationRule[]> = new Map()

  private constructor() {
    this.initializeDefaultRules()
  }

  static getInstance(): BOSFieldValidator {
    if (!BOSFieldValidator.instance) {
      BOSFieldValidator.instance = new BOSFieldValidator()
    }
    return BOSFieldValidator.instance
  }

  /**
   * Initialize default BOS methodology validation rules
   */
  private initializeDefaultRules(): void {
    // Stakeholder validation rules
    this.addValidationRules('stakeholders', [
      {
        fieldPath: 'stakeholders',
        required: true,
        type: 'array',
        validator: value => Array.isArray(value) && value.length > 0,
        errorMessage: 'At least one stakeholder must be defined',
        suggestions: [
          'Add stakeholders for each type: people, business, vendor',
        ],
      },
      {
        fieldPath: 'stakeholders[].name',
        required: true,
        type: 'string',
        validator: value =>
          typeof value === 'string' && value.trim().length > 0,
        errorMessage: 'Stakeholder name is required',
        suggestions: ['Use descriptive names like "Senior Loan Processor"'],
      },
      {
        fieldPath: 'stakeholders[].role',
        required: true,
        type: 'string',
        validator: value =>
          typeof value === 'string' && value.trim().length > 0,
        errorMessage: 'Stakeholder role is required',
        suggestions: [
          'Define specific roles like "Income Verification Specialist"',
        ],
      },
      {
        fieldPath: 'stakeholders[].type',
        required: true,
        type: 'string',
        validator: value => ['people', 'business', 'vendor'].includes(value),
        errorMessage: 'Stakeholder type must be: people, business, or vendor',
        suggestions: ['Use standard types for consistency'],
      },
    ])

    // Dependencies validation rules
    this.addValidationRules('dependencies', [
      {
        fieldPath: 'dependencies',
        required: true,
        type: 'object',
        validator: value =>
          typeof value === 'object' && Object.keys(value).length > 0,
        errorMessage:
          'Dependencies must be defined for stakeholder expectations',
        suggestions: ['Map what each stakeholder expects from this step'],
      },
    ])

    // Impacts validation rules
    this.addValidationRules('impacts', [
      {
        fieldPath: 'impacts',
        required: true,
        type: 'object',
        validator: value =>
          typeof value === 'object' && Object.keys(value).length > 0,
        errorMessage: 'Impact categories must be defined',
        suggestions: [
          'Define impacts for: financial, legal, operational, customer_experience',
        ],
      },
    ])

    // Telemetry validation rules
    this.addValidationRules('telemetry', [
      {
        fieldPath: 'telemetry',
        required: true,
        type: 'object',
        validator: value =>
          typeof value === 'object' && Object.keys(value).length > 0,
        errorMessage: 'Telemetry mapping must be defined',
        suggestions: ['Specify data sources and observable signals'],
      },
    ])

    // Signals validation rules
    this.addValidationRules('signals', [
      {
        fieldPath: 'signals',
        required: true,
        type: 'object',
        validator: value =>
          typeof value === 'object' && Object.keys(value).length > 0,
        errorMessage: 'Observable signals must be defined',
        suggestions: ['Define business, process, and system signals'],
      },
    ])
  }

  /**
   * Add custom validation rules for a field category
   */
  addValidationRules(category: string, rules: FieldValidationRule[]): void {
    this.validationRules.set(category, rules)
    logger.debug('Added validation rules', {
      component: 'BOSFieldValidator',
      category,
      ruleCount: rules.length,
    })
  }

  /**
   * Validate a complete step against all BOS methodology requirements
   */
  validateStep(step: Step): BOSFieldValidationSummary {
    const fieldResults: FieldValidationResult[] = []
    const criticalErrors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    let totalScore = 0
    let maxScore = 0

    // Validate each category
    for (const [category, rules] of this.validationRules) {
      const categoryResults = this.validateFieldCategory(step, category, rules)
      fieldResults.push(...categoryResults)

      // Aggregate results
      categoryResults.forEach(result => {
        totalScore += result.score
        maxScore += 100 // Each field can score up to 100

        if (!result.valid) {
          criticalErrors.push(...result.errors)
        }
        warnings.push(...result.warnings)
        suggestions.push(...result.suggestions)
      })
    }

    // Calculate completion status for each BOS step
    const completionStatus = {
      stakeholders: this.calculateCategoryCompleteness(step, 'stakeholders'),
      dependencies: this.calculateCategoryCompleteness(step, 'dependencies'),
      impacts: this.calculateCategoryCompleteness(step, 'impacts'),
      telemetry: this.calculateCategoryCompleteness(step, 'telemetry'),
      signals: this.calculateCategoryCompleteness(step, 'signals'),
    }

    return {
      stepId: step.id,
      overallScore: maxScore > 0 ? (totalScore / maxScore) * 100 : 0,
      totalFields: fieldResults.length,
      validFields: fieldResults.filter(r => r.valid).length,
      criticalErrors: [...new Set(criticalErrors)], // Remove duplicates
      warnings: [...new Set(warnings)],
      suggestions: [...new Set(suggestions)],
      fieldResults,
      completionStatus,
    }
  }

  /**
   * Validate fields in a specific category
   */
  private validateFieldCategory(
    step: Step,
    category: string,
    rules: FieldValidationRule[]
  ): FieldValidationResult[] {
    const results: FieldValidationResult[] = []

    for (const rule of rules) {
      const result = this.validateField(step, rule)
      results.push(result)
    }

    return results
  }

  /**
   * Validate a single field against a rule
   */
  private validateField(
    step: Step,
    rule: FieldValidationRule
  ): FieldValidationResult {
    const value = this.getFieldValue(step, rule.fieldPath)
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = rule.suggestions || []

    let valid = true
    let score = 100

    // Check if required field is present
    if (rule.required && (value === undefined || value === null)) {
      valid = false
      score = 0
      errors.push(
        rule.errorMessage || `Required field '${rule.fieldPath}' is missing`
      )
    } else if (value !== undefined && value !== null) {
      // Type validation
      if (!this.validateType(value, rule.type)) {
        valid = false
        score = Math.max(0, score - 50)
        errors.push(
          `Field '${rule.fieldPath}' should be of type '${rule.type}'`
        )
      }

      // Custom validator
      if (rule.validator && !rule.validator(value)) {
        valid = false
        score = Math.max(0, score - 30)
        errors.push(
          rule.errorMessage || `Field '${rule.fieldPath}' failed validation`
        )
      }

      // Warning conditions
      if (rule.warningMessage && valid) {
        warnings.push(rule.warningMessage)
        score = Math.max(0, score - 10)
      }
    }

    return {
      field: rule.fieldPath,
      valid,
      value,
      errors,
      warnings,
      suggestions,
      score,
    }
  }

  /**
   * Get field value using dot notation path
   */
  private getFieldValue(obj: any, path: string): any {
    // Handle array notation like 'stakeholders[].name'
    if (path.includes('[]')) {
      const [arrayPath, fieldName] = path.split('[].')
      const arrayValue = this.getNestedValue(obj, arrayPath)

      if (Array.isArray(arrayValue)) {
        return arrayValue.map(item => this.getNestedValue(item, fieldName))
      }
      return undefined
    }

    return this.getNestedValue(obj, path)
  }

  /**
   * Get nested value using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined
    }, obj)
  }

  /**
   * Validate field type
   */
  private validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number'
      case 'boolean':
        return typeof value === 'boolean'
      case 'array':
        return Array.isArray(value)
      case 'object':
        return (
          typeof value === 'object' && value !== null && !Array.isArray(value)
        )
      default:
        return true
    }
  }

  /**
   * Calculate completeness percentage for a BOS category
   */
  private calculateCategoryCompleteness(step: Step, category: string): number {
    const rules = this.validationRules.get(category) || []
    if (rules.length === 0) return 0

    let totalScore = 0
    const maxScore = rules.length * 100

    for (const rule of rules) {
      const result = this.validateField(step, rule)
      totalScore += result.score
    }

    return maxScore > 0 ? (totalScore / maxScore) * 100 : 0
  }

  /**
   * Generate validation report for a step
   */
  generateValidationReport(step: Step): string {
    const summary = this.validateStep(step)

    let report = `# BOS Field Validation Report\n\n`
    report += `**Step**: ${step.name} (${step.id})\n`
    report += `**Overall Score**: ${summary.overallScore.toFixed(1)}%\n`
    report += `**Valid Fields**: ${summary.validFields}/${summary.totalFields}\n\n`

    // BOS Methodology Completion
    report += `## BOS Methodology Completion\n\n`
    report += `- **Stakeholders**: ${summary.completionStatus.stakeholders.toFixed(1)}%\n`
    report += `- **Dependencies**: ${summary.completionStatus.dependencies.toFixed(1)}%\n`
    report += `- **Impacts**: ${summary.completionStatus.impacts.toFixed(1)}%\n`
    report += `- **Telemetry**: ${summary.completionStatus.telemetry.toFixed(1)}%\n`
    report += `- **Signals**: ${summary.completionStatus.signals.toFixed(1)}%\n\n`

    // Critical Errors
    if (summary.criticalErrors.length > 0) {
      report += `## Critical Errors\n\n`
      summary.criticalErrors.forEach(error => {
        report += `- ❌ ${error}\n`
      })
      report += '\n'
    }

    // Warnings
    if (summary.warnings.length > 0) {
      report += `## Warnings\n\n`
      summary.warnings.forEach(warning => {
        report += `- ⚠️ ${warning}\n`
      })
      report += '\n'
    }

    // Suggestions
    if (summary.suggestions.length > 0) {
      report += `## Suggestions for Improvement\n\n`
      summary.suggestions.forEach(suggestion => {
        report += `- 💡 ${suggestion}\n`
      })
      report += '\n'
    }

    // Detailed Field Results
    report += `## Detailed Field Validation\n\n`
    summary.fieldResults.forEach(result => {
      const status = result.valid ? '✅' : '❌'
      report += `### ${status} ${result.field} (${result.score.toFixed(1)}%)\n`

      if (result.errors.length > 0) {
        report += `**Errors**: ${result.errors.join(', ')}\n`
      }
      if (result.warnings.length > 0) {
        report += `**Warnings**: ${result.warnings.join(', ')}\n`
      }
      report += '\n'
    })

    return report
  }

  /**
   * Validate multiple steps and return summary
   */
  validateMultipleSteps(steps: Step[]): {
    totalSteps: number
    validSteps: number
    averageScore: number
    summaries: BOSFieldValidationSummary[]
  } {
    const summaries = steps.map(step => this.validateStep(step))
    const validSteps = summaries.filter(
      s => s.criticalErrors.length === 0
    ).length
    const averageScore =
      summaries.reduce((sum, s) => sum + s.overallScore, 0) / summaries.length

    return {
      totalSteps: steps.length,
      validSteps,
      averageScore,
      summaries,
    }
  }

  /**
   * Add custom field validation rule
   */
  addCustomFieldValidation(
    category: string,
    fieldPath: string,
    validator: (value: any) => boolean,
    errorMessage: string,
    suggestions?: string[]
  ): void {
    const existingRules = this.validationRules.get(category) || []
    const newRule: FieldValidationRule = {
      fieldPath,
      required: false,
      type: 'string',
      validator,
      errorMessage,
      suggestions,
    }

    this.validationRules.set(category, [...existingRules, newRule])

    logger.info('Added custom field validation', {
      component: 'BOSFieldValidator',
      category,
      fieldPath,
    })
  }

  /**
   * Get all validation rules for inspection
   */
  getAllValidationRules(): Map<string, FieldValidationRule[]> {
    return new Map(this.validationRules)
  }
}

// Export singleton instance
export const bosFieldValidator = BOSFieldValidator.getInstance()

/**
 * Utility functions for common validation scenarios
 */
export class BOSFieldValidationUtils {
  /**
   * Quick validation check for new fields
   */
  static quickValidate(step: Step): {
    valid: boolean
    score: number
    errors: string[]
  } {
    const summary = bosFieldValidator.validateStep(step)
    return {
      valid: summary.criticalErrors.length === 0,
      score: summary.overallScore,
      errors: summary.criticalErrors,
    }
  }

  /**
   * Validate specific BOS methodology step
   */
  static validateBOSStep(
    step: Step,
    bosStep:
      | 'stakeholders'
      | 'dependencies'
      | 'impacts'
      | 'telemetry'
      | 'signals'
  ): { completeness: number; suggestions: string[] } {
    const summary = bosFieldValidator.validateStep(step)
    return {
      completeness: summary.completionStatus[bosStep],
      suggestions: summary.suggestions.filter(s =>
        s.toLowerCase().includes(bosStep)
      ),
    }
  }

  /**
   * Get validation requirements for adding new fields
   */
  static getFieldRequirements(category: string): FieldValidationRule[] {
    const validator = BOSFieldValidator.getInstance()
    return validator.getAllValidationRules().get(category) || []
  }
}
