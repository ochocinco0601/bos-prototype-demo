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

  /**
   * Copies the export data to clipboard and shows a notification
   */
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportData)
    alert('Copied to clipboard!')
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
          Export JSON Data
        </h3>
        <textarea
          value={exportData}
          readOnly
          style={{
            width: '100%',
            height: '300px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            backgroundColor: '#f9fafb',
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
            Close
          </button>
          <button
            onClick={handleCopyToClipboard}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
