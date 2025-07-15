/**
 * Dashboard Requirements Component
 *
 * Auto-generates technical dashboard requirements from Task 3 signal data
 * Part of Task 4 BOS methodology workflow
 */

import React from 'react'
import { Step, Signal, Stakeholder } from '../types/index'

interface DashboardRequirementsProps {
  step: Step | null
  flowName?: string
  stageName?: string
}

/**
 * Dashboard Requirements Component
 * 6 sections providing technical implementation specifications
 */
const DashboardRequirements: React.FC<DashboardRequirementsProps> = ({
  step,
  flowName = 'Business Process',
  stageName: _stageName = 'Process Stage',
}) => {
  // Extract BOS methodology data from step
  const stakeholders = step?.stakeholders || []
  const signals = step?.signals || []

  // Helper function to format date
  const formatDate = (date: Date = new Date()) => {
    return (
      date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
    )
  }

  // Get signals by type for correlation section
  const businessSignals = signals.filter(s => s.type === 'business')
  const processSignals = signals.filter(s => s.type === 'process')
  const systemSignals = signals.filter(s => s.type === 'system')

  // Get primary business signal for detailed implementation
  const primaryBusinessSignal = businessSignals[0]

  return (
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
          Dashboard Requirements
        </h1>
        <p
          style={{
            margin: '0',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          Technical implementation specifications for {step?.name || 'step'}
        </p>
      </div>

      {/* Metadata Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}
      >
        <div>
          Process: {flowName} | Step: {step?.name || 'Undefined'}
        </div>
        <div>Generated: {formatDate()} | Version: 4-Task Methodology</div>
      </div>

      {/* Section 1: Signal Implementation Specification */}
      <RequirementsSection
        title="1. Signal Implementation Specification"
        badge="Metrics"
      >
        {businessSignals.length > 0 ? (
          businessSignals.map((signal, index) => (
            <SignalImplementation key={index} signal={signal} />
          ))
        ) : (
          <EmptyState message="No business signals defined in Task 3" />
        )}
      </RequirementsSection>

      {/* Section 2: Alert Configuration */}
      <RequirementsSection title="2. Alert Configuration" badge="Thresholds">
        {primaryBusinessSignal ? (
          <AlertConfiguration signal={primaryBusinessSignal} />
        ) : (
          <EmptyState message="No business signals with thresholds defined" />
        )}
      </RequirementsSection>

      {/* Section 3: Notification Requirements */}
      <RequirementsSection
        title="3. Notification Requirements"
        badge="Contacts"
      >
        <NotificationRequirements
          signal={primaryBusinessSignal}
          stakeholders={stakeholders}
        />
      </RequirementsSection>

      {/* Section 4: Dashboard Placement Specification */}
      <RequirementsSection
        title="4. Dashboard Placement Specification"
        badge="Location"
      >
        <DashboardPlacement
          flowName={flowName}
          stepName={step?.name}
          signals={signals}
        />
      </RequirementsSection>

      {/* Section 5: Diagnostic Correlation */}
      <RequirementsSection title="5. Diagnostic Correlation" badge="Patterns">
        <DiagnosticCorrelation
          businessSignals={businessSignals}
          processSignals={processSignals}
          systemSignals={systemSignals}
        />
      </RequirementsSection>

      {/* Section 6: Implementation Handoff Boundary */}
      <RequirementsSection
        title="6. Implementation Handoff Boundary"
        badge="Handoff"
      >
        <ImplementationHandoff />
      </RequirementsSection>
    </div>
  )
}

/**
 * Requirements Section Component
 */
const RequirementsSection: React.FC<{
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
 * Signal Implementation Component
 */
const SignalImplementation: React.FC<{ signal: Signal }> = ({ signal }) => (
  <div
    style={{
      padding: '1rem',
      backgroundColor: '#f0f9ff',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
    }}
  >
    <h3
      style={{
        margin: '0 0 0.75rem 0',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#0369a1',
      }}
    >
      {signal.name}
    </h3>

    {signal.primaryImpactType && (
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>Impact Type:</strong>{' '}
        {signal.primaryImpactType === 'financial'
          ? '💰 Financial'
          : signal.primaryImpactType === 'experience'
            ? '😊 Experience'
            : signal.primaryImpactType === 'legal'
              ? '⚖️ Legal/Risk'
              : signal.primaryImpactType === 'operational'
                ? '⚙️ Operational'
                : signal.primaryImpactType}
      </div>
    )}

    {signal.businessLogicDefinition && (
      <div
        style={{
          marginBottom: '0.75rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.25rem',
        }}
      >
        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
          Business Logic Definition:
        </div>
        <div style={{ color: '#0369a1' }}>{signal.businessLogicDefinition}</div>
      </div>
    )}

    <div style={{ marginBottom: '0.75rem' }}>
      <strong>Calculation Formula:</strong>
      <div
        style={{
          fontFamily: 'monospace',
          backgroundColor: '#e0f2fe',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          marginTop: '0.25rem',
        }}
      >
        {signal.metricName ||
          `${signal.name.toLowerCase().replace(/\s+/g, '_')}_rate`}{' '}
        = (count(events.where({getCalculationCondition(signal)})) /
        count(events.total)) * 100
      </div>
    </div>

    <div>
      <strong>Required Events:</strong>
      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.25rem',
        }}
      >
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Event Name:</strong> <code>{getEventName(signal)}</code>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Required Fields:</strong>
          <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
            {getRequiredFields(signal).map((field, index) => (
              <li key={index}>
                <code>{field.name}</code> - {field.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Processing Logic:</strong> {getProcessingLogic(signal)}
        </div>
      </div>
    </div>
  </div>
)

/**
 * Alert Configuration Component
 */
const AlertConfiguration: React.FC<{ signal: Signal }> = ({ signal }) => {
  const thresholds = parseThresholds(signal.threshold)

  return (
    <div>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        {signal.name} Alert Configuration
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <AlertThreshold
          level="Good"
          threshold={thresholds.good || '>95%'}
          color="#059669"
          action="No action required - system performing as expected"
        />
        <AlertThreshold
          level="Warning"
          threshold={thresholds.warning || '90-95%'}
          color="#d97706"
          action="Investigate: Check related process signals for degradation patterns"
        />
        <AlertThreshold
          level="Critical"
          threshold={thresholds.critical || '<90%'}
          color="#dc2626"
          action="Immediate response: Engage Product Owner and development team"
        />
      </div>

      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
        }}
      >
        <strong>Note:</strong> Duration thresholds (how long condition must
        persist) to be determined by telemetry team based on business
        criticality.
      </div>
    </div>
  )
}

/**
 * Alert Threshold Component
 */
const AlertThreshold: React.FC<{
  level: string
  threshold: string
  color: string
  action: string
}> = ({ level, threshold, color, action }) => (
  <div
    style={{
      marginBottom: '0.75rem',
      padding: '0.75rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.375rem',
    }}
  >
    <div
      style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: '0.5rem',
        }}
      />
      <strong>{level} Threshold:</strong>
      <code style={{ marginLeft: '0.5rem', color }}>{threshold}</code>
    </div>
    <div
      style={{ marginLeft: '1.25rem', fontSize: '0.75rem', color: '#6b7280' }}
    >
      {action}
    </div>
    <div
      style={{ marginLeft: '1.25rem', fontSize: '0.75rem', color: '#9ca3af' }}
    >
      Duration: [TBD by telemetry team]
    </div>
  </div>
)

/**
 * Notification Requirements Component
 */
const NotificationRequirements: React.FC<{
  signal: Signal | undefined
  stakeholders: Stakeholder[]
}> = ({ signal, stakeholders }) => (
  <div>
    <div style={{ marginBottom: '1rem' }}>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        Primary Signal Owner
      </h4>
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <div>
          <strong>Owner:</strong> {signal?.owner || 'Product Owner'}
        </div>
        <div>
          <strong>Contact Method:</strong> [TBD - PagerDuty/Slack channel]
        </div>
        <div>
          <strong>Escalation:</strong> Alert on Warning and Critical thresholds
        </div>
      </div>
    </div>

    <div>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        Affected Stakeholders
      </h4>
      {stakeholders.length > 0 ? (
        <div>
          {stakeholders.map((stakeholder, index) => (
            <div
              key={index}
              style={{
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ fontWeight: '500' }}>{stakeholder.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Type: {stakeholder.type} | Contact: [TBD by organization]
              </div>
              {stakeholder.type === 'vendor' && (
                <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>
                  ⚠️ External vendor - requires contract-based escalation
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No stakeholders defined in Task 2" />
      )}
    </div>
  </div>
)

/**
 * Dashboard Placement Component
 */
const DashboardPlacement: React.FC<{
  flowName?: string
  stepName?: string
  signals: Signal[]
}> = ({ flowName, signals }) => (
  <div>
    <div style={{ marginBottom: '1rem' }}>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        Primary Dashboard
      </h4>
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#dcfce7',
          borderRadius: '0.375rem',
          border: '1px solid #059669',
        }}
      >
        <div>
          <strong>Dashboard Name:</strong> {flowName} Operations Dashboard
        </div>
        <div>
          <strong>Section:</strong> Business Step Performance
        </div>
        <div>
          <strong>Panel Type:</strong> Time series with threshold lines
        </div>
        <div>
          <strong>Refresh Rate:</strong> 1 minute (near real-time)
        </div>
        <div>
          <strong>Primary Audience:</strong> Product Owners, Business Operations
        </div>
      </div>
    </div>

    {signals.length > 0 && (
      <div>
        <h4
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          Additional Context Dashboards
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          {signals.some(s => s.type === 'process') && (
            <li>Development Team Dashboard - Process signal monitoring</li>
          )}
          {signals.some(s => s.type === 'system') && (
            <li>Platform SRE Dashboard - System signal correlation</li>
          )}
          <li>Executive Summary Dashboard - Aggregated business impact view</li>
        </ul>
      </div>
    )}
  </div>
)

/**
 * Diagnostic Correlation Component
 */
const DiagnosticCorrelation: React.FC<{
  businessSignals: Signal[]
  processSignals: Signal[]
  systemSignals: Signal[]
}> = ({ businessSignals, processSignals, systemSignals }) => (
  <div>
    <div style={{ marginBottom: '1rem' }}>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        Required Companion Signals
      </h4>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <SignalTypeGroup
          type="Business"
          signals={businessSignals}
          color="#3b82f6"
        />
        <SignalTypeGroup
          type="Process"
          signals={processSignals}
          color="#059669"
        />
        <SignalTypeGroup
          type="System"
          signals={systemSignals}
          color="#d97706"
        />
      </div>
    </div>

    <div>
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        Diagnostic Patterns
      </h4>
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <DiagnosticPattern
          pattern="Business signal degraded + Process signals normal"
          owner="Product Owner"
          action="Review business logic and data quality"
        />
        <DiagnosticPattern
          pattern="Business signal degraded + Process signals degraded"
          owner="Development Team"
          action="Investigate code changes and deployment issues"
        />
        <DiagnosticPattern
          pattern="All signals degraded including system"
          owner="Platform SRE"
          action="Infrastructure issue - check system health"
        />
      </div>
    </div>
  </div>
)

/**
 * Signal Type Group Component
 */
const SignalTypeGroup: React.FC<{
  type: string
  signals: Signal[]
  color: string
}> = ({ type, signals, color }) => (
  <div
    style={{
      padding: '0.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.25rem',
      borderLeft: `3px solid ${color}`,
    }}
  >
    <div
      style={{
        fontWeight: '500',
        fontSize: '0.75rem',
        marginBottom: '0.25rem',
      }}
    >
      {type} Signals ({signals.length})
    </div>
    {signals.length > 0 ? (
      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
        {signals.map(s => s.name).join(', ')}
      </div>
    ) : (
      <div
        style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}
      >
        None defined
      </div>
    )}
  </div>
)

/**
 * Diagnostic Pattern Component
 */
const DiagnosticPattern: React.FC<{
  pattern: string
  owner: string
  action: string
}> = ({ pattern, owner, action }) => (
  <div
    style={{
      marginBottom: '0.75rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e5e7eb',
    }}
  >
    <div style={{ fontSize: '0.75rem', fontWeight: '500' }}>{pattern}</div>
    <div
      style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}
    >
      → Owner: {owner} | Action: {action}
    </div>
  </div>
)

/**
 * Implementation Handoff Component
 */
const ImplementationHandoff: React.FC = () => (
  <div>
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#f0fdf4',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        border: '1px solid #059669',
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
        BOS Methodology Scope (Complete)
      </h4>
      <ul
        style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.75rem' }}
      >
        <li>✅ Business signal definitions with impact types</li>
        <li>✅ Stakeholder notification requirements</li>
        <li>✅ Alert thresholds and response procedures</li>
        <li>✅ Dashboard placement specifications</li>
        <li>✅ Diagnostic correlation patterns</li>
      </ul>
    </div>

    <div
      style={{
        padding: '1rem',
        backgroundColor: '#fef2f2',
        borderRadius: '0.375rem',
        border: '1px solid #dc2626',
      }}
    >
      <h4
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#dc2626',
        }}
      >
        Telemetry Strategy Scope (Handoff Required)
      </h4>
      <ul
        style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.75rem' }}
      >
        <li>🔄 Grafana query implementation</li>
        <li>🔄 PagerDuty integration setup</li>
        <li>🔄 Slack channel configuration</li>
        <li>🔄 Event collection infrastructure</li>
        <li>🔄 Data pipeline configuration</li>
      </ul>
      <div
        style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#7f1d1d' }}
      >
        <strong>Next Step:</strong> Schedule handoff meeting with telemetry team
        to begin technical implementation
      </div>
    </div>
  </div>
)

/**
 * Empty State Component
 */
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      padding: '2rem',
      textAlign: 'center',
      color: '#9ca3af',
      fontStyle: 'italic',
    }}
  >
    {message}
  </div>
)

// Helper functions

function getCalculationCondition(signal: Signal): string {
  const name = signal.name.toLowerCase()
  if (name.includes('credit') && name.includes('actionable')) {
    return 'credit_score_present=true'
  } else if (name.includes('processed')) {
    return 'status=completed'
  } else if (name.includes('success')) {
    return 'status=success'
  }
  return 'condition=true'
}

function getEventName(signal: Signal): string {
  const name = signal.name.toLowerCase().replace(/\s+/g, '_')
  if (name.includes('credit')) {
    return 'credit_request_processed'
  } else if (name.includes('process')) {
    return 'business_step_processed'
  }
  return `${name}_event`
}

function getRequiredFields(
  signal: Signal
): Array<{ name: string; description: string }> {
  const name = signal.name.toLowerCase()
  const baseFields = [
    { name: 'timestamp', description: 'Event occurrence time' },
    { name: 'step_id', description: 'Business step identifier' },
  ]

  if (name.includes('credit')) {
    return [
      ...baseFields,
      { name: 'customer_id', description: 'Unique customer identifier' },
      {
        name: 'credit_score_present',
        description: 'Boolean flag for actionable data',
      },
      { name: 'request_type', description: 'Type of credit request' },
    ]
  }

  return [
    ...baseFields,
    { name: 'entity_id', description: 'Business entity identifier' },
    { name: 'status', description: 'Processing status' },
  ]
}

function getProcessingLogic(signal: Signal): string {
  const name = signal.name.toLowerCase()
  if (name.includes('actionable')) {
    return 'Count events where required business data is present and valid'
  } else if (name.includes('success')) {
    return 'Calculate percentage of successful completions'
  }
  return 'Aggregate events based on business logic definition'
}

function parseThresholds(threshold?: string): {
  good?: string
  warning?: string
  critical?: string
} {
  if (!threshold) {
    return { good: '>95%', warning: '90-95%', critical: '<90%' }
  }

  // Simple parsing - in real implementation would be more sophisticated
  if (threshold.includes('>')) {
    const value = parseInt(threshold.replace(/[>%]/g, ''))
    return {
      good: threshold,
      warning: `${value - 5}-${value}%`,
      critical: `<${value - 5}%`,
    }
  }

  return { good: '>95%', warning: '90-95%', critical: '<90%' }
}

export default DashboardRequirements
