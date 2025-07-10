/**
 * Business Impact Playbook Component
 *
 * Session 4: Playbook Tab Implementation - Complete 6-section Business Impact Playbook
 * display based on reference JPG structure from prior version design docs.
 *
 * Implements Business Impact Playbook artifact generation as new tab in MethodologyEditModal.
 * Provides structured template display of BOS methodology data with graceful empty data handling.
 */

import React from 'react'
import {
  Step,
  Stakeholder,
  Dependency,
  Signal,
  Impact,
  TelemetryMappingItem,
  RoleOutcomeMapping,
} from '../types/index'
import { useRoleOutcomeData } from '../hooks/useRoleOutcomeData'
import { RoleOutcomeErrorBoundary } from './RoleOutcomeErrorBoundary'
import RoleOutcomeTable from './RoleOutcomeTable'
import SignalVisualization from './SignalVisualization'

interface BusinessImpactPlaybookProps {
  step: Step | null
  flowName?: string
  stageName?: string
}

/**
 * Business Impact Playbook Component
 *
 * Renders a comprehensive Business Impact Playbook with 6 structured sections
 * based on BOS methodology data. Handles partial data gracefully with placeholders.
 */
const BusinessImpactPlaybook: React.FC<BusinessImpactPlaybookProps> = ({
  step,
  flowName = 'Business Process',
  stageName = 'Process Stage',
}) => {
  // Extract BOS methodology data from step
  const stakeholders = step?.stakeholders || []
  const dependencies = step?.dependencies || []
  const signals = step?.signals || []
  const impacts = step?.impacts || []
  const telemetryMappings = step?.telemetryMappings || []
  const services = step?.services || []

  // Generate role-outcome mappings with performance optimization
  const roleOutcomeData = useRoleOutcomeData(
    stakeholders,
    dependencies,
    signals
  )

  // Helper function to format date
  const formatDate = (date: Date = new Date()) => {
    return (
      date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
    )
  }

  return (
    <RoleOutcomeErrorBoundary>
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '1rem',
          }}
        >
          <h1
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            Business Observability Factory - Step Detail
          </h1>
          <p
            style={{
              margin: '0',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            Comprehensive view of business observability mappings for a single
            step
          </p>
        </div>

        {/* Navigation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            All Steps &gt; {flowName} &gt; {step?.name || 'Current Step'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Last Modified: {formatDate()} | Signal Count: {signals.length}{' '}
            signals ({signals.filter(s => s.type === 'business').length}{' '}
            business, {signals.filter(s => s.type === 'process').length}{' '}
            process, {signals.filter(s => s.type === 'system').length} system)
          </div>
        </div>

        {/* Step Overview Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '0.75rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.375rem',
          }}
        >
          <div>
            <strong>Step ID:</strong> {step?.id || 'N/A'} |
            <strong> Completeness:</strong> {roleOutcomeData.qualityScore}%
          </div>
          <div>
            <strong>Process:</strong> {flowName} |<strong>Step:</strong>{' '}
            {step?.name || 'Undefined'}
          </div>
        </div>

        {/* Section 1: Process & Step Overview */}
        <PlaybookSection title="1. Process & Step Overview" badge="Product">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <div>
              <PlaybookField
                label="Business Process Name"
                value={flowName}
                placeholder="Business process name not specified"
              />
              <PlaybookField
                label="Business Process Description"
                value={step?.description}
                placeholder="Deliver business value through systematic process execution while managing risk and operational cost"
              />
              <PlaybookField
                label="Business Step Name"
                value={step?.name}
                placeholder="Process step name not specified"
              />
              <PlaybookField
                label="Business Step Description"
                value={step?.description}
                placeholder="Ensure process execution meets requirements and stakeholder expectations"
              />
            </div>
            <div>
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Quick Summary
              </h4>
              <PlaybookField
                label="Process"
                value={flowName}
                placeholder="Business Process"
              />
              <PlaybookField
                label="Step"
                value={step?.name}
                placeholder="Process Step"
              />
              <PlaybookField
                label="Business KPIs"
                value={`${roleOutcomeData.qualityScore}%`}
                placeholder="N/A"
              />
              <PlaybookField
                label="Tech Flow"
                value={
                  services.length > 0
                    ? services.map(s => s.name).join(' → ')
                    : undefined
                }
                placeholder="Service → Processing → Validation"
              />
            </div>
          </div>

          {/* Signal Overview Visualization */}
          {signals.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  fontSize: '1rem',
                  fontWeight: '500',
                }}
              >
                Signal Distribution & Health Overview
              </h4>
              <SignalVisualization
                signals={signals}
                dependencies={dependencies}
                impacts={impacts}
                telemetryMappings={telemetryMappings}
                showInteractive={true}
              />
            </div>
          )}
        </PlaybookSection>

        {/* Section 2: Role to Outcome Mapping */}
        <PlaybookSection title="2. Role to Outcome Mapping" badge="Product">
          <RoleOutcomeTable
            mappings={roleOutcomeData.mappings}
            roleOutcomeData={roleOutcomeData}
            showAdvancedFeatures={true}
          />
        </PlaybookSection>

        {/* Section 3: Business Outcome & Signal Definitions */}
        <PlaybookSection
          title="3. Business Outcome & Signal Definitions"
          badge="Product"
        >
          <EnhancedBusinessSignalsSection
            signals={signals.filter(
              s => s.type === 'business' || s.type === 'kpi'
            )}
            dependencies={dependencies}
            impacts={impacts}
          />
        </PlaybookSection>

        {/* Section 4: Technical Implementation */}
        <PlaybookSection
          title="4. Technical Implementation"
          badge="Development"
        >
          <EnhancedTechnicalImplementationSection
            services={services}
            telemetryMappings={telemetryMappings}
            signals={signals}
            impacts={impacts}
          />
        </PlaybookSection>

        {/* Section 5: Process Signal Definitions */}
        <PlaybookSection
          title="5. Process Signal Definitions"
          badge="Development"
        >
          <EnhancedProcessSignalsSection
            signals={signals.filter(s => s.type === 'process')}
            impacts={impacts}
            telemetryMappings={telemetryMappings}
          />
        </PlaybookSection>

        {/* Section 6: System Signal Definitions */}
        <PlaybookSection
          title="6. System Signal Definitions"
          badge="Platform SRE"
        >
          <EnhancedSystemSignalsSection
            signals={signals.filter(s => s.type === 'system')}
            services={services}
            telemetryMappings={telemetryMappings}
          />
        </PlaybookSection>

        {/* Footer */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: '#6b7280',
            textAlign: 'center',
          }}
        >
          Generated by Business Observability System (BOS) | Role-Outcome
          Mappings: {roleOutcomeData.mappings.length} | Quality Score:{' '}
          {roleOutcomeData.qualityScore}% | Readiness:{' '}
          {roleOutcomeData.readinessLevel}
        </div>
      </div>
    </RoleOutcomeErrorBoundary>
  )
}

/**
 * Playbook Section Component
 * Consistent section wrapper with title and badge
 */
const PlaybookSection: React.FC<{
  title: string
  badge: string
  children: React.ReactNode
}> = ({ title, badge, children }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}
    >
      <h2
        style={{
          margin: '0',
          fontSize: '1.125rem',
          fontWeight: '500',
          color: '#1f2937',
        }}
      >
        {title}
      </h2>
      <span
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#6b7280',
        }}
      >
        {badge}
      </span>
    </div>
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        padding: '1rem',
      }}
    >
      {children}
    </div>
  </div>
)

/**
 * Playbook Field Component
 * Consistent field display with placeholder support
 */
const PlaybookField: React.FC<{
  label: string
  value?: string
  placeholder?: string
}> = ({ label, value, placeholder }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <div
      style={{
        fontWeight: '500',
        fontSize: '0.875rem',
        color: '#374151',
        marginBottom: '0.25rem',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: '0.875rem',
        color: value ? '#1f2937' : '#9ca3af',
        fontStyle: value ? 'normal' : 'italic',
      }}
    >
      {value || placeholder || 'Not specified'}
    </div>
  </div>
)

/**
 * Enhanced Business Signals Section
 * Advanced signal categorization with dependency linking and impact traceability
 */
const EnhancedBusinessSignalsSection: React.FC<{
  signals: Signal[]
  dependencies: Dependency[]
  impacts: Impact[]
}> = ({ signals, dependencies, impacts }) => {
  const kpiSignals = signals.filter(s => s.type === 'kpi')
  const businessSignals = signals.filter(s => s.type === 'business')

  // Helper to find linked dependency
  const findLinkedDependency = (signal: Signal) => {
    return dependencies.find(dep => dep.id === signal.dependencyId)
  }

  if (signals.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic',
        }}
      >
        No business signals defined. Add KPI or Business signals to populate
        this section.
      </div>
    )
  }

  return (
    <div>
      {/* Summary Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#dcfce7',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}
          >
            {kpiSignals.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#065f46' }}>
            KPI Signals
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}
          >
            {businessSignals.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#991b1b' }}>
            Business Signals
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0284c7' }}
          >
            {signals.filter(s => s.dependencyId).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>
            Dependency Linked
          </div>
        </div>
      </div>

      {/* Enhanced Signal Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={tableHeaderStyle}>Signal Type</th>
              <th style={tableHeaderStyle}>Name & Owner</th>
              <th style={tableHeaderStyle}>Metric Definition</th>
              <th style={tableHeaderStyle}>Threshold & Targets</th>
              <th style={tableHeaderStyle}>Dependency Linkage</th>
              <th style={tableHeaderStyle}>Business Value</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => {
              const linkedDependency = findLinkedDependency(signal)
              return (
                <tr
                  key={signal.id || index}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                    borderLeft: signal.dependencyId
                      ? '3px solid #059669'
                      : '3px solid #e5e7eb',
                  }}
                >
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor:
                          signal.type === 'kpi' ? '#dcfce7' : '#fee2e2',
                        color: signal.type === 'kpi' ? '#059669' : '#dc2626',
                      }}
                    >
                      {signal.type === 'kpi' ? 'KPI' : 'Business Signal'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: '500' }}>{signal.name}</div>
                    {signal.owner && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Owner: {signal.owner}
                      </div>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <div>{signal.description || 'Not specified'}</div>
                    {signal.metricName && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          fontFamily: 'monospace',
                        }}
                      >
                        {signal.metricName}
                      </div>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    {signal.threshold || 'Not specified'}
                  </td>
                  <td style={tableCellStyle}>
                    {linkedDependency ? (
                      <div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#059669',
                          }}
                        >
                          ✓ Linked
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {linkedDependency.expectation}
                        </div>
                      </div>
                    ) : (
                      <span
                        style={{
                          color: '#6b7280',
                          fontStyle: 'italic',
                          fontSize: '0.75rem',
                        }}
                      >
                        No dependency link
                      </span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {signal.type === 'kpi'
                        ? 'Aggregated metric tracking performance over time'
                        : 'Event-based signal for real-time monitoring'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Enhanced Technical Implementation Section
 * Comprehensive service flow descriptions with telemetry requirements
 */
const EnhancedTechnicalImplementationSection: React.FC<{
  services: any[]
  telemetryMappings: TelemetryMappingItem[]
  signals: Signal[]
  impacts: Impact[]
}> = ({ services, telemetryMappings, signals, impacts }) => {
  // Get technical signals that relate to system implementation
  const technicalSignals = signals.filter(
    s => s.type === 'process' || s.type === 'system'
  )

  // Group telemetry by impact category
  const telemetryByImpact = telemetryMappings.reduce(
    (acc, mapping) => {
      const impact = impacts.find(i => i.id === mapping.impactId)
      const category = impact?.category || 'unknown'
      if (!acc[category]) acc[category] = []
      acc[category].push(mapping)
      return acc
    },
    {} as Record<string, TelemetryMappingItem[]>
  )

  return (
    <div>
      {/* Service Architecture Overview */}
      <div style={{ marginBottom: '2rem' }}>
        <h4
          style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '500' }}
        >
          Service Architecture & Flow
        </h4>

        {services.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  backgroundColor: '#f9fafb',
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                  {service.name}
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                  }}
                >
                  {service.technical_description}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    padding: '0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    color: '#374151',
                  }}
                >
                  {service.technical_flow}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '1rem',
              color: '#6b7280',
              fontStyle: 'italic',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
            }}
          >
            No technical services defined. Add service components to describe
            technical implementation.
          </div>
        )}
      </div>

      {/* Telemetry Requirements by Impact Category */}
      <div style={{ marginBottom: '2rem' }}>
        <h4
          style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '500' }}
        >
          Telemetry Requirements & Data Sources
        </h4>

        {Object.keys(telemetryByImpact).length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(telemetryByImpact).map(([category, mappings]) => (
              <div
                key={category}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                }}
              >
                <div
                  style={{
                    fontWeight: '500',
                    marginBottom: '0.75rem',
                    textTransform: 'capitalize',
                    color: getCategoryColor(category),
                  }}
                >
                  {category.replace('_', ' ')} Impact Telemetry
                </div>

                {mappings.map((mapping, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: '1rem', fontSize: '0.875rem' }}
                  >
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      📊 {mapping.telemetryRequired}
                    </div>
                    <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                      <strong>Data Sources:</strong> {mapping.dataSources}
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      <strong>Observable Signals:</strong>{' '}
                      {mapping.observableSignals}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '1rem',
              color: '#6b7280',
              fontStyle: 'italic',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
            }}
          >
            No telemetry mappings defined. Add telemetry requirements to provide
            implementation guidance.
          </div>
        )}
      </div>

      {/* Technical Signal Integration */}
      {technicalSignals.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Technical Signal Integration
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={tableHeaderStyle}>Signal Type</th>
                  <th style={tableHeaderStyle}>Signal Name</th>
                  <th style={tableHeaderStyle}>Owner Component</th>
                  <th style={tableHeaderStyle}>Implementation Notes</th>
                </tr>
              </thead>
              <tbody>
                {technicalSignals.map((signal, index) => (
                  <tr
                    key={signal.id || index}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                    }}
                  >
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor:
                            signal.type === 'process' ? '#ddd6fe' : '#e0e7ff',
                          color:
                            signal.type === 'process' ? '#7c3aed' : '#3730a3',
                        }}
                      >
                        {signal.type === 'process' ? 'Process' : 'System'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{signal.name}</td>
                    <td style={tableCellStyle}>
                      {signal.owner || 'Not specified'}
                    </td>
                    <td style={tableCellStyle}>
                      <div>
                        {signal.description ||
                          'Implementation details not specified'}
                      </div>
                      {signal.metricName && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontFamily: 'monospace',
                            marginTop: '0.25rem',
                          }}
                        >
                          Metric: {signal.metricName}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function for impact category colors
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'financial':
      return '#dc2626'
    case 'legal':
      return '#7c2d12'
    case 'operational':
      return '#ea580c'
    case 'customer_experience':
      return '#9333ea'
    default:
      return '#6b7280'
  }
}

/**
 * Enhanced Process Signals Section
 * Process monitoring signals with impact correlation and workflow integration
 */
const EnhancedProcessSignalsSection: React.FC<{
  signals: Signal[]
  impacts: Impact[]
  telemetryMappings: TelemetryMappingItem[]
}> = ({ signals, impacts, telemetryMappings }) => {
  // Find operational impacts that process signals typically monitor
  const operationalImpacts = impacts.filter(i => i.category === 'operational')

  if (signals.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic',
        }}
      >
        No process signals defined. Add Process signals to populate this
        section.
      </div>
    )
  }

  return (
    <div>
      {/* Process Signal Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#ddd6fe',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}
          >
            {signals.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#5b21b6' }}>
            Process Signals
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fed7aa',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ea580c' }}
          >
            {signals.filter(s => s.threshold).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#9a3412' }}>
            With Thresholds
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}
          >
            {operationalImpacts.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
            Related Impacts
          </div>
        </div>
      </div>

      {/* Enhanced Process Signals Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={tableHeaderStyle}>Signal Name</th>
              <th style={tableHeaderStyle}>Process Component</th>
              <th style={tableHeaderStyle}>Metric & Threshold</th>
              <th style={tableHeaderStyle}>Monitoring Purpose</th>
              <th style={tableHeaderStyle}>Operational Impact</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => (
              <tr
                key={signal.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                  borderLeft: '3px solid #7c3aed',
                }}
              >
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: '500' }}>{signal.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#7c3aed' }}>
                    🔄 Process Signal
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div>{signal.owner || 'Process Component'}</div>
                  {signal.metricName && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        fontFamily: 'monospace',
                      }}
                    >
                      {signal.metricName}
                    </div>
                  )}
                </td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: '500' }}>
                    {signal.threshold || 'Not specified'}
                  </div>
                  {signal.threshold && (
                    <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                      ✓ Threshold defined
                    </div>
                  )}
                </td>
                <td style={tableCellStyle}>
                  <div>{signal.description || 'Process monitoring signal'}</div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.25rem',
                    }}
                  >
                    Monitors process execution and workflow efficiency
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ fontSize: '0.75rem' }}>
                    {operationalImpacts.length > 0 ? (
                      <div>
                        <div style={{ color: '#ea580c', fontWeight: '500' }}>
                          Operational Risk
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          {operationalImpacts[0]?.description?.substring(0, 50)}
                          ...
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        No operational impacts defined
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Process Implementation Guidance */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.375rem',
          borderLeft: '4px solid #0284c7',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#0284c7',
          }}
        >
          💡 Process Signal Implementation Notes
        </h4>
        <ul
          style={{
            margin: '0',
            paddingLeft: '1.5rem',
            fontSize: '0.75rem',
            color: '#6b7280',
          }}
        >
          <li>
            Process signals monitor workflow execution, SLA compliance, and
            processing bottlenecks
          </li>
          <li>
            Implement at workflow decision points and queue depth monitoring
            locations
          </li>
          <li>
            Consider time-based thresholds for processing duration and queue
            wait times
          </li>
          <li>
            Link to operational impacts for business context and escalation
            procedures
          </li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Enhanced System Signals Section
 * Platform SRE-focused system monitoring with service integration
 */
const EnhancedSystemSignalsSection: React.FC<{
  signals: Signal[]
  services: any[]
  telemetryMappings: TelemetryMappingItem[]
}> = ({ signals, services, telemetryMappings }) => {
  if (signals.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic',
        }}
      >
        No system signals defined. Add System signals to populate this section.
      </div>
    )
  }

  return (
    <div>
      {/* System Signal Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#e0e7ff',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3730a3' }}
          >
            {signals.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#312e81' }}>
            System Signals
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d' }}
          >
            {services.length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#14532d' }}>
            Service Components
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}
          >
            {signals.filter(s => s.threshold).length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#991b1b' }}>
            Alert Thresholds
          </div>
        </div>
      </div>

      {/* Enhanced System Signals Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={tableHeaderStyle}>Signal Name</th>
              <th style={tableHeaderStyle}>System Component</th>
              <th style={tableHeaderStyle}>Alert Conditions</th>
              <th style={tableHeaderStyle}>Monitoring Scope</th>
              <th style={tableHeaderStyle}>Platform SRE Action</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => (
              <tr
                key={signal.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                  borderLeft: '3px solid #3730a3',
                }}
              >
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: '500' }}>{signal.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#3730a3' }}>
                    🖥️ System Signal
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div>{signal.owner || 'System Component'}</div>
                  {signal.metricName && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        fontFamily: 'monospace',
                      }}
                    >
                      {signal.metricName}
                    </div>
                  )}
                </td>
                <td style={tableCellStyle}>
                  <div style={{ fontWeight: '500' }}>
                    {signal.threshold || 'Not specified'}
                  </div>
                  {signal.threshold && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                      🚨 Alert configured
                    </div>
                  )}
                </td>
                <td style={tableCellStyle}>
                  <div>{signal.description || 'System monitoring signal'}</div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.25rem',
                    }}
                  >
                    Infrastructure health and availability monitoring
                  </div>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: '#3730a3', fontWeight: '500' }}>
                      Platform SRE Response
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      {signal.threshold
                        ? 'Escalate to on-call engineer for immediate investigation'
                        : 'Monitor for trend analysis and capacity planning'}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service Integration Overview */}
      {services.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            System Component Integration
          </h4>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  border: '1px solid #e0e7ff',
                  borderRadius: '0.375rem',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{ fontWeight: '500', color: '#3730a3' }}>
                    🔧 {service.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e0e7ff',
                      borderRadius: '0.25rem',
                      color: '#3730a3',
                    }}
                  >
                    System Component
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem',
                  }}
                >
                  {service.technical_description}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    padding: '0.5rem',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '0.25rem',
                    color: '#475569',
                  }}
                >
                  {service.technical_flow}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform SRE Implementation Guidance */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fef7ff',
          borderRadius: '0.375rem',
          borderLeft: '4px solid #9333ea',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#9333ea',
          }}
        >
          🛠️ Platform SRE Implementation Guidelines
        </h4>
        <ul
          style={{
            margin: '0',
            paddingLeft: '1.5rem',
            fontSize: '0.75rem',
            color: '#6b7280',
          }}
        >
          <li>
            System signals focus on infrastructure health, API availability, and
            resource utilization
          </li>
          <li>
            Implement at service boundaries and critical system interfaces
          </li>
          <li>
            Configure automated alerting for threshold breaches with escalation
            procedures
          </li>
          <li>
            Integrate with existing monitoring platforms (Prometheus, Grafana,
            PagerDuty)
          </li>
          <li>
            Include capacity planning metrics for proactive resource management
          </li>
        </ul>
      </div>

      {/* Dashboard Requirements */}
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.375rem',
          borderLeft: '4px solid #059669',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#059669',
          }}
        >
          📊 Recommended Dashboard Components
        </h4>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Service Health Dashboard:</strong> Real-time availability,
            response times, error rates
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Infrastructure Overview:</strong> CPU, memory, disk
            utilization across service components
          </div>
          <div>
            <strong>Alert Management:</strong> Active alerts, escalation status,
            resolution tracking
          </div>
        </div>
      </div>
    </div>
  )
}

// Common table styles
const tableHeaderStyle: React.CSSProperties = {
  padding: '0.75rem',
  textAlign: 'left',
  fontWeight: '500',
  fontSize: '0.875rem',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb',
}

const tableCellStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid #e5e7eb',
  verticalAlign: 'top',
}

export default BusinessImpactPlaybook
