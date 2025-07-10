/**
 * Visual Component Tests
 * Comprehensive visual testing for BOS components to prevent UI regressions
 * Validates existing components and provides foundation for new screen development
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ComponentTestSuite,
  VisualTestFramework,
  VisualTestUtils,
  visualTestFramework,
} from './visualTestUtils'
import { FlowManager } from '../../components/FlowManager'
import { GridView } from '../../components/GridView'
import { CompactView } from '../../components/CompactView'
import { DetailPanel } from '../../components/DetailPanel'
import { ImportModal } from '../../components/ImportModal'
import { ExportModal } from '../../components/ExportModal'

describe('Visual Component Tests', () => {
  beforeEach(() => {
    visualTestFramework.clearResults()
  })

  describe('FlowManager Component', () => {
    const testData = VisualTestUtils.createBOSTestData()

    const flowManagerSuite: ComponentTestSuite = {
      name: 'FlowManager',
      component: FlowManager,
      variants: [
        {
          name: 'default',
          props: {
            flows: [testData.completeFlow, testData.basicFlow],
            selectedFlowId: testData.completeFlow.id,
            onFlowSelect: () => {},
            onFlowCreate: () => {},
            onFlowDuplicate: () => {},
            onFlowDelete: () => {},
          },
          expectedElements: ['flow-selector', 'flow-actions'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'empty-flows',
          props: {
            flows: [],
            selectedFlowId: null,
            onFlowSelect: () => {},
            onFlowCreate: () => {},
            onFlowDuplicate: () => {},
            onFlowDelete: () => {},
          },
          expectedElements: ['flow-selector', 'empty-state'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'single-flow',
          props: {
            flows: [testData.completeFlow],
            selectedFlowId: testData.completeFlow.id,
            onFlowSelect: () => {},
            onFlowCreate: () => {},
            onFlowDuplicate: () => {},
            onFlowDelete: () => {},
          },
          expectedElements: ['flow-selector', 'flow-actions'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
      ],
      interactions: [
        {
          name: 'flow-selection',
          action: async container => {
            const selector = container.querySelector('select')
            if (selector) {
              fireEvent.change(selector, {
                target: { value: testData.basicFlow.id },
              })
            }
          },
          expectedResult: container => {
            const selector = container.querySelector(
              'select'
            ) as HTMLSelectElement
            return selector?.value === testData.basicFlow.id
          },
        },
        {
          name: 'create-flow-button',
          action: async container => {
            const createButton = container.querySelector(
              '[data-testid="create-flow"]'
            ) as HTMLButtonElement
            if (createButton) {
              fireEvent.click(createButton)
            }
          },
          expectedResult: () => true, // Just test that it doesn't crash
        },
      ],
    }

    it('should pass visual tests for all variants', async () => {
      for (const variant of flowManagerSuite.variants) {
        const result = await visualTestFramework.testComponentVariant(
          flowManagerSuite,
          variant
        )

        expect(
          result.passed,
          `FlowManager ${variant.name} failed: ${result.errors.join(', ')}`
        ).toBe(true)

        expect(result.performance.renderTime).toBeLessThan(100) // Should render quickly
        expect(result.accessibility.score).toBeGreaterThan(70) // Good accessibility
      }
    })

    it('should handle interactions correctly', async () => {
      const interactionResult =
        await visualTestFramework.testComponentInteractions(
          flowManagerSuite,
          flowManagerSuite.variants[0]
        )

      expect(
        interactionResult.passed,
        `Interactions failed: ${interactionResult.results.join(', ')}`
      ).toBe(true)
    })
  })

  describe('GridView Component', () => {
    const testData = VisualTestUtils.createBOSTestData()

    const gridViewSuite: ComponentTestSuite = {
      name: 'GridView',
      component: GridView,
      variants: [
        {
          name: 'with-complete-flow',
          props: {
            flow: testData.completeFlow,
            selectedStepId: testData.completeStep.id,
            onStepSelect: () => {},
          },
          expectedElements: ['grid-container', 'flow-stages'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'with-basic-flow',
          props: {
            flow: testData.basicFlow,
            selectedStepId: testData.basicStep.id,
            onStepSelect: () => {},
          },
          expectedElements: ['grid-container', 'flow-stages'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'no-selection',
          props: {
            flow: testData.completeFlow,
            selectedStepId: null,
            onStepSelect: () => {},
          },
          expectedElements: ['grid-container', 'flow-stages'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
      ],
      interactions: [
        {
          name: 'step-selection',
          action: async container => {
            const stepButton = container.querySelector(
              '[data-testid="step-button"]'
            ) as HTMLButtonElement
            if (stepButton) {
              fireEvent.click(stepButton)
            }
          },
          expectedResult: () => true, // Just test that it doesn't crash
        },
      ],
    }

    it('should pass visual tests for all variants', async () => {
      for (const variant of gridViewSuite.variants) {
        const result = await visualTestFramework.testComponentVariant(
          gridViewSuite,
          variant
        )

        expect(
          result.passed,
          `GridView ${variant.name} failed: ${result.errors.join(', ')}`
        ).toBe(true)

        expect(result.performance.renderTime).toBeLessThan(200) // Complex layout, allow more time
      }
    })
  })

  describe('CompactView Component', () => {
    const testData = VisualTestUtils.createBOSTestData()

    const compactViewSuite: ComponentTestSuite = {
      name: 'CompactView',
      component: CompactView,
      variants: [
        {
          name: 'with-complete-flow',
          props: {
            flow: testData.completeFlow,
            selectedStepId: testData.completeStep.id,
            onStepSelect: () => {},
          },
          expectedElements: ['compact-container'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'with-basic-flow',
          props: {
            flow: testData.basicFlow,
            selectedStepId: testData.basicStep.id,
            onStepSelect: () => {},
          },
          expectedElements: ['compact-container'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
      ],
    }

    it('should pass visual tests for all variants', async () => {
      for (const variant of compactViewSuite.variants) {
        const result = await visualTestFramework.testComponentVariant(
          compactViewSuite,
          variant
        )

        expect(
          result.passed,
          `CompactView ${variant.name} failed: ${result.errors.join(', ')}`
        ).toBe(true)
      }
    })
  })

  describe('DetailPanel Component', () => {
    const testData = VisualTestUtils.createBOSTestData()

    const detailPanelSuite: ComponentTestSuite = {
      name: 'DetailPanel',
      component: DetailPanel,
      variants: [
        {
          name: 'with-complete-step',
          props: {
            step: testData.completeStep,
            onClose: () => {},
          },
          expectedElements: ['detail-panel', 'step-details'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'with-basic-step',
          props: {
            step: testData.basicStep,
            onClose: () => {},
          },
          expectedElements: ['detail-panel', 'step-details'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'null-step',
          props: {
            step: null,
            onClose: () => {},
          },
          expectedElements: [],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
      ],
      interactions: [
        {
          name: 'close-panel',
          action: async container => {
            const closeButton = container.querySelector(
              '[data-testid="close-panel"]'
            ) as HTMLButtonElement
            if (closeButton) {
              fireEvent.click(closeButton)
            }
          },
          expectedResult: () => true, // Just test that it doesn't crash
        },
      ],
    }

    it('should pass visual tests for all variants', async () => {
      for (const variant of detailPanelSuite.variants) {
        const result = await visualTestFramework.testComponentVariant(
          detailPanelSuite,
          variant
        )

        expect(
          result.passed,
          `DetailPanel ${variant.name} failed: ${result.errors.join(', ')}`
        ).toBe(true)
      }
    })
  })

  describe('Modal Components', () => {
    const importModalSuite: ComponentTestSuite = {
      name: 'ImportModal',
      component: ImportModal,
      variants: [
        {
          name: 'open-modal',
          props: {
            isOpen: true,
            onClose: () => {},
            onImport: () => {},
          },
          expectedElements: ['import-modal', 'modal-content'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'closed-modal',
          props: {
            isOpen: false,
            onClose: () => {},
            onImport: () => {},
          },
          expectedElements: [],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
      ],
    }

    const exportModalSuite: ComponentTestSuite = {
      name: 'ExportModal',
      component: ExportModal,
      variants: [
        {
          name: 'open-modal',
          props: {
            isOpen: true,
            onClose: () => {},
            data: { flows: [] },
          },
          expectedElements: ['export-modal', 'modal-content'],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
        {
          name: 'closed-modal',
          props: {
            isOpen: false,
            onClose: () => {},
            data: { flows: [] },
          },
          expectedElements: [],
          accessibility: VisualTestUtils.getBOSAccessibilityChecks(),
        },
      ],
    }

    it('should pass visual tests for ImportModal', async () => {
      for (const variant of importModalSuite.variants) {
        const result = await visualTestFramework.testComponentVariant(
          importModalSuite,
          variant
        )

        expect(
          result.passed,
          `ImportModal ${variant.name} failed: ${result.errors.join(', ')}`
        ).toBe(true)
      }
    })

    it('should pass visual tests for ExportModal', async () => {
      for (const variant of exportModalSuite.variants) {
        const result = await visualTestFramework.testComponentVariant(
          exportModalSuite,
          variant
        )

        expect(
          result.passed,
          `ExportModal ${variant.name} failed: ${result.errors.join(', ')}`
        ).toBe(true)
      }
    })
  })

  describe('Visual Test Reporting', () => {
    it('should generate comprehensive test report', () => {
      const report = visualTestFramework.generateTestReport()

      expect(report).toContain('Visual Component Test Report')
      expect(report).toContain('Generated:')
      expect(report).toContain('Summary')
      expect(report).toContain('Total Tests')
      expect(report).toContain('Success Rate')
    })

    it('should track performance metrics', () => {
      const results = visualTestFramework.getAllResults()

      for (const [testName, result] of results) {
        expect(result.performance.renderTime).toBeGreaterThan(0)
        expect(result.performance.domNodes).toBeGreaterThan(0)
        expect(typeof result.performance.componentCount).toBe('number')
      }
    })

    it('should validate accessibility scores', () => {
      const results = visualTestFramework.getAllResults()

      for (const [testName, result] of results) {
        expect(result.accessibility.score).toBeGreaterThanOrEqual(0)
        expect(result.accessibility.score).toBeLessThanOrEqual(100)
        expect(Array.isArray(result.accessibility.issues)).toBe(true)
        expect(Array.isArray(result.accessibility.recommendations)).toBe(true)
      }
    })
  })
})
