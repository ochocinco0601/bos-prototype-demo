/**
 * Role-Outcome Generator Tests
 *
 * Session 3: Testing role-outcome generation with Enhanced Complete Test Flow
 * Validates 1-to-1 goal-to-signal mapping logic and performance requirements
 */

import { describe, it, expect } from 'vitest'
import { RoleOutcomeGenerator } from '../utils/roleOutcomeGenerator'
import { createEnhancedCompleteFlow } from '../data/mockData'

describe('RoleOutcomeGenerator', () => {
  const testFlow = createEnhancedCompleteFlow()
  const testStep = testFlow.stages[0].steps[0]
  const { stakeholders, dependencies, signals } = testStep

  describe('generateRoleOutcomeMappings', () => {
    it('should generate mappings for all dependencies', () => {
      const result = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      expect(result.mappings).toHaveLength(3) // 3 dependencies
      expect(result.totalDependencies).toBe(3)
      expect(result.totalStakeholders).toBe(3)
    })

    it('should link KPI and Business signals to dependencies', () => {
      const result = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      const linkedMappings = result.mappings.filter(m => m.signalId)
      expect(linkedMappings).toHaveLength(3) // 3 dependencies with signal linkage (1-to-1 mapping)

      // Verify specific signal linkages from Enhanced Complete Test Flow
      const mapping1 = result.mappings.find(
        m => m.dependencyId === 'dependency-1'
      )
      expect(mapping1?.signalId).toBeDefined()
      expect(mapping1?.signalType).toMatch(/(business|kpi)/)
    })

    it('should not link Process/System signals to dependencies', () => {
      const result = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      const processSystemSignals = signals.filter(
        s => s.type === 'process' || s.type === 'system'
      )
      processSystemSignals.forEach(signal => {
        expect(signal.dependencyId).toBeUndefined()
      })
    })

    it('should generate complete mapping structure', () => {
      const result = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      const mapping = result.mappings[0]
      expect(mapping).toHaveProperty('id')
      expect(mapping).toHaveProperty('stakeholderId')
      expect(mapping).toHaveProperty('dependencyId')
      expect(mapping).toHaveProperty('stakeholderName')
      expect(mapping).toHaveProperty('stakeholderRole')
      expect(mapping).toHaveProperty('goalExpectation')
    })
  })

  describe('validateRoleOutcomeChain', () => {
    it('should validate complete Enhanced Complete Test Flow', () => {
      const result = RoleOutcomeGenerator.validateRoleOutcomeChain(
        stakeholders,
        dependencies,
        signals
      )

      expect(result.isValid).toBe(true)
      expect(result.score).toBeGreaterThan(80) // Should score high
      expect(result.feedback).toContain(
        '✓ All 3 stakeholders have complete data'
      )
    })

    it('should provide feedback and suggestions', () => {
      const result = RoleOutcomeGenerator.validateRoleOutcomeChain(
        stakeholders,
        dependencies,
        signals
      )

      expect(result.feedback).toBeInstanceOf(Array)
      expect(result.suggestions).toBeInstanceOf(Array)
      expect(result.feedback.length).toBeGreaterThan(0)
    })
  })

  describe('generateSummaryStats', () => {
    it('should calculate summary statistics', () => {
      const generationResult = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      const stats = RoleOutcomeGenerator.generateSummaryStats(generationResult)

      expect(stats.coveragePercentage).toBeGreaterThan(0)
      expect(stats.linkageEfficiency).toBeGreaterThan(0)
      expect(stats.dataCompleteness).toBeGreaterThan(0)
      expect(stats.qualityScore).toBeGreaterThan(0)
      expect(stats.readinessLevel).toMatch(/(Poor|Fair|Good|Excellent)/)
    })

    it('should show excellent readiness for Enhanced Complete Test Flow', () => {
      const generationResult = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      const stats = RoleOutcomeGenerator.generateSummaryStats(generationResult)

      expect(stats.readinessLevel).toMatch(/(Good|Excellent)/)
      expect(stats.qualityScore).toBeGreaterThan(70)
    })
  })

  describe('Performance Requirements', () => {
    it('should generate mappings in under 100ms', () => {
      const startTime = performance.now()

      RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        signals
      )

      const endTime = performance.now()
      const duration = endTime - startTime

      expect(duration).toBeLessThan(100) // Sub-100ms requirement
    })

    it('should handle validation in under 50ms', () => {
      const startTime = performance.now()

      RoleOutcomeGenerator.validateRoleOutcomeChain(
        stakeholders,
        dependencies,
        signals
      )

      const endTime = performance.now()
      const duration = endTime - startTime

      expect(duration).toBeLessThan(50) // Validation should be faster
    })
  })

  describe('Error Handling', () => {
    it('should handle empty data gracefully', () => {
      const result = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        [],
        [],
        []
      )

      expect(result.mappings).toHaveLength(0)
      expect(result.errors).toHaveLength(0)
      expect(result.totalStakeholders).toBe(0)
    })

    it('should handle invalid data gracefully', () => {
      const invalidSignals = [
        { name: 'Test Signal', type: 'kpi', dependencyId: 'non-existent' },
      ] as any[]

      const result = RoleOutcomeGenerator.generateRoleOutcomeMappings(
        stakeholders,
        dependencies,
        invalidSignals
      )

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.mappings.length).toBeGreaterThan(0) // Should still generate base mappings
    })
  })
})
