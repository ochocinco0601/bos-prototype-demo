import React, { useState, useRef, useEffect } from 'react'
import { useCreationWorkflow } from '../hooks'
import { Flow } from '../types'

interface SmartAddButtonProps {
  selectedFlow: Flow | null
  flows: Flow[]
  onCreateFlow: () => void
  onCreateStep: () => void
  onShowFlowManager: () => void
  onShowUnifiedCreator?: () => void
  useUnifiedCreator?: boolean
}

export const SmartAddButton: React.FC<SmartAddButtonProps> = ({
  selectedFlow,
  flows,
  onCreateFlow,
  onCreateStep,
  onShowFlowManager,
  onShowUnifiedCreator,
  useUnifiedCreator = false
}) => {
  const { creationContext } = useCreationWorkflow({ selectedFlow, flows })
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handlePrimaryAction = () => {
    if (useUnifiedCreator && onShowUnifiedCreator) {
      onShowUnifiedCreator()
    } else {
      switch (creationContext.suggestedType) {
        case 'flow':
          onShowFlowManager()
          break
        case 'step':
          if (creationContext.canCreateStep) {
            onCreateStep()
          } else {
            // Show context message if can't create
            alert(creationContext.contextMessage)
          }
          break
        case 'stage':
          // For now, redirect to flow manager for stage creation
          alert('Stage creation coming soon. Use Flow Manager to add stages.')
          onShowFlowManager()
          break
      }
    }
    setShowMenu(false)
  }

  const handleMenuItemClick = (action: 'flow' | 'step') => {
    setShowMenu(false)
    if (useUnifiedCreator && onShowUnifiedCreator) {
      onShowUnifiedCreator()
    } else {
      if (action === 'flow') {
        onShowFlowManager()
      } else if (action === 'step') {
        if (creationContext.canCreateStep) {
          onCreateStep()
        } else {
          alert(creationContext.contextMessage)
        }
      }
    }
  }

  // Determine button style based on context
  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
    transition: 'all 0.2s'
  }

  // Show disabled state if primary action isn't available
  if (creationContext.suggestedType === 'step' && !creationContext.canCreateStep) {
    buttonStyle.backgroundColor = '#9ca3af'
    buttonStyle.cursor = 'not-allowed'
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          if (e.altKey || e.metaKey) {
            // Alt/Cmd click shows menu
            e.preventDefault()
            setShowMenu(!showMenu)
          } else {
            handlePrimaryAction()
          }
        }}
        onContextMenu={(e) => {
          // Right-click shows menu
          e.preventDefault()
          setShowMenu(!showMenu)
        }}
        style={buttonStyle}
        title={`${creationContext.buttonLabel} (Alt+Click for more options)`}
      >
        {creationContext.buttonLabel}
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.25rem',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minWidth: '200px',
            zIndex: 50
          }}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <button
              onClick={() => handleMenuItemClick('flow')}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#374151'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              📁 Create Business Flow
            </button>
            
            <button
              onClick={() => handleMenuItemClick('step')}
              disabled={!creationContext.canCreateStep}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: creationContext.canCreateStep ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                color: creationContext.canCreateStep ? '#374151' : '#9ca3af'
              }}
              onMouseEnter={(e) => {
                if (creationContext.canCreateStep) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              📋 Add Business Step
              {!creationContext.canCreateStep && (
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  {creationContext.contextMessage}
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Context Message (shown when appropriate) */}
      {creationContext.contextMessage && !showMenu && creationContext.suggestedType !== 'step' && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: '#92400e',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          {creationContext.contextMessage}
        </div>
      )}
    </div>
  )
}