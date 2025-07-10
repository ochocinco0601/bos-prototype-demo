import { useState, useCallback } from 'react'

/**
 * Custom hook for managing UI state
 *
 * Handles all UI-related state and operations including:
 * - Modal visibility state
 * - View mode switching (grid/compact)
 * - UI interaction handlers
 */
export const useUIState = () => {
  const [showFlowManager, setShowFlowManager] = useState(false)
  const [showStepCreator, setShowStepCreator] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid')

  /**
   * Toggle flow manager modal visibility
   */
  const toggleFlowManager = useCallback(() => {
    setShowFlowManager(prev => !prev)
  }, [])

  /**
   * Open flow manager modal
   */
  const openFlowManager = useCallback(() => {
    setShowFlowManager(true)
  }, [])

  /**
   * Close flow manager modal
   */
  const closeFlowManager = useCallback(() => {
    setShowFlowManager(false)
  }, [])

  /**
   * Toggle step creator modal visibility
   */
  const toggleStepCreator = useCallback(() => {
    setShowStepCreator(prev => !prev)
  }, [])

  /**
   * Open step creator modal
   */
  const openStepCreator = useCallback(() => {
    setShowStepCreator(true)
  }, [])

  /**
   * Close step creator modal
   */
  const closeStepCreator = useCallback(() => {
    setShowStepCreator(false)
  }, [])

  /**
   * Switch to grid view mode
   */
  const switchToGridView = useCallback(() => {
    setViewMode('grid')
  }, [])

  /**
   * Switch to compact view mode
   */
  const switchToCompactView = useCallback(() => {
    setViewMode('compact')
  }, [])

  /**
   * Toggle between grid and compact view modes
   */
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => (prev === 'grid' ? 'compact' : 'grid'))
  }, [])

  /**
   * Set view mode directly
   */
  const setViewModeDirectly = useCallback((mode: 'grid' | 'compact') => {
    setViewMode(mode)
  }, [])

  /**
   * Check if currently in grid view
   */
  const isGridView = viewMode === 'grid'

  /**
   * Check if currently in compact view
   */
  const isCompactView = viewMode === 'compact'

  return {
    // State
    showFlowManager,
    showStepCreator,
    viewMode,
    isGridView,
    isCompactView,

    // Modal actions
    toggleFlowManager,
    openFlowManager,
    closeFlowManager,
    toggleStepCreator,
    openStepCreator,
    closeStepCreator,

    // View mode actions
    switchToGridView,
    switchToCompactView,
    toggleViewMode,
    setViewModeDirectly,

    // Direct state setters for convenience
    setShowFlowManager,
    setShowStepCreator,
    setViewMode,
  }
}
