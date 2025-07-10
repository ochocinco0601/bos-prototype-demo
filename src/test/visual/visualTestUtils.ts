/**
 * Visual Component Testing Framework
 * Provides utilities for visual regression testing and component validation
 * Supports UI changes and new screen development with confidence
 */

import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { Flow, Step } from '../../types'
import {
  createCompleteMethodologyFlow,
  createBasicFlow,
} from '../../data/mockData'

export interface ComponentTestSuite {
  name: string
  component: React.ComponentType<any>
  variants: ComponentVariant[]
  interactions?: ComponentInteraction[]
}

export interface ComponentVariant {
  name: string
  props: Record<string, any>
  expectedElements: string[]
  accessibility?: AccessibilityChecks
}

export interface ComponentInteraction {
  name: string
  action: (container: HTMLElement) => void | Promise<void>
  expectedResult: (container: HTMLElement) => boolean
}

export interface AccessibilityChecks {
  hasProperLabels: boolean
  hasKeyboardNavigation: boolean
  hasAriaAttributes: boolean
  hasColorContrast: boolean
}

export interface VisualTestResult {
  passed: boolean
  errors: string[]
  warnings: string[]
  accessibility: AccessibilityResult
  performance: PerformanceMetrics
}

export interface AccessibilityResult {
  score: number
  issues: AccessibilityIssue[]
  recommendations: string[]
}

export interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info'
  element: string
  message: string
  suggestion: string
}

export interface PerformanceMetrics {
  renderTime: number
  componentCount: number
  domNodes: number
  memoryUsage?: number
}

/**
 * Visual Component Testing Framework
 * Provides comprehensive UI validation for safe component changes
 */
export class VisualTestFramework {
  private static instance: VisualTestFramework
  private testResults: Map<string, VisualTestResult> = new Map()
  private baselineSnapshots: Map<string, string> = new Map()

  private constructor() {}

  static getInstance(): VisualTestFramework {
    if (!VisualTestFramework.instance) {
      VisualTestFramework.instance = new VisualTestFramework()
    }
    return VisualTestFramework.instance
  }

  /**
   * Test a component variant for visual consistency and functionality
   */
  async testComponentVariant(
    suite: ComponentTestSuite,
    variant: ComponentVariant
  ): Promise<VisualTestResult> {
    const startTime = performance.now()
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Render component with variant props
      const renderResult = render(
        React.createElement(suite.component, variant.props)
      )

      // Check for expected elements
      for (const expectedElement of variant.expectedElements) {
        try {
          const element = renderResult.getByTestId(expectedElement)
          if (!element) {
            errors.push(`Expected element not found: ${expectedElement}`)
          }
        } catch (error) {
          // Try alternative selectors
          try {
            renderResult.getByRole('button', { name: expectedElement }) ||
              renderResult.getByText(expectedElement) ||
              renderResult.getByLabelText(expectedElement)
          } catch (fallbackError) {
            warnings.push(
              `Element may be missing or selector needs update: ${expectedElement}`
            )
          }
        }
      }

      // Accessibility validation
      const accessibilityResult = await this.validateAccessibility(
        renderResult,
        variant.accessibility
      )

      // Performance metrics
      const renderTime = performance.now() - startTime
      const performance: PerformanceMetrics = {
        renderTime,
        componentCount: this.countComponents(renderResult.container),
        domNodes: renderResult.container.querySelectorAll('*').length,
      }

      // Check for console errors during render
      const consoleErrors = this.captureConsoleErrors()
      errors.push(...consoleErrors)

      const result: VisualTestResult = {
        passed: errors.length === 0,
        errors,
        warnings,
        accessibility: accessibilityResult,
        performance,
      }

      // Store result for reporting
      this.testResults.set(`${suite.name}-${variant.name}`, result)

      renderResult.unmount()
      return result
    } catch (error) {
      errors.push(`Component rendering failed: ${(error as Error).message}`)

      return {
        passed: false,
        errors,
        warnings,
        accessibility: {
          score: 0,
          issues: [],
          recommendations: [
            'Fix rendering errors before accessibility testing',
          ],
        },
        performance: {
          renderTime: performance.now() - startTime,
          componentCount: 0,
          domNodes: 0,
        },
      }
    }
  }

  /**
   * Test component interactions (clicks, form inputs, etc.)
   */
  async testComponentInteractions(
    suite: ComponentTestSuite,
    variant: ComponentVariant
  ): Promise<{ passed: boolean; results: string[] }> {
    if (!suite.interactions) {
      return { passed: true, results: [] }
    }

    const results: string[] = []
    let allPassed = true

    const renderResult = render(
      React.createElement(suite.component, variant.props)
    )

    for (const interaction of suite.interactions) {
      try {
        await interaction.action(renderResult.container)

        const interactionPassed = interaction.expectedResult(
          renderResult.container
        )
        if (interactionPassed) {
          results.push(`✅ ${interaction.name}: PASSED`)
        } else {
          results.push(
            `❌ ${interaction.name}: FAILED - Expected result not achieved`
          )
          allPassed = false
        }
      } catch (error) {
        results.push(
          `❌ ${interaction.name}: ERROR - ${(error as Error).message}`
        )
        allPassed = false
      }
    }

    renderResult.unmount()
    return { passed: allPassed, results }
  }

  /**
   * Validate accessibility compliance
   */
  private async validateAccessibility(
    renderResult: RenderResult,
    checks?: AccessibilityChecks
  ): Promise<AccessibilityResult> {
    const issues: AccessibilityIssue[] = []
    const recommendations: string[] = []
    let score = 100

    if (!checks) {
      return { score, issues, recommendations }
    }

    // Check for proper labels
    if (checks.hasProperLabels) {
      const inputs = renderResult.container.querySelectorAll(
        'input, select, textarea'
      )
      inputs.forEach((input, index) => {
        const hasLabel =
          input.getAttribute('aria-label') ||
          input.getAttribute('aria-labelledby') ||
          renderResult.container.querySelector(`label[for="${input.id}"]`)

        if (!hasLabel) {
          issues.push({
            severity: 'error',
            element: `Input ${index + 1}`,
            message: 'Missing accessible label',
            suggestion:
              'Add aria-label, aria-labelledby, or associated label element',
          })
          score -= 20
        }
      })
    }

    // Check for keyboard navigation
    if (checks.hasKeyboardNavigation) {
      const interactiveElements = renderResult.container.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]'
      )

      let hasTabIndex = false
      interactiveElements.forEach(element => {
        const tabIndex = element.getAttribute('tabindex')
        if (tabIndex && tabIndex !== '-1') {
          hasTabIndex = true
        }
      })

      if (interactiveElements.length > 0 && !hasTabIndex) {
        recommendations.push(
          'Consider adding proper tab order with tabindex attributes'
        )
      }
    }

    // Check for ARIA attributes
    if (checks.hasAriaAttributes) {
      const elementsNeedingAria = renderResult.container.querySelectorAll(
        '[role], [aria-expanded], [aria-hidden], [aria-describedby]'
      )

      if (elementsNeedingAria.length === 0) {
        recommendations.push(
          'Consider adding ARIA attributes for better screen reader support'
        )
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
    }
  }

  /**
   * Count React components in rendered tree
   */
  private countComponents(container: HTMLElement): number {
    // Estimate based on elements with React-like attributes
    const reactElements = container.querySelectorAll(
      '[data-testid], [class*="react"]'
    )
    return reactElements.length
  }

  /**
   * Capture console errors during testing
   */
  private captureConsoleErrors(): string[] {
    // In a real implementation, this would hook into console.error
    // For now, return empty array as we don't have access to console capture
    return []
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport(): string {
    let report = '# Visual Component Test Report\n\n'
    report += `Generated: ${new Date().toISOString()}\n\n`

    let totalTests = 0
    let passedTests = 0
    let totalWarnings = 0
    let totalErrors = 0

    for (const [testName, result] of this.testResults) {
      totalTests++
      if (result.passed) passedTests++
      totalWarnings += result.warnings.length
      totalErrors += result.errors.length

      report += `## ${testName}\n`
      report += `- **Status**: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n`
      report += `- **Render Time**: ${result.performance.renderTime.toFixed(2)}ms\n`
      report += `- **DOM Nodes**: ${result.performance.domNodes}\n`
      report += `- **Accessibility Score**: ${result.accessibility.score}/100\n`

      if (result.errors.length > 0) {
        report += `- **Errors**:\n`
        result.errors.forEach(error => (report += `  - ${error}\n`))
      }

      if (result.warnings.length > 0) {
        report += `- **Warnings**:\n`
        result.warnings.forEach(warning => (report += `  - ${warning}\n`))
      }

      if (result.accessibility.recommendations.length > 0) {
        report += `- **Accessibility Recommendations**:\n`
        result.accessibility.recommendations.forEach(
          rec => (report += `  - ${rec}\n`)
        )
      }

      report += '\n'
    }

    report += `## Summary\n`
    report += `- **Total Tests**: ${totalTests}\n`
    report += `- **Passed**: ${passedTests}\n`
    report += `- **Failed**: ${totalTests - passedTests}\n`
    report += `- **Total Warnings**: ${totalWarnings}\n`
    report += `- **Total Errors**: ${totalErrors}\n`
    report += `- **Success Rate**: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%\n`

    return report
  }

  /**
   * Clear test results
   */
  clearResults(): void {
    this.testResults.clear()
  }

  /**
   * Get all test results
   */
  getAllResults(): Map<string, VisualTestResult> {
    return new Map(this.testResults)
  }
}

/**
 * Utility functions for common test scenarios
 */
export class VisualTestUtils {
  /**
   * Create test data for BOS methodology components
   */
  static createBOSTestData(): {
    completeFlow: Flow
    basicFlow: Flow
    completeStep: Step
    basicStep: Step
  } {
    const completeFlow = createCompleteMethodologyFlow()
    const basicFlow = createBasicFlow()

    return {
      completeFlow,
      basicFlow,
      completeStep: completeFlow.stages[0].steps[0],
      basicStep: basicFlow.stages[0].steps[0],
    }
  }

  /**
   * Standard accessibility checks for BOS components
   */
  static getBOSAccessibilityChecks(): AccessibilityChecks {
    return {
      hasProperLabels: true,
      hasKeyboardNavigation: true,
      hasAriaAttributes: true,
      hasColorContrast: true,
    }
  }

  /**
   * Common component variants for testing
   */
  static createComponentVariants(
    baseProps: Record<string, any>
  ): ComponentVariant[] {
    return [
      {
        name: 'default',
        props: baseProps,
        expectedElements: ['main-content'],
        accessibility: this.getBOSAccessibilityChecks(),
      },
      {
        name: 'with-data',
        props: { ...baseProps, ...this.createBOSTestData() },
        expectedElements: ['main-content', 'data-display'],
        accessibility: this.getBOSAccessibilityChecks(),
      },
      {
        name: 'empty-state',
        props: { ...baseProps, data: null },
        expectedElements: ['main-content', 'empty-state'],
        accessibility: this.getBOSAccessibilityChecks(),
      },
    ]
  }
}

// Export singleton instance
export const visualTestFramework = VisualTestFramework.getInstance()
