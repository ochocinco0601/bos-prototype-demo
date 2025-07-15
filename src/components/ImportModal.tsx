import React from 'react'

/**
 * ImportModal component props interface
 */
interface ImportModalProps {
  /** Controls the visibility of the import modal */
  isOpen: boolean
  /** Callback to close the import modal */
  onClose: () => void
  /** Current import data text */
  importData: string
  /** Callback when import data changes */
  onImportDataChange: (data: string) => void
  /** Callback to handle the import operation */
  onImport: () => void
}

/**
 * ImportModal Component
 *
 * A modal dialog for importing JSON data into the BOS system.
 * Provides a textarea for pasting JSON data and buttons for import/cancel operations.
 *
 * @param props - The component props
 * @returns JSX element for the import modal
 */
const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  importData,
  onImportDataChange,
  onImport,
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
    backgroundColor: 'white',
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

  const buttonPrimaryStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#dc2626',
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
          📥 Import BOS Data
        </h3>
        
        <div style={helpSectionStyle}>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
          }}>
            💡 Import Instructions:
          </p>
          <ul style={{
            margin: '0',
            paddingLeft: '1.5rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: '1.5',
          }}>
            <li>Paste valid JSON data from a BOS export</li>
            <li>Data will be validated before import</li>
            <li>Invalid JSON will show an error message</li>
            <li>All existing data will be replaced</li>
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
            JSON Data *
          </label>
          <textarea
            value={importData}
            onChange={e => onImportDataChange(e.target.value)}
            placeholder={`Paste your JSON data here...

{
  "flows": [
    {
      "id": "...",
      "name": "...",
      "stages": [...]
    }
  ]
}`}
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
            Cancel
          </button>
          <button
            onClick={onImport}
            disabled={!importData.trim()}
            style={{
              ...buttonPrimaryStyle,
              ...(importData.trim() ? {} : {
                backgroundColor: '#9ca3af',
                cursor: 'not-allowed',
              })
            }}
          >
            📥 Import Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImportModal
