import React, { useState } from 'react'
import { Signal, TelemetryMappingItem, Dependency } from '../../types'
import {
  extractKeyTerms,
  extractContextGuidance,
  SIGNAL_OWNER_MAP,
} from '../../utils/signalUtils'

/**
 * SignalForm Component
 */
interface SignalFormProps {
  signals: Signal[]
  onChange: (signals: Signal[]) => void
  telemetryMappings?: TelemetryMappingItem[]
  dependencies?: Dependency[]
  businessContext?: string
}

const SignalForm: React.FC<SignalFormProps> = ({
  signals,
  onChange,
  telemetryMappings,
  dependencies,
  businessContext,
}) => {
  // Professional Input Styling System - Local copy for SignalForm
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

  // Professional Button Styling System - Local copy for SignalForm
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

  const [newSignal, setNewSignal] = useState<Signal>({
    name: '',
    type: 'business',
    description: '',
    owner: SIGNAL_OWNER_MAP['business'],
    metricName: '',
    threshold: '',
    alertConditions: [],
    observableUnit: '',
    businessLogicDefinition: '',
    primaryImpactType: undefined,
  })

  // Edit state management
  const [editingSignalId, setEditingSignalId] = useState<string | null>(null)
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null)

  const addSignal = () => {
    if (newSignal.name.trim()) {
      onChange([...signals, { ...newSignal, id: Date.now().toString() }])
      setNewSignal({
        name: '',
        type: 'business',
        description: '',
        owner: SIGNAL_OWNER_MAP['business'],
        metricName: '',
        threshold: '',
        alertConditions: [],
        observableUnit: '',
        businessLogicDefinition: '',
        primaryImpactType: undefined,
      })
    }
  }

  const removeSignal = (index: number) => {
    onChange(signals.filter((_, i) => i !== index))
  }

  // Edit functions
  const startEditingSignal = (signal: Signal, index: number) => {
    setEditingSignalId(signal.id || index.toString())
    setEditingSignal({ ...signal })
  }

  const saveEditingSignal = () => {
    if (editingSignal && editingSignalId) {
      const updatedSignals = signals.map((signal, index) => {
        const id = signal.id || index.toString()
        return id === editingSignalId ? editingSignal : signal
      })
      onChange(updatedSignals)
      setEditingSignalId(null)
      setEditingSignal(null)
    }
  }

  const cancelEditingSignal = () => {
    setEditingSignalId(null)
    setEditingSignal(null)
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
        <span>📊</span>
        Task 3: Signal Definition
      </h3>

      {/* Context Display Panel */}
      {businessContext && (
        <div
          style={{
            backgroundColor: '#e0f2fe',
            border: '2px solid #0284c7',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h4
            style={{
              ...subSectionHeaderStyle,
              margin: '0 0 0.5rem 0',
              color: '#0369a1',
            }}
          >
            💡 Business Context from Task 1:
          </h4>
          <p
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
          >
            {businessContext}
          </p>

          {/* Context-driven guidance */}
          <div style={{ marginTop: '1rem' }}>
            <strong style={{ fontSize: '0.875rem' }}>
              Context-Driven Signal Creation:
            </strong>
            <ul
              style={{
                marginTop: '0.5rem',
                marginBottom: 0,
                paddingLeft: '1.5rem',
              }}
            >
              {extractContextGuidance(businessContext).map((guide, i) => (
                <li
                  key={i}
                  style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}
                >
                  {guide}
                </li>
              ))}
            </ul>
          </div>

          {/* Key terms */}
          <div style={{ marginTop: '1rem' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                marginRight: '0.5rem',
              }}
            >
              Key terms:
            </span>
            {extractKeyTerms(businessContext).map((term, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: '#fef3c7',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '0.25rem',
                  marginRight: '0.5rem',
                  fontSize: '0.875rem',
                  display: 'inline-block',
                  marginBottom: '0.25rem',
                }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add New Signal */}
      <div style={formSectionStyle}>
        <h4 style={subSectionHeaderStyle}>
          ➕ Add New Signal
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          {/* Signal Type Selection */}
          <div style={{ marginBottom: '1rem' }}>
            <h5
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Select Signal Type:
            </h5>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {(['business', 'process', 'system'] as const).map(type => (
                <label
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="signalType"
                    value={type}
                    checked={newSignal.type === type}
                    onChange={e => {
                      const newType = e.target.value as Signal['type']
                      setNewSignal({
                        ...newSignal,
                        type: newType,
                        owner: SIGNAL_OWNER_MAP[newType],
                      })
                    }}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span
                    style={{
                      textTransform: 'capitalize',
                      fontSize: '0.875rem',
                    }}
                  >
                    {type} Signal
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional guidance based on signal type */}
          {newSignal.type === 'business' && (
            <div
              style={{
                backgroundColor: '#e0f2fe',
                border: '1px solid #0284c7',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h5
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                💡 Business Signal Guidance
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: '1.5' }}>
                Business signals focus on:
              </p>
              <ul
                style={{
                  margin: '0.5rem 0 0 0',
                  paddingLeft: '1.5rem',
                  fontSize: '0.75rem',
                }}
              >
                <li>👥 People: Customers, Staff, Vendors, Partners</li>
                <li>
                  🏢 Business Entities: Accounts, Applications, Trades, Loans
                </li>
                <li>
                  💰 Financial: Revenue, Cost, Profitability, Loss Prevention
                </li>
                <li>😊 Experience: Satisfaction, Usability, Service Quality</li>
                <li>⚖️ Legal/Risk: Regulatory violations, Audit, Security</li>
                <li>
                  ⚙️ Operational: Process speed, Resource use, Error rates
                </li>
              </ul>
            </div>
          )}

          {newSignal.type === 'process' && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h5
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                💡 Process Signal Guidance
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: '1.5' }}>
                Process signals measure workflow efficiency and quality. Focus
                on throughput, error rates, and processing times that impact
                business operations.
              </p>
            </div>
          )}

          {newSignal.type === 'system' && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h5
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                💡 System Signal Guidance
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: '1.5' }}>
                System signals track technical health and performance. Monitor
                availability, response times, error rates, and resource
                utilization.
              </p>
            </div>
          )}

          <input
            type="text"
            placeholder="Signal name"
            value={newSignal.name}
            onChange={e => setNewSignal({ ...newSignal, name: e.target.value })}
            style={{
              ...inputBaseStyle,
              marginBottom: '0.75rem',
            }}
          />
        </div>

        {/* Primary Impact Type - Business signals only */}
        {newSignal.type === 'business' && (
          <div style={{ marginBottom: '0.75rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              Primary Impact Type
            </label>
            <select
              value={newSignal.primaryImpactType || ''}
              onChange={e =>
                setNewSignal({
                  ...newSignal,
                  primaryImpactType: e.target
                    .value as Signal['primaryImpactType'],
                })
              }
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              <option value="">Select impact type...</option>
              <option value="financial">💰 Financial Impact</option>
              <option value="experience">😊 Experience Impact</option>
              <option value="legal">⚖️ Legal/Risk Impact</option>
              <option value="operational">⚙️ Operational Impact</option>
            </select>
          </div>
        )}

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
            placeholder="Signal owner (auto-populated)"
            value={newSignal.owner}
            readOnly
            style={{
              padding: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              backgroundColor: '#f9fafb',
              cursor: 'not-allowed',
            }}
          />
          <input
            type="text"
            placeholder="Metric name"
            value={newSignal.metricName}
            onChange={e =>
              setNewSignal({ ...newSignal, metricName: e.target.value })
            }
            style={{
              ...inputBaseStyle,
              marginBottom: '0.75rem',
            }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Alert threshold (e.g., >100ms, <95%)"
            value={newSignal.threshold}
            onChange={e =>
              setNewSignal({ ...newSignal, threshold: e.target.value })
            }
            style={inputBaseStyle}
          />
        </div>
        <textarea
          placeholder="Signal description"
          value={newSignal.description}
          onChange={e =>
            setNewSignal({ ...newSignal, description: e.target.value })
          }
          style={{
            ...textareaStyle,
            marginBottom: '0.75rem',
          }}
        />
        <textarea
          placeholder="Business Logic Definition - What makes this signal 'good'? (e.g., 'Credit score is present in bureau response')"
          value={newSignal.businessLogicDefinition || ''}
          onChange={e =>
            setNewSignal({
              ...newSignal,
              businessLogicDefinition: e.target.value,
            })
          }
          style={{
            ...textareaStyle,
            marginBottom: '0.75rem',
          }}
        />
        <button
          onClick={addSignal}
          style={buttonSecondaryStyle}
        >
          Add Signal
        </button>
      </div>

      {/* Existing Signals */}
      {signals.length > 0 && (
        <div style={formSectionStyle}>
          <h4 style={subSectionHeaderStyle}>
            📋 Current Signals ({signals.length})
          </h4>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {signals.map((signal, index) => {
              const signalId = signal.id || index.toString()
              const isEditing = editingSignalId === signalId

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
                          placeholder="Signal name"
                          value={editingSignal?.name || ''}
                          onChange={e =>
                            setEditingSignal(prev =>
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
                        <select
                          value={editingSignal?.type || 'business'}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev
                                ? {
                                    ...prev,
                                    type: e.target.value as
                                      | 'business'
                                      | 'process'
                                      | 'system',
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
                          <option value="business">Business</option>
                          <option value="process">Process</option>
                          <option value="system">System</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Owner"
                          value={editingSignal?.owner || ''}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev ? { ...prev, owner: e.target.value } : null
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
                          placeholder="Metric name"
                          value={editingSignal?.metricName || ''}
                          onChange={e =>
                            setEditingSignal(prev =>
                              prev
                                ? { ...prev, metricName: e.target.value }
                                : null
                            )
                          }
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                          }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Threshold"
                        value={editingSignal?.threshold || ''}
                        onChange={e =>
                          setEditingSignal(prev =>
                            prev ? { ...prev, threshold: e.target.value } : null
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          marginBottom: '0.75rem',
                          boxSizing: 'border-box',
                        }}
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={editingSignal?.description || ''}
                        onChange={e =>
                          setEditingSignal(prev =>
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
                          onClick={saveEditingSignal}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingSignal}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
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
                          {signal.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {signal.type} • {signal.owner} • {signal.threshold}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditingSignal(signal, index)}
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
                          Edit
                        </button>
                        <button
                          onClick={() => removeSignal(index)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
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

export default SignalForm