import React from 'react'
import { Flow, Step } from '../types'

/**
 * Props interface for the GridView component
 */
interface GridViewProps {
  /** The flow data to display in grid format */
  selectedFlow: Flow
  /** The currently selected step, if any */
  selectedStep: Step | null
  /** Handler for step click events */
  onStepClick: (step: Step) => void
}

/**
 * Enhanced Grid View Component
 *
 * Displays flow data in a responsive grid layout with clean, minimal design.
 * Features:
 * - Responsive grid layout that adapts to screen size
 * - Visual stage headers with gradient backgrounds
 * - Interactive step cards with hover effects
 * - User-friendly BOS methodology status indicators (CONTEXT-WHO-WHAT-ARTIFACTS)
 * - Services list with teaching relevance labels
 * - Single interaction model (click card for details)
 *
 * @param props - The component props
 * @returns JSX element representing the grid view
 */
const GridView: React.FC<GridViewProps> = ({
  selectedFlow,
  selectedStep,
  onStepClick,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        marginBottom: '2rem',
      }}
    >
      {selectedFlow.stages.map(stage => (
        <div
          key={stage.id}
          style={{
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Enhanced Stage Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: 'white',
              padding: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }}
            ></div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '600',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {stage.name}
            </h3>
            <div
              style={{
                fontSize: '0.75rem',
                opacity: 0.9,
                marginTop: '0.25rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {stage.steps.length} steps
            </div>
          </div>

          {/* Enhanced Stage Content */}
          <div style={{ padding: '1.5rem' }}>
            {stage.steps.map((step, stepIndex) => (
              <div
                key={step.id}
                onClick={() => onStepClick(step)}
                style={{
                  padding: '1rem',
                  border:
                    selectedStep?.id === step.id
                      ? '2px solid #3b82f6'
                      : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  marginBottom:
                    stepIndex < stage.steps.length - 1 ? '1rem' : '0',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedStep?.id === step.id ? '#eff6ff' : '#ffffff',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (selectedStep?.id !== step.id) {
                    e.currentTarget.style.backgroundColor = '#f8fafc'
                    e.currentTarget.style.borderColor = '#cbd5e1'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedStep?.id !== step.id) {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                    e.currentTarget.style.borderColor = '#e5e7eb'
                  }
                }}
              >
                {/* Step Header with Enhanced Visual Indicators */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      lineHeight: '1.4',
                    }}
                  >
                    {step.name}
                  </h4>
                </div>

                {/* Services List */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Services:
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {step.services.length > 0 ? (
                      step.services.map((service, serviceIdx) => (
                        <div
                          key={serviceIdx}
                          style={{ marginBottom: '0.25rem' }}
                        >
                          • {service.name}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontStyle: 'italic', color: '#9ca3af' }}>
                        No services defined
                      </div>
                    )}
                  </div>
                </div>

                {/* Simplified Methodology Status Icons */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    padding: '0.5rem 0',
                  }}
                >
                  {[
                    { key: 'context', icon: '📝', label: 'CONTEXT' },
                    { key: 'stakeholders', icon: '👥', label: 'WHO' },
                    { key: 'signals', icon: '📈', label: 'WHAT' },
                    { key: 'artifacts', icon: '📄', label: 'ARTIFACTS' },
                  ].map((item, idx) => {
                    const isComplete =
                      item.key === 'context'
                        ? Boolean(step.description?.trim())
                        : item.key === 'stakeholders'
                          ? (step.stakeholders?.length || 0) > 0
                          : item.key === 'signals'
                            ? (step.signals?.length || 0) > 0
                            : item.key === 'artifacts'
                              ? (step.signals?.length || 0) > 0 // Artifacts available if signals exist
                              : false
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          opacity: isComplete ? 1 : 0.3,
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.875rem',
                            filter: isComplete ? 'none' : 'grayscale(100%)',
                          }}
                        >
                          {item.icon}
                        </div>
                        <div
                          style={{
                            fontSize: '0.5rem',
                            color: isComplete ? '#059669' : '#9ca3af',
                            fontWeight: '500',
                            marginTop: '0.125rem',
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GridView
