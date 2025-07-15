/**
 * Backup Manager - Automatic data backup and recovery system
 * Provides data safety during critical operations and import/export
 */

import { Flow } from '../types'

export interface BackupEntry {
  id: string
  timestamp: string
  operation: string
  data: Flow[]
  metadata?: {
    version: string
    source: string
    description?: string
  }
}

export interface BackupManagementResult {
  success: boolean
  backupId?: string
  error?: string
  backupsRemoved?: number
}

/**
 * Manages automatic backups for BOS data
 * Creates backups before risky operations like imports, bulk changes
 */
export class BackupManager {
  private static readonly BACKUP_STORAGE_KEY = 'bos_data_backups'
  private static readonly MAX_BACKUPS = 10 // Keep last 10 backups
  private static readonly BACKUP_OPERATIONS = [
    'import',
    'bulk_delete',
    'bulk_update',
    'data_migration',
    'manual_backup',
  ] as const

  /**
   * Create a backup before performing a risky operation
   */
  static createBackup(
    data: Flow[],
    operation: (typeof BackupManager.BACKUP_OPERATIONS)[number],
    description?: string
  ): BackupManagementResult {
    try {
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const backup: BackupEntry = {
        id: backupId,
        timestamp: new Date().toISOString(),
        operation,
        data: JSON.parse(JSON.stringify(data)), // Deep clone
        metadata: {
          version: '1.3.0',
          source: 'unified_bos_prototype',
          description,
        },
      }

      // Get existing backups
      const existingBackups = this.getAllBackups()

      // Add new backup
      const updatedBackups = [backup, ...existingBackups]

      // Trim to max backups
      const trimmedBackups = updatedBackups.slice(0, this.MAX_BACKUPS)
      const backupsRemoved = updatedBackups.length - trimmedBackups.length

      // Save to localStorage
      localStorage.setItem(
        this.BACKUP_STORAGE_KEY,
        JSON.stringify(trimmedBackups)
      )

      return {
        success: true,
        backupId,
        backupsRemoved: backupsRemoved > 0 ? backupsRemoved : undefined,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Backup creation failed',
      }
    }
  }

  /**
   * Get all available backups
   */
  static getAllBackups(): BackupEntry[] {
    try {
      const backupsData = localStorage.getItem(this.BACKUP_STORAGE_KEY)
      if (!backupsData) return []

      const backups = JSON.parse(backupsData) as BackupEntry[]
      return Array.isArray(backups) ? backups : []
    } catch (error) {
      console.error('Failed to load backups:', error)
      return []
    }
  }

  /**
   * Get a specific backup by ID
   */
  static getBackup(backupId: string): BackupEntry | null {
    const backups = this.getAllBackups()
    return backups.find(backup => backup.id === backupId) || null
  }

  /**
   * Restore data from a backup
   */
  static restoreFromBackup(backupId: string): {
    success: boolean
    data?: Flow[]
    error?: string
  } {
    try {
      const backup = this.getBackup(backupId)

      if (!backup) {
        return { success: false, error: `Backup ${backupId} not found` }
      }

      return {
        success: true,
        data: backup.data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Restore failed',
      }
    }
  }

  /**
   * Delete a specific backup
   */
  static deleteBackup(backupId: string): BackupManagementResult {
    try {
      const backups = this.getAllBackups()
      const filteredBackups = backups.filter(backup => backup.id !== backupId)

      if (filteredBackups.length === backups.length) {
        return { success: false, error: `Backup ${backupId} not found` }
      }

      localStorage.setItem(
        this.BACKUP_STORAGE_KEY,
        JSON.stringify(filteredBackups)
      )

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
      }
    }
  }

  /**
   * Clear all backups (use with caution)
   */
  static clearAllBackups(): BackupManagementResult {
    try {
      localStorage.removeItem(this.BACKUP_STORAGE_KEY)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Clear failed',
      }
    }
  }

  /**
   * Get backup storage size in bytes (approximate)
   */
  static getBackupStorageSize(): number {
    try {
      const backupsData = localStorage.getItem(this.BACKUP_STORAGE_KEY)
      return backupsData ? new Blob([backupsData]).size : 0
    } catch {
      return 0
    }
  }

  /**
   * Check if storage is getting full and suggest cleanup
   */
  static checkStorageHealth(): {
    status: 'healthy' | 'warning' | 'critical'
    message: string
    storageSize: number
  } {
    const storageSize = this.getBackupStorageSize()
    const backupCount = this.getAllBackups().length

    // Rough thresholds (in bytes)
    const WARNING_SIZE = 500 * 1024 // 500KB
    const CRITICAL_SIZE = 1024 * 1024 // 1MB

    if (storageSize > CRITICAL_SIZE) {
      return {
        status: 'critical',
        message: `Backup storage is ${Math.round(storageSize / 1024)}KB. Consider clearing old backups.`,
        storageSize,
      }
    } else if (storageSize > WARNING_SIZE || backupCount >= this.MAX_BACKUPS) {
      return {
        status: 'warning',
        message: `${backupCount} backups stored (${Math.round(storageSize / 1024)}KB). Automatic cleanup active.`,
        storageSize,
      }
    } else {
      return {
        status: 'healthy',
        message: `${backupCount} backups stored (${Math.round(storageSize / 1024)}KB).`,
        storageSize,
      }
    }
  }

  /**
   * Format backup metadata for display
   */
  static formatBackupInfo(backup: BackupEntry): string {
    const date = new Date(backup.timestamp).toLocaleString()
    const description = backup.metadata?.description || backup.operation
    const flowCount = backup.data.length

    return `${date} - ${description} (${flowCount} flows)`
  }
}
