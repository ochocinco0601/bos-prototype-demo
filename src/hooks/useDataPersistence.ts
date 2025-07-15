import { useState, useCallback } from 'react'
import { Flow } from '../types'
import { DataPersistenceManager } from '../data/persistenceManager'

/**
 * Custom hook for managing data persistence operations
 *
 * Handles all data persistence-related state and operations including:
 * - Auto-saving to localStorage
 * - Loading from localStorage
 * - Import/export functionality
 * - Managing import/export modal state
 */
export const useDataPersistence = () => {
  const [importData, setImportData] = useState('')
  const [exportData, setExportData] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  /**
   * Load initial data from localStorage
   */
  const loadInitialData = useCallback((): Flow[] | null => {
    const savedFlows = DataPersistenceManager.loadData()
    return savedFlows
  }, [])

  /**
   * Auto-save flows to localStorage whenever flows change
   */
  const autoSave = useCallback((flows: Flow[]) => {
    if (flows.length > 0) {
      DataPersistenceManager.saveData(flows)
    }
  }, [])

  /**
   * Handle data import from JSON string with enhanced validation and backup
   */
  const handleImport = useCallback(
    (
      currentFlows?: Flow[]
    ): {
      success: boolean
      data?: Flow[]
      error?: string
      warnings?: string[]
      recoveredData?: Flow[]
      backupId?: string
    } => {
      if (!importData.trim()) {
        return { success: false, error: 'No data provided for import' }
      }

      const result = DataPersistenceManager.importData(importData, currentFlows)

      if (result.success) {
        setImportData('')
        setShowImportModal(false)
      }

      return result
    },
    [importData]
  )

  /**
   * Handle data export to JSON string
   */
  const handleExport = useCallback((flows: Flow[]) => {
    const exportJson = DataPersistenceManager.exportData(flows)
    setExportData(exportJson)
    setShowExportModal(true)
  }, [])

  /**
   * Close import modal and reset import data
   */
  const closeImportModal = useCallback(() => {
    setShowImportModal(false)
    setImportData('')
  }, [])

  /**
   * Close export modal
   */
  const closeExportModal = useCallback(() => {
    setShowExportModal(false)
    // Keep export data for potential re-use
  }, [])

  /**
   * Open import modal
   */
  const openImportModal = useCallback(() => {
    setShowImportModal(true)
  }, [])

  return {
    // State
    importData,
    exportData,
    showImportModal,
    showExportModal,

    // Actions
    loadInitialData,
    autoSave,
    handleImport,
    handleExport,
    closeImportModal,
    closeExportModal,
    openImportModal,
    setImportData,

    // Direct state setters for convenience
    setShowImportModal,
    setShowExportModal,
  }
}
