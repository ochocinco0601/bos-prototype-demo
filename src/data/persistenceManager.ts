/**
 * Data Persistence Manager (Phase 1.3)
 * Handles localStorage operations, import/export functionality
 * Extracted from App.tsx for better code organization
 */

import { Flow } from '../types'
import { DataMigrationManager } from './migrationManager'
import { BackupManager } from './backupManager'

/**
 * Centralized data persistence management for BOS prototype
 * Handles localStorage operations, JSON import/export, and data migration
 */
export const DataPersistenceManager = {
  /** Storage key for localStorage operations */
  STORAGE_KEY: 'unified_bos_data_v13',

  /**
   * Save data to localStorage
   * Stores flows with metadata including version and timestamp
   *
   * @param {Flow[]} flows - Array of flows to save
   * @returns {boolean} Success status
   */
  saveData: (flows: Flow[]): boolean => {
    try {
      const dataToSave = {
        flows,
        metadata: {
          version: '1.3.0',
          lastUpdated: new Date().toISOString(),
          source: 'unified_bos_prototype',
        },
      }
      localStorage.setItem(
        DataPersistenceManager.STORAGE_KEY,
        JSON.stringify(dataToSave)
      )
      return true
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
      return false
    }
  },

  /**
   * Load data from localStorage
   * Retrieves and migrates stored data to current format
   *
   * @returns {Flow[] | null} Array of flows or null if not found
   */
  loadData: (): Flow[] | null => {
    try {
      const storedData = localStorage.getItem(
        DataPersistenceManager.STORAGE_KEY
      )
      if (!storedData) return null

      const parsedData = JSON.parse(storedData)
      return DataMigrationManager.migrateData(parsedData)
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
      return null
    }
  },

  /**
   * Export data as JSON string
   * Creates a JSON representation of flows with metadata
   *
   * @param {Flow[]} flows - Array of flows to export
   * @returns {string} JSON string representation
   */
  exportData: (flows: Flow[]): string => {
    const exportData = {
      flows,
      metadata: {
        version: '1.3.0',
        lastUpdated: new Date().toISOString(),
        source: 'unified_bos_prototype',
      },
    }
    return JSON.stringify(exportData, null, 2)
  },

  /**
   * Import data from JSON string with enhanced validation and automatic backup
   * Creates backup before import, validates, recovers, and migrates imported data
   *
   * @param {string} jsonString - JSON string to import
   * @param {Flow[]} currentFlows - Current flows to backup before import
   * @returns {Object} Import result with success status, data, warnings, and errors
   */
  importData: (
    jsonString: string,
    currentFlows?: Flow[]
  ): {
    success: boolean
    data?: Flow[]
    error?: string
    warnings?: string[]
    recoveredData?: Flow[]
    backupId?: string
  } => {
    try {
      // Create backup before import if current flows provided
      let backupId: string | undefined
      if (currentFlows && currentFlows.length > 0) {
        const backupResult = BackupManager.createBackup(
          currentFlows,
          'import',
          'Pre-import backup'
        )
        if (backupResult.success && backupResult.backupId) {
          backupId = backupResult.backupId
        }
        // Continue even if backup fails - log but don't block import
      }

      const parsedData = JSON.parse(jsonString)
      const migrationResult =
        DataMigrationManager.migrateDataWithValidation(parsedData)

      if (migrationResult.valid && migrationResult.data) {
        return {
          success: true,
          data: migrationResult.data,
          warnings:
            migrationResult.warnings.length > 0
              ? migrationResult.warnings
              : undefined,
          backupId,
        }
      }

      if (migrationResult.recoveredData) {
        return {
          success: false,
          error: `Data validation failed: ${migrationResult.errors.join('; ')}`,
          recoveredData: migrationResult.recoveredData,
          warnings: migrationResult.warnings,
          backupId,
        }
      }

      return {
        success: false,
        error: `Import failed: ${migrationResult.errors.join('; ')}`,
        backupId,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error during import',
      }
    }
  },
}
