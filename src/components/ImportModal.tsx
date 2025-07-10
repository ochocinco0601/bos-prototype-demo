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
          borderRadius: '0.5rem',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            fontSize: '1.25rem',
            fontWeight: '600',
          }}
        >
          Import JSON Data
        </h3>
        <textarea
          value={importData}
          onChange={e => onImportDataChange(e.target.value)}
          placeholder="Paste your JSON data here..."
          style={{
            width: '100%',
            height: '300px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
        />
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1rem',
            justifyContent: 'flex-end',
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
            Cancel
          </button>
          <button
            onClick={onImport}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImportModal
