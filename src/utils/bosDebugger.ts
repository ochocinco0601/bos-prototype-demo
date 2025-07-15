/**
 * BOS Methodology Debugger - Specialized debugging utilities for BOS validation
 * Provides deep inspection and debugging of the 5-step stakeholder-first methodology
 */

import { Flow, Step } from '../types'
import { logger } from './logger'
import { performanceMonitor } from './performanceMonitor'

export interface BOSValidationTrace {
  step: 'stakeholders' | 'dependencies' | 'impacts' | 'telemetry' | 'signals'
  flowId: string
  stepId?: string
  timestamp: string
  duration: number
  input: unknown
  output: unknown
  validationResult: {
    valid: boolean
    errors: string[]
    warnings: string[]
    completionScore: number
  }
  metadata: Record<string, unknown>
}

export interface BOSDebugSession {
  id: string
  flowId: string
  stepId?: string
  timestamp: string
  traces: BOSValidationTrace[]
  summary: {
    totalSteps: number
    validSteps: number
    completionScore: number
    criticalIssues: string[]
    recommendations: string[]
  }
}

export interface StakeholderValidationResult {
  hasCategories: boolean
  categoriesFound: string[]
  missingCategories: string[]
  validStructure: boolean
  errors: string[]
}

export interface DependencyValidationResult {
  hasMapping: boolean
  dependenciesCount: number
  validRelationships: boolean
  orphanedDependencies: string[]
  errors: string[]
}

export interface ImpactValidationResult {
  hasCategories: boolean
  categoriesFound: string[]
  impactAssessment: {
    financial: boolean
    legal: boolean
    operational: boolean
    customerExperience: boolean
  }
  errors: string[]
}

export interface TelemetryValidationResult {
  hasDataSources: boolean
  dataSourcesCount: number
  signalMapping: boolean
  coverage: number
  errors: string[]
}

export interface SignalValidationResult {
  hasSignals: boolean
  signalTypes: string[]
  businessSignals: number
  processSignals: number
  systemSignals: number
  errors: string[]
}

class BOSDebugger {
  private static instance: BOSDebugger
  private sessions: BOSDebugSession[] = []
  private maxSessions = 50
  private isDevelopment = import.meta.env.MODE === 'development'

  private constructor() {}

  static getInstance(): BOSDebugger {
    if (!BOSDebugger.instance) {
      BOSDebugger.instance = new BOSDebugger()
    }
    return BOSDebugger.instance
  }

  startDebugSession(flowId: string, stepId?: string): string {
    const sessionId = `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const session: BOSDebugSession = {
      id: sessionId,
      flowId,
      stepId,
      timestamp: new Date().toISOString(),
      traces: [],
      summary: {
        totalSteps: 0,
        validSteps: 0,
        completionScore: 0,
        criticalIssues: [],
        recommendations: [],
      },
    }

    this.sessions.push(session)
    if (this.sessions.length > this.maxSessions) {
      this.sessions.shift()
    }

    logger.debug(`BOS debug session started`, {
      component: 'BOSDebugger',
      operation: 'startSession',
      sessionId,
      flowId,
      stepId,
    })

    return sessionId
  }

  traceValidation(
    sessionId: string,
    step: BOSValidationTrace['step'],
    input: unknown,
    validationFn: () => {
      valid: boolean
      errors: string[]
      warnings: string[]
      score: number
    }
  ): BOSValidationTrace {
    return performanceMonitor.measureBOSValidation(step, sessionId, () => {
      const session = this.sessions.find(s => s.id === sessionId)
      if (!session) {
        throw new Error(`Debug session ${sessionId} not found`)
      }

      const startTime = performance.now()
      const validationResult = validationFn()
      const duration = performance.now() - startTime

      const trace: BOSValidationTrace = {
        step,
        flowId: session.flowId,
        stepId: session.stepId,
        timestamp: new Date().toISOString(),
        duration,
        input,
        output: validationResult,
        validationResult: {
          valid: validationResult.valid,
          errors: validationResult.errors,
          warnings: validationResult.warnings,
          completionScore: validationResult.score,
        },
        metadata: {
          sessionId,
          inputType: typeof input,
          inputSize: JSON.stringify(input).length,
        },
      }

      session.traces.push(trace)
      this.updateSessionSummary(session)

      if (this.isDevelopment) {
        this.logTrace(trace)
      }

      return trace
    })
  }

  private updateSessionSummary(session: BOSDebugSession): void {
    const validTraces = session.traces.filter(t => t.validationResult.valid)
    const totalScore = session.traces.reduce(
      (sum, t) => sum + t.validationResult.completionScore,
      0
    )

    session.summary = {
      totalSteps: session.traces.length,
      validSteps: validTraces.length,
      completionScore:
        session.traces.length > 0 ? totalScore / session.traces.length : 0,
      criticalIssues: this.extractCriticalIssues(session.traces),
      recommendations: this.generateRecommendations(session.traces),
    }
  }

  private extractCriticalIssues(traces: BOSValidationTrace[]): string[] {
    const issues: string[] = []

    for (const trace of traces) {
      if (!trace.validationResult.valid) {
        issues.push(
          `${trace.step}: ${trace.validationResult.errors.join(', ')}`
        )
      }
      if (trace.validationResult.completionScore < 0.5) {
        issues.push(
          `${trace.step}: Low completion score (${(trace.validationResult.completionScore * 100).toFixed(1)}%)`
        )
      }
    }

    return issues
  }

  private generateRecommendations(traces: BOSValidationTrace[]): string[] {
    const recommendations: string[] = []
    const stepCounts = new Map<string, number>()

    for (const trace of traces) {
      stepCounts.set(trace.step, (stepCounts.get(trace.step) || 0) + 1)

      if (trace.validationResult.warnings.length > 0) {
        recommendations.push(
          `${trace.step}: Address warnings - ${trace.validationResult.warnings.join(', ')}`
        )
      }
    }

    // Check BOS methodology completeness
    const bosSteps = [
      'stakeholders',
      'dependencies',
      'impacts',
      'telemetry',
      'signals',
    ]
    const missingSteps = bosSteps.filter(step => !stepCounts.has(step))

    if (missingSteps.length > 0) {
      recommendations.push(
        `Complete missing BOS steps: ${missingSteps.join(', ')}`
      )
    }

    return recommendations
  }

  private logTrace(trace: BOSValidationTrace): void {
    const success = trace.validationResult.valid ? '✅' : '❌'
    const score = `${(trace.validationResult.completionScore * 100).toFixed(1)}%`

    console.group(`${success} BOS Validation - ${trace.step} (${score})`)
    console.log('Duration:', `${trace.duration.toFixed(2)}ms`)
    console.log('Input:', trace.input)
    console.log('Validation Result:', trace.validationResult)

    if (trace.validationResult.errors.length > 0) {
      console.error('Errors:', trace.validationResult.errors)
    }
    if (trace.validationResult.warnings.length > 0) {
      console.warn('Warnings:', trace.validationResult.warnings)
    }

    console.groupEnd()
  }

  // Specialized BOS validation methods
  validateStakeholders(
    sessionId: string,
    step: Step
  ): StakeholderValidationResult {
    const result: StakeholderValidationResult = {
      hasCategories: false,
      categoriesFound: [],
      missingCategories: [],
      validStructure: false,
      errors: [],
    }

    this.traceValidation(sessionId, 'stakeholders', step, () => {
      const expectedTypes = ['people', 'business', 'vendor']

      if (!step.stakeholders || !Array.isArray(step.stakeholders)) {
        result.errors.push('No stakeholders defined')
        return { valid: false, errors: result.errors, warnings: [], score: 0 }
      }

      // Group stakeholders by type
      const stakeholderCategories = step.stakeholders.reduce(
        (acc, stakeholder) => {
          const category = stakeholder.type || 'unknown'
          if (!acc[category]) acc[category] = []
          acc[category].push(stakeholder)
          return acc
        },
        {} as Record<string, any[]>
      )

      result.hasCategories = Object.keys(stakeholderCategories).length > 0
      result.categoriesFound = Object.keys(stakeholderCategories)
      result.missingCategories = expectedTypes.filter(
        type => !result.categoriesFound.includes(type)
      )

      // Check for valid stakeholder data
      const totalStakeholders = step.stakeholders.length
      for (const stakeholder of step.stakeholders) {
        if (!stakeholder.name || !stakeholder.role) {
          result.errors.push(`Invalid stakeholder format: missing name or role`)
        }
      }

      result.validStructure =
        result.errors.length === 0 && totalStakeholders > 0

      const score = result.validStructure
        ? Math.min(1, totalStakeholders / 3)
        : 0

      return {
        valid: result.validStructure,
        errors: result.errors,
        warnings: totalStakeholders === 0 ? ['No stakeholders defined'] : [],
        score,
      }
    })

    return result
  }

  validateDependencies(
    sessionId: string,
    step: Step
  ): DependencyValidationResult {
    const result: DependencyValidationResult = {
      hasMapping: false,
      dependenciesCount: 0,
      validRelationships: false,
      orphanedDependencies: [],
      errors: [],
    }

    this.traceValidation(sessionId, 'dependencies', step, () => {
      if (!step.dependencies || typeof step.dependencies !== 'object') {
        result.errors.push('No dependencies defined')
        return { valid: false, errors: result.errors, warnings: [], score: 0 }
      }

      result.hasMapping = true
      result.dependenciesCount = Object.keys(step.dependencies).length

      // Validate dependency structure
      for (const [depKey, depValue] of Object.entries(step.dependencies)) {
        if (typeof depValue !== 'string' && !Array.isArray(depValue)) {
          result.errors.push(`Invalid dependency format for ${depKey}`)
        }
      }

      result.validRelationships = result.errors.length === 0

      const score = result.validRelationships
        ? Math.min(1, result.dependenciesCount / 5)
        : 0

      return {
        valid: result.validRelationships && result.dependenciesCount > 0,
        errors: result.errors,
        warnings:
          result.dependenciesCount === 0 ? ['No dependencies mapped'] : [],
        score,
      }
    })

    return result
  }

  validateImpacts(sessionId: string, step: Step): ImpactValidationResult {
    const result: ImpactValidationResult = {
      hasCategories: false,
      categoriesFound: [],
      impactAssessment: {
        financial: false,
        legal: false,
        operational: false,
        customerExperience: false,
      },
      errors: [],
    }

    this.traceValidation(sessionId, 'impacts', step, () => {
      if (!step.impacts || typeof step.impacts !== 'object') {
        result.errors.push('No impact categories defined')
        return { valid: false, errors: result.errors, warnings: [], score: 0 }
      }

      result.hasCategories = Object.keys(step.impacts).length > 0

      // Extract impact categories from the nested structure
      const impactCategories = new Set<string>()
      for (const impactGroup of Object.values(step.impacts)) {
        if (typeof impactGroup === 'object' && impactGroup !== null) {
          Object.keys(impactGroup).forEach(cat => impactCategories.add(cat))
        }
      }

      result.categoriesFound = Array.from(impactCategories)

      // Check for required impact types
      result.impactAssessment.financial = impactCategories.has('financial')
      result.impactAssessment.legal = impactCategories.has('legal')
      result.impactAssessment.operational = impactCategories.has('operational')
      result.impactAssessment.customerExperience = impactCategories.has(
        'customer_experience'
      )

      const assessedImpacts = Object.values(result.impactAssessment).filter(
        Boolean
      ).length
      const score = assessedImpacts / 4

      return {
        valid: assessedImpacts > 0,
        errors: result.errors,
        warnings:
          assessedImpacts < 4
            ? [`Missing impact assessments: ${4 - assessedImpacts} categories`]
            : [],
        score,
      }
    })

    return result
  }

  validateTelemetry(sessionId: string, step: Step): TelemetryValidationResult {
    const result: TelemetryValidationResult = {
      hasDataSources: false,
      dataSourcesCount: 0,
      signalMapping: false,
      coverage: 0,
      errors: [],
    }

    this.traceValidation(sessionId, 'telemetry', step, () => {
      if (!step.telemetry || typeof step.telemetry !== 'object') {
        result.errors.push('No telemetry signals defined')
        return { valid: false, errors: result.errors, warnings: [], score: 0 }
      }

      result.hasDataSources = Object.keys(step.telemetry).length > 0
      result.dataSourcesCount = Object.keys(step.telemetry).length

      // Calculate coverage based on signal completeness
      let totalSignals = 0
      let completeSignals = 0

      for (const [signalKey, signalValue] of Object.entries(step.telemetry)) {
        totalSignals++
        if (typeof signalValue === 'string' && signalValue.trim().length > 0) {
          completeSignals++
        } else if (typeof signalValue === 'object' && signalValue !== null) {
          completeSignals++
        }
      }

      result.coverage = totalSignals > 0 ? completeSignals / totalSignals : 0
      result.signalMapping = result.coverage > 0.5

      return {
        valid: result.hasDataSources && result.coverage > 0,
        errors: result.errors,
        warnings: result.coverage < 0.8 ? ['Low telemetry coverage'] : [],
        score: result.coverage,
      }
    })

    return result
  }

  validateSignals(sessionId: string, step: Step): SignalValidationResult {
    const result: SignalValidationResult = {
      hasSignals: false,
      signalTypes: [],
      businessSignals: 0,
      processSignals: 0,
      systemSignals: 0,
      errors: [],
    }

    this.traceValidation(sessionId, 'signals', step, () => {
      if (!step.signals || typeof step.signals !== 'object') {
        result.errors.push('No observable units (signals) defined')
        return { valid: false, errors: result.errors, warnings: [], score: 0 }
      }

      result.hasSignals = Object.keys(step.signals).length > 0

      // Categorize signals - flatten nested structure
      const allSignals = new Map<string, any>()
      for (const [, signalGroup] of Object.entries(step.signals)) {
        if (typeof signalGroup === 'object' && signalGroup !== null) {
          for (const [signalKey, signalValue] of Object.entries(signalGroup)) {
            allSignals.set(signalKey, signalValue)
          }
        }
      }

      for (const [signalKey] of allSignals) {
        result.signalTypes.push(signalKey)

        // Simple heuristic to categorize signals
        const lowerKey = signalKey.toLowerCase()
        if (
          lowerKey.includes('business') ||
          lowerKey.includes('revenue') ||
          lowerKey.includes('cost')
        ) {
          result.businessSignals++
        } else if (
          lowerKey.includes('process') ||
          lowerKey.includes('workflow') ||
          lowerKey.includes('step')
        ) {
          result.processSignals++
        } else {
          result.systemSignals++
        }
      }

      result.signalTypes = Array.from(allSignals.keys())
      const totalSignals = result.signalTypes.length
      const hasBalancedSignals =
        result.businessSignals > 0 &&
        (result.processSignals > 0 || result.systemSignals > 0)

      return {
        valid: totalSignals > 0,
        errors: result.errors,
        warnings: !hasBalancedSignals
          ? ['Consider adding both business and technical signals']
          : [],
        score: Math.min(1, totalSignals / 3) * (hasBalancedSignals ? 1 : 0.7),
      }
    })

    return result
  }

  // Complete BOS flow validation
  validateCompleteFlow(flowId: string, flow: Flow): BOSDebugSession {
    const sessionId = this.startDebugSession(flowId)

    logger.info(`Starting complete BOS flow validation`, {
      component: 'BOSDebugger',
      operation: 'validateCompleteFlow',
      flowId,
      stageCount: flow.stages.length,
    })

    for (const stage of flow.stages) {
      for (const step of stage.steps) {
        this.validateStakeholders(sessionId, step)
        this.validateDependencies(sessionId, step)
        this.validateImpacts(sessionId, step)
        this.validateTelemetry(sessionId, step)
        this.validateSignals(sessionId, step)
      }
    }

    const session = this.sessions.find(s => s.id === sessionId)!

    logger.info(`BOS flow validation completed`, {
      component: 'BOSDebugger',
      operation: 'validateCompleteFlow',
      flowId,
      totalSteps: session.summary.totalSteps,
      validSteps: session.summary.validSteps,
      completionScore: session.summary.completionScore,
    })

    return session
  }

  getSession(sessionId: string): BOSDebugSession | undefined {
    return this.sessions.find(s => s.id === sessionId)
  }

  getAllSessions(): BOSDebugSession[] {
    return [...this.sessions]
  }

  clearSessions(): void {
    this.sessions = []
    logger.info('BOS debug sessions cleared', { component: 'BOSDebugger' })
  }

  exportSession(sessionId: string): string {
    const session = this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }
    return JSON.stringify(session, null, 2)
  }

  generateFlowReport(sessionId: string): string {
    const session = this.getSession(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    let report = '🔍 BOS Methodology Validation Report\n'
    report += '='.repeat(60) + '\n\n'

    report += `Flow ID: ${session.flowId}\n`
    report += `Session: ${session.id}\n`
    report += `Timestamp: ${session.timestamp}\n`
    report += `Completion Score: ${(session.summary.completionScore * 100).toFixed(1)}%\n`
    report += `Valid Steps: ${session.summary.validSteps}/${session.summary.totalSteps}\n\n`

    if (session.summary.criticalIssues.length > 0) {
      report += '🚨 Critical Issues:\n'
      for (const issue of session.summary.criticalIssues) {
        report += `  • ${issue}\n`
      }
      report += '\n'
    }

    if (session.summary.recommendations.length > 0) {
      report += '💡 Recommendations:\n'
      for (const rec of session.summary.recommendations) {
        report += `  • ${rec}\n`
      }
      report += '\n'
    }

    report += 'Validation Details:\n'
    for (const trace of session.traces) {
      const status = trace.validationResult.valid ? '✅' : '❌'
      const score = `${(trace.validationResult.completionScore * 100).toFixed(1)}%`
      report += `  ${status} ${trace.step}: ${score} (${trace.duration.toFixed(2)}ms)\n`

      if (trace.validationResult.errors.length > 0) {
        for (const error of trace.validationResult.errors) {
          report += `    ❌ ${error}\n`
        }
      }
    }

    return report
  }
}

// Export singleton instance
export const bosDebugger = BOSDebugger.getInstance()
