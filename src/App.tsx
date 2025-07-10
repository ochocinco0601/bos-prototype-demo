// =============================================================================
// BUSINESS OBSERVABILITY SYSTEM (BOS) PROTOTYPE - Refactored with Custom Hooks
// =============================================================================

/**
 * Unified Business Observability System (BOS) Prototype
 *
 * PHASE 4 COMPLETE: BOS Methodology Workflow with Step Creation
 * ✅ Complete step creation foundation with stage management
 * ✅ Integrated 5-step BOS methodology workflow (WHO→WHAT→BREAKS→TELEMETRY→SIGNALS)
 * ✅ Step creation immediately launches methodology workflow
 * ✅ Non-linear methodology navigation with partial completion support
 * ✅ Auto-save methodology data to localStorage
 * ✅ Full BOS methodology validation and scoring system
 * ✅ Enhanced custom hooks architecture with step creation capabilities
 */

import React, { useEffect } from 'react'
import { Step } from './types'
import {
  createHLFlow,
  createCompleteMethodologyFlow,
  createBasicFlow,
  createEnhancedCompleteFlow,
} from './data/mockData'
import {
  FlowManager,
  ImportModal,
  ExportModal,
  GridView,
  CompactView,
  ErrorBoundary,
  DevDashboard,
  BuildVersion,
  MethodologyEditModal,
} from './components'
import {
  useFlowManagement,
  useDataPersistence,
  useStepManagement,
  useUIState,
} from './hooks'

const UnifiedBOSPrototype = () => {
  // Custom hooks for state management
  const flowManagement = useFlowManagement()
  const dataPersistence = useDataPersistence()
  const stepManagement = useStepManagement()
  const uiState = useUIState()

  // Development dashboard state (only in development)
  const [showDevDashboard, setShowDevDashboard] = React.useState(false)
  const isDevelopment = import.meta.env.MODE === 'development'

  // Unified modal state
  const [showUnifiedModal, setShowUnifiedModal] = React.useState(false)
  const [unifiedModalMode, setUnifiedModalMode] = React.useState<
    'create' | 'edit'
  >('edit')
  const [modalSelectedStep, setModalSelectedStep] = React.useState<Step | null>(
    null
  )

  // Initialize with hybrid data sets
  useEffect(() => {
    // Try to load from localStorage first
    const savedFlows = dataPersistence.loadInitialData()
    if (savedFlows && savedFlows.length > 0) {
      flowManagement.updateFlows(savedFlows)
    } else {
      // Initialize with default data including enhanced test data
      const hybridFlows = [
        createHLFlow(),
        createCompleteMethodologyFlow(),
        createBasicFlow(),
        createEnhancedCompleteFlow(),
      ]
      flowManagement.updateFlows(hybridFlows)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save flows to localStorage
  useEffect(() => {
    dataPersistence.autoSave(flowManagement.flows)
  }, [flowManagement.flows, dataPersistence])

  // Enhanced import handler with validation, recovery, and backup
  const handleImport = () => {
    const result = dataPersistence.handleImport(flowManagement.flows)

    if (result.success && result.data) {
      flowManagement.updateFlows(result.data)
      stepManagement.clearSelectedStep()

      // Show success message with backup info
      let message = 'Import successful!'
      if (result.backupId) {
        message += `\n\nBackup created: ${result.backupId}`
      }
      if (result.warnings && result.warnings.length > 0) {
        message += `\n\nWarnings:\n${result.warnings.join('\n')}`
      }
      alert(message)
    } else if (result.recoveredData) {
      // Offer recovery option
      let confirmMessage = `Import failed with errors: ${result.error}\n\nRecovered partial data is available. Use recovered data?`
      if (result.backupId) {
        confirmMessage += `\n\nYour original data was backed up: ${result.backupId}`
      }

      const useRecovered = window.confirm(confirmMessage)

      if (useRecovered) {
        flowManagement.updateFlows(result.recoveredData)
        stepManagement.clearSelectedStep()
        let message = 'Using recovered data.'
        if (result.backupId) {
          message += `\n\nOriginal data backed up: ${result.backupId}`
        }
        if (result.warnings && result.warnings.length > 0) {
          message += `\n\nWarnings:\n${result.warnings.join('\n')}`
        }
        alert(message)
      }
    } else {
      let errorMessage = `Import failed: ${result.error}`
      if (result.backupId) {
        errorMessage += `\n\nYour original data was backed up: ${result.backupId}`
      }
      alert(errorMessage)
    }
  }

  // Enhanced flow change handler that clears step selection
  const handleFlowChange = (flowId: string) => {
    flowManagement.handleFlowChange(flowId)
    stepManagement.clearSelectedStep()
  }

  // Enhanced flow creation that closes manager modal
  const handleCreateFlow = () => {
    const updatedFlows = flowManagement.handleCreateFlow()
    if (updatedFlows) {
      uiState.closeFlowManager()
    }
  }

  // Handle methodology changes for steps (legacy function - kept for compatibility)
  // const handleMethodologySave = (updatedStep: Step) => {
  //   const updatedFlows = flowManagement.flows.map(flow => ({
  //     ...flow,
  //     stages: flow.stages.map(stage => ({
  //       ...stage,
  //       steps: stage.steps.map(step =>
  //         step.id === updatedStep.id ? updatedStep : step
  //       ),
  //     })),
  //   }))

  //   flowManagement.updateFlows(updatedFlows)
  //   stepManagement.setSelectedStep(updatedStep)
  // }

  // Handle step deletion
  const handleDeleteStep = (stepId: string) => {
    const success = flowManagement.handleDeleteStep(stepId)
    if (success) {
      stepManagement.clearSelectedStep()
    }
  }

  // Handle reload test data
  const handleReloadTestData = () => {
    const testDataFlows = [
      createHLFlow(),
      createCompleteMethodologyFlow(),
      createBasicFlow(),
      createEnhancedCompleteFlow(),
    ]
    flowManagement.updateFlows(testDataFlows)
    stepManagement.clearSelectedStep()

    // Select the enhanced complete flow to showcase the test data
    const enhancedFlow = testDataFlows.find(
      f => f.id === 'enhanced-complete-test'
    )
    if (enhancedFlow) {
      flowManagement.handleFlowChange(enhancedFlow.id)
    }
  }

  // Unified modal handlers
  const handleOpenCreateMode = () => {
    // Ensure we have a selected flow before opening create mode
    if (!flowManagement.selectedFlow) {
      alert('Please select a flow first before adding a step.')
      return
    }

    setUnifiedModalMode('create')
    setModalSelectedStep(null)
    setShowUnifiedModal(true)
  }

  const handleOpenEditMode = (step: Step) => {
    setUnifiedModalMode('edit')
    setModalSelectedStep(step)
    setShowUnifiedModal(true)
    stepManagement.closeDetailPanel() // Close detail panel if open
  }

  const handleCloseUnifiedModal = () => {
    setShowUnifiedModal(false)
    setModalSelectedStep(null)
  }

  const handleUnifiedModalSave = (updatedStep: Step) => {
    const updatedFlows = flowManagement.flows.map(flow => ({
      ...flow,
      stages: flow.stages.map(stage => ({
        ...stage,
        steps: stage.steps.map(step =>
          step.id === updatedStep.id ? updatedStep : step
        ),
      })),
    }))

    flowManagement.updateFlows(updatedFlows)
    stepManagement.setSelectedStep(updatedStep)
    // Don't close modal after save - allow continued editing
    // setShowUnifiedModal(false)
    // setModalSelectedStep(null)
  }

  // New step click handler that bypasses DetailPanel
  const handleStepClickDirect = (step: Step) => {
    handleOpenEditMode(step)
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Enhanced Header with Flow Management */}
      <div
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '1rem 2rem',
          borderBottom: '2px solid #b91c1c',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            Business Observability System
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              opacity: 0.9,
            }}
          >
            Stakeholder-First Business Observability - From Dependencies to
            Measurable Signals
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Enhanced Flow Selector with Management */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              value={flowManagement.selectedFlow?.id || ''}
              onChange={e => handleFlowChange(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                minWidth: '200px',
              }}
            >
              <option value="">
                Select Flow ({flowManagement.flows.length} available)
              </option>
              {flowManagement.flows.map(flow => (
                <option key={flow.id} value={flow.id}>
                  {flow.name}
                </option>
              ))}
            </select>

            {/* Flow Management Button */}
            <button
              onClick={uiState.toggleFlowManager}
              style={{
                padding: '0.5rem',
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              title="Flow Management"
            >
              ⚙️
            </button>
          </div>

          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              backgroundColor: '#374151',
              borderRadius: '0.375rem',
              padding: '0.25rem',
            }}
          >
            <button
              onClick={uiState.switchToGridView}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: uiState.isGridView ? '#dc2626' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              🔲 Grid
            </button>
            <button
              onClick={uiState.switchToCompactView}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: uiState.isCompactView
                  ? '#dc2626'
                  : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              📋 Compact
            </button>
          </div>

          {/* Import/Export Buttons */}
          <button
            onClick={dataPersistence.openImportModal}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            📥 Import
          </button>
          <button
            onClick={() => dataPersistence.handleExport(flowManagement.flows)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* Flow Manager Modal */}
      <ErrorBoundary>
        <FlowManager
          isOpen={uiState.showFlowManager}
          onClose={uiState.closeFlowManager}
          flows={flowManagement.flows}
          selectedFlowId={flowManagement.selectedFlow?.id || null}
          newFlowName={flowManagement.newFlowName}
          onNewFlowNameChange={flowManagement.setNewFlowName}
          newFlowDescription={flowManagement.newFlowDescription}
          onNewFlowDescriptionChange={flowManagement.setNewFlowDescription}
          onCreateFlow={handleCreateFlow}
          onSelectFlow={handleFlowChange}
          onDuplicateFlow={flowManagement.handleDuplicateFlow}
          onDeleteFlow={flowManagement.handleDeleteFlow}
          onEditFlow={flowManagement.handleEditFlow}
          onReloadTestData={handleReloadTestData}
        />
      </ErrorBoundary>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        {flowManagement.selectedFlow ? (
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937',
              }}
            >
              {flowManagement.selectedFlow.name}
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1rem',
              }}
            >
              {flowManagement.selectedFlow.description}
            </p>

            {/* Add Step Button */}
            <div style={{ marginBottom: '2rem' }}>
              <button
                onClick={handleOpenCreateMode}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#b91c1c'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#dc2626'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                ➕ Add Step
              </button>
            </div>

            {/* Dynamic Grid Layout based on viewMode */}
            <ErrorBoundary>
              <div style={{ padding: '2rem' }}>
                {uiState.isGridView ? (
                  <GridView
                    selectedFlow={flowManagement.selectedFlow}
                    selectedStep={stepManagement.selectedStep}
                    onStepClick={handleStepClickDirect}
                  />
                ) : (
                  <CompactView
                    selectedFlow={flowManagement.selectedFlow}
                    selectedStep={stepManagement.selectedStep}
                    onStepClick={handleStepClickDirect}
                    expandedSteps={stepManagement.expandedSteps}
                    onExpandedStepsChange={
                      stepManagement.handleExpandedStepsChange
                    }
                  />
                )}
              </div>
            </ErrorBoundary>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#6b7280',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#374151',
              }}
            >
              Welcome to Business Observability System
            </h2>
            <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
              To get started, please select a flow from the dropdown above.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              Once you select a flow, you'll be able to add steps and work with
              the BOS methodology.
            </p>
          </div>
        )}
      </div>

      {/* DetailPanel removed - replaced by unified modal workflow */}

      {/* Import Modal */}
      <ErrorBoundary>
        <ImportModal
          isOpen={dataPersistence.showImportModal}
          onClose={dataPersistence.closeImportModal}
          importData={dataPersistence.importData}
          onImportDataChange={dataPersistence.setImportData}
          onImport={handleImport}
        />
      </ErrorBoundary>

      {/* Export Modal */}
      <ErrorBoundary>
        <ExportModal
          isOpen={dataPersistence.showExportModal}
          onClose={dataPersistence.closeExportModal}
          exportData={dataPersistence.exportData}
        />
      </ErrorBoundary>

      {/* Unified Step Modal (Create & Edit) */}
      <ErrorBoundary>
        {flowManagement.selectedFlow && (
          <MethodologyEditModal
            isOpen={showUnifiedModal}
            selectedStep={modalSelectedStep}
            selectedFlow={flowManagement.selectedFlow}
            createMode={unifiedModalMode === 'create'}
            onClose={handleCloseUnifiedModal}
            onSave={handleUnifiedModalSave}
            onCreateStep={flowManagement.handleCreateStep}
            onDeleteStep={handleDeleteStep}
          />
        )}
      </ErrorBoundary>

      {/* Development Dashboard (only in development mode) */}
      {isDevelopment && (
        <DevDashboard
          isVisible={showDevDashboard}
          onToggle={() => setShowDevDashboard(!showDevDashboard)}
        />
      )}

      {/* Build Version Display */}
      <BuildVersion />

      {/* Simplified CSS */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default UnifiedBOSPrototype
