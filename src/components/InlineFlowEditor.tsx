import React, { useState, useRef, useEffect } from 'react'
import { Flow } from '../types'

interface InlineFlowEditorProps {
  flow: Flow
  onSave: (flowId: string, name: string, description: string) => void
}

export const InlineFlowEditor: React.FC<InlineFlowEditorProps> = ({ flow, onSave }) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [name, setName] = useState(flow.name)
  const [description, setDescription] = useState(flow.description || '')
  const nameInputRef = useRef<HTMLInputElement>(null)
  const descInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditingName])

  useEffect(() => {
    if (isEditingDescription && descInputRef.current) {
      descInputRef.current.focus()
      descInputRef.current.select()
    }
  }, [isEditingDescription])

  const handleSaveName = () => {
    if (name.trim() && name !== flow.name) {
      onSave(flow.id, name.trim(), flow.description || '')
    } else {
      setName(flow.name)
    }
    setIsEditingName(false)
  }

  const handleSaveDescription = () => {
    if (description !== flow.description) {
      onSave(flow.id, flow.name, description.trim())
    }
    setIsEditingDescription(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, type: 'name' | 'description') => {
    if (e.key === 'Enter' && type === 'name') {
      e.preventDefault()
      handleSaveName()
    } else if (e.key === 'Escape') {
      if (type === 'name') {
        setName(flow.name)
        setIsEditingName(false)
      } else {
        setDescription(flow.description || '')
        setIsEditingDescription(false)
      }
    }
  }

  return (
    <div>
      {/* Editable Name */}
      {isEditingName ? (
        <input
          ref={nameInputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSaveName}
          onKeyDown={(e) => handleKeyDown(e, 'name')}
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            border: '2px solid #dc2626',
            borderRadius: '0.375rem',
            padding: '0.25rem 0.5rem',
            marginBottom: '1rem',
            width: 'auto',
            minWidth: '200px',
            background: 'white'
          }}
        />
      ) : (
        <h2
          onClick={() => setIsEditingName(true)}
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          title="Click to edit flow name"
        >
          {flow.name}
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>✏️</span>
        </h2>
      )}

      {/* Editable Description */}
      {isEditingDescription ? (
        <textarea
          ref={descInputRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSaveDescription}
          onKeyDown={(e) => handleKeyDown(e, 'description')}
          rows={2}
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            border: '2px solid #dc2626',
            borderRadius: '0.375rem',
            padding: '0.5rem',
            marginBottom: '1rem',
            width: '100%',
            resize: 'vertical',
            background: 'white'
          }}
        />
      ) : (
        <p
          onClick={() => setIsEditingDescription(true)}
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            transition: 'all 0.2s',
            minHeight: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
          title="Click to edit flow description"
        >
          {flow.description || <span style={{ fontStyle: 'italic' }}>Click to add description</span>}
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>✏️</span>
        </p>
      )}
    </div>
  )
}