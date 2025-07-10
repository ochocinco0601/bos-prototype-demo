/**
 * Integration Tests for BOS Methodology Validation Flow
 * Tests the complete 5-step stakeholder-first methodology validation process
 */

import { bosDebugger } from '../../utils/bosDebugger'
import { errorMonitor } from '../../utils/errorMonitor'
import { performanceMonitor } from '../../utils/performanceMonitor'
import { logger } from '../../utils/logger'
import {
  createCompleteMethodologyFlow,
  createBasicFlow,
} from '../../data/mockData'
import { Flow, Step } from '../../types'

describe('BOS Methodology Integration', () => {
  beforeEach(() => {
    // Clear all monitoring data before each test
    bosDebugger.clearSessions()
    errorMonitor.clearErrors()
    performanceMonitor.clearMetrics()
    logger.clearLogs()
  })

  describe('Complete Flow Validation', () => {
    it('should validate complete methodology flow successfully', () => {
      const flow = createCompleteMethodologyFlow()

      // Run complete validation
      const session = bosDebugger.validateCompleteFlow(flow.id, flow)

      // Verify session was created
      expect(session).toBeDefined()
      expect(session.flowId).toBe(flow.id)
      expect(session.traces.length).toBeGreaterThan(0)

      // Verify all BOS steps were validated
      const stepTypes = session.traces.map(t => t.step)
      expect(stepTypes).toContain('stakeholders')
      expect(stepTypes).toContain('dependencies')
      expect(stepTypes).toContain('impacts')
      expect(stepTypes).toContain('telemetry')
      expect(stepTypes).toContain('signals')

      // Verify completion score is reasonable for complete flow
      expect(session.summary.completionScore).toBeGreaterThan(0.7)
      expect(session.summary.validSteps).toBeGreaterThan(0)
    })

    it('should handle incomplete methodology flow gracefully', () => {
      const flow = createBasicFlow()

      // Run validation on basic flow (incomplete methodology)
      const session = bosDebugger.validateCompleteFlow(flow.id, flow)

      expect(session).toBeDefined()
      expect(session.summary.criticalIssues.length).toBeGreaterThan(0)
      expect(session.summary.recommendations.length).toBeGreaterThan(0)
      expect(session.summary.completionScore).toBeLessThan(0.5)
    })

    it('should track performance during validation', () => {
      const flow = createCompleteMethodologyFlow()

      // Clear metrics to ensure clean measurement
      performanceMonitor.clearMetrics()

      bosDebugger.validateCompleteFlow(flow.id, flow)

      // Verify performance was tracked
      const stats = performanceMonitor.getStats()
      expect(stats.total).toBeGreaterThan(0)

      // Should have methodology category metrics
      expect(stats.byCategory['methodology']).toBeDefined()
      expect(stats.byCategory['methodology'].count).toBeGreaterThan(0)
    })

    it('should log validation activities', () => {
      const flow = createCompleteMethodologyFlow()

      logger.clearLogs()

      bosDebugger.validateCompleteFlow(flow.id, flow)

      // Verify logging occurred
      const logStats = logger.getLogStats()
      expect(logStats.total).toBeGreaterThan(0)
      expect(logStats.byLevel['INFO']).toBeGreaterThan(0)
    })
  })

  describe('Individual Step Validation', () => {
    let completeFlow: Flow
    let basicFlow: Flow
    let sessionId: string

    beforeEach(() => {
      completeFlow = createCompleteMethodologyFlow()
      basicFlow = createBasicFlow()
      sessionId = bosDebugger.startDebugSession('test-flow')
    })

    it('should validate stakeholders correctly', () => {
      const completeStep = completeFlow.stages[0].steps[0]
      const basicStep = basicFlow.stages[0].steps[0]

      // Test complete step
      const completeResult = bosDebugger.validateStakeholders(
        sessionId,
        completeStep
      )
      expect(completeResult.validStructure).toBe(true)
      expect(completeResult.hasCategories).toBe(true)
      expect(completeResult.categoriesFound.length).toBeGreaterThan(0)

      // Test basic step (should pass with minimal data)
      const basicResult = bosDebugger.validateStakeholders(sessionId, basicStep)
      expect(basicResult.validStructure).toBe(true)
      expect(basicResult.hasCategories).toBe(true)
      expect(basicResult.categoriesFound.length).toBeGreaterThan(0)
    })

    it('should validate dependencies correctly', () => {
      const completeStep = completeFlow.stages[0].steps[0]
      const basicStep = basicFlow.stages[0].steps[0]

      const completeResult = bosDebugger.validateDependencies(
        sessionId,
        completeStep
      )
      expect(completeResult.hasMapping).toBe(true)
      expect(completeResult.validRelationships).toBe(true)
      expect(completeResult.dependenciesCount).toBeGreaterThan(0)

      const basicResult = bosDebugger.validateDependencies(sessionId, basicStep)
      expect(basicResult.hasMapping).toBe(true)
      expect(basicResult.validRelationships).toBe(true)
      expect(basicResult.dependenciesCount).toBeGreaterThan(0)
    })

    it('should validate impacts correctly', () => {
      const completeStep = completeFlow.stages[0].steps[0]

      const result = bosDebugger.validateImpacts(sessionId, completeStep)
      expect(result.hasCategories).toBe(true)
      expect(result.categoriesFound.length).toBeGreaterThan(0)

      // Check for key impact categories
      const hasFinancial = result.impactAssessment.financial
      const hasOperational = result.impactAssessment.operational
      expect(hasFinancial || hasOperational).toBe(true)
    })

    it('should validate telemetry correctly', () => {
      const completeStep = completeFlow.stages[0].steps[0]

      const result = bosDebugger.validateTelemetry(sessionId, completeStep)
      expect(result.hasDataSources).toBe(true)
      expect(result.dataSourcesCount).toBeGreaterThan(0)
      expect(result.coverage).toBeGreaterThan(0)
    })

    it('should validate signals correctly', () => {
      const completeStep = completeFlow.stages[0].steps[0]

      const result = bosDebugger.validateSignals(sessionId, completeStep)
      expect(result.hasSignals).toBe(true)
      expect(result.signalTypes.length).toBeGreaterThan(0)

      // Should have some variety of signals
      const totalSignals =
        result.businessSignals + result.processSignals + result.systemSignals
      expect(totalSignals).toBeGreaterThan(0)
    })
  })

  describe('Error Handling Integration', () => {
    it('should capture validation errors', () => {
      errorMonitor.clearErrors()

      // Create invalid step data
      const invalidStep: Step = {
        id: 'invalid',
        name: 'Invalid Step',
        description: 'Step with no methodology data',
        services: [],
        // No methodology data - should trigger errors
      }

      const sessionId = bosDebugger.startDebugSession('error-test')

      // Validate invalid step (should generate errors)
      bosDebugger.validateStakeholders(sessionId, invalidStep)
      bosDebugger.validateDependencies(sessionId, invalidStep)

      const session = bosDebugger.getSession(sessionId)
      expect(session?.summary.criticalIssues.length).toBeGreaterThan(0)
    })

    it('should handle corrupted data gracefully', () => {
      const sessionId = bosDebugger.startDebugSession('corruption-test')

      // Create step with corrupted methodology data
      const corruptedStep: Step = {
        id: 'corrupted',
        name: 'Corrupted Step',
        description: 'Step with invalid data',
        services: [],
        methodology: {
          stakeholder_categories: 'invalid-format' as any, // Should be object
          dependencies: null as any, // Should be object
          impact_categories: undefined as any,
        },
      }

      // Should not throw, but should capture errors
      expect(() => {
        bosDebugger.validateStakeholders(sessionId, corruptedStep)
        bosDebugger.validateDependencies(sessionId, corruptedStep)
        bosDebugger.validateImpacts(sessionId, corruptedStep)
      }).not.toThrow()

      const session = bosDebugger.getSession(sessionId)
      expect(session?.summary.criticalIssues.length).toBeGreaterThan(0)
    })

    it('should monitor system health during validation', () => {
      const flow = createCompleteMethodologyFlow()

      // Clear errors to get clean baseline
      errorMonitor.clearErrors()

      bosDebugger.validateCompleteFlow(flow.id, flow)

      const health = errorMonitor.getSystemHealth()
      expect(health.status).toMatch(/healthy|degraded|critical/)
      expect(Array.isArray(health.issues)).toBe(true)
      expect(Array.isArray(health.recommendations)).toBe(true)
    })
  })

  describe('Performance Integration', () => {
    it('should complete validation within performance thresholds', () => {
      const flow = createCompleteMethodologyFlow()

      const startTime = performance.now()
      bosDebugger.validateCompleteFlow(flow.id, flow)
      const duration = performance.now() - startTime

      // Validation should complete within reasonable time (2 seconds)
      expect(duration).toBeLessThan(2000)

      // Check for any performance threshold violations
      const perfStats = performanceMonitor.getStats()
      const slowOps = perfStats.exceedingThreshold

      // Log warnings for slow operations but don't fail test
      if (slowOps.length > 0) {
        console.warn(
          `Slow operations detected:`,
          slowOps.map(op => `${op.name}: ${op.duration.toFixed(2)}ms`)
        )
      }
    })

    it('should scale with flow complexity', () => {
      const simpleFlow = createBasicFlow()
      const complexFlow = createCompleteMethodologyFlow()

      performanceMonitor.clearMetrics()

      // Validate simple flow
      const start1 = performance.now()
      bosDebugger.validateCompleteFlow(simpleFlow.id, simpleFlow)
      const simpleDuration = performance.now() - start1

      // Validate complex flow
      const start2 = performance.now()
      bosDebugger.validateCompleteFlow(complexFlow.id, complexFlow)
      const complexDuration = performance.now() - start2

      // Complex flow should take longer but not excessively
      expect(complexDuration).toBeGreaterThanOrEqual(simpleDuration)
      expect(complexDuration).toBeLessThan(simpleDuration * 10) // Not more than 10x slower
    })
  })

  describe('Session Management', () => {
    it('should create and manage debug sessions correctly', () => {
      const initialSessions = bosDebugger.getAllSessions().length

      const sessionId1 = bosDebugger.startDebugSession('flow-1')
      const sessionId2 = bosDebugger.startDebugSession('flow-2', 'step-1')

      expect(bosDebugger.getAllSessions().length).toBe(initialSessions + 2)

      const session1 = bosDebugger.getSession(sessionId1)
      const session2 = bosDebugger.getSession(sessionId2)

      expect(session1?.flowId).toBe('flow-1')
      expect(session1?.stepId).toBeUndefined()
      expect(session2?.flowId).toBe('flow-2')
      expect(session2?.stepId).toBe('step-1')
    })

    it('should generate comprehensive reports', () => {
      const flow = createCompleteMethodologyFlow()
      const session = bosDebugger.validateCompleteFlow(flow.id, flow)

      const report = bosDebugger.generateFlowReport(session.id)

      expect(report).toContain('BOS Methodology Validation Report')
      expect(report).toContain(flow.id)
      expect(report).toContain('Completion Score')
      expect(report).toContain('Valid Steps')

      if (session.summary.criticalIssues.length > 0) {
        expect(report).toContain('Critical Issues')
      }

      if (session.summary.recommendations.length > 0) {
        expect(report).toContain('Recommendations')
      }
    })

    it('should export session data correctly', () => {
      const sessionId = bosDebugger.startDebugSession('export-test')
      const flow = createCompleteMethodologyFlow()
      const step = flow.stages[0].steps[0]

      bosDebugger.validateStakeholders(sessionId, step)

      const exportData = bosDebugger.exportSession(sessionId)
      const parsed = JSON.parse(exportData)

      expect(parsed.id).toBe(sessionId)
      expect(parsed.flowId).toBe('export-test')
      expect(parsed.traces).toBeDefined()
      expect(parsed.summary).toBeDefined()
    })
  })
})
