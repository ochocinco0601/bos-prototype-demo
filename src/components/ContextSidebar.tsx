import React from 'react'
import { Flow, Step } from '../types'

/**
 * ContextSidebar component props interface
 */
interface ContextSidebarProps {
  /** The current flow */
  flow: Flow
  /** The current step */
  currentStep: Step | null
  /** Whether the sidebar is expanded */
  isExpanded: boolean
  /** Callback to toggle sidebar expansion */
  onToggle: () => void
  /** Callback to navigate to a different step */
  onNavigateToStep?: (step: Step) => void
  /** Whether in create mode */
  createMode?: boolean
  /** Selected stage ID for create mode */
  selectedStageId?: string
}

/**
 * ContextSidebar Component
 * 
 * Provides contextual information about the current flow, stage, and related steps
 * in a collapsible sidebar for enhanced user awareness during methodology workflow.
 */
const ContextSidebar: React.FC<ContextSidebarProps> = ({
  flow,
  currentStep,
  isExpanded,
  onToggle,
  onNavigateToStep,
  createMode = false,
  selectedStageId,
}) => {
  // Find current stage
  const currentStage = createMode
    ? flow.stages.find(s => s.id === selectedStageId)
    : flow.stages.find(s => s.steps.some(step => step.id === currentStep?.id))

  // Get related steps in the same stage
  const relatedSteps = currentStage?.steps || []

  // Sidebar styles
  const sidebarStyle = {
    width: isExpanded ? '300px' : '60px',
    backgroundColor: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    padding: isExpanded ? '1.5rem' : '1rem',
    transition: 'all 0.3s ease',
    height: '100%',
    overflowY: 'auto' as const,
    flexShrink: 0,
  }

  const toggleButtonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginBottom: isExpanded ? '1.5rem' : '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isExpanded ? 'space-between' : 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.3s ease',
  }

  const sectionStyle = {
    marginBottom: '1.5rem',
  }

  const sectionHeaderStyle = {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const contentStyle = {
    fontSize: '0.875rem',
    color: '#374151',
    lineHeight: '1.5',
  }

  const stepListStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  }

  const stepItemStyle = (step: Step, isCurrent: boolean) => ({
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: isCurrent ? '#dbeafe' : 'transparent',
    border: isCurrent ? '1px solid #3b82f6' : '1px solid transparent',
    cursor: onNavigateToStep ? 'pointer' : 'default',
    fontSize: '0.75rem',
    color: isCurrent ? '#1d4ed8' : '#6b7280',
    fontWeight: isCurrent ? '500' : '400',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  })

  const stepItemHoverStyle = {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  }

  return (
    <div style={sidebarStyle}>
      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        style={toggleButtonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, {
            backgroundColor: '#f1f5f9',
            borderColor: '#cbd5e1',
          })
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, {
            backgroundColor: 'transparent',
            borderColor: '#e2e8f0',
          })
        }}
      >
        {isExpanded ? (
          <>
            <span>Context</span>
            <span>◀</span>
          </>
        ) : (
          <span>≡</span>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Flow Information */}
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <span>🏢</span>
              <span>Flow</span>
            </div>
            <div style={contentStyle}>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                {flow.name}
              </div>
              {flow.description && (
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {flow.description}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                {flow.stages.length} stages • {flow.stages.reduce((acc, stage) => acc + stage.steps.length, 0)} steps
              </div>
            </div>
          </div>

          {/* Stage Information */}
          {currentStage && (
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <span>📋</span>
                <span>Stage</span>
              </div>
              <div style={contentStyle}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {currentStage.name}
                </div>
                {currentStage.description && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {currentStage.description}
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  {currentStage.steps.length} steps in this stage
                </div>
              </div>
            </div>
          )}

          {/* Related Steps */}
          {relatedSteps.length > 0 && (
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <span>📄</span>
                <span>Steps</span>
              </div>
              <div style={stepListStyle}>
                {relatedSteps.map((step, index) => {
                  const isCurrent = !createMode && currentStep?.id === step.id
                  return (
                    <div
                      key={step.id}
                      style={stepItemStyle(step, isCurrent)}
                      onClick={() => {
                        if (onNavigateToStep && !createMode) {
                          onNavigateToStep(step)
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (onNavigateToStep && !createMode && !isCurrent) {
                          Object.assign(e.currentTarget.style, stepItemHoverStyle)
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (onNavigateToStep && !createMode && !isCurrent) {
                          Object.assign(e.currentTarget.style, {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                          })
                        }
                      }}
                    >
                      <span>{index + 1}</span>
                      <span>{step.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Create Mode Info */}
          {createMode && (
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <span>✨</span>
                <span>Creating</span>
              </div>
              <div style={contentStyle}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Adding new step to {currentStage?.name || 'selected stage'}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ContextSidebar