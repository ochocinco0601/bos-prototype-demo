import React from 'react'

/**
 * ExportModal component props interface
 */
interface ExportModalProps {
  /** Controls the visibility of the export modal */
  isOpen: boolean
  /** Callback to close the export modal */
  onClose: () => void
  /** Export data as JSON string */
  exportData: string
}

/**
 * ExportModal Component
 *
 * A modal dialog for exporting JSON data from the BOS system.
 * Displays formatted JSON data in a read-only textarea with copy-to-clipboard functionality.
 *
 * @param props - The component props
 * @returns JSX element for the export modal
 */
const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  exportData,
}) => {
  if (!isOpen) return null

  // Professional Styling System - Based on MethodologyEditModal Design
  const sectionHeaderStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }

  const textareaStyle = {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9fafb',
    color: '#374151',
    boxSizing: 'border-box' as const,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    lineHeight: '1.5',
    width: '100%',
    minHeight: '20rem',
    resize: 'vertical' as const,
  }

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

  const helpSectionStyle = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  }

  /**
   * Copies the export data to clipboard and shows a notification
   */
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportData)
      // Replace alert with a more professional notification
      const button = document.activeElement as HTMLButtonElement
      if (button) {
        const originalText = button.textContent
        button.textContent = '✅ Copied!'
        button.style.backgroundColor = '#059669'
        setTimeout(() => {
          button.textContent = originalText
          button.style.backgroundColor = '#10b981'
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      alert('Failed to copy to clipboard')
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h3 style={sectionHeaderStyle}>
          📤 Export BOS Data
        </h3>
        
        <div style={helpSectionStyle}>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
          }}>
            💡 Export Instructions:
          </p>
          <ul style={{
            margin: '0',
            paddingLeft: '1.5rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: '1.5',
          }}>
            <li>Copy the JSON data below to save your BOS configuration</li>
            <li>Use this data to backup or share your business flows</li>
            <li>Import this data into another BOS system to restore configuration</li>
            <li>The data includes all flows, stages, steps, and methodology data</li>
          </ul>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem',
          }}>
            JSON Export Data (Read-Only)
          </label>
          <textarea
            value={exportData}
            readOnly
            style={textareaStyle}
          />
        </div>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={buttonOutlineStyle}
          >
            Close
          </button>
          <button
            onClick={handleCopyToClipboard}
            style={buttonSecondaryStyle}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
