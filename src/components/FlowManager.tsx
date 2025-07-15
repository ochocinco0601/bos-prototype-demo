import React from 'react'
import { Flow } from '../types'
import * as styles from './methodology/methodologyStyles'

/**
 * FlowManager component props interface
 */
interface FlowManagerProps {
  /** Controls the visibility of the flow manager modal */
  isOpen: boolean
  /** Callback to close the flow manager modal */
  onClose: () => void
  /** Array of all available flows */
  flows: Flow[]
  /** Currently selected flow ID */
  selectedFlowId: string | null
  /** New flow name input value */
  newFlowName: string
  /** Callback when new flow name changes */
  onNewFlowNameChange: (name: string) => void
  /** New flow description input value */
  newFlowDescription: string
  /** Callback when new flow description changes */
  onNewFlowDescriptionChange: (description: string) => void
  /** Callback to create a new flow */
  onCreateFlow: () => void
  /** Callback to select a flow */
  onSelectFlow: (flowId: string) => void
  /** Callback to duplicate a flow */
  onDuplicateFlow: (flow: Flow) => void
  /** Callback to delete a flow */
  onDeleteFlow: (flowId: string) => void
  /** Callback to edit a flow */
  onEditFlow: (flowId: string, newName: string, newDescription?: string) => void
  /** Callback to reload test data */
  onReloadTestData: () => void
}

/**
 * FlowManager Component
 *
 * A modal dialog for managing business flows including:
 * - Creating new flows
 * - Selecting existing flows
 * - Duplicating flows
 * - Deleting flows
 *
 * @param props - The component props
 * @returns JSX element for the flow manager modal
 */
const FlowManager: React.FC<FlowManagerProps> = ({
  isOpen,
  onClose,
  flows,
  selectedFlowId,
  newFlowName,
  onNewFlowNameChange,
  newFlowDescription,
  onNewFlowDescriptionChange,
  onCreateFlow,
  onSelectFlow,
  onDuplicateFlow,
  onDeleteFlow,
  onEditFlow,
  onReloadTestData,
}) => {
  const [editingFlowId, setEditingFlowId] = React.useState<string | null>(null)
  const [editName, setEditName] = React.useState('')
  const [editDescription, setEditDescription] = React.useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [flowToDelete, setFlowToDelete] = React.useState<Flow | null>(null)

  const handleStartEdit = (flow: Flow) => {
    setEditingFlowId(flow.id)
    setEditName(flow.name)
    setEditDescription(flow.description || '')
  }

  const handleSaveEdit = (flowId: string) => {
    if (editName.trim()) {
      onEditFlow(flowId, editName, editDescription)
      setEditingFlowId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingFlowId(null)
    setEditName('')
    setEditDescription('')
  }

  const handleStartDelete = (flow: Flow) => {
    setFlowToDelete(flow)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (flowToDelete) {
      onDeleteFlow(flowToDelete.id)
      setShowDeleteConfirm(false)
      setFlowToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setFlowToDelete(null)
  }

  if (!isOpen) return null

  // Professional Styling System - Based on MethodologyEditModal Design
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

  const textareaStyle = {
    ...inputBaseStyle,
    minHeight: '4rem',
    resize: 'vertical' as const,
    lineHeight: '1.6',
  }

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

  // Use shared button styles from methodology styles
  const {
    buttonBaseStyle,
    buttonPrimaryStyle,
    buttonSecondaryStyle,
    buttonOutlineStyle,
    buttonDangerStyle,
    buttonWarningStyle,
    buttonDisabledStyle,
    buttonSmallStyle,
  } = styles

  return (
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
        zIndex: 200,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h3 style={sectionHeaderStyle}>
          💼 Business Flow Management
        </h3>

        {/* Create New Flow */}
        <div style={formSectionStyle}>
          <h4 style={{
            ...sectionHeaderStyle,
            fontSize: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
          }}>
            ✨ Create New Business Flow
          </h4>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
            }}>
              Business Flow Name *
            </label>
            <input
              type="text"
              placeholder="Enter flow name (e.g., Loan Processing)"
              value={newFlowName}
              onChange={e => onNewFlowNameChange(e.target.value)}
              style={inputBaseStyle}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
            }}>
              Flow Description (Optional)
            </label>
            <textarea
              placeholder="Describe the business flow purpose and scope"
              value={newFlowDescription}
              onChange={e => onNewFlowDescriptionChange(e.target.value)}
              style={textareaStyle}
            />
          </div>
          <button
            onClick={onCreateFlow}
            disabled={!newFlowName.trim()}
            style={newFlowName.trim() ? buttonSecondaryStyle : buttonDisabledStyle}
          >
            ✨ Create Business Flow
          </button>
        </div>

        {/* Existing Flows */}
        <div style={formSectionStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h4 style={{
              ...sectionHeaderStyle,
              fontSize: '1rem',
              marginBottom: '0',
              borderBottom: 'none',
            }}>
              📋 Existing Business Flows ({flows.length})
            </h4>
            <button
              onClick={onReloadTestData}
              style={{
                ...buttonOutlineStyle,
                ...buttonSmallStyle,
              }}
            >
              🔄 Load Test Data
            </button>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {flows.map(flow => (
              <div
                key={flow.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem',
                  border:
                    selectedFlowId === flow.id
                      ? '2px solid #dc2626'
                      : '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  backgroundColor:
                    selectedFlowId === flow.id ? '#fef2f2' : 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedFlowId === flow.id 
                    ? '0 4px 8px rgba(220, 38, 38, 0.15)'
                    : '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ flex: 1 }}>
                  {editingFlowId === flow.id ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}>
                          Business Flow Name *
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          style={inputBaseStyle}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}>
                          Flow Description (Optional)
                        </label>
                        <textarea
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value)}
                          placeholder="Describe the business flow purpose and scope"
                          style={{
                            ...textareaStyle,
                            minHeight: '3rem',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                      }}>
                        {flow.name}
                      </div>
                      {flow.description && (
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#6b7280',
                          marginBottom: '0.5rem',
                          lineHeight: '1.5',
                        }}>
                          {flow.description}
                        </div>
                      )}
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#9ca3af',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                      }}>
                        <span>📊 {flow.stages.length} stages</span>
                        <span>📋 {flow.stages.reduce(
                          (acc, stage) => acc + stage.steps.length,
                          0
                        )} steps</span>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {editingFlowId === flow.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(flow.id)}
                        disabled={!editName.trim()}
                        style={{
                          ...(editName.trim() ? buttonSecondaryStyle : buttonDisabledStyle),
                          ...buttonSmallStyle,
                        }}
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          ...buttonOutlineStyle,
                          ...buttonSmallStyle,
                        }}
                      >
                        ✖️ Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectFlow(flow.id)}
                        style={{
                          ...buttonPrimaryStyle,
                          ...buttonSmallStyle,
                        }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleStartEdit(flow)}
                        style={{
                          ...buttonWarningStyle,
                          ...buttonSmallStyle,
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDuplicateFlow(flow)}
                        style={{
                          ...buttonSecondaryStyle,
                          ...buttonSmallStyle,
                        }}
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => handleStartDelete(flow)}
                        disabled={flows.length <= 1}
                        style={{
                          ...(flows.length > 1 ? buttonDangerStyle : buttonDisabledStyle),
                          ...buttonSmallStyle,
                        }}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <button
            onClick={onClose}
            style={buttonOutlineStyle}
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && flowToDelete && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 300,
          }}
          onClick={handleCancelDelete}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '450px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{
              ...sectionHeaderStyle,
              color: '#dc2626',
              borderBottom: '2px solid #fef2f2',
              paddingBottom: '1rem',
            }}>
              🗑️ Delete Business Flow
            </h3>
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}>
              <p style={{
                margin: '0',
                fontSize: '1rem',
                color: '#374151',
                lineHeight: '1.6',
              }}>
                Are you sure you want to delete <strong>"{flowToDelete.name}"</strong>?
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: '1.5',
              }}>
                This action cannot be undone and will permanently remove the flow and all its business stages and steps.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleCancelDelete}
                style={buttonOutlineStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={buttonDangerStyle}
              >
                Delete Business Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlowManager
