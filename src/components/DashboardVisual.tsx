/**
 * Dashboard Visual Component
 *
 * Shows a visual mockup preview of what the monitoring dashboard will look like
 * Part of Task 4 BOS methodology workflow
 */

import React from 'react'
import { Step, Signal, Stakeholder } from '../types/index'

interface DashboardVisualProps {
  step: Step | null
  flowName?: string
  stageName?: string
}

/**
 * Dashboard Visual Component
 * Visual mockup demonstrating the final dashboard implementation
 */
const DashboardVisual: React.FC<DashboardVisualProps> = ({
  step,
  flowName = 'Business Process',
  stageName: _stageName = 'Process Stage',
}) => {
  // Extract BOS methodology data from step
  const stakeholders = step?.stakeholders || []
  const signals = step?.signals || []

  // Get business signals for primary display
  const businessSignals = signals.filter(s => s.type === 'business')
  const processSignals = signals.filter(s => s.type === 'process')
  const systemSignals = signals.filter(s => s.type === 'system')

  // Get primary business signal for mockup data
  const primarySignal = businessSignals[0]
  const mockValue = 92.3 // Simulated current value
  const isWarning = mockValue < 95 && mockValue >= 90
  const isCritical = mockValue < 90

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
          Dashboard Visual Preview
        </h1>
        <p
          style={{
            margin: '0',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          Mockup of monitoring dashboard for {step?.name || 'step'}
        </p>
      </div>

      {/* Dashboard Mockup */}
      <div
        style={{
          border: '2px solid #374151',
          borderRadius: '0.5rem',
          backgroundColor: '#f9fafb',
          padding: '1rem',
        }}
      >
        {/* Dashboard Header */}
        <DashboardHeader flowName={flowName} />

        {/* Main Metric Panel */}
        <MainMetricPanel
          signal={primarySignal}
          value={mockValue}
          isWarning={isWarning}
          isCritical={isCritical}
        />

        {/* Diagnostic Triangulation */}
        <DiagnosticPanel
          businessSignals={businessSignals}
          processSignals={processSignals}
          systemSignals={systemSignals}
          mockValue={mockValue}
        />

        {/* Active Alerts */}
        <AlertsPanel
          signal={primarySignal}
          value={mockValue}
          isWarning={isWarning}
        />

        {/* Business Context */}
        <BusinessContextPanel
          step={step}
          stakeholders={stakeholders}
          signal={primarySignal}
        />
      </div>

      {/* Implementation Notes */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.375rem',
          borderLeft: '4px solid #0369a1',
        }}
      >
        <h3
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#0369a1',
          }}
        >
          📊 Dashboard Implementation Notes
        </h3>
        <div style={{ fontSize: '0.75rem', color: '#374151' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Real Implementation:</strong> Connect to Grafana with actual
            metric queries
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Data Source:</strong> Event streams defined in Dashboard
            Requirements
          </div>
          <div>
            <strong>Refresh Rate:</strong> 30-second updates for near real-time
            monitoring
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard Header Component
 */
const DashboardHeader: React.FC<{ flowName?: string }> = ({ flowName }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: '#1f2937',
      color: 'white',
      borderRadius: '0.375rem 0.375rem 0 0',
      marginBottom: '1rem',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>🏠</span>
      <strong>{flowName} Operations Dashboard</strong>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>🔄</span>
      <span style={{ fontSize: '0.75rem' }}>30s</span>
    </div>
  </div>
)

/**
 * Main Metric Panel Component
 */
const MainMetricPanel: React.FC<{
  signal?: Signal
  value: number
  isWarning: boolean
  isCritical: boolean
}> = ({ signal, value, isWarning, isCritical }) => {
  const status = isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'GOOD'
  const statusColor = isCritical ? '#dc2626' : isWarning ? '#d97706' : '#059669'
  const statusIcon = isCritical ? '🔴' : isWarning ? '🟡' : '🟢'

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3
        style={{
          margin: '0 0 1rem 0',
          fontSize: '1rem',
          fontWeight: '500',
          color: '#374151',
        }}
      >
        {signal?.name || 'Customers with Actionable Credit Data Rate'}
      </h3>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          padding: '1rem',
          backgroundColor: 'white',
        }}
      >
        {/* Current Value Display */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
            }}
          >
            📊 {value}%
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: isCritical
                ? '#fef2f2'
                : isWarning
                  ? '#fef3c7'
                  : '#f0fdf4',
              color: statusColor,
              borderRadius: '0.375rem',
              fontWeight: '500',
            }}
          >
            {statusIcon} {status}
          </div>
        </div>

        {/* Chart Mockup */}
        <ChartMockup value={value} />

        {/* Last Alert */}
        {(isWarning || isCritical) && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              color: '#92400e',
            }}
          >
            Last Alert: 15:23 - Credit data quality degraded to {value}%
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Chart Mockup Component
 */
const ChartMockup: React.FC<{ value: number }> = ({ value }) => (
  <div
    style={{
      height: '120px',
      backgroundColor: '#f9fafb',
      borderRadius: '0.25rem',
      padding: '0.5rem',
      position: 'relative',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
    }}
  >
    {/* Y-axis labels and threshold lines */}
    <div style={{ position: 'absolute', left: '0.25rem', top: '0.25rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>100%</div>
      <div style={{ marginBottom: '0.5rem', color: '#059669' }}>
        95% ─ ─ Good
      </div>
      <div style={{ marginBottom: '0.5rem', color: '#d97706' }}>
        90% ─ ─ Warning
      </div>
      <div style={{ marginBottom: '0.5rem' }}>85%</div>
      <div style={{ marginBottom: '0.5rem' }}>80%</div>
    </div>

    {/* Chart bars mockup */}
    <div
      style={{
        position: 'absolute',
        bottom: '1rem',
        left: '3rem',
        right: '0.5rem',
        height: '60px',
        display: 'flex',
        alignItems: 'end',
        gap: '2px',
      }}
    >
      {[88, 91, 89, 92, 94, 93, 92, 91, 90, value].map((val, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(val / 100) * 60}px`,
            backgroundColor:
              val < 90 ? '#dc2626' : val < 95 ? '#d97706' : '#059669',
            borderRadius: '1px',
          }}
        />
      ))}
    </div>

    {/* X-axis */}
    <div
      style={{
        position: 'absolute',
        bottom: '0.25rem',
        left: '3rem',
        right: '0.5rem',
        fontSize: '0.625rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span>08:00</span>
      <span>10:00</span>
      <span>12:00</span>
      <span>14:00</span>
      <span>16:00</span>
      <span style={{ fontWeight: 'bold' }}>NOW</span>
    </div>
  </div>
)

/**
 * Diagnostic Panel Component
 */
const DiagnosticPanel: React.FC<{
  businessSignals: Signal[]
  processSignals: Signal[]
  systemSignals: Signal[]
  mockValue: number
}> = ({ mockValue }) => (
  <div style={{ marginBottom: '1rem' }}>
    <h3
      style={{
        margin: '0 0 1rem 0',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#374151',
      }}
    >
      Diagnostic Triangulation
    </h3>

    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      {/* Signal Status Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <SignalStatus
          type="Business Signal"
          value={mockValue}
          status={mockValue < 95 ? 'WARN' : 'GOOD'}
          color={mockValue < 95 ? '#d97706' : '#059669'}
        />
        <SignalStatus
          type="Process Signal"
          value={98.7}
          status="GOOD"
          color="#059669"
        />
        <SignalStatus
          type="System Signal"
          value={99.9}
          status="GOOD"
          color="#059669"
        />
      </div>

      {/* Diagnosis */}
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.375rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <span>🔍</span>
          <strong>Diagnosis: Business Logic Issue</strong>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <span>👤</span>
          <strong>Responsible: Product Owner</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📋</span>
          <strong>Action: Fix credit score validation logic</strong>
        </div>
      </div>
    </div>
  </div>
)

/**
 * Signal Status Component
 */
const SignalStatus: React.FC<{
  type: string
  value: number
  status: string
  color: string
}> = ({ type, value, status, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}
    >
      {type}
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
    >
      <span>{status === 'GOOD' ? '✅' : '❌'}</span>
      <span style={{ fontWeight: '500' }}>{value}%</span>
      <span style={{ color, fontSize: '0.75rem', fontWeight: '500' }}>
        ({status})
      </span>
    </div>
  </div>
)

/**
 * Alerts Panel Component
 */
const AlertsPanel: React.FC<{
  signal?: Signal
  value: number
  isWarning: boolean
}> = ({ signal, value, isWarning }) => (
  <div style={{ marginBottom: '1rem' }}>
    <h3
      style={{
        margin: '0 0 1rem 0',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#374151',
      }}
    >
      Active Alerts
    </h3>

    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      {isWarning ? (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.375rem',
            borderLeft: '4px solid #d97706',
          }}
        >
          <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
            🟡 15:23 Credit Data Quality Warning
          </div>
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            {value}% actionable credit data rate (threshold: 95%)
          </div>
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Notified: {signal?.owner || 'Product Owner'} via PagerDuty
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Impact: Loan Officers investigation in progress
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#6b7280',
            fontStyle: 'italic',
          }}
        >
          No active alerts - all signals within normal ranges
        </div>
      )}
    </div>
  </div>
)

/**
 * Business Context Panel Component
 */
const BusinessContextPanel: React.FC<{
  step: Step | null
  stakeholders: Stakeholder[]
  signal?: Signal
}> = ({ step, stakeholders, signal }) => (
  <div>
    <h3
      style={{
        margin: '0 0 1rem 0',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#374151',
      }}
    >
      Business Context
    </h3>

    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>Step:</strong>{' '}
        {step?.name || 'Validate Customer Credit Information'}
      </div>
      <div style={{ marginBottom: '0.75rem' }}>
        <strong>Purpose:</strong>{' '}
        {step?.description ||
          'Support loan underwriting decisions with actionable data for loan officers within regulatory timeframes'}
      </div>

      {signal?.businessLogicDefinition && (
        <div style={{ marginBottom: '0.75rem' }}>
          <strong>Business Logic:</strong> {signal.businessLogicDefinition}
        </div>
      )}

      <div>
        <strong>Stakeholders:</strong>{' '}
        {stakeholders.length > 0
          ? stakeholders.map(s => s.name).join(', ')
          : 'Loan Officers, Customer Credit Accounts, Experian Credit Bureau'}
      </div>
    </div>
  </div>
)

export default DashboardVisual
