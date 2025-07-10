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
import BusinessImpactPlaybook from './BusinessImpactPlaybook'
import { useMethodologyWorkflow, CompletionState } from '../hooks'

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
    updateDependencies,
    updateImpacts,
    updateTelemetryMappings,
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

  // Safe validation calls (only for existing steps)
  let validation = { isValid: false, score: 0, feedback: [], suggestions: [] }
  let completionStates = {
    stakeholders: 'blank' as CompletionState,
    dependencies: 'blank' as CompletionState,
    impacts: 'blank' as CompletionState,
    telemetryMappings: 'blank' as CompletionState,
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
  const autoSaveMethodology = () => {
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

  const stepTitles = [
    'Step Details', // Tab 0
    'WHO depends',
    'WHAT they expect',
    'WHAT breaks',
    'WHAT telemetry',
    'WHAT signals',
    'PLAYBOOK', // Tab 6
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

  // Income verification help content for each methodology step
  const getHelpContent = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return {
          title: 'Stakeholder Identification: Income Verification Example',
          content: (
            <div>
              <p>
                <strong>Scenario:</strong> Mortgage application income
                verification process
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>People Stakeholders:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Loan Applicant</strong> - Person applying for
                    mortgage (serves relationship)
                  </li>
                  <li>
                    <strong>Loan Officer</strong> - Reviews and processes
                    application (maintains relationship)
                  </li>
                  <li>
                    <strong>Underwriter</strong> - Final approval decision maker
                    (integrates relationship)
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
                    process (serves relationship)
                  </li>
                  <li>
                    <strong>Compliance Department</strong> - Regulatory
                    oversight (maintains relationship)
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
                    Third-party verification (integrates relationship)
                  </li>
                  <li>
                    <strong>Credit Bureau</strong> - Credit history provider
                    (integrates relationship)
                  </li>
                  <li>
                    <strong>Document Storage System</strong> - Secure document
                    management (maintains relationship)
                  </li>
                </ul>
              </div>
            </div>
          ),
        }
      case 2:
        return {
          title: 'Dependency Mapping: What Stakeholders Expect',
          content: (
            <div>
              <p>
                <strong>Scenario:</strong> Expectations from income verification
                step
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Stakeholder Expectations:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Loan Applicant expects:</strong> Fast, accurate
                    verification of stated income
                  </li>
                  <li>
                    <strong>Loan Officer expects:</strong> Complete income
                    documentation within 24 hours
                  </li>
                  <li>
                    <strong>Underwriter expects:</strong> Verified income meets
                    debt-to-income ratio requirements
                  </li>
                  <li>
                    <strong>Compliance expects:</strong> All verification
                    follows regulatory guidelines
                  </li>
                  <li>
                    <strong>Employment Service expects:</strong> Clear
                    verification requests with proper authorization
                  </li>
                </ul>
              </div>
              <p style={{ marginTop: '0.75rem' }}>
                <strong>Key Pattern:</strong> Each stakeholder has specific,
                measurable expectations from this business step.
              </p>
            </div>
          ),
        }
      case 3:
        return {
          title: 'Impact Analysis: What Breaks When Verification Fails',
          content: (
            <div>
              <p>
                <strong>Scenario:</strong> Income verification system failures
                and their business impacts
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Financial Impacts:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>Loan defaults due to incorrect income verification</li>
                  <li>
                    Processing delays causing additional costs per application
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Legal/Compliance Impacts:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    Regulatory violations for improper income verification
                  </li>
                  <li>Audit failures due to incomplete documentation</li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Operational Impacts:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    Manual verification backlog requiring additional staff
                  </li>
                  <li>Increased processing time affecting daily throughput</li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Customer Experience Impacts:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>Customer frustration from verification delays</li>
                  <li>Increased call center volume</li>
                </ul>
              </div>
              <p style={{ marginTop: '0.75rem' }}>
                <strong>Measurability:</strong> Financial and operational
                impacts are easily measurable in real-time.
              </p>
            </div>
          ),
        }
      case 4:
        return {
          title: 'Telemetry Mapping: Required Data Sources',
          content: (
            <div>
              <p>
                <strong>Scenario:</strong> Telemetry needed to detect income
                verification failures
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Application Telemetry:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Logs:</strong> Income verification request/response
                    logs
                  </li>
                  <li>
                    <strong>Metrics:</strong> Processing time per verification
                    step
                  </li>
                  <li>
                    <strong>Traces:</strong> End-to-end verification workflow
                    traces
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Business Process Telemetry:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Database:</strong> Application status changes and
                    timestamps
                  </li>
                  <li>
                    <strong>Events:</strong> Document upload/verification
                    completion events
                  </li>
                  <li>
                    <strong>Queues:</strong> Verification request queue depth
                    and processing rates
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>External System Telemetry:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>API Metrics:</strong> Employment verification
                    service response times and errors
                  </li>
                  <li>
                    <strong>Integration Health:</strong> Credit bureau
                    connection status
                  </li>
                </ul>
              </div>
              <p style={{ marginTop: '0.75rem' }}>
                <strong>Key Pattern:</strong> Map each impact to specific data
                sources that can detect when problems occur.
              </p>
            </div>
          ),
        }
      case 5:
        return {
          title: 'Signal Definitions: Observable Indicators',
          content: (
            <div>
              <p>
                <strong>Scenario:</strong> Signals that indicate income
                verification problems
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Business Signals:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Verification Completion Rate:</strong> &lt;95%
                    completions within 24 hours
                  </li>
                  <li>
                    <strong>Income Discrepancy Rate:</strong> &gt;5%
                    applications with income mismatches
                  </li>
                  <li>
                    <strong>Manual Review Rate:</strong> &gt;20% verifications
                    requiring manual intervention
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>Process Signals:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>Queue Backup:</strong> &gt;50 verification requests
                    waiting &gt;2 hours
                  </li>
                  <li>
                    <strong>Document Rejection Rate:</strong> &gt;10% income
                    documents rejected
                  </li>
                  <li>
                    <strong>Retry Rate:</strong> &gt;15% verifications requiring
                    multiple attempts
                  </li>
                </ul>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div>
                  <strong>System Signals:</strong>
                </div>
                <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                  <li>
                    <strong>API Error Rate:</strong> &gt;2% employment
                    verification API failures
                  </li>
                  <li>
                    <strong>Response Time:</strong> &gt;5 seconds average
                    verification processing time
                  </li>
                  <li>
                    <strong>Integration Health:</strong> &gt;1% credit bureau
                    connection failures
                  </li>
                </ul>
              </div>
              <p style={{ marginTop: '0.75rem' }}>
                <strong>Key Pattern:</strong> Define specific, measurable
                thresholds that trigger alerts when business objectives are at
                risk.
              </p>
            </div>
          ),
        }
      default:
        return { title: '', content: null }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Made darker to be more visible
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
          borderRadius: '0.5rem',
          padding: '2rem',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
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
                margin: '0 0 0.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              {createMode ? 'Create New Step' : 'Edit BOS Methodology'}
            </h2>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>
              {createMode
                ? `Step ${currentStep}: ${stepTitles[currentStep]}`
                : `${selectedStep?.name} - Step ${currentStep}: ${stepTitles[currentStep]}`}
            </p>
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

        {/* Step Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {stepTitles.map((title, index) => {
            // Map step index to completion state key - skip index 0 (Step Details)
            const stepKey =
              index === 0
                ? null
                : ([
                    'stakeholders',
                    'dependencies',
                    'impacts',
                    'telemetryMappings',
                    'signals',
                  ][index - 1] as keyof typeof completionStates)

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

            // Get the base status color
            const statusColor = getCompletionColor(completionState)

            // Calculate selection styling that preserves status visibility
            const getSelectionStyling = () => {
              if (!isCurrentStep) {
                return {
                  backgroundColor: statusColor,
                  border: '1px solid #e5e7eb',
                  color: '#374151',
                }
              }

              // Selected state: blend status color with selection indication
              return {
                backgroundColor: statusColor,
                border: '3px solid #3b82f6', // Bold blue border for selection
                color: completionState === 'blank' ? '#1f2937' : '#374151', // Darker text for better contrast
                boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)', // Subtle blue glow
                position: 'relative' as const,
                // Slight blue overlay to indicate selection without hiding status
                backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.15))`,
              }
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: isCurrentStep ? '600' : '400', // Bold text for selected
                  transition: 'all 0.2s ease', // Smooth transitions
                  ...getSelectionStyling(),
                }}
              >
                {index}. {title}
              </button>
            )
          })}
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Help Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => toggleHelpSection(currentStep)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#374151',
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
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 0.75rem 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#1f2937',
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
            <DependencyForm
              dependencies={methodologyState.dependencies}
              onChange={updateDependencies}
              stakeholders={methodologyState.stakeholders}
            />
          )}
          {currentStep === 3 && (
            <ImpactForm
              impacts={methodologyState.impacts}
              onChange={updateImpacts}
            />
          )}
          {currentStep === 4 && (
            <TelemetryForm
              telemetryMappings={methodologyState.telemetryMappings}
              onChange={updateTelemetryMappings}
              impacts={methodologyState.impacts}
            />
          )}
          {currentStep === 5 && (
            <SignalForm
              signals={methodologyState.signals}
              onChange={updateSignals}
              telemetryMappings={methodologyState.telemetryMappings}
              dependencies={methodologyState.dependencies}
            />
          )}
          {currentStep === 6 && (
            <BusinessImpactPlaybook
              step={localStep}
              flowName={selectedFlow?.name}
              stageName={
                selectedFlow?.stages.find(s => s.id === selectedStageId)?.name
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * StakeholderForm Component
 */
interface StakeholderFormProps {
  stakeholders: Stakeholder[]
  onChange: (stakeholders: Stakeholder[]) => void
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({
  stakeholders,
  onChange,
}) => {
  const [newStakeholder, setNewStakeholder] = useState<Stakeholder>({
    name: '',
    relationship: 'serves',
    type: 'people',
    role: '',
    description: '',
    contactInfo: '',
  })

  // Edit state management
  const [editingStakeholderId, setEditingStakeholderId] = useState<
    string | null
  >(null)
  const [editingStakeholder, setEditingStakeholder] =
    useState<Stakeholder | null>(null)

  const addStakeholder = () => {
    if (newStakeholder.name.trim()) {
      onChange([
        ...stakeholders,
        { ...newStakeholder, id: Date.now().toString() },
      ])
      setNewStakeholder({
        name: '',
        relationship: 'serves',
        type: 'people',
        role: '',
        description: '',
        contactInfo: '',
      })
    }
  }

  const removeStakeholder = (index: number) => {
    onChange(stakeholders.filter((_, i) => i !== index))
  }

  // Edit functions
  const startEditingStakeholder = (stakeholder: Stakeholder, index: number) => {
    setEditingStakeholderId(stakeholder.id || index.toString())
    setEditingStakeholder({ ...stakeholder })
  }

  const saveEditingStakeholder = () => {
    if (editingStakeholder && editingStakeholderId) {
      const updatedStakeholders = stakeholders.map((stakeholder, index) => {
        const id = stakeholder.id || index.toString()
        return id === editingStakeholderId ? editingStakeholder : stakeholder
      })
      onChange(updatedStakeholders)
      setEditingStakeholderId(null)
      setEditingStakeholder(null)
    }
  }

  const cancelEditingStakeholder = () => {
    setEditingStakeholderId(null)
    setEditingStakeholder(null)
  }

  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          fontWeight: '500',
        }}
      >
        Step 1: WHO depends on this step?
      </h3>

      {/* Add New Stakeholder */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Add Stakeholder
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <input
            type="text"
            placeholder="Stakeholder name"
            value={newStakeholder.name}
            onChange={e =>
              setNewStakeholder({ ...newStakeholder, name: e.target.value })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
          <input
            type="text"
            placeholder="Role/Position"
            value={newStakeholder.role}
            onChange={e =>
              setNewStakeholder({ ...newStakeholder, role: e.target.value })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <select
            value={newStakeholder.relationship}
            onChange={e =>
              setNewStakeholder({
                ...newStakeholder,
                relationship: e.target.value as
                  | 'serves'
                  | 'maintains'
                  | 'integrates',
              })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="serves">Serves</option>
            <option value="maintains">Maintains</option>
            <option value="integrates">Integrates</option>
          </select>
          <select
            value={newStakeholder.type}
            onChange={e =>
              setNewStakeholder({
                ...newStakeholder,
                type: e.target.value as 'people' | 'business' | 'vendor',
              })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="people">People</option>
            <option value="business">Business</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        <textarea
          placeholder="Description (optional)"
          value={newStakeholder.description}
          onChange={e =>
            setNewStakeholder({
              ...newStakeholder,
              description: e.target.value,
            })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            minHeight: '3rem',
            marginBottom: '0.75rem',
          }}
        />
        <button
          onClick={addStakeholder}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Add Stakeholder
        </button>
      </div>

      {/* Existing Stakeholders */}
      {stakeholders.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Current Stakeholders ({stakeholders.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {stakeholders.map((stakeholder, index) => {
              const stakeholderId = stakeholder.id || index.toString()
              const isEditing = editingStakeholderId === stakeholderId

              return (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: isEditing ? 'white' : '#fafafa',
                  }}
                >
                  {isEditing ? (
                    // Edit mode
                    <div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Stakeholder name"
                          value={editingStakeholder?.name || ''}
                          onChange={e =>
                            setEditingStakeholder(prev =>
                              prev ? { ...prev, name: e.target.value } : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Role/Title"
                          value={editingStakeholder?.role || ''}
                          onChange={e =>
                            setEditingStakeholder(prev =>
                              prev ? { ...prev, role: e.target.value } : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        />
                        <select
                          value={editingStakeholder?.relationship || 'serves'}
                          onChange={e =>
                            setEditingStakeholder(prev =>
                              prev
                                ? {
                                    ...prev,
                                    relationship: e.target.value as
                                      | 'serves'
                                      | 'maintains'
                                      | 'integrates',
                                  }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <option value="serves">Serves</option>
                          <option value="maintains">Maintains</option>
                          <option value="integrates">Integrates</option>
                        </select>
                        <select
                          value={editingStakeholder?.type || 'people'}
                          onChange={e =>
                            setEditingStakeholder(prev =>
                              prev
                                ? {
                                    ...prev,
                                    type: e.target.value as
                                      | 'people'
                                      | 'business'
                                      | 'vendor',
                                  }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <option value="people">People</option>
                          <option value="business">Business</option>
                          <option value="vendor">Vendor</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Description (optional)"
                        value={editingStakeholder?.description || ''}
                        onChange={e =>
                          setEditingStakeholder(prev =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                          minHeight: '3rem',
                          marginBottom: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={saveEditingStakeholder}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingStakeholder}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{ fontWeight: '500', fontSize: '0.875rem' }}
                        >
                          {stakeholder.name} - {stakeholder.role}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {stakeholder.relationship} • {stakeholder.type}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() =>
                            startEditingStakeholder(stakeholder, index)
                          }
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeStakeholder(index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * DependencyForm Component
 */
interface DependencyFormProps {
  dependencies: Dependency[]
  onChange: (dependencies: Dependency[]) => void
  stakeholders: Stakeholder[]
}

const DependencyForm: React.FC<DependencyFormProps> = ({
  dependencies,
  onChange,
  stakeholders,
}) => {
  const [newDependency, setNewDependency] = useState<Dependency>({
    expectation: '',
    description: '',
    stakeholderId: '',
  })

  // Edit state management
  const [editingDependencyId, setEditingDependencyId] = useState<string | null>(
    null
  )
  const [editingDependency, setEditingDependency] = useState<Dependency | null>(
    null
  )

  const addDependency = () => {
    if (newDependency.expectation.trim()) {
      onChange([
        ...dependencies,
        { ...newDependency, id: Date.now().toString() },
      ])
      setNewDependency({
        expectation: '',
        description: '',
        stakeholderId: '',
      })
    }
  }

  const removeDependency = (index: number) => {
    onChange(dependencies.filter((_, i) => i !== index))
  }

  // Edit functions
  const startEditingDependency = (dependency: Dependency, index: number) => {
    setEditingDependencyId(dependency.id || index.toString())
    setEditingDependency({ ...dependency })
  }

  const saveEditingDependency = () => {
    if (editingDependency && editingDependencyId) {
      const updatedDependencies = dependencies.map((dependency, index) => {
        const id = dependency.id || index.toString()
        return id === editingDependencyId ? editingDependency : dependency
      })
      onChange(updatedDependencies)
      setEditingDependencyId(null)
      setEditingDependency(null)
    }
  }

  const cancelEditingDependency = () => {
    setEditingDependencyId(null)
    setEditingDependency(null)
  }

  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          fontWeight: '500',
        }}
      >
        Step 2: WHAT do stakeholders expect from this step?
      </h3>

      {/* Add New Dependency */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Add Dependency
        </h4>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="What does the stakeholder expect?"
            value={newDependency.expectation}
            onChange={e =>
              setNewDependency({
                ...newDependency,
                expectation: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <select
            value={newDependency.stakeholderId}
            onChange={e =>
              setNewDependency({
                ...newDependency,
                stakeholderId: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="">Select stakeholder (optional)</option>
            {stakeholders.map(stakeholder => (
              <option key={stakeholder.id} value={stakeholder.id}>
                {stakeholder.name} - {stakeholder.role}
              </option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Description (optional)"
          value={newDependency.description}
          onChange={e =>
            setNewDependency({ ...newDependency, description: e.target.value })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            minHeight: '3rem',
            marginBottom: '0.75rem',
          }}
        />
        <button
          onClick={addDependency}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Add Dependency
        </button>
      </div>

      {/* Existing Dependencies */}
      {dependencies.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Current Dependencies ({dependencies.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {dependencies.map((dependency, index) => {
              const dependencyId = dependency.id || index.toString()
              const isEditing = editingDependencyId === dependencyId

              return (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: isEditing ? 'white' : '#fafafa',
                  }}
                >
                  {isEditing ? (
                    // Edit mode
                    <div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <select
                          value={editingDependency?.stakeholderId || ''}
                          onChange={e =>
                            setEditingDependency(prev =>
                              prev
                                ? { ...prev, stakeholderId: e.target.value }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <option value="">
                            Link to stakeholder (optional)
                          </option>
                          {stakeholders.map(stakeholder => (
                            <option key={stakeholder.id} value={stakeholder.id}>
                              {stakeholder.name} - {stakeholder.role}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="What do they expect?"
                          value={editingDependency?.expectation || ''}
                          onChange={e =>
                            setEditingDependency(prev =>
                              prev
                                ? { ...prev, expectation: e.target.value }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                        <textarea
                          placeholder="Description (optional)"
                          value={editingDependency?.description || ''}
                          onChange={e =>
                            setEditingDependency(prev =>
                              prev
                                ? { ...prev, description: e.target.value }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            resize: 'vertical',
                            minHeight: '3rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={saveEditingDependency}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingDependency}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{ fontWeight: '500', fontSize: '0.875rem' }}
                        >
                          {dependency.expectation}
                        </div>
                        {dependency.description && (
                          <div
                            style={{ fontSize: '0.75rem', color: '#6b7280' }}
                          >
                            {dependency.description}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() =>
                            startEditingDependency(dependency, index)
                          }
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeDependency(index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * ImpactForm Component
 */
interface ImpactFormProps {
  impacts: Impact[]
  onChange: (impacts: Impact[]) => void
}

const ImpactForm: React.FC<ImpactFormProps> = ({ impacts, onChange }) => {
  const [newImpact, setNewImpact] = useState<Impact>({
    category: 'financial',
    description: '',
    severity: 'medium',
    isMeasurable: false,
    measurabilityPattern: '',
  })

  // Edit state management
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null)
  const [editingImpact, setEditingImpact] = useState<Impact | null>(null)

  const addImpact = () => {
    if (newImpact.description.trim()) {
      onChange([...impacts, { ...newImpact, id: Date.now().toString() }])
      setNewImpact({
        category: 'financial',
        description: '',
        severity: 'medium',
        isMeasurable: false,
        measurabilityPattern: '',
      })
    }
  }

  const removeImpact = (index: number) => {
    onChange(impacts.filter((_, i) => i !== index))
  }

  // Edit functions
  const startEditingImpact = (impact: Impact, index: number) => {
    setEditingImpactId(impact.id || index.toString())
    setEditingImpact({ ...impact })
  }

  const saveEditingImpact = () => {
    if (editingImpact && editingImpactId) {
      const updatedImpacts = impacts.map((impact, index) => {
        const id = impact.id || index.toString()
        return id === editingImpactId ? editingImpact : impact
      })
      onChange(updatedImpacts)
      setEditingImpactId(null)
      setEditingImpact(null)
    }
  }

  const cancelEditingImpact = () => {
    setEditingImpactId(null)
    setEditingImpact(null)
  }

  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          fontWeight: '500',
        }}
      >
        Step 3: WHAT breaks when this step fails?
      </h3>

      {/* Add New Impact */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Add Impact
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <select
            value={newImpact.category}
            onChange={e =>
              setNewImpact({
                ...newImpact,
                category: e.target.value as
                  | 'financial'
                  | 'legal'
                  | 'operational'
                  | 'customer_experience',
              })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="financial">Financial</option>
            <option value="legal">Legal</option>
            <option value="operational">Operational</option>
            <option value="customer_experience">Customer Experience</option>
          </select>
          <select
            value={newImpact.severity}
            onChange={e =>
              setNewImpact({
                ...newImpact,
                severity: e.target.value as
                  | 'low'
                  | 'medium'
                  | 'high'
                  | 'critical',
              })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <textarea
          placeholder="Describe the impact when this step fails"
          value={newImpact.description}
          onChange={e =>
            setNewImpact({ ...newImpact, description: e.target.value })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            minHeight: '3rem',
            marginBottom: '0.75rem',
          }}
        />
        <div style={{ marginBottom: '0.75rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <input
              type="checkbox"
              checked={newImpact.isMeasurable}
              onChange={e =>
                setNewImpact({ ...newImpact, isMeasurable: e.target.checked })
              }
            />
            This impact is measurable in real-time
          </label>
        </div>
        {newImpact.isMeasurable && (
          <input
            type="text"
            placeholder="How can this impact be measured?"
            value={newImpact.measurabilityPattern}
            onChange={e =>
              setNewImpact({
                ...newImpact,
                measurabilityPattern: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '0.75rem',
            }}
          />
        )}
        <button
          onClick={addImpact}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Add Impact
        </button>
      </div>

      {/* Existing Impacts */}
      {impacts.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Current Impacts ({impacts.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {impacts.map((impact, index) => {
              const impactId = impact.id || index.toString()
              const isEditing = editingImpactId === impactId

              return (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: isEditing ? 'white' : '#fafafa',
                  }}
                >
                  {isEditing ? (
                    // Edit mode
                    <div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <select
                          value={editingImpact?.category || 'financial'}
                          onChange={e =>
                            setEditingImpact(prev =>
                              prev
                                ? {
                                    ...prev,
                                    category: e.target.value as
                                      | 'financial'
                                      | 'legal'
                                      | 'operational'
                                      | 'customer_experience',
                                  }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <option value="financial">Financial</option>
                          <option value="legal">Legal</option>
                          <option value="operational">Operational</option>
                          <option value="customer_experience">
                            Customer Experience
                          </option>
                        </select>
                        <select
                          value={editingImpact?.severity || 'medium'}
                          onChange={e =>
                            setEditingImpact(prev =>
                              prev
                                ? {
                                    ...prev,
                                    severity: e.target.value as
                                      | 'low'
                                      | 'medium'
                                      | 'high'
                                      | 'critical',
                                  }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Impact description"
                        value={editingImpact?.description || ''}
                        onChange={e =>
                          setEditingImpact(prev =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                          minHeight: '3rem',
                          marginBottom: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <input
                            type="checkbox"
                            checked={editingImpact?.isMeasurable || false}
                            onChange={e =>
                              setEditingImpact(prev =>
                                prev
                                  ? { ...prev, isMeasurable: e.target.checked }
                                  : null
                              )
                            }
                            style={{ marginRight: '0.5rem' }}
                          />
                          <span style={{ fontSize: '0.875rem' }}>
                            This impact is measurable
                          </span>
                        </label>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={saveEditingImpact}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingImpact}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{ fontWeight: '500', fontSize: '0.875rem' }}
                        >
                          {impact.description}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {impact.category} • {impact.severity} •{' '}
                          {impact.isMeasurable
                            ? 'Measurable'
                            : 'Not measurable'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditingImpact(impact, index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeImpact(index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * TelemetryForm Component
 */
interface TelemetryFormProps {
  telemetryMappings: TelemetryMappingItem[]
  onChange: (telemetryMappings: TelemetryMappingItem[]) => void
  impacts: Impact[]
}

const TelemetryForm: React.FC<TelemetryFormProps> = ({
  telemetryMappings,
  onChange,
  impacts,
}) => {
  const [newTelemetry, setNewTelemetry] = useState<TelemetryMappingItem>({
    impactId: '',
    telemetryRequired: '',
    dataSources: '',
    observableSignals: '',
  })

  // Edit state management
  const [editingTelemetryId, setEditingTelemetryId] = useState<string | null>(
    null
  )
  const [editingTelemetry, setEditingTelemetry] =
    useState<TelemetryMappingItem | null>(null)

  const addTelemetry = () => {
    if (newTelemetry.telemetryRequired.trim()) {
      onChange([
        ...telemetryMappings,
        { ...newTelemetry, id: Date.now().toString() },
      ])
      setNewTelemetry({
        impactId: '',
        telemetryRequired: '',
        dataSources: '',
        observableSignals: '',
      })
    }
  }

  const removeTelemetry = (index: number) => {
    onChange(telemetryMappings.filter((_, i) => i !== index))
  }

  // Edit functions
  const startEditingTelemetry = (
    telemetry: TelemetryMappingItem,
    index: number
  ) => {
    setEditingTelemetryId(telemetry.id || index.toString())
    setEditingTelemetry({ ...telemetry })
  }

  const saveEditingTelemetry = () => {
    if (editingTelemetry && editingTelemetryId) {
      const updatedTelemetryMappings = telemetryMappings.map(
        (telemetry, index) => {
          const id = telemetry.id || index.toString()
          return id === editingTelemetryId ? editingTelemetry : telemetry
        }
      )
      onChange(updatedTelemetryMappings)
      setEditingTelemetryId(null)
      setEditingTelemetry(null)
    }
  }

  const cancelEditingTelemetry = () => {
    setEditingTelemetryId(null)
    setEditingTelemetry(null)
  }

  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          fontWeight: '500',
        }}
      >
        Step 4: WHAT telemetry is needed to detect impacts?
      </h3>

      {/* Add New Telemetry */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Add Telemetry Mapping
        </h4>
        <div style={{ marginBottom: '0.75rem' }}>
          <select
            value={newTelemetry.impactId}
            onChange={e =>
              setNewTelemetry({ ...newTelemetry, impactId: e.target.value })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="">Select related impact (optional)</option>
            {impacts.map(impact => (
              <option key={impact.id} value={impact.id}>
                {impact.description} ({impact.category})
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="What telemetry is required?"
            value={newTelemetry.telemetryRequired}
            onChange={e =>
              setNewTelemetry({
                ...newTelemetry,
                telemetryRequired: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Data sources (logs, metrics, traces, etc.)"
            value={newTelemetry.dataSources}
            onChange={e =>
              setNewTelemetry({ ...newTelemetry, dataSources: e.target.value })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <textarea
          placeholder="Observable signals from this telemetry"
          value={newTelemetry.observableSignals}
          onChange={e =>
            setNewTelemetry({
              ...newTelemetry,
              observableSignals: e.target.value,
            })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            minHeight: '3rem',
            marginBottom: '0.75rem',
          }}
        />
        <button
          onClick={addTelemetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Add Telemetry
        </button>
      </div>

      {/* Existing Telemetry */}
      {telemetryMappings.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Current Telemetry Mappings ({telemetryMappings.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {telemetryMappings.map((telemetry, index) => {
              const telemetryId = telemetry.id || index.toString()
              const isEditing = editingTelemetryId === telemetryId

              return (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: isEditing ? 'white' : '#fafafa',
                  }}
                >
                  {isEditing ? (
                    // Edit mode
                    <div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <select
                          value={editingTelemetry?.impactId || ''}
                          onChange={e =>
                            setEditingTelemetry(prev =>
                              prev
                                ? { ...prev, impactId: e.target.value }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <option value="">Link to impact (optional)</option>
                          {impacts.map(impact => (
                            <option key={impact.id} value={impact.id}>
                              {impact.description.substring(0, 50)}
                              {impact.description.length > 50 ? '...' : ''}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Telemetry required"
                          value={editingTelemetry?.telemetryRequired || ''}
                          onChange={e =>
                            setEditingTelemetry(prev =>
                              prev
                                ? {
                                    ...prev,
                                    telemetryRequired: e.target.value,
                                  }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Data sources"
                          value={editingTelemetry?.dataSources || ''}
                          onChange={e =>
                            setEditingTelemetry(prev =>
                              prev
                                ? { ...prev, dataSources: e.target.value }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem',
                            boxSizing: 'border-box',
                          }}
                        />
                        <textarea
                          placeholder="Observable signals"
                          value={editingTelemetry?.observableSignals || ''}
                          onChange={e =>
                            setEditingTelemetry(prev =>
                              prev
                                ? {
                                    ...prev,
                                    observableSignals: e.target.value,
                                  }
                                : null
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            resize: 'vertical',
                            minHeight: '3rem',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={saveEditingTelemetry}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingTelemetry}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{ fontWeight: '500', fontSize: '0.875rem' }}
                        >
                          {telemetry.telemetryRequired}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Sources: {telemetry.dataSources}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() =>
                            startEditingTelemetry(telemetry, index)
                          }
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeTelemetry(index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * SignalForm Component
 */
interface SignalFormProps {
  signals: Signal[]
  onChange: (signals: Signal[]) => void
  telemetryMappings: TelemetryMappingItem[]
  dependencies: Dependency[]
}

const SignalForm: React.FC<SignalFormProps> = ({
  signals,
  onChange,
  telemetryMappings,
  dependencies,
}) => {
  const [newSignal, setNewSignal] = useState<Signal>({
    name: '',
    type: 'business',
    description: '',
    owner: '',
    metricName: '',
    threshold: '',
    alertConditions: [],
    observableUnit: '',
    dependencyId: '',
  })

  // Edit state management
  const [editingSignalId, setEditingSignalId] = useState<string | null>(null)
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null)

  const addSignal = () => {
    if (newSignal.name.trim()) {
      onChange([...signals, { ...newSignal, id: Date.now().toString() }])
      setNewSignal({
        name: '',
        type: 'business',
        description: '',
        owner: '',
        metricName: '',
        threshold: '',
        alertConditions: [],
        observableUnit: '',
        dependencyId: '',
      })
    }
  }

  const removeSignal = (index: number) => {
    onChange(signals.filter((_, i) => i !== index))
  }

  // Edit functions
  const startEditingSignal = (signal: Signal, index: number) => {
    setEditingSignalId(signal.id || index.toString())
    setEditingSignal({ ...signal })
  }

  const saveEditingSignal = () => {
    if (editingSignal && editingSignalId) {
      const updatedSignals = signals.map((signal, index) => {
        const id = signal.id || index.toString()
        return id === editingSignalId ? editingSignal : signal
      })
      onChange(updatedSignals)
      setEditingSignalId(null)
      setEditingSignal(null)
    }
  }

  const cancelEditingSignal = () => {
    setEditingSignalId(null)
    setEditingSignal(null)
  }

  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          fontWeight: '500',
        }}
      >
        Step 5: WHAT signals indicate problems?
      </h3>

      {/* Add New Signal */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Add Signal
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <input
            type="text"
            placeholder="Signal name"
            value={newSignal.name}
            onChange={e => setNewSignal({ ...newSignal, name: e.target.value })}
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
          <select
            value={newSignal.type}
            onChange={e =>
              setNewSignal({
                ...newSignal,
                type: e.target.value as
                  | 'business'
                  | 'process'
                  | 'system'
                  | 'kpi',
              })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            <option value="business">Business</option>
            <option value="kpi">KPI</option>
            <option value="process">Process</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Dependency Selector - Show only for KPI and Business signals */}
        {(newSignal.type === 'kpi' || newSignal.type === 'business') && (
          <div style={{ marginBottom: '0.75rem' }}>
            <select
              value={newSignal.dependencyId || ''}
              onChange={e =>
                setNewSignal({
                  ...newSignal,
                  dependencyId: e.target.value || '',
                })
              }
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              <option value="">Select dependency (optional)</option>
              {dependencies.map(dep => (
                <option key={dep.id} value={dep.id}>
                  {dep.expectation}
                </option>
              ))}
            </select>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <input
            type="text"
            placeholder="Signal owner"
            value={newSignal.owner}
            onChange={e =>
              setNewSignal({ ...newSignal, owner: e.target.value })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
          <input
            type="text"
            placeholder="Metric name"
            value={newSignal.metricName}
            onChange={e =>
              setNewSignal({ ...newSignal, metricName: e.target.value })
            }
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Alert threshold (e.g., >100ms, <95%)"
            value={newSignal.threshold}
            onChange={e =>
              setNewSignal({ ...newSignal, threshold: e.target.value })
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <textarea
          placeholder="Signal description"
          value={newSignal.description}
          onChange={e =>
            setNewSignal({ ...newSignal, description: e.target.value })
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            resize: 'vertical',
            minHeight: '3rem',
            marginBottom: '0.75rem',
          }}
        />
        <button
          onClick={addSignal}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Add Signal
        </button>
      </div>

      {/* Existing Signals */}
      {signals.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Current Signals ({signals.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {signals.map((signal, index) => {
              const signalId = signal.id || index.toString()
              const isEditing = editingSignalId === signalId

              return (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    backgroundColor: isEditing ? 'white' : '#fafafa',
                  }}
                >
                  {isEditing ? (
                    // Edit mode
                    <div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Signal name"
                          value={editingSignal?.name || ''}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev ? { ...prev, name: e.target.value } : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        />
                        <select
                          value={editingSignal?.type || 'business'}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev
                                ? {
                                    ...prev,
                                    type: e.target.value as
                                      | 'business'
                                      | 'process'
                                      | 'system'
                                      | 'kpi',
                                  }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          <option value="business">Business</option>
                          <option value="kpi">KPI</option>
                          <option value="process">Process</option>
                          <option value="system">System</option>
                        </select>

                        {/* Dependency Selector for editing - Show only for KPI and Business signals */}
                        {(editingSignal?.type === 'kpi' ||
                          editingSignal?.type === 'business') && (
                          <select
                            value={editingSignal?.dependencyId || ''}
                            onChange={e =>
                              setEditingSignal(prev =>
                                prev
                                  ? {
                                      ...prev,
                                      dependencyId: e.target.value || '',
                                    }
                                  : null
                              )
                            }
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            <option value="">
                              Select dependency (optional)
                            </option>
                            {dependencies.map(dep => (
                              <option key={dep.id} value={dep.id}>
                                {dep.expectation}
                              </option>
                            ))}
                          </select>
                        )}

                        <input
                          type="text"
                          placeholder="Owner"
                          value={editingSignal?.owner || ''}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev ? { ...prev, owner: e.target.value } : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Metric name"
                          value={editingSignal?.metricName || ''}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev
                                ? { ...prev, metricName: e.target.value }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Threshold"
                        value={editingSignal?.threshold || ''}
                        onChange={e =>
                          setEditingSignal(prev =>
                            prev ? { ...prev, threshold: e.target.value } : null
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          marginBottom: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={editingSignal?.description || ''}
                        onChange={e =>
                          setEditingSignal(prev =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          resize: 'vertical',
                          minHeight: '3rem',
                          marginBottom: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={saveEditingSignal}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingSignal}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{ fontWeight: '500', fontSize: '0.875rem' }}
                        >
                          {signal.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {signal.type} • {signal.owner} • {signal.threshold}
                          {signal.dependencyId && (
                            <span style={{ marginLeft: '0.5rem' }}>
                              🔗{' '}
                              {dependencies.find(
                                dep => dep.id === signal.dependencyId
                              )?.expectation || 'Linked'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditingSignal(signal, index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeSignal(index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * StepDetailsForm Component - Tab 0
 * Handles step creation and step info display
 */
interface StepDetailsFormProps {
  stepName: string
  stepDescription: string
  selectedStageId: string
  isCreatingNewStage: boolean
  newStageName: string
  selectedFlow?: Flow | undefined
  createMode: boolean
  localStep: Step | null
  isEditingStep: boolean
  onStepNameChange: (name: string) => void
  onStepDescriptionChange: (description: string) => void
  onStageSelection: (stageId: string) => void
  onNewStageNameChange: (name: string) => void
  onCreateStep: () => void
  onDeleteStep: () => void
  onStartEdit: () => void
  onUpdateStepInfo: () => void
  onCancelEdit: () => void
  showDeleteConfirm: boolean
  onShowDeleteConfirm: (show: boolean) => void
  canCreateStep: boolean
}

const StepDetailsForm: React.FC<StepDetailsFormProps> = ({
  stepName,
  stepDescription,
  selectedStageId,
  isCreatingNewStage,
  newStageName,
  selectedFlow,
  createMode,
  localStep,
  isEditingStep,
  onStepNameChange,
  onStepDescriptionChange,
  onStageSelection,
  onNewStageNameChange,
  onCreateStep,
  onDeleteStep,
  onStartEdit,
  onUpdateStepInfo,
  onCancelEdit,
  showDeleteConfirm,
  onShowDeleteConfirm,
  canCreateStep,
}) => {
  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1.125rem',
          fontWeight: '500',
        }}
      >
        {createMode ? 'Create New Step' : 'Step Details'}
      </h3>

      {/* Stage Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          Stage <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <select
          value={isCreatingNewStage ? 'CREATE_NEW' : selectedStageId}
          onChange={e => onStageSelection(e.target.value)}
          disabled={!createMode}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: createMode ? 'white' : '#f9fafb',
            color: '#374151',
            boxSizing: 'border-box',
            cursor: createMode ? 'pointer' : 'not-allowed',
          }}
        >
          <option value="">Choose existing stage...</option>
          {selectedFlow?.stages.map(stage => (
            <option key={stage.id} value={stage.id}>
              {stage.name} ({stage.steps.length} steps)
            </option>
          ))}
          {createMode && (
            <option value="CREATE_NEW">➕ Create New Stage</option>
          )}
        </select>
      </div>

      {/* New Stage Name Input */}
      {isCreatingNewStage && createMode && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
            }}
          >
            New Stage Name <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            value={newStageName}
            onChange={e => onNewStageNameChange(e.target.value)}
            placeholder="Enter stage name..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              color: '#374151',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Step Name */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          Step Name <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            value={stepName}
            onChange={e => onStepNameChange(e.target.value)}
            placeholder="Enter step name..."
            disabled={!createMode && !isEditingStep}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor:
                createMode || isEditingStep ? 'white' : '#f9fafb',
              color: '#374151',
              boxSizing: 'border-box',
            }}
          />
          {!createMode && (
            <>
              {isEditingStep ? (
                <>
                  <button
                    onClick={onUpdateStepInfo}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelEdit}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={onStartEdit}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Step Description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          Step Description (Optional)
        </label>
        <textarea
          value={stepDescription}
          onChange={e => onStepDescriptionChange(e.target.value)}
          placeholder="Describe what this step does..."
          rows={3}
          disabled={!createMode}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            backgroundColor: createMode ? 'white' : '#f9fafb',
            color: '#374151',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {!createMode && (
            <>
              <button
                onClick={() => onShowDeleteConfirm(true)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete Step
              </button>

              {/* Delete Confirmation Modal */}
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      padding: '2rem',
                      maxWidth: '400px',
                      textAlign: 'center',
                    }}
                  >
                    <h3 style={{ margin: '0 0 1rem 0', color: '#dc2626' }}>
                      Delete Step?
                    </h3>
                    <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
                      This action cannot be undone. All methodology data for
                      this step will be permanently deleted.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        onClick={() => onShowDeleteConfirm(false)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={onDeleteStep}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          {createMode && (
            <button
              onClick={onCreateStep}
              disabled={!canCreateStep}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: canCreateStep ? '#dc2626' : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: canCreateStep ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
              }}
            >
              ➕ Create Step
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MethodologyEditModal
