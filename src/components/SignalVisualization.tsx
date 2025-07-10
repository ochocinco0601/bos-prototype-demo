/**
 * Signal Visualization Components
 *
 * Session 5 Task 3: Advanced signal visualization and linkage displays
 * - Interactive signal flow diagrams
 * - Dependency visualization with hover effects
 * - Signal health indicators and quality metrics
 * - Signal-to-impact traceability mapping
 */

import React, { useState } from 'react'
import {
  Signal,
  Dependency,
  Impact,
  TelemetryMappingItem,
} from '../types/index'

interface SignalVisualizationProps {
  signals: Signal[]
  dependencies?: Dependency[]
  impacts?: Impact[]
  telemetryMappings?: TelemetryMappingItem[]
  showInteractive?: boolean
}

interface SignalFlowDiagramProps {
  signals: Signal[]
  dependencies: Dependency[]
  showHoverEffects?: boolean
}

interface SignalHealthIndicatorProps {
  signal: Signal
  healthStatus?: 'healthy' | 'warning' | 'critical' | 'unknown'
  showMetrics?: boolean
}

interface SignalLinkageMapProps {
  signals: Signal[]
  dependencies: Dependency[]
  impacts: Impact[]
  telemetryMappings: TelemetryMappingItem[]
}

/**
 * Main Signal Visualization Component
 * Provides comprehensive signal analysis with interactive features
 */
const SignalVisualization: React.FC<SignalVisualizationProps> = ({
  signals,
  dependencies = [],
  impacts = [],
  telemetryMappings = [],
  showInteractive = true,
}) => {
  const [activeSignal, setActiveSignal] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'flow' | 'linkage'>(
    'overview'
  )

  // Signal categorization
  const signalsByType = {
    kpi: signals.filter(s => s.type === 'kpi'),
    business: signals.filter(s => s.type === 'business'),
    process: signals.filter(s => s.type === 'process'),
    system: signals.filter(s => s.type === 'system'),
  }

  // Linkage analysis
  const linkedSignals = signals.filter(s => s.dependencyId)
  const unlinkedSignals = signals.filter(s => !s.dependencyId)

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
        No signals available for visualization
      </div>
    )
  }

  return (
    <div>
      {/* View Mode Controls */}
      {showInteractive && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
          }}
        >
          {(['overview', 'flow', 'linkage'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: viewMode === mode ? '#3b82f6' : 'white',
                color: viewMode === mode ? 'white' : '#6b7280',
                transition: 'all 0.2s',
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)} View
            </button>
          ))}
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <SignalOverviewVisualization
          signalsByType={signalsByType}
          linkedCount={linkedSignals.length}
          unlinkedCount={unlinkedSignals.length}
          activeSignal={activeSignal}
          onSignalHover={setActiveSignal}
        />
      )}

      {viewMode === 'flow' && (
        <SignalFlowDiagram
          signals={signals}
          dependencies={dependencies}
          showHoverEffects={showInteractive}
        />
      )}

      {viewMode === 'linkage' && (
        <SignalLinkageMap
          signals={signals}
          dependencies={dependencies}
          impacts={impacts}
          telemetryMappings={telemetryMappings}
        />
      )}
    </div>
  )
}

/**
 * Signal Overview Visualization
 * Shows signal distribution and health metrics
 */
const SignalOverviewVisualization: React.FC<{
  signalsByType: Record<string, Signal[]>
  linkedCount: number
  unlinkedCount: number
  activeSignal: string | null
  onSignalHover: (id: string | null) => void
}> = ({
  signalsByType,
  linkedCount,
  unlinkedCount,
  activeSignal,
  onSignalHover,
}) => {
  const typeColors = {
    kpi: { bg: '#dcfce7', border: '#059669', text: '#065f46' },
    business: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' },
    process: { bg: '#ddd6fe', border: '#7c3aed', text: '#5b21b6' },
    system: { bg: '#e0e7ff', border: '#3730a3', text: '#312e81' },
  }

  return (
    <div>
      {/* Signal Type Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {Object.entries(signalsByType).map(([type, signals]) => {
          const colors = typeColors[type as keyof typeof typeColors]
          return (
            <div
              key={type}
              style={{
                padding: '1rem',
                backgroundColor: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: '0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                transform: activeSignal === type ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={() => onSignalHover(type)}
              onMouseLeave={() => onSignalHover(null)}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: colors.text,
                }}
              >
                {signals.length}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: colors.text,
                  textTransform: 'uppercase',
                }}
              >
                {type} {signals.length === 1 ? 'Signal' : 'Signals'}
              </div>
              {signals.length > 0 && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: colors.text,
                    marginTop: '0.25rem',
                  }}
                >
                  {signals.filter(s => s.dependencyId).length} linked
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Linkage Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d' }}
          >
            {linkedCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#166534' }}>
            Dependency Linked
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#16a34a',
              marginTop: '0.25rem',
            }}
          >
            ✓ Role-outcome mappings active
          </div>
        </div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}
          >
            {unlinkedCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#991b1b' }}>
            Step-Level Only
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#dc2626',
              marginTop: '0.25rem',
            }}
          >
            ⚠ No dependency linkage
          </div>
        </div>
      </div>

      {/* Signal Health Overview */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.375rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <h4
          style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '500' }}
        >
          Signal Health Overview
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0.5rem',
          }}
        >
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ color: '#059669', fontSize: '1.25rem' }}>●</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Healthy</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ color: '#f59e0b', fontSize: '1.25rem' }}>●</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Warning</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ color: '#ef4444', fontSize: '1.25rem' }}>●</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Critical
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem' }}>
            <div style={{ color: '#9ca3af', fontSize: '1.25rem' }}>●</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Unknown</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Signal Flow Diagram
 * Shows signal relationships and dependencies
 */
const SignalFlowDiagram: React.FC<SignalFlowDiagramProps> = ({
  signals,
  dependencies,
  showHoverEffects = true,
}) => {
  const [hoveredSignal, setHoveredSignal] = useState<string | null>(null)

  // Group signals by dependency linkage
  const linkedSignals = signals.filter(s => s.dependencyId)
  const stepLevelSignals = signals.filter(s => !s.dependencyId)

  return (
    <div>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '500' }}>
        Signal Flow & Dependencies
      </h4>

      {/* Dependency-Linked Signals */}
      {linkedSignals.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h5
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#059669',
            }}
          >
            📊 Dependency-Linked Signals (Role-Outcome Mappings)
          </h5>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {linkedSignals.map(signal => {
              const dependency = dependencies.find(
                d => d.id === signal.dependencyId
              )
              const isHovered = hoveredSignal === signal.id

              return (
                <div
                  key={signal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: isHovered ? '#f0f9ff' : 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: showHoverEffects ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                  }}
                  onMouseEnter={() =>
                    showHoverEffects && setHoveredSignal(signal.id || null)
                  }
                  onMouseLeave={() =>
                    showHoverEffects && setHoveredSignal(null)
                  }
                >
                  {/* Signal */}
                  <div
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: getSignalColor(signal.type).bg,
                      color: getSignalColor(signal.type).text,
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      minWidth: '120px',
                      textAlign: 'center',
                    }}
                  >
                    {signal.name}
                  </div>

                  {/* Arrow */}
                  <div style={{ margin: '0 1rem', color: '#6b7280' }}>→</div>

                  {/* Dependency */}
                  <div
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      flex: 1,
                    }}
                  >
                    {dependency ? dependency.expectation : 'Unknown dependency'}
                  </div>

                  {/* Signal Health */}
                  <SignalHealthIndicator
                    signal={signal}
                    showMetrics={isHovered}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step-Level Signals */}
      {stepLevelSignals.length > 0 && (
        <div>
          <h5
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
            }}
          >
            ⚙️ Step-Level Signals (Process & System)
          </h5>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {stepLevelSignals.map(signal => {
              const isHovered = hoveredSignal === signal.id

              return (
                <div
                  key={signal.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: isHovered ? '#f9fafb' : 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    cursor: showHoverEffects ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={() =>
                    showHoverEffects && setHoveredSignal(signal.id || null)
                  }
                  onMouseLeave={() =>
                    showHoverEffects && setHoveredSignal(null)
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: getSignalColor(signal.type).bg,
                        color: getSignalColor(signal.type).text,
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}
                    >
                      {signal.type}
                    </span>
                    <SignalHealthIndicator
                      signal={signal}
                      showMetrics={false}
                    />
                  </div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {signal.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {signal.description || 'No description'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Signal Health Indicator
 * Shows signal status with optional metrics
 */
const SignalHealthIndicator: React.FC<SignalHealthIndicatorProps> = ({
  signal,
  healthStatus = 'unknown',
  showMetrics = false,
}) => {
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#22c55e'
      case 'warning':
        return '#f59e0b'
      case 'critical':
        return '#ef4444'
      default:
        return '#9ca3af'
    }
  }

  const hasThreshold = Boolean(signal.threshold)
  const hasOwner = Boolean(signal.owner)

  // Calculate health score based on signal completeness
  const completeness =
    ([
      signal.description,
      signal.threshold,
      signal.owner,
      signal.metricName,
    ].filter(Boolean).length /
      4) *
    100

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getHealthColor(healthStatus),
        }}
      />
      {showMetrics && (
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          <div>Completeness: {Math.round(completeness)}%</div>
          <div>
            {hasThreshold ? '✓' : '⚠'} Threshold
            {hasOwner ? ' | ✓ Owner' : ' | ⚠ Owner'}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Signal Linkage Map
 * Shows comprehensive signal-to-impact relationships
 */
const SignalLinkageMap: React.FC<SignalLinkageMapProps> = ({
  signals,
  dependencies,
  impacts,
  telemetryMappings,
}) => {
  // Build linkage relationships
  const linkageData = signals.map(signal => {
    const dependency = dependencies.find(d => d.id === signal.dependencyId)
    const relatedTelemetry = telemetryMappings.filter(tm =>
      impacts.some(impact => impact.id === tm.impactId)
    )

    return {
      signal,
      dependency,
      relatedImpacts: impacts.filter(impact =>
        telemetryMappings.some(tm => tm.impactId === impact.id)
      ),
      telemetryCount: relatedTelemetry.length,
    }
  })

  return (
    <div>
      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '500' }}>
        Signal-to-Impact Traceability Map
      </h4>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {linkageData.map(
          ({ signal, dependency, relatedImpacts, telemetryCount }, index) => (
            <div
              key={signal.id || index}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: getSignalColor(signal.type).bg,
                      color: getSignalColor(signal.type).text,
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                    }}
                  >
                    {signal.type} Signal
                  </span>
                  <div style={{ fontWeight: '500', marginTop: '0.5rem' }}>
                    {signal.name}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <div>
                    {dependency ? 'Dependency Linked' : 'Step-Level Only'}
                  </div>
                  <div>
                    {relatedImpacts.length} Impact
                    {relatedImpacts.length !== 1 ? 's' : ''}
                  </div>
                  <div>
                    {telemetryCount} Telemetry Mapping
                    {telemetryCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Linkage Flow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                {dependency && (
                  <>
                    <div
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f0f9ff',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        flex: 1,
                        minWidth: '150px',
                      }}
                    >
                      <strong>Dependency:</strong> {dependency.expectation}
                    </div>
                    <div style={{ color: '#6b7280' }}>→</div>
                  </>
                )}

                <div
                  style={{
                    padding: '0.5rem',
                    backgroundColor: getSignalColor(signal.type).bg,
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    minWidth: '100px',
                    textAlign: 'center',
                  }}
                >
                  <strong>{signal.name}</strong>
                </div>

                {relatedImpacts.length > 0 && (
                  <>
                    <div style={{ color: '#6b7280' }}>→</div>
                    <div
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#fef2f2',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        flex: 1,
                        minWidth: '150px',
                      }}
                    >
                      <strong>Impacts:</strong>{' '}
                      {relatedImpacts.map(i => i.category).join(', ')}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

// Helper function to get signal type colors
const getSignalColor = (type: string) => {
  switch (type) {
    case 'kpi':
      return { bg: '#dcfce7', text: '#065f46' }
    case 'business':
      return { bg: '#fee2e2', text: '#991b1b' }
    case 'process':
      return { bg: '#ddd6fe', text: '#5b21b6' }
    case 'system':
      return { bg: '#e0e7ff', text: '#312e81' }
    default:
      return { bg: '#f3f4f6', text: '#6b7280' }
  }
}

export default SignalVisualization
export { SignalHealthIndicator, SignalFlowDiagram }
