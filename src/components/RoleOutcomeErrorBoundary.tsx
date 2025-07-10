/**
 * Role-Outcome Error Boundary
 *
 * Business Impact Playbook Session 3 - Specialized error boundary for role-outcome
 * mapping generation with graceful degradation and recovery strategies.
 *
 * Provides robust error handling for Business Impact Playbook generation scenarios.
 */

import React, { Component, ReactNode } from 'react'
import { RoleOutcomeMapping } from '../types/index'

interface RoleOutcomeErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  enableRecovery?: boolean
}

interface RoleOutcomeErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
  lastErrorTime: number
}

/**
 * Role-Outcome Error Boundary Component
 *
 * Specialized error boundary for role-outcome mapping operations that provides:
 * - Graceful degradation for Business Impact Playbook generation
 * - Recovery mechanisms for temporary failures
 * - Detailed error reporting for debugging
 * - Safe fallback UI for partial data scenarios
 */
export class RoleOutcomeErrorBoundary extends Component<
  RoleOutcomeErrorBoundaryProps,
  RoleOutcomeErrorBoundaryState
> {
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  constructor(props: RoleOutcomeErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0,
      lastErrorTime: 0,
    }
  }

  static getDerivedStateFromError(error: Error): RoleOutcomeErrorBoundaryState {
    return {
      hasError: true,
      error,
      retryCount: 0,
      lastErrorTime: Date.now(),
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Role-Outcome Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Update state with error information
    this.setState({
      error,
      errorInfo,
    })
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
        lastErrorTime: Date.now(),
      }))
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI with recovery options
      return (
        <div
          style={{
            padding: '1.5rem',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            margin: '1rem 0',
          }}
        >
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.125rem' }}>
            Business Impact Playbook Generation Error
          </h3>

          <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
            An error occurred while generating role-outcome mappings. This may
            be due to:
          </p>

          <ul
            style={{
              margin: '0 0 1rem 0',
              paddingLeft: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <li>Incomplete or corrupted stakeholder data</li>
            <li>Missing dependency linkages</li>
            <li>Invalid signal configurations</li>
            <li>Performance issues with large datasets</li>
          </ul>

          {this.props.enableRecovery &&
            this.state.retryCount < this.maxRetries && (
              <div style={{ marginBottom: '1rem' }}>
                <button
                  onClick={this.handleRetry}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Retry Generation ({this.state.retryCount + 1}/
                  {this.maxRetries})
                </button>
              </div>
            )}

          <details style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
              Technical Details
            </summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '0.25rem',
                overflow: 'auto',
                maxHeight: '200px',
              }}
            >
              {this.state.error?.message}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>

          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            <strong>Recovery Options:</strong>
            <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
              <li>Check stakeholder data completeness</li>
              <li>Verify dependency linkages</li>
              <li>Ensure signal configurations are valid</li>
              <li>Refresh the page to clear any cached data</li>
            </ul>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Safe Role-Outcome Mapping Wrapper
 *
 * Higher-order component that provides safe rendering for role-outcome mappings
 * with graceful degradation for partial or corrupted data.
 */
export const SafeRoleOutcomeMapping: React.FC<{
  mapping: RoleOutcomeMapping | null
  fallback?: ReactNode
}> = ({ mapping, fallback }) => {
  if (!mapping) {
    return (
      <div style={{ padding: '1rem', color: '#6b7280', fontStyle: 'italic' }}>
        {fallback || 'No role-outcome mapping available'}
      </div>
    )
  }

  try {
    return (
      <div
        style={{
          padding: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
          {mapping.stakeholderName}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          {mapping.stakeholderRole}
        </div>
        <div style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>
          {mapping.goalExpectation}
        </div>
        {mapping.signalId && (
          <div style={{ fontSize: '0.75rem', color: '#059669' }}>
            📊 {mapping.signalName} ({mapping.signalType})
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error rendering role-outcome mapping:', error)
    return (
      <div
        style={{
          padding: '0.75rem',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          fontSize: '0.875rem',
        }}
      >
        Error rendering mapping for{' '}
        {mapping.stakeholderName || 'Unknown Stakeholder'}
      </div>
    )
  }
}

/**
 * Data Integrity Check Hook
 *
 * Custom hook for validating role-outcome data integrity before rendering.
 * Provides early error detection and recovery suggestions.
 */
export const useRoleOutcomeDataIntegrity = (
  mappings: RoleOutcomeMapping[]
): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
} => {
  const errors: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []

  try {
    // Check for empty or null mappings
    if (!mappings || mappings.length === 0) {
      warnings.push('No role-outcome mappings available')
      suggestions.push('Add stakeholders and dependencies to generate mappings')
      return { isValid: true, errors, warnings, suggestions }
    }

    // Validate each mapping
    mappings.forEach((mapping, index) => {
      if (!mapping.id) {
        errors.push(`Mapping ${index + 1}: Missing ID`)
      }
      if (!mapping.stakeholderName) {
        errors.push(`Mapping ${index + 1}: Missing stakeholder name`)
      }
      if (!mapping.goalExpectation) {
        errors.push(`Mapping ${index + 1}: Missing goal expectation`)
      }
      if (!mapping.signalId) {
        warnings.push(`Mapping ${index + 1}: No signal linkage`)
      }
    })

    // Check for duplicate mappings
    const uniqueIds = new Set(mappings.map(m => m.id))
    if (uniqueIds.size !== mappings.length) {
      errors.push('Duplicate mapping IDs detected')
    }

    // Provide suggestions based on warnings
    if (warnings.length > 0) {
      suggestions.push(
        'Link KPI and Business signals to dependencies for complete role-outcome mappings'
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    }
  } catch (error) {
    console.error('Data integrity check failed:', error)
    return {
      isValid: false,
      errors: ['Data integrity check failed'],
      warnings: [],
      suggestions: ['Check data structure and try again'],
    }
  }
}
