import React from 'react'
import { Flow } from '../types'

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
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <h3
          style={{
            margin: '0 0 1.5rem 0',
            fontSize: '1.25rem',
            fontWeight: '600',
          }}
        >
          Flow Management
        </h3>

        {/* Create New Flow */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h4
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Create New Flow
          </h4>
          <input
            type="text"
            placeholder="Flow name"
            value={newFlowName}
            onChange={e => onNewFlowNameChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          />
          <textarea
            placeholder="Flow description (optional)"
            value={newFlowDescription}
            onChange={e => onNewFlowDescriptionChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              rows: 3,
              resize: 'vertical',
              marginBottom: '0.5rem',
            }}
          />
          <button
            onClick={onCreateFlow}
            disabled={!newFlowName.trim()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: newFlowName.trim() ? '#10b981' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: newFlowName.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            ✨ Create Flow
          </button>
        </div>

        {/* Existing Flows */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h4
              style={{
                margin: '0',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Existing Flows ({flows.length})
            </h4>
            <button
              onClick={onReloadTestData}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              🔄 Load Test Data
            </button>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {flows.map(flow => (
              <div
                key={flow.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border:
                    selectedFlowId === flow.id
                      ? '2px solid #3b82f6'
                      : '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  backgroundColor:
                    selectedFlowId === flow.id ? '#eff6ff' : 'white',
                }}
              >
                <div style={{ flex: 1 }}>
                  {editingFlowId === flow.id ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      }}
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                        }}
                      />
                      <textarea
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        placeholder="Flow description (optional)"
                        style={{
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          rows: 2,
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {flow.name}
                      </div>
                      {flow.description && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {flow.description}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {flow.stages.length} stages •{' '}
                        {flow.stages.reduce(
                          (acc, stage) => acc + stage.steps.length,
                          0
                        )}{' '}
                        steps
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingFlowId === flow.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(flow.id)}
                        disabled={!editName.trim()}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: editName.trim()
                            ? '#10b981'
                            : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: editName.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
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
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => handleStartEdit(flow)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDuplicateFlow(flow)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => handleStartDelete(flow)}
                        disabled={flows.length <= 1}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor:
                            flows.length > 1 ? '#ef4444' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: flows.length > 1 ? 'pointer' : 'not-allowed',
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
            marginTop: '1.5rem',
          }}
        >
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              🗑️ Delete Flow
            </h3>
            <p
              style={{
                margin: '0 0 1.5rem 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: '1.5',
              }}
            >
              Are you sure you want to delete "{flowToDelete.name}"? This action
              cannot be undone and will permanently remove the flow and all its
              stages and steps.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleCancelDelete}
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
                Delete Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlowManager
