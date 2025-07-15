import React from 'react'
import { Step, Flow } from '../../types'

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
  // Professional Input Styling System - Local copy for StepDetailsForm
  const inputBaseStyle = {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    color: '#374151',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    lineHeight: '1.5',
    width: '100%',
  }

  const inputDisabledStyle = {
    ...inputBaseStyle,
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
    borderColor: '#d1d5db',
  }

  const textareaStyle = {
    ...inputBaseStyle,
    minHeight: '4rem',
    resize: 'vertical' as const,
    lineHeight: '1.6',
  }

  // Enhanced Visual Hierarchy System - SESSION 3
  const sectionHeaderStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }

  const formSectionStyle = {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#fafbfc',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
  }

  const fieldGroupStyle = {
    marginBottom: '1.5rem',
  }

  return (
    <div>
      <h3 style={sectionHeaderStyle}>
        <span>{createMode ? '✨' : '⚙️'}</span>
        {createMode ? 'Task 1: Business Context' : 'Step Details'}
      </h3>

      {/* Stage Selection */}
      <div style={formSectionStyle}>
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          Business Stage <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <select
          value={isCreatingNewStage ? 'CREATE_NEW' : selectedStageId}
          onChange={e => onStageSelection(e.target.value)}
          style={{
            ...inputBaseStyle,
            cursor: 'pointer',
          }}
        >
          <option value="">Choose existing business stage...</option>
          {selectedFlow?.stages.map(stage => (
            <option key={stage.id} value={stage.id}>
              {stage.name} ({stage.steps.length} steps)
            </option>
          ))}
          {createMode && (
            <option value="CREATE_NEW">➕ Create New Business Stage</option>
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
            New Business Stage Name <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            value={newStageName}
            onChange={e => onNewStageNameChange(e.target.value)}
            placeholder="Enter business stage name..."
            style={inputBaseStyle}
          />
        </div>
      )}

      {/* Step Name */}
      <div style={fieldGroupStyle}>
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
        <input
          type="text"
          value={stepName}
          onChange={e => onStepNameChange(e.target.value)}
          placeholder="Enter step name..."
          disabled={!createMode && !isEditingStep}
          style={createMode || isEditingStep ? inputBaseStyle : inputDisabledStyle}
        />
      </div>

      {/* Step Description */}
      <div style={fieldGroupStyle}>
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
          disabled={!createMode && !isEditingStep}
          style={createMode || isEditingStep ? textareaStyle : { ...inputDisabledStyle, minHeight: '4rem', resize: 'vertical' as const, lineHeight: '1.6' }}
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          {createMode ? (
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
          ) : (
            <>
              {isEditingStep ? (
                <>
                  <button
                    onClick={onUpdateStepInfo}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={onCancelEdit}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    ✕ Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={onStartEdit}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ✏️ Edit Step Details
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StepDetailsForm