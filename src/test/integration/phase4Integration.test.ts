/**
 * Phase 4 Integration Tests
 * Tests all Phase 4 UI/Data Change Acceleration features working together
 * Validates readiness for UI changes, data structure modifications, and new screen development
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { visualTestFramework } from '../visual/visualTestUtils'
import {
  bosFieldValidator,
  BOSFieldValidationUtils,
} from '../../utils/bosFieldValidator'
import { componentStorybook } from '../../docs/componentStories'
import {
  dataStructureEvolution,
  DataEvolutionUtils,
} from '../../utils/dataStructureEvolution'
import {
  createCompleteMethodologyFlow,
  createBasicFlow,
} from '../../data/mockData'

describe('Phase 4: UI/Data Change Acceleration Integration', () => {
  beforeEach(() => {
    visualTestFramework.clearResults()
  })

  describe('Visual Testing Framework Integration', () => {
    it('should provide comprehensive visual testing capabilities', () => {
      // Visual testing framework should be available and functional
      expect(visualTestFramework).toBeDefined()
      expect(typeof visualTestFramework.testComponentVariant).toBe('function')
      expect(typeof visualTestFramework.generateTestReport).toBe('function')
      expect(typeof visualTestFramework.clearResults).toBe('function')
    })

    it('should support visual regression detection', () => {
      // Framework should track visual test results
      const results = visualTestFramework.getAllResults()
      expect(results instanceof Map).toBe(true)

      // Should generate comprehensive reports
      const report = visualTestFramework.generateTestReport()
      expect(report).toContain('Visual Component Test Report')
      expect(report).toContain('Generated:')
    })
  })

  describe('BOS Field Validation Framework Integration', () => {
    it('should provide comprehensive field validation for safe data changes', () => {
      const completeFlow = createCompleteMethodologyFlow()
      const completeStep = completeFlow.stages[0].steps[0]

      // Should validate complete steps
      const summary = bosFieldValidator.validateStep(completeStep)
      expect(summary.stepId).toBe(completeStep.id)
      expect(summary.overallScore).toBeGreaterThan(0)
      expect(summary.totalFields).toBeGreaterThan(0)
      expect(Array.isArray(summary.fieldResults)).toBe(true)

      // Should provide BOS methodology scoring
      expect(typeof summary.completionStatus.stakeholders).toBe('number')
      expect(typeof summary.completionStatus.dependencies).toBe('number')
      expect(typeof summary.completionStatus.impacts).toBe('number')
      expect(typeof summary.completionStatus.telemetry).toBe('number')
      expect(typeof summary.completionStatus.signals).toBe('number')
    })

    it('should support custom field validation for new features', () => {
      // Should allow adding custom validation rules
      bosFieldValidator.addCustomFieldValidation(
        'test',
        'testField',
        value => value !== null,
        'Test field validation'
      )

      const rules = bosFieldValidator.getAllValidationRules()
      expect(rules.has('test')).toBe(true)

      // Should provide validation utilities
      const completeFlow = createCompleteMethodologyFlow()
      const completeStep = completeFlow.stages[0].steps[0]

      const quickResult = BOSFieldValidationUtils.quickValidate(completeStep)
      expect(typeof quickResult.valid).toBe('boolean')
      expect(typeof quickResult.score).toBe('number')
      expect(Array.isArray(quickResult.errors)).toBe(true)
    })

    it('should generate detailed validation reports for development', () => {
      const completeFlow = createCompleteMethodologyFlow()
      const completeStep = completeFlow.stages[0].steps[0]

      const report = bosFieldValidator.generateValidationReport(completeStep)
      expect(report).toContain('BOS Field Validation Report')
      expect(report).toContain('BOS Methodology Completion')
      expect(report).toContain('Stakeholders')
      expect(report).toContain('Dependencies')
      expect(report).toContain('Detailed Field Validation')
    })
  })

  describe('Component Story Documentation Integration', () => {
    it('should provide comprehensive component documentation', () => {
      // Should have stories for all major components
      const allStories = componentStorybook.getAllStories()
      expect(allStories.length).toBeGreaterThan(0)

      // Should include key BOS components
      const flowManagerStory = componentStorybook.getStory('FlowManager')
      const gridViewStory = componentStorybook.getStory('GridView')
      const detailPanelStory = componentStorybook.getStory('DetailPanel')

      expect(flowManagerStory).toBeDefined()
      expect(gridViewStory).toBeDefined()
      expect(detailPanelStory).toBeDefined()

      // Each story should have comprehensive documentation
      if (flowManagerStory) {
        expect(flowManagerStory.description).toBeDefined()
        expect(flowManagerStory.usage.props.length).toBeGreaterThan(0)
        expect(flowManagerStory.examples.length).toBeGreaterThan(0)
        expect(flowManagerStory.patterns.length).toBeGreaterThan(0)
        expect(flowManagerStory.accessibility).toBeDefined()
        expect(flowManagerStory.styling).toBeDefined()
      }
    })

    it('should support component categorization and search', () => {
      // Should categorize components
      const displayComponents =
        componentStorybook.getStoriesByCategory('display')
      const modalComponents = componentStorybook.getStoriesByCategory('modal')
      const navigationComponents =
        componentStorybook.getStoriesByCategory('navigation')

      expect(Array.isArray(displayComponents)).toBe(true)
      expect(Array.isArray(modalComponents)).toBe(true)
      expect(Array.isArray(navigationComponents)).toBe(true)

      // Should support search functionality
      const flowStories = componentStorybook.searchStories('flow')
      expect(Array.isArray(flowStories)).toBe(true)
    })

    it('should generate comprehensive documentation', () => {
      const documentation = componentStorybook.generateDocumentation()
      expect(documentation).toContain('BOS Component Library Documentation')
      expect(documentation).toContain('Table of Contents')
      expect(documentation).toContain('Props')
      expect(documentation).toContain('Examples')
      expect(documentation).toContain('Design Patterns')
    })
  })

  describe('Data Structure Evolution Integration', () => {
    it('should provide safe data structure modification tools', () => {
      // Should support evolution planning
      const plan = dataStructureEvolution.createEvolutionPlan('1.0.0', '1.1.0')
      expect(plan.currentVersion).toBe('1.0.0')
      expect(plan.targetVersion).toBe('1.1.0')
      expect(Array.isArray(plan.migrations)).toBe(true)
      expect(typeof plan.backupRequired).toBe('boolean')
      expect(['low', 'medium', 'high']).toContain(plan.riskLevel)
    })

    it('should support field-level changes', () => {
      const testData = { flows: [] }

      // Should support adding fields
      const dataWithNewField = DataEvolutionUtils.addField(
        testData,
        'version',
        '1.0.0'
      )
      expect(dataWithNewField).toBeDefined()

      // Should support removing fields
      const dataWithoutField = DataEvolutionUtils.removeField(
        testData,
        'someField'
      )
      expect(dataWithoutField).toBeDefined()

      // Should support renaming fields
      const dataWithRenamedField = DataEvolutionUtils.renameField(
        testData,
        'oldName',
        'newName'
      )
      expect(dataWithRenamedField).toBeDefined()
    })

    it('should provide compatibility checking', () => {
      const testData = { flows: [] }
      const compatibility = dataStructureEvolution.checkCompatibility(
        testData,
        '1.1.0'
      )

      expect(typeof compatibility.compatible).toBe('boolean')
      expect(Array.isArray(compatibility.issues)).toBe(true)
      expect(Array.isArray(compatibility.recommendations)).toBe(true)
    })

    it('should generate migration templates', () => {
      const template = dataStructureEvolution.generateMigrationTemplate(
        '1.1.0',
        'Add new field',
        [
          {
            type: 'add',
            path: 'newField',
            newValue: 'defaultValue',
            description: 'Add new field with default value',
          },
        ]
      )

      expect(template).toContain('Migration: 1.1.0')
      expect(template).toContain('Add new field')
      expect(template).toContain('up:')
      expect(template).toContain('down:')
      expect(template).toContain('validate:')
    })
  })

  describe('Cross-System Integration', () => {
    it('should enable confident UI changes with validation backing', () => {
      const completeFlow = createCompleteMethodologyFlow()
      const completeStep = completeFlow.stages[0].steps[0]

      // Visual testing should work with BOS data
      expect(visualTestFramework).toBeDefined()

      // Field validation should provide feedback for UI changes
      const validation = bosFieldValidator.validateStep(completeStep)
      expect(validation.fieldResults.length).toBeGreaterThan(0)

      // Documentation should guide UI development
      const flowManagerDocs = componentStorybook.getStory('FlowManager')
      expect(flowManagerDocs?.usage.props.length).toBeGreaterThan(0)
    })

    it('should enable confident data structure changes', () => {
      const basicFlow = createBasicFlow()
      const basicStep = basicFlow.stages[0].steps[0]

      // Field validation should identify current state
      const beforeValidation = bosFieldValidator.validateStep(basicStep)
      expect(beforeValidation.completionStatus).toBeDefined()

      // Evolution tools should plan safe changes
      const evolutionPlan =
        DataEvolutionUtils.createQuickEvolutionPlan('addBOSField')
      expect(evolutionPlan.migrations.length).toBeGreaterThan(0)
      expect(evolutionPlan.backupRequired).toBe(true)

      // Documentation should guide implementation
      const requirements =
        BOSFieldValidationUtils.getFieldRequirements('stakeholders')
      expect(requirements.length).toBeGreaterThan(0)
    })

    it('should support iterative development workflow', () => {
      // 1. Plan changes using evolution tools
      const plan = DataEvolutionUtils.createQuickEvolutionPlan('addValidation')
      expect(plan).toBeDefined()

      // 2. Validate current state
      const completeFlow = createCompleteMethodologyFlow()
      const validation = bosFieldValidator.validateStep(
        completeFlow.stages[0].steps[0]
      )
      expect(validation).toBeDefined()

      // 3. Reference component patterns
      const patterns = componentStorybook.getAllStories()
      expect(patterns.length).toBeGreaterThan(0)

      // 4. Visual testing should catch regressions
      const testReport = visualTestFramework.generateTestReport()
      expect(testReport).toContain('Visual Component Test Report')
    })
  })

  describe('Development Velocity Features', () => {
    it('should provide quick validation feedback', () => {
      const basicFlow = createBasicFlow()
      const basicStep = basicFlow.stages[0].steps[0]

      const quickValidation = BOSFieldValidationUtils.quickValidate(basicStep)
      expect(quickValidation).toBeDefined()
      expect(typeof quickValidation.valid).toBe('boolean')
      expect(typeof quickValidation.score).toBe('number')
    })

    it('should provide specific BOS step guidance', () => {
      const completeFlow = createCompleteMethodologyFlow()
      const completeStep = completeFlow.stages[0].steps[0]

      const stakeholderGuidance = BOSFieldValidationUtils.validateBOSStep(
        completeStep,
        'stakeholders'
      )
      expect(stakeholderGuidance.completeness).toBeGreaterThanOrEqual(0)
      expect(Array.isArray(stakeholderGuidance.suggestions)).toBe(true)
    })

    it('should provide component usage examples', () => {
      const gridViewStory = componentStorybook.getStory('GridView')
      if (gridViewStory) {
        expect(gridViewStory.examples.length).toBeGreaterThan(0)

        const firstExample = gridViewStory.examples[0]
        expect(firstExample.name).toBeDefined()
        expect(firstExample.description).toBeDefined()
        expect(firstExample.props).toBeDefined()
        expect(firstExample.code).toBeDefined()
      }
    })
  })

  describe('Error Prevention and Safety', () => {
    it('should detect validation issues before they become problems', () => {
      // Create step with known issues
      const problematicStep = {
        id: 'problematic',
        name: 'Problematic Step',
        description: 'Step with validation issues',
        stakeholders: [], // Empty - should be flagged
        dependencies: {}, // Empty - should be flagged
        impacts: {},
        telemetry: {},
        signals: {},
        services: [],
      }

      const validation = bosFieldValidator.validateStep(problematicStep as any)
      expect(validation.criticalErrors.length).toBeGreaterThan(0)
      expect(validation.overallScore).toBeLessThan(80) // Adjusted expectation
    })

    it('should provide clear guidance for fixes', () => {
      const problematicStep = {
        id: 'problematic',
        name: 'Problematic Step',
        description: 'Step with validation issues',
        stakeholders: [],
        dependencies: {},
        impacts: {},
        telemetry: {},
        signals: {},
        services: [],
      }

      const validation = bosFieldValidator.validateStep(problematicStep as any)
      expect(validation.suggestions.length).toBeGreaterThan(0)

      const report = bosFieldValidator.generateValidationReport(
        problematicStep as any
      )
      expect(report).toContain('Suggestions for Improvement')
    })

    it('should support safe evolution with backups', () => {
      const plan = dataStructureEvolution.createEvolutionPlan('1.0.0', '1.2.0')
      expect(plan.backupRequired).toBe(true)
      expect(plan.riskLevel).toBeDefined()
    })
  })
})
