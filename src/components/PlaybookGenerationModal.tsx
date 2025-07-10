import React from 'react'
import { PlaybookData } from '../data/playbookGenerator'

interface PlaybookGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  playbookData: PlaybookData
}

/**
 * PlaybookGenerationModal Component
 *
 * Displays formatted Business Impact Playbook template with BOS methodology data.
 */
const PlaybookGenerationModal: React.FC<PlaybookGenerationModalProps> = ({
  isOpen,
  onClose,
  playbookData,
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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '48rem',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '2rem',
            borderBottom: '2px solid #dc2626',
            paddingBottom: '1rem',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#dc2626',
              margin: 0,
            }}
          >
            📋 Business Impact Playbook
          </h1>
          <h2
            style={{
              fontSize: '1.25rem',
              color: '#374151',
              margin: '0.5rem 0 0 0',
            }}
          >
            {playbookData.stepName}
          </h2>
          {playbookData.description && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0.5rem 0 0 0',
              }}
            >
              {playbookData.description}
            </p>
          )}
        </div>

        {/* Stakeholders Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#dc2626',
              marginBottom: '1rem',
            }}
          >
            👥 Key Stakeholders
          </h3>
          {playbookData.stakeholders.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {playbookData.stakeholders.map((stakeholder, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#374151' }}>
                    {stakeholder.name}
                  </div>
                  {stakeholder.role && (
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Role: {stakeholder.role}
                    </div>
                  )}
                  {stakeholder.relationship && (
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Relationship: {stakeholder.relationship}
                    </div>
                  )}
                  {stakeholder.type && (
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Type: {stakeholder.type}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              No stakeholders defined for this step
            </div>
          )}
        </div>

        {/* Business Impacts Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#dc2626',
              marginBottom: '1rem',
            }}
          >
            💥 Business Impacts
          </h3>
          {playbookData.impacts.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {playbookData.impacts.map((impact, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    borderRadius: '0.375rem',
                    border: '1px solid #fecaca',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        marginRight: '0.5rem',
                      }}
                    >
                      {impact.category?.toUpperCase()}
                    </span>
                    {impact.isMeasurable && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#059669',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                        }}
                      >
                        MEASURABLE
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#374151' }}>{impact.description}</div>
                  {impact.measurabilityPattern && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginTop: '0.5rem',
                      }}
                    >
                      <strong>Measurability:</strong>{' '}
                      {impact.measurabilityPattern}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              No impacts defined for this step
            </div>
          )}
        </div>

        {/* Observable Signals Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#dc2626',
              marginBottom: '1rem',
            }}
          >
            📊 Observable Signals
          </h3>
          {playbookData.signals.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {playbookData.signals.map((signal, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#eff6ff',
                    borderRadius: '0.375rem',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {signal.name}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {signal.type && (
                      <div>
                        <strong>Type:</strong> {signal.type}
                      </div>
                    )}
                    {signal.owner && (
                      <div>
                        <strong>Owner:</strong> {signal.owner}
                      </div>
                    )}
                    {signal.threshold && (
                      <div>
                        <strong>Threshold:</strong> {signal.threshold}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              No observable signals defined for this step
            </div>
          )}
        </div>

        {/* Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1rem',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Close Playbook
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaybookGenerationModal
