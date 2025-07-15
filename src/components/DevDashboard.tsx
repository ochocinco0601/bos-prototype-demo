/**
 * Development Dashboard - System health monitoring and debugging interface
 * Only visible in development mode for debugging BOS methodology validation
 */

import React, { useState, useEffect } from 'react'
import { logger } from '../utils/logger'
import { errorMonitor, ErrorSeverity } from '../utils/errorMonitor'
import { performanceMonitor } from '../utils/performanceMonitor'
import { bosDebugger } from '../utils/bosDebugger'

interface DevDashboardProps {
  isVisible: boolean
  onToggle: () => void
}

export const DevDashboard: React.FC<DevDashboardProps> = ({
  isVisible,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<
    'errors' | 'performance' | 'logs' | 'bos'
  >('errors')
  const [errorStats, setErrorStats] = useState(errorMonitor.getErrorStats())
  const [perfStats, setPerfStats] = useState(performanceMonitor.getStats())
  const [systemHealth, setSystemHealth] = useState(
    errorMonitor.getSystemHealth()
  )
  const [logStats, setLogStats] = useState(logger.getLogStats())
  const [bosSessions, setBOSSessions] = useState(bosDebugger.getAllSessions())

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setErrorStats(errorMonitor.getErrorStats())
      setPerfStats(performanceMonitor.getStats())
      setSystemHealth(errorMonitor.getSystemHealth())
      setLogStats(logger.getLogStats())
      setBOSSessions(bosDebugger.getAllSessions())
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 10000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        title="Open Development Dashboard"
      >
        🔧
      </button>
    )
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#4caf50'
      case 'degraded':
        return '#ff9800'
      case 'critical':
        return '#d32f2f'
      default:
        return '#757575'
    }
  }

  const tabStyle = (tab: string) => ({
    padding: '8px 16px',
    backgroundColor: activeTab === tab ? '#d32f2f' : '#f5f5f5',
    color: activeTab === tab ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  })

  const renderErrorsTab = () => (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            padding: '12px',
            backgroundColor: getHealthColor(systemHealth.status),
            color: 'white',
            borderRadius: '4px',
            minWidth: '120px',
          }}
        >
          <strong>System: {systemHealth.status.toUpperCase()}</strong>
        </div>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <strong>Total Errors: {errorStats.total}</strong>
        </div>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          <strong>
            Critical: {errorStats.bySeverity[ErrorSeverity.CRITICAL] || 0}
          </strong>
        </div>
      </div>

      {systemHealth.issues.length > 0 && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          <strong>Issues:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {systemHealth.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <div>
          <h4>By Category</h4>
          {Object.entries(errorStats.byCategory).map(([category, count]) => (
            <div
              key={category}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
              }}
            >
              <span>{category}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
        <div>
          <h4>By Severity</h4>
          {Object.entries(errorStats.bySeverity).map(([severity, count]) => (
            <div
              key={severity}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
              }}
            >
              <span>{severity}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={() => {
            errorMonitor.clearErrors()
            setErrorStats(errorMonitor.getErrorStats())
          }}
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Errors
        </button>
      </div>
    </div>
  )

  const renderPerformanceTab = () => (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <strong>Total Ops: {perfStats.total}</strong>
        </div>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <strong>
            Avg Duration: {perfStats.averageDuration.toFixed(2)}ms
          </strong>
        </div>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          <strong>Slow Ops: {perfStats.exceedingThreshold.length}</strong>
        </div>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <div>
          <h4>By Category</h4>
          {Object.entries(perfStats.byCategory).map(([category, stats]) => (
            <div
              key={category}
              style={{
                padding: '8px',
                backgroundColor: '#f9f9f9',
                marginBottom: '4px',
                borderRadius: '4px',
              }}
            >
              <div>
                <strong>{category}</strong>
              </div>
              <div>Count: {stats.count}</div>
              <div>Avg: {stats.averageDuration.toFixed(2)}ms</div>
            </div>
          ))}
        </div>
        <div>
          <h4>Extremes</h4>
          {perfStats.slowestOperation && (
            <div
              style={{
                padding: '8px',
                backgroundColor: '#ffebee',
                marginBottom: '8px',
                borderRadius: '4px',
              }}
            >
              <div>
                <strong>Slowest:</strong>
              </div>
              <div>{perfStats.slowestOperation.name}</div>
              <div>{perfStats.slowestOperation.duration.toFixed(2)}ms</div>
            </div>
          )}
          {perfStats.fastestOperation && (
            <div
              style={{
                padding: '8px',
                backgroundColor: '#e8f5e8',
                borderRadius: '4px',
              }}
            >
              <div>
                <strong>Fastest:</strong>
              </div>
              <div>{perfStats.fastestOperation.name}</div>
              <div>{perfStats.fastestOperation.duration.toFixed(2)}ms</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={() => {
            performanceMonitor.clearMetrics()
            setPerfStats(performanceMonitor.getStats())
          }}
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Metrics
        </button>
      </div>
    </div>
  )

  const renderLogsTab = () => (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <strong>Total Logs: {logStats.total}</strong>
        </div>
      </div>

      <div>
        <h4>By Level</h4>
        {Object.entries(logStats.byLevel).map(([level, count]) => (
          <div
            key={level}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}
          >
            <span>{level}:</span>
            <span>{count}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={() => {
            const logs = logger.exportLogs()
            const blob = new Blob([logs], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `bos-logs-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
          }}
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          Export Logs
        </button>
        <button
          onClick={() => {
            logger.clearLogs()
            setLogStats(logger.getLogStats())
          }}
          style={{
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Logs
        </button>
      </div>
    </div>
  )

  const renderBOSTab = () => (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <strong>Debug Sessions: {bosSessions.length}</strong>
        </div>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {bosSessions.map(session => (
          <div
            key={session.id}
            style={{
              padding: '12px',
              backgroundColor: '#f9f9f9',
              marginBottom: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <strong>Flow: {session.flowId}</strong>
              <span>{new Date(session.timestamp).toLocaleTimeString()}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <div>
                Steps: {session.summary.validSteps}/{session.summary.totalSteps}
              </div>
              <div>
                Score: {(session.summary.completionScore * 100).toFixed(1)}%
              </div>
              <div>Issues: {session.summary.criticalIssues.length}</div>
            </div>
            {session.summary.criticalIssues.length > 0 && (
              <div
                style={{ marginTop: '8px', fontSize: '12px', color: '#d32f2f' }}
              >
                Critical:{' '}
                {session.summary.criticalIssues.slice(0, 2).join(', ')}
                {session.summary.criticalIssues.length > 2 && '...'}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={() => {
            bosDebugger.clearSessions()
            setBOSSessions(bosDebugger.getAllSessions())
          }}
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Sessions
        </button>
      </div>
    </div>
  )

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '500px',
        height: '400px',
        backgroundColor: 'white',
        border: '2px solid #d32f2f',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#d32f2f',
          color: 'white',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px' }}>
          🔧 Development Dashboard
        </h3>
        <button
          onClick={onToggle}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            width: '24px',
            height: '24px',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
        {(['errors', 'performance', 'logs', 'bos'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={tabStyle(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ height: 'calc(100% - 120px)', overflowY: 'auto' }}>
        {activeTab === 'errors' && renderErrorsTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'logs' && renderLogsTab()}
        {activeTab === 'bos' && renderBOSTab()}
      </div>
    </div>
  )
}

export default DevDashboard
