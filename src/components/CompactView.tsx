import React from 'react'
import { Flow, Step } from '../types'

/**
 * Props interface for the CompactView component
 */
interface CompactViewProps {
  /** The flow data to display in compact format */
  selectedFlow: Flow
  /** The currently selected step, if any */
  selectedStep: Step | null
  /** Handler for step click events */
  onStepClick: (step: Step) => void
  /** Object tracking which steps are expanded */
  expandedSteps: { [key: string]: boolean }
  /** Handler for updating expanded steps state */
  onExpandedStepsChange: (stepId: string, isExpanded: boolean) => void
}

/**
 * Compact View Component
 *
 * Displays flow data in a compact, tabular format optimized for space efficiency.
 * Features:
 * - Columnar layout with stages as headers
 * - Compact step cards with essential information
 * - Expandable step details
 * - Progress bars and completion indicators
 * - Stakeholder, service, and signal counters
 * - Hover effects for better interactivity
 *
 * @param props - The component props
 * @returns JSX element representing the compact view
 */
const CompactView: React.FC<CompactViewProps> = ({
  selectedFlow,
  selectedStep,
  onStepClick,
  expandedSteps,
  onExpandedStepsChange,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
      }}
    >
      {/* Stage Headers Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${selectedFlow.stages.length}, 1fr)`,
          gap: '0.25rem',
          padding: '0.25rem',
          backgroundColor: '#f3f4f6',
        }}
      >
        {selectedFlow.stages.map(stage => (
          <div
            key={stage.id}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '600',
              borderRadius: '0.375rem 0.375rem 0 0',
            }}
          >
            {stage.name}
            <div
              style={{
                fontSize: '0.75rem',
                opacity: 0.9,
                marginTop: '0.25rem',
              }}
            >
              {stage.steps.length} steps
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${selectedFlow.stages.length}, 1fr)`,
          gap: '0.25rem',
          backgroundColor: '#f3f4f6',
          padding: '0.25rem',
          paddingTop: '0',
        }}
      >
        {selectedFlow.stages.map(stage => (
          <div
            key={stage.id}
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              minHeight: '300px',
            }}
          >
            {stage.steps.map(step => (
              <div
                key={step.id}
                onClick={() => onStepClick(step)}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  border:
                    selectedStep?.id === step.id
                      ? '2px solid #3b82f6'
                      : '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedStep?.id === step.id ? '#eff6ff' : '#ffffff',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (selectedStep?.id !== step.id) {
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedStep?.id !== step.id) {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                  }
                }}
              >
                {/* Step Header */}
                <div
                  style={{
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#1f2937',
                    }}
                  >
                    {step.name}
                  </div>
                </div>

                {/* Metrics Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <span>👥 {step.stakeholders.length}</span>
                  <span>⚙️ {step.services.length}</span>
                  <span>🔔 {Object.keys(step.signals).length}</span>
                </div>

                {/* Simple Expand Button for Compact View */}
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <button
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      onExpandedStepsChange(step.id, !expandedSteps[step.id])
                    }}
                    style={{
                      padding: '0.375rem 0.75rem',
                      backgroundColor: expandedSteps[step.id]
                        ? '#dbeafe'
                        : '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: '#374151',
                      fontWeight: '500',
                    }}
                  >
                    {expandedSteps[step.id] ? '▲ Hide' : '▼ Show'}
                  </button>
                </div>

                {/* Show expanded content in compact view */}
                {expandedSteps[step.id] && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '0.375rem',
                      border: '2px solid #bfdbfe',
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  >
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>👥 Stakeholders:</strong>{' '}
                      {step.stakeholders.length > 0
                        ? step.stakeholders.map(s => s.name).join(', ')
                        : 'None'}
                    </div>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>⚙️ Services:</strong>{' '}
                      {step.services.length > 0
                        ? step.services.map(s => s.name).join(', ')
                        : 'None'}
                    </div>
                    <div>
                      <strong>🔗 Dependencies:</strong>{' '}
                      {Object.keys(step.dependencies).length > 0
                        ? Object.keys(step.dependencies).join(', ')
                        : 'None'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompactView
