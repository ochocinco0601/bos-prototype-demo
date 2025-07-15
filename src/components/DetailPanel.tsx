import React, { useEffect, useState } from 'react'
import { Step } from '../types'
import { useMethodologyWorkflow, CompletionState } from '../hooks'
import MethodologyEditModal from './MethodologyEditModal'
import PlaybookGenerationModal from './PlaybookGenerationModal'
import { PlaybookGenerator } from '../data/playbookGenerator'

/**
 * DetailPanel component props interface
 */
interface DetailPanelProps {
  /** Controls the visibility of the detail panel */
  isOpen: boolean
  /** The step to display details for */
  selectedStep: Step | null
  /** Callback to close the detail panel */
  onClose: () => void
  /** Callback to save methodology changes */
  onSaveMethodology?: (updatedStep: Step) => void
  /** Callback to delete the current step */
  onDeleteStep?: (stepId: string) => void
  /** Callback to edit step name and description */
  onEditStep?: (
    stepId: string,
    newName: string,
    newDescription?: string
  ) => void
}

/**
 * DetailPanel Component
 *
 * A detailed view panel that displays comprehensive information about a selected step.
 * Shows stakeholders, dependencies, services, and methodology status in a contextual bottom panel.
 *
 * @param props - The component props
 * @returns JSX element for the detail panel
 */
const DetailPanel: React.FC<DetailPanelProps> = ({
  isOpen,
  selectedStep,
  onClose,
  onSaveMethodology,
  onDeleteStep,
  onEditStep,
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPlaybookModal, setShowPlaybookModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditingStep, setIsEditingStep] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const {
    getOverallValidation,
    getStakeholderValidation,
    getImpactValidation,
    getMethodologyCompletionStates,
    syncWithStep,
  } = useMethodologyWorkflow(selectedStep)

  // Sync methodology state when selected step changes
  useEffect(() => {
    if (selectedStep) {
      syncWithStep(selectedStep)
    }
  }, [selectedStep, syncWithStep])

  if (!isOpen || !selectedStep) return null

  // Helper function to get background color for 3-state completion
  const getCompletionColor = (state: CompletionState) => {
    switch (state) {
      case 'blank':
        return '#f3f4f6' // Faded gray
      case 'partial':
        return '#FF8C00' // Orange
      case 'complete':
        return '#10B981' // Green
      default:
        return '#f3f4f6'
    }
  }

  // Safe validation calls with error handling
  let overallValidation,
    stakeholderValidation,
    impactValidation,
    completionStates
  try {
    overallValidation = getOverallValidation()
    stakeholderValidation = getStakeholderValidation()
    impactValidation = getImpactValidation()
    completionStates = getMethodologyCompletionStates()
  } catch (error) {
    console.error('DetailPanel validation error:', error)
    // Fallback validation results
    overallValidation = {
      isValid: false,
      score: 0,
      feedback: ['Error loading validation'],
      suggestions: [],
    }
    stakeholderValidation = {
      isValid: false,
      score: 0,
      feedback: [],
      suggestions: [],
    }
    impactValidation = {
      isValid: false,
      score: 0,
      feedback: [],
      suggestions: [],
    }
    completionStates = {
      stakeholders: 'blank',
      dependencies: 'blank',
      impacts: 'blank',
      telemetryMappings: 'blank',
      signals: 'blank',
    }
  }

  // Generate playbook data
  const playbookGenerator = new PlaybookGenerator()
  const playbookData = playbookGenerator.generatePlaybook(selectedStep)

  // Handle step deletion with confirmation
  const handleDeleteConfirm = () => {
    if (selectedStep && onDeleteStep) {
      onDeleteStep(selectedStep.id)
      setShowDeleteConfirm(false)
      onClose() // Close detail panel after deletion
    }
  }

  // Handle step editing
  const handleStartEdit = () => {
    if (selectedStep) {
      setEditName(selectedStep.name)
      setEditDescription(selectedStep.description || '')
      setIsEditingStep(true)
    }
  }

  const handleSaveEdit = () => {
    if (selectedStep && onEditStep && editName.trim()) {
      onEditStep(selectedStep.id, editName, editDescription)
      setIsEditingStep(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingStep(false)
    setEditName('')
    setEditDescription('')
  }

  // Handle clicking on methodology step icons to navigate to incomplete steps
  const handleMethodologyStepClick = (_stepNumber: number) => {
    setShowEditModal(true)
    // TODO: We could set the current step in the modal here
    // For now, the modal will open and user can navigate normally
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem 2rem',
        zIndex: 50,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ flex: 1 }}>
          {isEditingStep ? (
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
                placeholder="Step name"
              />
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  minHeight: '80px',
                  resize: 'vertical',
                }}
                placeholder="Step description (optional)"
              />
            </div>
          ) : (
            <>
              <h3
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                }}
              >
                {selectedStep.name}
              </h3>
              {selectedStep.description && (
                <p
                  style={{
                    margin: '0 0 1rem 0',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                  }}
                >
                  {selectedStep.description}
                </p>
              )}
            </>
          )}

          <div
            style={{
              display: 'flex',
              gap: '2rem',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <span style={{ fontWeight: '500' }}>Stakeholders:</span>{' '}
              {selectedStep.stakeholders?.length || 0}
            </div>
            <div>
              <span style={{ fontWeight: '500' }}>Services:</span>{' '}
              {selectedStep.services.length}
            </div>
          </div>
        </div>

        <div
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
        >
          <button
            onClick={() => setShowEditModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
            title="Edit BOS methodology for this step"
          >
            📝 Edit Methodology
          </button>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor:
                (selectedStep.signals?.length || 0) > 0 ? '#10b981' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor:
                (selectedStep.signals?.length || 0) > 0
                  ? 'pointer'
                  : 'not-allowed',
            }}
            disabled={(selectedStep.signals?.length || 0) === 0}
            title={
              (selectedStep.signals?.length || 0) === 0
                ? 'No signals defined yet'
                : 'View signals (Phase 3)'
            }
          >
            📊 View Signals
          </button>
          <button
            onClick={() => setShowPlaybookModal(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
            title="Generate Business Impact Playbook"
          >
            📋 Generate Playbook
          </button>
          {onEditStep && (
            <>
              {isEditingStep ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editName.trim()}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: editName.trim() ? '#10b981' : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: editName.trim() ? 'pointer' : 'not-allowed',
                    }}
                    title="Save step changes"
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                    title="Cancel editing"
                  >
                    ✖️ Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStartEdit}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                  title="Edit step name and description"
                >
                  ✏️ Edit Step
                </button>
              )}
            </>
          )}
          {onDeleteStep && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
              title="Delete this step permanently"
            >
              🗑️ Delete Step
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
      >
        {/* Left Column - Stakeholders & Dependencies */}
        <div style={{ space: '1.5rem' }}>
          {/* Stakeholders */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              👥 Stakeholders
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {(selectedStep.stakeholders || []).map((stakeholder, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>
                      {stakeholder.type === 'people'
                        ? '👤'
                        : stakeholder.type === 'business'
                          ? '🏢'
                          : stakeholder.type === 'vendor'
                            ? '🔗'
                            : '👤'}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {stakeholder.name}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {stakeholder.role}
                  </div>
                  {stakeholder.description && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {stakeholder.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor:
                          stakeholder.type === 'people'
                            ? '#dbeafe'
                            : stakeholder.type === 'business'
                              ? '#dcfce7'
                              : stakeholder.type === 'vendor'
                                ? '#e0e7ff'
                                : '#f3f4f6',
                        color:
                          stakeholder.type === 'people'
                            ? '#1e40af'
                            : stakeholder.type === 'business'
                              ? '#166534'
                              : stakeholder.type === 'vendor'
                                ? '#5b21b6'
                                : '#374151',
                      }}
                    >
                      {stakeholder.type}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: '0.75rem',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor:
                          stakeholder.relationship === 'serves'
                            ? '#fef3c7'
                            : stakeholder.relationship === 'maintains'
                              ? '#ddd6fe'
                              : stakeholder.relationship === 'integrates'
                                ? '#fce7f3'
                                : '#f3f4f6',
                        color:
                          stakeholder.relationship === 'serves'
                            ? '#92400e'
                            : stakeholder.relationship === 'maintains'
                              ? '#5b21b6'
                              : stakeholder.relationship === 'integrates'
                                ? '#be185d'
                                : '#374151',
                      }}
                    >
                      {stakeholder.relationship}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <h4
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              🔗 Dependencies
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {(Array.isArray(selectedStep.dependencies)
                ? selectedStep.dependencies
                : []
              ).map((dependency, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {dependency.expectation}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {dependency.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Services & Methodology Status */}
        <div style={{ space: '1.5rem' }}>
          {/* Services */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              ⚙️ Services
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {selectedStep.services.map((service, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {service.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {service.technical_description}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      fontFamily: 'monospace',
                    }}
                  >
                    {service.technical_flow}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology Status */}
          <div>
            <h4
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              📊 Methodology Status
            </h4>
            <div
              style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  onClick={() => handleMethodologyStepClick(1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    backgroundColor: getCompletionColor(
                      completionStates.stakeholders
                    ),
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                  title="Click to edit stakeholders"
                >
                  👥
                </div>
                <div>Step 1: WHO depends</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  onClick={() => handleMethodologyStepClick(2)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    backgroundColor: getCompletionColor(
                      completionStates.dependencies
                    ),
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                  title="Click to edit dependencies"
                >
                  🔗
                </div>
                <div>Step 2: WHAT they expect</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  onClick={() => handleMethodologyStepClick(3)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    backgroundColor: getCompletionColor(
                      completionStates.impacts
                    ),
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                  title="Click to edit impacts"
                >
                  💥
                </div>
                <div>Step 3: WHAT breaks</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  onClick={() => handleMethodologyStepClick(4)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    backgroundColor: getCompletionColor(
                      completionStates.telemetryMappings
                    ),
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                  title="Click to edit telemetry"
                >
                  📊
                </div>
                <div>Step 4: WHAT telemetry</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  onClick={() => handleMethodologyStepClick(5)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    backgroundColor: getCompletionColor(
                      completionStates.signals
                    ),
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                  title="Click to edit signals"
                >
                  🚨
                </div>
                <div>Step 5: WHAT signals</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Validation Feedback */}
      {overallValidation &&
        (overallValidation.feedback.length > 0 ||
          overallValidation.suggestions.length > 0) && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor:
                overallValidation.score >= 60 ? '#ecfdf5' : '#fef3c7',
              border: `1px solid ${overallValidation.score >= 60 ? '#d1fae5' : '#fcd34d'}`,
              borderRadius: '0.5rem',
            }}
          >
            <h4
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1rem',
                fontWeight: '500',
                color: overallValidation.score >= 60 ? '#065f46' : '#92400e',
              }}
            >
              {overallValidation.score >= 60 ? '✅' : '💡'} BOS Methodology
              Validation
            </h4>

            {overallValidation.suggestions.length > 0 && (
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Suggestions:</strong>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1rem' }}>
                  {overallValidation.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stakeholderValidation.suggestions.length > 0 && (
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '0.5rem',
                }}
              >
                <strong>Stakeholder Insights:</strong>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1rem' }}>
                  {stakeholderValidation.suggestions.map(
                    (suggestion, index) => (
                      <li key={index} style={{ marginBottom: '0.25rem' }}>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {impactValidation.suggestions.length > 0 && (
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '0.5rem',
                }}
              >
                <strong>Impact Measurability:</strong>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1rem' }}>
                  {impactValidation.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      {/* Methodology Edit Modal */}
      <MethodologyEditModal
        isOpen={showEditModal}
        selectedStep={selectedStep}
        onClose={() => setShowEditModal(false)}
        onSave={updatedStep => {
          if (onSaveMethodology) {
            onSaveMethodology(updatedStep)
          }
          setShowEditModal(false)
        }}
      />

      {/* Playbook Generation Modal */}
      <PlaybookGenerationModal
        isOpen={showPlaybookModal}
        onClose={() => setShowPlaybookModal(false)}
        playbookData={playbookData}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 1rem 0',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#dc2626',
              }}
            >
              🗑️ Delete Step
            </h3>
            <p
              style={{
                margin: '0 0 1.5rem 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: '1.5',
              }}
            >
              Are you sure you want to delete "{selectedStep?.name}"? This
              action cannot be undone and will permanently remove all
              methodology data for this step.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailPanel
