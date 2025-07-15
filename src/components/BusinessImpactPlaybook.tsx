/**
 * Business Impact Playbook Component - REDESIGNED VERSION
 *
 * Implements the correct 5-section structure per BOS_METHODOLOGY_REDESIGN_SIMULATION.md
 * Removes role-outcome mapping and focuses on differentiating BOS value
 */

import React from 'react'
import { Step, Signal, Stakeholder } from '../types/index'

interface BusinessImpactPlaybookProps {
  step: Step | null
  flowName?: string
  stageName?: string
}

/**
 * Redesigned Business Impact Playbook Component
 * 5 sections focusing on BOS differentiating value
 */
const BusinessImpactPlaybook: React.FC<BusinessImpactPlaybookProps> = ({
  step,
  flowName = 'Business Process',
  stageName: _stageName = 'Process Stage',
}) => {
  // Extract BOS methodology data from step
  const stakeholders = step?.stakeholders || []
  const signals = step?.signals || []
  const services = step?.services || []

  // Helper function to format date
  const formatDate = (date: Date = new Date()) => {
    return (
      date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0]
    )
  }

  // Get business signals for primary display
  const businessSignals = signals.filter(s => s.type === 'business')
  const processSignals = signals.filter(s => s.type === 'process')
  const systemSignals = signals.filter(s => s.type === 'system')

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
          Business Impact Playbook
        </h1>
        <p
          style={{
            margin: '0',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          Comprehensive business impact documentation for {step?.name || 'step'}
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

      {/* Section 1: Process & Step Overview */}
      <PlaybookSection title="1. Process & Step Overview" badge="Context">
        <div style={{ marginBottom: '1.5rem' }}>
          <PlaybookField
            label="Business Process"
            value={flowName}
            placeholder="Business process name"
          />
          <PlaybookField
            label="Business Step"
            value={step?.name}
            placeholder="Process step name"
          />
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.375rem',
            marginBottom: '1.5rem',
          }}
        >
          <h4
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#0369a1',
            }}
          >
            Step Description
          </h4>
          <div style={{ color: '#374151' }}>
            {step?.description || 'No business context provided'}
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            borderRadius: '0.375rem',
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
            Business Impact When Failed
          </h4>
          <div style={{ color: '#374151' }}>
            When this step fails, the immediate business impact includes
            operational delays, stakeholder expectations not being met, and
            potential compliance or financial implications.
          </div>
        </div>
      </PlaybookSection>

      {/* Section 2: Business Signal Definitions */}
      <PlaybookSection title="2. Business Signal Definitions" badge="Signals">
        {businessSignals.length > 0 ? (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Primary Business Signals:</strong>{' '}
              {businessSignals.length} defined
            </div>

            {businessSignals.map((signal, index) => (
              <SignalCard
                key={signal.id || index}
                signal={signal}
                isPrimary={index === 0}
              />
            ))}
          </div>
        ) : (
          <EmptyStateMessage>
            No business signals defined. Business signals measure
            stakeholder-centric outcomes with financial, experience, legal/risk,
            or operational impact.
          </EmptyStateMessage>
        )}
      </PlaybookSection>

      {/* Section 3: Stakeholder Impact Assessment */}
      <PlaybookSection title="3. Stakeholder Impact Assessment" badge="Impact">
        {stakeholders.length > 0 ? (
          <div>
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {stakeholders.map((stakeholder, index) => (
                <StakeholderCard
                  key={stakeholder.id || index}
                  stakeholder={stakeholder}
                />
              ))}
            </div>

            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.375rem',
              }}
            >
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#d97706',
                }}
              >
                Business Impact Assessment
              </h4>
              <div style={{ fontSize: '0.75rem', color: '#374151' }}>
                <div>
                  • Customer/Process Impact: Critical for business operations
                </div>
                <div>
                  • Financial Impact: Revenue and cost implications when step
                  fails
                </div>
                <div>
                  • Compliance Impact: Regulatory requirements and deadlines
                </div>
                <div>
                  • Downstream Impact: Effects on dependent processes and
                  systems
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateMessage>
            No stakeholders identified. Add stakeholders in Task 2 to show
            impact assessment.
          </EmptyStateMessage>
        )}
      </PlaybookSection>

      {/* Section 4: Technical Implementation Bridge */}
      <PlaybookSection
        title="4. Technical Implementation Bridge"
        badge="Technical"
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h4
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Service Architecture Flow
          </h4>
          {services.length > 0 ? (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.375rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              {services.map(s => s.name).join(' → ')}
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No services defined
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Integration Points
          </h4>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            External dependencies and API integrations required for this step
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#ecfdf5',
            borderRadius: '0.375rem',
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
            Telemetry Strategy Requirements
          </h4>
          <ul
            style={{
              margin: '0.5rem 0 0 0',
              paddingLeft: '1.5rem',
              fontSize: '0.75rem',
              color: '#374151',
            }}
          >
            <li>Event emission when step executes</li>
            <li>Business logic evaluation tracking</li>
            <li>Real-time aggregation for dashboard display</li>
            <li>Integration with organizational monitoring platforms</li>
          </ul>
        </div>
      </PlaybookSection>

      {/* Section 5: Response Actions & Escalation */}
      <PlaybookSection
        title="5. Response Actions & Escalation"
        badge="Response"
      >
        <DiagnosticTriangulation
          businessSignals={businessSignals}
          processSignals={processSignals}
          systemSignals={systemSignals}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <h4
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            Immediate Response Framework
          </h4>
          <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.75rem' }}>
            <ResponseAction
              condition="Business signals degraded"
              action="Investigate business logic and stakeholder impact"
              owner="Product Owner"
            />
            <ResponseAction
              condition="Process signals degraded"
              action="Check workflow efficiency and bottlenecks"
              owner="Development Team"
            />
            <ResponseAction
              condition="System signals degraded"
              action="Infrastructure and availability investigation"
              owner="Platform SRE"
            />
          </div>
        </div>

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
            🚧 Implementation Handoff Boundary
          </h4>
          <div style={{ fontSize: '0.75rem', color: '#374151' }}>
            <strong>BOS Methodology Scope Complete:</strong> Business
            requirements and logical specifications
            <br />
            <strong>Telemetry Strategy Team Scope:</strong> Technical
            implementation, event schemas, dashboard configuration, alerting
            setup
          </div>
        </div>
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
        Generated by Business Observability System (BOS) | 4-Task Methodology |
        Focus on Business Differentiation
      </div>
    </div>
  )
}

/**
 * Playbook Section Component
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
 * Signal Card Component
 */
const SignalCard: React.FC<{ signal: Signal; isPrimary: boolean }> = ({
  signal,
  isPrimary,
}) => (
  <div
    style={{
      padding: '1rem',
      backgroundColor: isPrimary ? '#dcfce7' : '#f9fafb',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      border: isPrimary ? '2px solid #059669' : '1px solid #e5e7eb',
    }}
  >
    {isPrimary && (
      <div
        style={{
          fontSize: '0.75rem',
          color: '#059669',
          marginBottom: '0.5rem',
        }}
      >
        ⭐ PRIMARY SIGNAL
      </div>
    )}

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
      }}
    >
      <div style={{ flex: 1 }}>
        <h4
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          {signal.name}
        </h4>

        <div
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          Signal Type: 🟦 Business Signal | Owner:{' '}
          {signal.owner || 'Product Owner'}
        </div>

        {signal.primaryImpactType && (
          <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
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
      </div>
    </div>

    {signal.businessLogicDefinition && (
      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.25rem',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: '500',
            marginBottom: '0.25rem',
          }}
        >
          Business Logic Definition:
        </div>
        <div style={{ fontSize: '0.75rem', color: '#059669' }}>
          {signal.businessLogicDefinition}
        </div>
      </div>
    )}

    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}>
      <div>
        <strong>Description:</strong> {signal.description || 'Not specified'}
      </div>
      {signal.metricName && (
        <div>
          <strong>Metric:</strong> <code>{signal.metricName}</code>
        </div>
      )}
      {signal.threshold && (
        <div>
          <strong>Thresholds:</strong> {signal.threshold}
        </div>
      )}
    </div>
  </div>
)

/**
 * Stakeholder Card Component
 */
const StakeholderCard: React.FC<{ stakeholder: Stakeholder }> = ({
  stakeholder,
}) => (
  <div
    style={{
      padding: '0.75rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.375rem',
      border: '1px solid #e5e7eb',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
          {stakeholder.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          Type: {stakeholder.type}
        </div>
      </div>
      {stakeholder.role && (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#e5e7eb',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
          }}
        >
          {stakeholder.role}
        </div>
      )}
    </div>
    {stakeholder.expectation && (
      <div
        style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#374151' }}
      >
        {stakeholder.expectation}
      </div>
    )}
  </div>
)

/**
 * Diagnostic Triangulation Component
 */
const DiagnosticTriangulation: React.FC<{
  businessSignals: Signal[]
  processSignals: Signal[]
  systemSignals: Signal[]
}> = ({ businessSignals, processSignals, systemSignals }) => (
  <div
    style={{
      padding: '1rem',
      backgroundColor: '#fef7ff',
      borderRadius: '0.375rem',
    }}
  >
    <h4
      style={{
        margin: '0 0 1rem 0',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#9333ea',
      }}
    >
      🔍 Diagnostic Triangulation Framework
    </h4>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        marginBottom: '1rem',
        fontSize: '0.75rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
          Business Signals
        </div>
        <div style={{ color: '#6b7280' }}>{businessSignals.length} defined</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
          Process Signals
        </div>
        <div style={{ color: '#6b7280' }}>{processSignals.length} defined</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
          System Signals
        </div>
        <div style={{ color: '#6b7280' }}>{systemSignals.length} defined</div>
      </div>
    </div>

    <div style={{ fontSize: '0.75rem', color: '#374151' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Pattern Recognition:</strong>
      </div>
      <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
        <li>
          Business↓ Process↓ System→ = Business logic issue → Product Owner
        </li>
        <li>
          Business↓ Process↓ System↓ = Integration issue → Vendor escalation
        </li>
        <li>Business↓ Process✓ System✓ = Infrastructure → Platform SRE</li>
      </ul>
    </div>
  </div>
)

/**
 * Response Action Component
 */
const ResponseAction: React.FC<{
  condition: string
  action: string
  owner: string
}> = ({ condition, action, owner }) => (
  <div
    style={{
      padding: '0.5rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <div>
      <div style={{ fontWeight: '500' }}>{condition}</div>
      <div style={{ color: '#6b7280' }}>→ {action}</div>
    </div>
    <div
      style={{
        padding: '0.25rem 0.5rem',
        backgroundColor: '#dc2626',
        color: 'white',
        borderRadius: '0.25rem',
        fontSize: '0.625rem',
        fontWeight: '500',
      }}
    >
      {owner}
    </div>
  </div>
)

/**
 * Empty State Message Component
 */
const EmptyStateMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      padding: '2rem',
      textAlign: 'center',
      color: '#6b7280',
      fontStyle: 'italic',
    }}
  >
    {children}
  </div>
)

export default BusinessImpactPlaybook
