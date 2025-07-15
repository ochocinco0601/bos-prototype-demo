import React, { useState, useEffect, useRef } from 'react'
import { Flow, Stage } from '../types'
import { useCreationWorkflow } from '../hooks'
import * as methodologyStyles from './methodology/methodologyStyles'

interface UnifiedCreatorProps {
  isOpen: boolean
  onClose: () => void
  flows: Flow[]
  selectedFlow: Flow | null
  onCreateFlow: (name: string, description: string) => void
  onCreateStage: (flowId: string, name: string, description: string) => void
  onCreateStep: (name: string, description: string, stageId: string) => void
  onOpenMethodologyEdit: (stepData: { name: string; description: string; stageId: string }) => void
}

type EntityType = 'flow' | 'stage' | 'step'

export const UnifiedCreator: React.FC<UnifiedCreatorProps> = ({
  isOpen,
  onClose,
  flows,
  selectedFlow,
  onCreateFlow,
  onCreateStage,
  onCreateStep,
  onOpenMethodologyEdit
}) => {
  const { creationContext, availableStages, suggestedStage } = useCreationWorkflow({ selectedFlow, flows })
  const [activeTab, setActiveTab] = useState<EntityType>(creationContext.suggestedType)
  const [createAndContinue, setCreateAndContinue] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFlowId, setSelectedFlowId] = useState(selectedFlow?.id || '')
  const [selectedStageId, setSelectedStageId] = useState(suggestedStage?.id || '')
  const [showStageCreation, setShowStageCreation] = useState(false)
  const [newStageName, setNewStageName] = useState('')
  const [newStageDescription, setNewStageDescription] = useState('')
  
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Update active tab based on context when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(creationContext.suggestedType)
      // Auto-select flow if there's only one
      if (flows.length === 1 && !selectedFlowId) {
        setSelectedFlowId(flows[0].id)
      }
      // Auto-select stage if there's only one
      if (availableStages.length === 1 && !selectedStageId) {
        setSelectedStageId(availableStages[0].id)
      }
      // Focus name input
      setTimeout(() => nameInputRef.current?.focus(), 100)
    }
  }, [isOpen, creationContext.suggestedType, flows, availableStages, selectedFlowId, selectedStageId])

  // Update selected stage when suggested stage changes
  useEffect(() => {
    if (suggestedStage && !selectedStageId) {
      setSelectedStageId(suggestedStage.id)
    }
  }, [suggestedStage, selectedStageId])

  // Reset form when closing
  useEffect(() => {
    if (!isOpen) {
      setName('')
      setDescription('')
      setShowStageCreation(false)
      setNewStageName('')
      setNewStageDescription('')
    }
  }, [isOpen])

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter a name')
      return
    }

    switch (activeTab) {
      case 'flow':
        onCreateFlow(name, description)
        break
        
      case 'stage':
        if (!selectedFlowId) {
          alert('Please select a flow')
          return
        }
        onCreateStage(selectedFlowId, name, description)
        break
        
      case 'step':
        if (showStageCreation) {
          // Create new stage first
          if (!newStageName.trim()) {
            alert('Please enter a stage name')
            return
          }
          if (!selectedFlowId) {
            alert('Please select a flow')
            return
          }
          // Create stage and then create step
          onCreateStage(selectedFlowId, newStageName, newStageDescription)
          // Note: Actual step creation will happen after stage is created
          // This would need to be handled by the parent component
          const stepData = { name, description, stageId: 'pending' }
          onOpenMethodologyEdit(stepData)
        } else {
          if (!selectedStageId) {
            alert('Please select a stage')
            return
          }
          // Create step and open methodology editor
          const stepData = { name, description, stageId: selectedStageId }
          onOpenMethodologyEdit(stepData)
        }
        break
    }

    if (!createAndContinue) {
      onClose()
    } else {
      // Reset form for next creation
      setName('')
      setDescription('')
      nameInputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleCreate()
    }
  }

  if (!isOpen) return null

  // Get the flow for the selected flow ID
  const targetFlow = activeTab === 'stage' || activeTab === 'step' 
    ? flows.find(f => f.id === selectedFlowId) || selectedFlow
    : null

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
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          width: '600px',
          maxHeight: '80vh',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>Create New</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.25rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {(['flow', 'stage', 'step'] as EntityType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              disabled={
                (type === 'stage' && !creationContext.canCreateStage) ||
                (type === 'step' && !creationContext.canCreateStep)
              }
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                backgroundColor: activeTab === type ? 'white' : 'transparent',
                borderBottom: activeTab === type ? '2px solid #dc2626' : '2px solid transparent',
                cursor: (type === 'stage' && !creationContext.canCreateStage) || 
                        (type === 'step' && !creationContext.canCreateStep) 
                        ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeTab === type ? '600' : '400',
                color: activeTab === type ? '#dc2626' : 
                       ((type === 'stage' && !creationContext.canCreateStage) || 
                        (type === 'step' && !creationContext.canCreateStep)) 
                       ? '#9ca3af' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              {type === 'flow' ? '📁 Business Flow' :
               type === 'stage' ? '📊 Business Stage' :
               '📋 Business Step'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', maxHeight: 'calc(80vh - 180px)', overflowY: 'auto' }}>
          {/* Context Message */}
          {creationContext.contextMessage && activeTab === creationContext.suggestedType && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#92400e'
            }}>
              {creationContext.contextMessage}
            </div>
          )}

          {/* Common Fields */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${activeTab} name`}
              style={methodologyStyles.inputBaseStyle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault()
                }
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter ${activeTab} description (optional)`}
              rows={3}
              style={methodologyStyles.textareaStyle}
            />
          </div>

          {/* Stage-specific fields */}
          {activeTab === 'stage' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
                Target Flow <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={selectedFlowId}
                onChange={(e) => setSelectedFlowId(e.target.value)}
                style={methodologyStyles.selectStyle}
              >
                <option value="">Select a flow</option>
                {flows.map(flow => (
                  <option key={flow.id} value={flow.id}>
                    {flow.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step-specific fields */}
          {activeTab === 'step' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
                  Target Flow <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedFlowId}
                  onChange={(e) => {
                    setSelectedFlowId(e.target.value)
                    setSelectedStageId('') // Reset stage selection
                  }}
                  style={methodologyStyles.selectStyle}
                >
                  <option value="">Select a flow</option>
                  {flows.map(flow => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFlowId && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
                    Target Stage <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  
                  {!showStageCreation ? (
                    <>
                      <select
                        value={selectedStageId}
                        onChange={(e) => setSelectedStageId(e.target.value)}
                        style={methodologyStyles.selectStyle}
                        disabled={targetFlow?.stages.length === 0}
                      >
                        <option value="">Select a stage</option>
                        {targetFlow?.stages.map(stage => (
                          <option key={stage.id} value={stage.id}>
                            {stage.name} ({stage.steps.length} steps)
                          </option>
                        ))}
                      </select>
                      
                      {targetFlow?.stages.length === 0 && (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                          No stages available. Create a new stage below.
                        </p>
                      )}
                      
                      <button
                        onClick={() => setShowStageCreation(true)}
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        ➕ Create New Stage
                      </button>
                    </>
                  ) : (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem'
                    }}>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          value={newStageName}
                          onChange={(e) => setNewStageName(e.target.value)}
                          placeholder="New stage name"
                          style={methodologyStyles.inputBaseStyle}
                        />
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <textarea
                          value={newStageDescription}
                          onChange={(e) => setNewStageDescription(e.target.value)}
                          placeholder="New stage description (optional)"
                          rows={2}
                          style={methodologyStyles.textareaStyle}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setShowStageCreation(false)
                          setNewStageName('')
                          setNewStageDescription('')
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel New Stage
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Create & Continue checkbox */}
          <div style={{ 
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              color: '#374151',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={createAndContinue}
                onChange={(e) => setCreateAndContinue(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Create & Continue (stay open for multiple creations)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <button
            onClick={onClose}
            style={methodologyStyles.buttonSecondaryStyle}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            style={{
              ...methodologyStyles.buttonPrimaryStyle,
              opacity: !name.trim() ? 0.5 : 1,
              cursor: !name.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            Create {activeTab === 'flow' ? 'Flow' : activeTab === 'stage' ? 'Stage' : 'Step'}
            {createAndContinue && ' & Continue'}
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div style={{
          padding: '0.5rem 1.5rem',
          backgroundColor: '#f3f4f6',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <kbd>Esc</kbd> to cancel • <kbd>Cmd/Ctrl + Enter</kbd> to create
        </div>
      </div>
    </div>
  )
}