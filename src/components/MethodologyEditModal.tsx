import React, { useState, useEffect } from 'react'
import {
  Step,
  Flow,
  Stakeholder,
  Dependency,
  Impact,
  Signal,
  TelemetryMappingItem,
} from '../types'

// Phase 2 Feature Flag - Set to false to rollback to Phase 1 layout
const ENABLE_PHASE_2_LAYOUT = true // Enterprise 1400px layout enabled
import StepDetailsForm from './methodology/StepDetailsForm'
import StakeholderForm from './methodology/StakeholderForm'
import SignalForm from './methodology/SignalForm'
import Task4ArtifactView from './methodology/Task4ArtifactView'
import ContextSidebar from './ContextSidebar'
import * as styles from './methodology/methodologyStyles'
import { useMethodologyWorkflow, CompletionState } from '../hooks'
import {
  extractKeyTerms,
  extractContextGuidance,
  SIGNAL_OWNER_MAP,
} from '../utils/signalUtils'

/**
 * MethodologyEditModal component props interface
 */
interface MethodologyEditModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean
  /** The step being edited (null for create mode) */
  selectedStep: Step | null
  /** The flow for step creation (required in create mode) */
  selectedFlow?: Flow
  /** Create mode flag */
  createMode?: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Callback to save changes */
  onSave: (updatedStep: Step) => void
  /** Callback to create a new step (create mode) */
  onCreateStep?: (
    stepName: string,
    stepDescription: string,
    stageId: string,
    isNewStage: boolean,
    newStageName?: string
  ) => Step | null
  /** Callback to delete a step */
  onDeleteStep?: (stepId: string) => void
}

/**
 * MethodologyEditModal Component
 *
 * A unified modal interface for creating and editing steps with BOS methodology.
 * Tab 0: Step Details (create/edit step info)
 * Tabs 1-5: BOS Methodology (WHO, WHAT, BREAKS, TELEMETRY, SIGNALS)
 */
const MethodologyEditModal: React.FC<MethodologyEditModalProps> = ({
  isOpen,
  selectedStep,
  selectedFlow,
  createMode = false,
  onClose,
  onSave,
  onCreateStep,
  onDeleteStep,
}) => {
  const [currentStep, setCurrentStep] = useState(createMode ? 0 : 1)
  const [localStep, setLocalStep] = useState<Step | null>(null)
  const [expandedHelpStep, setExpandedHelpStep] = useState<number | null>(null)
  
  // Phase 2 state
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  // Step creation state (Tab 0)
  const [stepName, setStepName] = useState('')
  const [stepDescription, setStepDescription] = useState('')
  const [selectedStageId, setSelectedStageId] = useState('')
  const [isCreatingNewStage, setIsCreatingNewStage] = useState(false)
  const [newStageName, setNewStageName] = useState('')
  const [isEditingStep, setIsEditingStep] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    methodologyState,
    syncWithStep,
    updateStakeholders,
    updateSignals,
    getOverallValidation,
    getMethodologyCompletionStates,
  } = useMethodologyWorkflow(selectedStep)

  // Initialize local step state
  useEffect(() => {
    if (createMode) {
      // Reset form for create mode
      setCurrentStep(0)
      setStepName('')
      setStepDescription('')
      setSelectedStageId('')
      setIsCreatingNewStage(false)
      setNewStageName('')
      setLocalStep(null)
      setIsEditingStep(false)
    } else if (selectedStep) {
      // Initialize for edit mode
      setCurrentStep(1)
      setLocalStep({ ...selectedStep })
      setStepName(selectedStep.name)
      setStepDescription(selectedStep.description || '')
      setIsEditingStep(false)
      syncWithStep(selectedStep)
    }
  }, [selectedStep, createMode, syncWithStep])

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  // Auto-save when methodology state changes
  useEffect(() => {
    if (localStep && !createMode && selectedStep) {
      const updatedStep: Step = {
        ...localStep,
        name: stepName.trim(),
        description: stepDescription.trim(),
        stakeholders: methodologyState.stakeholders,
        dependencies: methodologyState.dependencies,
        impacts: methodologyState.impacts,
        telemetryMappings: methodologyState.telemetryMappings,
        signals: methodologyState.signals,
        score: 0, // Will be calculated properly below
      }
      setLocalStep(updatedStep)
      onSave(updatedStep)
    }
  }, [
    methodologyState.stakeholders,
    methodologyState.dependencies,
    methodologyState.impacts,
    methodologyState.telemetryMappings,
    methodologyState.signals,
    localStep?.id, // Only trigger when same step
    createMode,
  ])

  if (!isOpen) return null
  if (!createMode && (!selectedStep || !localStep)) return null
  if (createMode && !selectedFlow) return null

  // Import all styles from the shared styles module
  const {
    inputBaseStyle,
    inputDisabledStyle,
    textareaStyle,
    sectionHeaderStyle,
    subSectionHeaderStyle,
    formSectionStyle,
    fieldGroupStyle,
    helpSectionStyle,
    tabContainerStyle,
    getTabStyle,
    tabContentStyle,
    buttonBaseStyle,
    buttonPrimaryStyle,
    buttonSecondaryStyle,
    buttonOutlineStyle,
    buttonDangerStyle,
    selectStyle,
    getCompletionColor,
    breadcrumbContainerStyle,
    breadcrumbItemStyle,
    breadcrumbSeparatorStyle,
    breadcrumbSubtitleStyle,
    phase2ModalContainerStyle,
    phase2ContentLayoutStyle,
    phase2MainContentStyle,
  } = styles

  // Safe validation calls (only for existing steps)
  let validation = { isValid: false, score: 0, feedback: [], suggestions: [] }
  let completionStates = {
    stakeholders: 'blank' as CompletionState,
    impacts: 'blank' as CompletionState,
    signals: 'blank' as CompletionState,
  }

  if (localStep && !createMode) {
    try {
      validation = getOverallValidation()
      completionStates = getMethodologyCompletionStates()
    } catch (error) {
      console.error('Validation error:', error)
    }
  }

  // Handle step creation (Tab 0)
  const handleCreateStep = () => {
    if (!stepName.trim()) return
    if (isCreatingNewStage && !newStageName.trim()) return
    if (!isCreatingNewStage && !selectedStageId) return
    if (!onCreateStep) return

    const newStep = onCreateStep(
      stepName.trim(),
      stepDescription.trim(),
      selectedStageId,
      isCreatingNewStage,
      newStageName.trim()
    )

    if (newStep && typeof newStep === 'object') {
      setLocalStep(newStep)
      setCurrentStep(1) // Move to WHO tab after creation
    }
  }

  // Note: Step editing will be handled in methodology save for simplicity

  // Handle step deletion
  const handleDeleteStep = () => {
    if (localStep && onDeleteStep) {
      onDeleteStep(localStep.id)
      onClose()
    }
  }

  // Auto-save methodology changes
  const _autoSaveMethodology = () => {
    if (localStep) {
      const updatedStep: Step = {
        ...localStep,
        name: stepName.trim(),
        description: stepDescription.trim(),
        stakeholders: methodologyState.stakeholders,
        dependencies: methodologyState.dependencies,
        impacts: methodologyState.impacts,
        telemetryMappings: methodologyState.telemetryMappings,
        signals: methodologyState.signals,
        score: validation?.score || 0,
      }
      setLocalStep(updatedStep)
      onSave(updatedStep)
    }
  }

  // Handle stage selection
  const handleStageSelection = (value: string) => {
    if (value === 'CREATE_NEW') {
      setIsCreatingNewStage(true)
      setSelectedStageId('')
    } else {
      setIsCreatingNewStage(false)
      setSelectedStageId(value)
      setNewStageName('')
    }
  }

  // Tab index mapping for safer refactoring
  const _TAB_INDEX = {
    BUSINESS_CONTEXT: 0,
    STAKEHOLDERS: 1,
    SIGNALS: 2,
    PLAYBOOK: 3,
  }

  const stepTitles = [
    'Task 1: Business Context', // Tab 0
    'Task 2: Stakeholder Identification', // Tab 1
    'Task 3: Signal Definition', // Tab 2
    'Task 4: Artifact Generation', // Tab 3
  ]

  // Validation for step creation
  const canCreateStep = !!(
    stepName.trim() &&
    ((isCreatingNewStage && newStageName.trim()) ||
      (!isCreatingNewStage && selectedStageId))
  )

  // Check if step has been created (for tab navigation)
  // const stepCreated = createMode ? !!localStep : true

  // Toggle help section expansion (accordion behavior - only one at a time)
  const toggleHelpSection = (stepNumber: number) => {
    setExpandedHelpStep(expandedHelpStep === stepNumber ? null : stepNumber)
  }

  // Phase 2: Navigate to different step
  const handleStepNavigation = (step: Step) => {
    if (createMode) return // Don't navigate in create mode
    
    // Update local state to the new step
    setLocalStep({ ...step })
    setStepName(step.name)
    setStepDescription(step.description || '')
    setCurrentStep(1) // Default to first methodology tab
    
    // Notify parent component of the change
    onSave(step)
  }

  // Dynamic modal title based on current task
  const getModalTitle = (stepNumber: number) => {
    switch (stepNumber) {
      case 0:
        return 'Business Step Context'
      case 1:
        return 'Business Step Stakeholders'
      case 2:
        return 'Business Step Signals'
      case 3:
        return 'Business Step Artifacts'
      default:
        return 'Business Step Workflow'
    }
  }

  // Income verification help content for each methodology step
  const getHelpContent = (stepNumber: number) => {
    switch (stepNumber) {
      case 0:
        return {
          title: 'Task 1: Context - Describe the Business Step',
          content: (
            <div>
              <p>
                <strong>Purpose:</strong> Provide clear business context that
                will guide signal creation.
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                <strong>Example:</strong> "Retrieve and validate customer credit
                information from external credit bureaus to provide actionable
                data for loan officers within regulatory timeframes."
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                <strong>Key Elements to Include:</strong>
              </p>
              <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                <li>What the step does</li>
                <li>Who benefits from it</li>
                <li>Business value it provides</li>
                <li>Critical requirements or constraints</li>
              </ul>
            </div>
          ),
        }
      case 1:
        return {
          title: 'Task 2: Who - Identify Stakeholders',
          content: (
            <div>
              <p>
                <strong>Purpose:</strong> Identify who depends on this step
                working correctly.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>People Stakeholders:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Loan Applicant</strong> - Person applying for
                    mortgage
                  </li>
                  <li>
                    <strong>Loan Officer</strong> - Reviews and processes
                    application
                  </li>
                  <li>
                    <strong>Underwriter</strong> - Final approval decision maker
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Business Entity Stakeholders:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Mortgage Application</strong> - Core business
                    process
                  </li>
                  <li>
                    <strong>Compliance Department</strong> - Regulatory
                    oversight
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Vendor Stakeholders:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Employment Verification Service</strong> -
                    Third-party verification
                  </li>
                  <li>
                    <strong>Credit Bureau</strong> - Credit history provider
                  </li>
                  <li>
                    <strong>Document Storage System</strong> - Secure document
                    management
                  </li>
                </ul>
              </div>
            </div>
          ),
        }
      case 2:
        return {
          title: 'Task 3: What - Define Signals',
          content: (
            <div>
              <p>
                <strong>Purpose:</strong> Define measurable signals that
                indicate step health and stakeholder impact.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Business Signals (focus on people/entities):</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Customers with actionable credit data rate:</strong>{' '}
                    % of customers with valid credit data retrieved
                  </li>
                  <li>
                    <strong>Loan officer decision readiness:</strong> % of
                    applications with complete credit information
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Process Signals:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Credit check API success rate:</strong> % of
                    successful API calls
                  </li>
                  <li>
                    <strong>Credit data processing time:</strong> Average time
                    to process credit response
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>System Signals:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Credit service latency:</strong> Response time from
                    credit bureau
                  </li>
                  <li>
                    <strong>Service availability:</strong> Uptime of credit
                    check service
                  </li>
                </ul>
              </div>
            </div>
          ),
        }
      case 3:
        return {
          title: 'Task 4: Artifacts - Generate Outputs',
          content: (
            <div>
              <p>
                <strong>Purpose:</strong> Generate three artifacts that complete
                the BOS methodology workflow.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <p>Task 4 generates three complementary artifacts:</p>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>📄 Business Impact Playbook</strong> - Comprehensive
                    documentation of business context, signals, and response
                    procedures
                  </li>
                  <li>
                    <strong>📊 Dashboard Requirements</strong> - Technical
                    specifications for implementing monitoring dashboards
                  </li>
                  <li>
                    <strong>📈 Dashboard Visual</strong> - Mock-up preview of
                    what the monitoring dashboard will look like
                  </li>
                </ul>
                <p
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                  }}
                >
                  These artifacts provide a complete handoff package for your
                  organizational telemetry strategy team.
                </p>
              </div>
            </div>
          ),
        }
      default:
        return { title: '', content: null }
    }
  }

  // Render main content (shared between Phase 1 and Phase 2)
  const renderMainContent = () => (
    <>
      {/* Phase 1 Enhancement: Simplified Breadcrumb Navigation */}
      <div style={breadcrumbContainerStyle}>
        <div style={breadcrumbItemStyle}>
          <span>🏢</span>
          <span>{selectedFlow?.name || 'Business Flow'}</span>
        </div>
        <span style={breadcrumbSeparatorStyle}>→</span>
        <div style={breadcrumbItemStyle}>
          <span>📋</span>
          <span>{selectedFlow?.stages.find(s => s.id === selectedStageId)?.name || 
                 selectedFlow?.stages.find(s => s.steps.some(step => step.id === selectedStep?.id))?.name || 
                 'Business Stage'}</span>
        </div>
        <span style={breadcrumbSeparatorStyle}>→</span>
        <div style={breadcrumbItemStyle}>
          <span>{createMode ? '✨' : '📄'}</span>
          <span>{createMode ? 'New Business Step' : (selectedStep?.name || 'Business Step')}</span>
        </div>
        <div style={breadcrumbSubtitleStyle}>
          Business Step Context and Methodology Workflow
        </div>
      </div>

      {/* Step Navigation */}
      <div style={tabContainerStyle}>
        {stepTitles.map((title, index) => {
          // Map step index to completion state key - skip index 0 (Step Details)
          const stepKey =
            index === 0
              ? null
              : (['stakeholders', 'signals'][
                  index - 1
                ] as keyof typeof completionStates)

          // Tab 0 validation: check if step details are complete
          const getTab0CompletionState = (): CompletionState => {
            if (!localStep) return 'blank'

            const hasStage = createMode ? !!selectedStageId : true // In edit mode, stage is already set
            const hasName = !!localStep.name && localStep.name.trim() !== ''
            const hasDescription =
              !!localStep.description && localStep.description.trim() !== ''

            if (hasStage && hasName && hasDescription) {
              return 'complete'
            } else if (hasStage || hasName || hasDescription) {
              return 'partial'
            } else {
              return 'blank'
            }
          }

          const completionState = stepKey
            ? completionStates[stepKey]
            : getTab0CompletionState()
          const isCurrentStep = currentStep === index

          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              style={getTabStyle(isCurrentStep, completionState)}
              onMouseEnter={(e) => {
                if (!isCurrentStep) {
                  Object.assign(e.currentTarget.style, {
                    backgroundColor: '#f8fafc',
                    color: '#374151',
                    borderBottom: '3px solid #94a3b8',
                    transform: 'translateY(-1px)',
                  })
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentStep) {
                  Object.assign(e.currentTarget.style, {
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    borderBottom: '3px solid transparent',
                    transform: 'translateY(0)',
                  })
                }
              }}
            >
              {title}
            </button>
          )
        })}
      </div>

      {/* Step Content */}
      <div style={tabContentStyle}>
        {/* Help Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => toggleHelpSection(currentStep)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '1rem 1.5rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              color: '#475569',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#e2e8f0',
                borderColor: '#94a3b8',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
              })
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#f1f5f9',
                borderColor: '#cbd5e1',
                transform: 'translateY(0)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              })
            }}
          >
            <span>📖</span>
            <span>Learn BOS Methodology: Income Verification Example</span>
            <span style={{ marginLeft: 'auto' }}>
              {expandedHelpStep === currentStep ? '▼' : '▶'}
            </span>
          </button>

          {expandedHelpStep === currentStep && (
            <div
              style={{
                ...helpSectionStyle,
                marginTop: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
            >
              <h4
                style={{
                  ...subSectionHeaderStyle,
                  margin: '0 0 0.75rem 0',
                  color: '#dc2626',
                }}
              >
                {getHelpContent(currentStep).title}
              </h4>
              {getHelpContent(currentStep).content}
            </div>
          )}
        </div>

        {currentStep === 0 && (
          <StepDetailsForm
            stepName={stepName}
            stepDescription={stepDescription}
            selectedStageId={selectedStageId}
            isCreatingNewStage={isCreatingNewStage}
            newStageName={newStageName}
            selectedFlow={selectedFlow}
            createMode={createMode}
            localStep={localStep}
            isEditingStep={isEditingStep}
            onStepNameChange={setStepName}
            onStepDescriptionChange={setStepDescription}
            onStageSelection={handleStageSelection}
            onNewStageNameChange={setNewStageName}
            onCreateStep={handleCreateStep}
            onDeleteStep={handleDeleteStep}
            onStartEdit={() => setIsEditingStep(true)}
            onUpdateStepInfo={() => {
              // Save step name/description changes
              if (localStep) {
                const updatedStep = {
                  ...localStep,
                  name: stepName,
                  description: stepDescription,
                }
                setLocalStep(updatedStep)
                // Use the existing save handler - it should update flows and stay open
                onSave(updatedStep)
              }
              setIsEditingStep(false)
            }}
            onCancelEdit={() => setIsEditingStep(false)}
            showDeleteConfirm={showDeleteConfirm}
            onShowDeleteConfirm={setShowDeleteConfirm}
            canCreateStep={canCreateStep}
          />
        )}
        {currentStep === 1 && (
          <StakeholderForm
            stakeholders={methodologyState.stakeholders}
            onChange={updateStakeholders}
          />
        )}
        {currentStep === 2 && (
          <SignalForm
            signals={methodologyState.signals}
            onChange={updateSignals}
            telemetryMappings={methodologyState.telemetryMappings}
            dependencies={methodologyState.dependencies}
            businessContext={
              createMode ? stepDescription : localStep?.description || ''
            }
          />
        )}
        {currentStep === 3 && (
          <Task4ArtifactView
            step={localStep}
            flowName={selectedFlow?.name}
            stageName={
              selectedFlow?.stages.find(s => s.id === selectedStageId)?.name
            }
          />
        )}
      </div>
    </>
  )

  // Conditional layout based on feature flag
  if (ENABLE_PHASE_2_LAYOUT) {
    // Phase 2: Sidebar Layout (1000px width)
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={phase2ModalContainerStyle}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '2rem 2rem 0 2rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <h2
                style={{
                  margin: '0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                }}
              >
                {createMode ? 'Create New Business Step' : getModalTitle(currentStep)}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.25rem',
                lineHeight: '1',
              }}
            >
              ×
            </button>
          </div>

          {/* Content Layout */}
          <div style={phase2ContentLayoutStyle}>
            {/* Sidebar */}
            <ContextSidebar
              flow={selectedFlow!}
              currentStep={localStep}
              isExpanded={sidebarExpanded}
              onToggle={() => setSidebarExpanded(!sidebarExpanded)}
              onNavigateToStep={handleStepNavigation}
              createMode={createMode}
              selectedStageId={selectedStageId}
            />

            {/* Main Content */}
            <div style={phase2MainContentStyle}>
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Phase 1: Original Modal Layout (800px width)
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h2
              style={{
                margin: '0',
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              {createMode ? 'Create New Business Step' : getModalTitle(currentStep)}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem',
              lineHeight: '1',
            }}
          >
            ×
          </button>
        </div>

        {/* Phase 1 Content */}
        {renderMainContent()}
      </div>
    </div>
  )
}

export default MethodologyEditModal
