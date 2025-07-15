import React, { useState } from 'react'
import { Stakeholder } from '../../types'

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
  // Professional Input Styling System - Local copy for StakeholderForm
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

  // Professional Button Styling System - Local copy for StakeholderForm
  const buttonBaseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    display: 'inline-flex' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }

  const buttonSecondaryStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#10b981',
    color: 'white',
  }

  const buttonOutlineStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'white',
    color: '#374151',
    border: '2px solid #e5e7eb',
    boxShadow: 'none',
  }

  const buttonDangerStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#ef4444',
    color: 'white',
  }

  // Professional Select Styling System
  const selectStyle = {
    ...inputBaseStyle,
    backgroundColor: 'white',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.25rem 1.25rem',
    paddingRight: '2.5rem',
    appearance: 'none' as const,
  }

  const [newStakeholder, setNewStakeholder] = useState<Stakeholder>({
    name: '',
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

  const subSectionHeaderStyle = {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.75rem',
    marginTop: '1.5rem',
  }

  return (
    <div>
      <h3 style={sectionHeaderStyle}>
        <span>👥</span>
        Task 2: Stakeholder Identification
      </h3>

      {/* Add New Stakeholder */}
      <div style={formSectionStyle}>
        <h4 style={subSectionHeaderStyle}>
          ➕ Add New Stakeholder
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
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
            style={inputBaseStyle}
          />
          <input
            type="text"
            placeholder="Role/Position"
            value={newStakeholder.role}
            onChange={e =>
              setNewStakeholder({ ...newStakeholder, role: e.target.value })
            }
            style={inputBaseStyle}
          />
        </div>
        <div
          style={{
            marginBottom: '0.75rem',
          }}
        >
          <select
            value={newStakeholder.type}
            onChange={e =>
              setNewStakeholder({
                ...newStakeholder,
                type: e.target.value as 'people' | 'business' | 'vendor',
              })
            }
            style={selectStyle}
          >
            <option value="people">People</option>
            <option value="business">Business Entity</option>
            <option value="vendor">Vendor/Service</option>
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
            ...textareaStyle,
            marginBottom: '0.75rem',
          }}
        />
        <button
          onClick={addStakeholder}
          style={buttonSecondaryStyle}
        >
          Add Stakeholder
        </button>
      </div>

      {/* Existing Stakeholders */}
      {stakeholders.length > 0 && (
        <div style={formSectionStyle}>
          <h4 style={subSectionHeaderStyle}>
            📋 Current Stakeholders ({stakeholders.length})
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
                          gridTemplateColumns: '1fr',
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
                            ...buttonSecondaryStyle,
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingStakeholder}
                          style={{
                            ...buttonOutlineStyle,
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
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
                          {stakeholder.type}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() =>
                            startEditingStakeholder(stakeholder, index)
                          }
                          style={{
                            ...buttonOutlineStyle,
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeStakeholder(index)}
                          style={{
                            ...buttonDangerStyle,
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
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

export default StakeholderForm