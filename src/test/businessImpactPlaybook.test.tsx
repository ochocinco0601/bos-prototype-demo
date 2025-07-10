/**
 * Business Impact Playbook Component Tests
 *
 * Session 4: Testing playbook component integration and functionality
 * Validates 6-section structure and Enhanced Complete Test Flow integration
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BusinessImpactPlaybook from '../components/BusinessImpactPlaybook'
import { createEnhancedCompleteFlow } from '../data/mockData'

describe('BusinessImpactPlaybook', () => {
  const testFlow = createEnhancedCompleteFlow()
  const testStep = testFlow.stages[0].steps[0]

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      expect(
        screen.getByText('Business Observability Factory - Step Detail')
      ).toBeInTheDocument()
    })

    it('should render all 6 sections', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      expect(screen.getByText('1. Process & Step Overview')).toBeInTheDocument()
      expect(screen.getByText('2. Role to Outcome Mapping')).toBeInTheDocument()
      expect(
        screen.getByText('3. Business Outcome & Signal Definitions')
      ).toBeInTheDocument()
      expect(
        screen.getByText('4. Technical Implementation')
      ).toBeInTheDocument()
      expect(
        screen.getByText('5. Process Signal Definitions')
      ).toBeInTheDocument()
      expect(
        screen.getByText('6. System Signal Definitions')
      ).toBeInTheDocument()
    })

    it('should display step information correctly', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      expect(screen.getAllByText(testStep.name)[0]).toBeInTheDocument()
      expect(screen.getAllByText(testFlow.name)[0]).toBeInTheDocument()
    })
  })

  describe('Role-Outcome Mapping Section', () => {
    it('should display role-outcome table with Enhanced Complete Test Flow data', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      // Check for table headers
      expect(screen.getByText('Role Type')).toBeInTheDocument()
      expect(screen.getByText('Value')).toBeInTheDocument()
      expect(screen.getByText('Goal/Intent')).toBeInTheDocument()
      expect(screen.getByText('Mapped KPI(s)')).toBeInTheDocument()
      expect(screen.getByText('Mapped Business Signal(s)')).toBeInTheDocument()

      // Check for stakeholder data
      expect(screen.getByText('Primary Loan Officer')).toBeInTheDocument()
      expect(screen.getByText('Underwriting Department')).toBeInTheDocument()
      expect(
        screen.getByText('Third-Party Verification Service')
      ).toBeInTheDocument()
    })

    it('should display signal linkages in role-outcome table', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      // Check for linked signals
      expect(
        screen.getAllByText('Income Verification Success Rate')[0]
      ).toBeInTheDocument()
      expect(
        screen.getAllByText('Documentation Turnaround Time')[0]
      ).toBeInTheDocument()
      expect(
        screen.getAllByText('Verification Quality Score')[0]
      ).toBeInTheDocument()
    })
  })

  describe('Business Signals Section', () => {
    it('should display business and KPI signals correctly', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      // Check for business signals
      expect(
        screen.getAllByText('Income Verification Success Rate')[0]
      ).toBeInTheDocument()
      expect(
        screen.getAllByText('Third-Party Service Reliability')[0]
      ).toBeInTheDocument()

      // Check for KPI signals
      expect(
        screen.getAllByText('Documentation Turnaround Time')[0]
      ).toBeInTheDocument()
      expect(
        screen.getAllByText('Verification Quality Score')[0]
      ).toBeInTheDocument()
    })
  })

  describe('Technical Implementation Section', () => {
    it('should display technical flow information', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      // Check for technical flow description
      expect(
        screen.getByText('Technical Function Description')
      ).toBeInTheDocument()
      expect(screen.getByText('Technical Flow')).toBeInTheDocument()

      // Check for service information
      expect(
        screen.getByText('Income Verification Service')
      ).toBeInTheDocument()
    })
  })

  describe('Process and System Signals', () => {
    it('should display process signals in separate section', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      expect(
        screen.getByText('Processing Time SLA Compliance')
      ).toBeInTheDocument()
    })

    it('should display system signals in separate section', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      expect(
        screen.getByText('Third-Party API Availability')
      ).toBeInTheDocument()
    })
  })

  describe('Empty Data Handling', () => {
    it('should handle empty step gracefully', () => {
      render(
        <BusinessImpactPlaybook
          step={null}
          flowName="Test Flow"
          stageName="Test Stage"
        />
      )

      expect(
        screen.getByText('Business Observability Factory - Step Detail')
      ).toBeInTheDocument()
      expect(
        screen.getByText('No role-outcome mappings available')
      ).toBeInTheDocument()
    })

    it('should display placeholder text for missing data', () => {
      const emptyStep = {
        id: 'empty-step',
        name: 'Empty Step',
        description: '',
        stakeholders: [],
        dependencies: [],
        signals: [],
        impacts: [],
        telemetryMappings: [],
        services: [],
        score: 0,
      }

      render(
        <BusinessImpactPlaybook
          step={emptyStep}
          flowName="Test Flow"
          stageName="Test Stage"
        />
      )

      expect(
        screen.getByText('No role-outcome mappings available')
      ).toBeInTheDocument()
      expect(
        screen.getByText('No business signals defined')
      ).toBeInTheDocument()
      expect(screen.getByText('No process signals defined')).toBeInTheDocument()
      expect(screen.getByText('No system signals defined')).toBeInTheDocument()
    })
  })

  describe('Signal Type Indicators', () => {
    it('should display signal type badges correctly', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      // Check for KPI and Business signal badges
      expect(screen.getByText('KPI')).toBeInTheDocument()
      expect(screen.getByText('Business Signal')).toBeInTheDocument()
    })
  })

  describe('Performance and Quality Metrics', () => {
    it('should display quality score and readiness level', () => {
      render(
        <BusinessImpactPlaybook
          step={testStep}
          flowName={testFlow.name}
          stageName={testFlow.stages[0].name}
        />
      )

      // Check for quality metrics in footer
      expect(screen.getByText(/Quality Score:/)).toBeInTheDocument()
      expect(screen.getByText(/Readiness:/)).toBeInTheDocument()
      expect(screen.getByText(/Role-Outcome Mappings:/)).toBeInTheDocument()
    })
  })
})
