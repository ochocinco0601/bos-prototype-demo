/**
 * Enhanced Role-Outcome Table Component
 *
 * Session 5 Task 1: Interactive role-outcome table with advanced features
 * - Sorting by role type, stakeholder name, and signal linkage
 * - Filtering capabilities for focused data analysis
 * - Expandable rows for detailed signal information
 * - Signal health indicators and quality metrics
 * - Dependency traceability and stakeholder relationship mapping
 */

import React, { useState, useMemo } from 'react'
import { RoleOutcomeMapping, UseRoleOutcomeDataResult } from '../types/index'

interface RoleOutcomeTableProps {
  mappings: RoleOutcomeMapping[]
  roleOutcomeData?: UseRoleOutcomeDataResult
  showAdvancedFeatures?: boolean
}

type SortField =
  | 'roleType'
  | 'stakeholderName'
  | 'goalExpectation'
  | 'signalLinkage'
type SortDirection = 'asc' | 'desc'
type FilterType = 'all' | 'linked' | 'unlinked' | 'kpi' | 'business'

interface ExpandedRowData {
  stakeholderDetails: boolean
  signalDetails: boolean
  dependencyTrace: boolean
}

/**
 * Enhanced Role-Outcome Table Component
 *
 * Provides interactive table with sorting, filtering, and expandable rows
 * for comprehensive role-outcome mapping analysis
 */
const RoleOutcomeTable: React.FC<RoleOutcomeTableProps> = ({
  mappings,
  roleOutcomeData,
  showAdvancedFeatures = true,
}) => {
  // State for interactive features
  const [sortField, setSortField] = useState<SortField>('stakeholderName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState<
    Record<string, ExpandedRowData>
  >({})

  // Filter and sort mappings
  const processedMappings = useMemo(() => {
    let filtered = mappings

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        mapping =>
          mapping.stakeholderName.toLowerCase().includes(term) ||
          mapping.stakeholderRole.toLowerCase().includes(term) ||
          mapping.goalExpectation.toLowerCase().includes(term) ||
          (mapping.signalName &&
            mapping.signalName.toLowerCase().includes(term))
      )
    }

    // Apply type filter
    switch (filterType) {
      case 'linked':
        filtered = filtered.filter(
          mapping => mapping.signalId && mapping.signalName
        )
        break
      case 'unlinked':
        filtered = filtered.filter(
          mapping => !mapping.signalId || !mapping.signalName
        )
        break
      case 'kpi':
        filtered = filtered.filter(mapping => mapping.signalType === 'kpi')
        break
      case 'business':
        filtered = filtered.filter(mapping => mapping.signalType === 'business')
        break
      case 'all':
      default:
        // No additional filtering
        break
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortField) {
        case 'roleType':
          aValue = a.stakeholderRole
          bValue = b.stakeholderRole
          break
        case 'stakeholderName':
          aValue = a.stakeholderName
          bValue = b.stakeholderName
          break
        case 'goalExpectation':
          aValue = a.goalExpectation
          bValue = b.goalExpectation
          break
        case 'signalLinkage':
          aValue = a.signalId && a.signalName ? 1 : 0
          bValue = b.signalId && b.signalName ? 1 : 0
          break
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
      }
    })

    return sorted
  }, [mappings, searchTerm, filterType, sortField, sortDirection])

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle row expansion
  const toggleRowExpansion = (
    mappingId: string,
    section: keyof ExpandedRowData
  ) => {
    setExpandedRows(prev => ({
      ...prev,
      [mappingId]: {
        ...prev[mappingId],
        [section]: !prev[mappingId]?.[section],
      },
    }))
  }

  // Get sort indicator
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  // Get signal health indicator
  const getSignalHealthIndicator = (mapping: RoleOutcomeMapping) => {
    if (!mapping.signalId || !mapping.signalName) {
      return { color: '#ef4444', label: 'No Signal', icon: '⚠️' }
    }

    if (mapping.signalType === 'kpi') {
      return { color: '#059669', label: 'KPI Linked', icon: '📊' }
    }

    if (mapping.signalType === 'business') {
      return { color: '#dc2626', label: 'Business Signal', icon: '💼' }
    }

    return { color: '#6b7280', label: 'Signal Linked', icon: '✓' }
  }

  if (mappings.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic',
        }}
      >
        No role-outcome mappings available. Add stakeholders and dependencies to
        generate mappings.
      </div>
    )
  }

  return (
    <div style={{ fontSize: '0.875rem' }}>
      {/* Advanced Controls */}
      {showAdvancedFeatures && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search stakeholders, roles, goals, or signals..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Filter */}
          <div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as FilterType)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                backgroundColor: 'white',
              }}
            >
              <option value="all">All Mappings ({mappings.length})</option>
              <option value="linked">
                Signal Linked ({mappings.filter(m => m.signalId).length})
              </option>
              <option value="unlinked">
                No Signal ({mappings.filter(m => !m.signalId).length})
              </option>
              <option value="kpi">
                KPI Signals (
                {mappings.filter(m => m.signalType === 'kpi').length})
              </option>
              <option value="business">
                Business Signals (
                {mappings.filter(m => m.signalType === 'business').length})
              </option>
            </select>
          </div>

          {/* Summary Stats */}
          {roleOutcomeData && (
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.75rem',
                color: '#6b7280',
              }}
            >
              <span>Coverage: {roleOutcomeData.coveragePercentage}%</span>
              <span>Quality: {roleOutcomeData.qualityScore}%</span>
              <span>Linkage: {roleOutcomeData.linkageEfficiency}%</span>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div
        style={{
          marginBottom: '0.5rem',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}
      >
        Showing {processedMappings.length} of {mappings.length} mappings
      </div>

      {/* Enhanced Table */}
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
              <th style={{ ...tableHeaderStyle, width: '40px' }}>
                {/* Expand column */}
              </th>
              <th
                style={{ ...tableHeaderStyle, cursor: 'pointer' }}
                onClick={() => handleSort('roleType')}
              >
                Role Type {getSortIndicator('roleType')}
              </th>
              <th
                style={{ ...tableHeaderStyle, cursor: 'pointer' }}
                onClick={() => handleSort('stakeholderName')}
              >
                Stakeholder {getSortIndicator('stakeholderName')}
              </th>
              <th
                style={{ ...tableHeaderStyle, cursor: 'pointer' }}
                onClick={() => handleSort('goalExpectation')}
              >
                Goal/Intent {getSortIndicator('goalExpectation')}
              </th>
              <th style={tableHeaderStyle}>Signal Status</th>
              <th
                style={{ ...tableHeaderStyle, cursor: 'pointer' }}
                onClick={() => handleSort('signalLinkage')}
              >
                Mapped Signal {getSortIndicator('signalLinkage')}
              </th>
            </tr>
          </thead>
          <tbody>
            {processedMappings.map((mapping, index) => {
              const healthIndicator = getSignalHealthIndicator(mapping)
              const isExpanded = expandedRows[mapping.id]

              return (
                <React.Fragment key={mapping.id}>
                  {/* Main Row */}
                  <tr
                    style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                      borderLeft: mapping.signalId
                        ? '3px solid #059669'
                        : '3px solid #ef4444',
                    }}
                  >
                    <td style={tableCellStyle}>
                      <button
                        onClick={() =>
                          toggleRowExpansion(mapping.id, 'stakeholderDetails')
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        {isExpanded?.stakeholderDetails ? '▼' : '▶'}
                      </button>
                    </td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                        }}
                      >
                        {mapping.stakeholderRole}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <strong>{mapping.stakeholderName}</strong>
                    </td>
                    <td style={tableCellStyle}>{mapping.goalExpectation}</td>
                    <td style={tableCellStyle}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span>{healthIndicator.icon}</span>
                        <span
                          style={{
                            color: healthIndicator.color,
                            fontSize: '0.75rem',
                            fontWeight: '500',
                          }}
                        >
                          {healthIndicator.label}
                        </span>
                      </div>
                    </td>
                    <td style={tableCellStyle}>
                      {mapping.signalName ? (
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {mapping.signalName}
                          </div>
                          {mapping.signalThreshold && (
                            <div
                              style={{ fontSize: '0.75rem', color: '#6b7280' }}
                            >
                              Threshold: {mapping.signalThreshold}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
                          No signal mapped
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row - Stakeholder Details */}
                  {isExpanded?.stakeholderDetails && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#f0f9ff',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '1rem',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                margin: '0 0 0.5rem 0',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                              }}
                            >
                              Stakeholder Details
                            </h4>
                            <div
                              style={{ fontSize: '0.75rem', color: '#6b7280' }}
                            >
                              <strong>ID:</strong> {mapping.stakeholderId}
                              <br />
                              <strong>Role:</strong> {mapping.stakeholderRole}
                              <br />
                              <strong>Name:</strong> {mapping.stakeholderName}
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
                              Dependency Trace
                            </h4>
                            <div
                              style={{ fontSize: '0.75rem', color: '#6b7280' }}
                            >
                              <strong>Dependency ID:</strong>{' '}
                              {mapping.dependencyId}
                              <br />
                              <strong>Expectation:</strong>{' '}
                              {mapping.goalExpectation}
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
                              Signal Linkage
                            </h4>
                            <div
                              style={{ fontSize: '0.75rem', color: '#6b7280' }}
                            >
                              {mapping.signalId ? (
                                <>
                                  <strong>Signal ID:</strong> {mapping.signalId}
                                  <br />
                                  <strong>Type:</strong> {mapping.signalType}
                                  <br />
                                  <strong>Metric:</strong>{' '}
                                  {mapping.signalMetric || 'Not specified'}
                                </>
                              ) : (
                                <span style={{ fontStyle: 'italic' }}>
                                  No signal linked to this dependency
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {showAdvancedFeatures && roleOutcomeData && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: '#6b7280',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>Role-Outcome Analysis:</strong> {processedMappings.length}{' '}
            mappings displayed
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>
              Linked: {processedMappings.filter(m => m.signalId).length}
            </span>
            <span>
              Unlinked: {processedMappings.filter(m => !m.signalId).length}
            </span>
            <span>Quality Score: {roleOutcomeData.qualityScore}%</span>
          </div>
        </div>
      )}
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

export default RoleOutcomeTable
