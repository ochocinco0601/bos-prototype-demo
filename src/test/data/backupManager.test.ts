/**
 * Tests for BackupManager - Critical data backup and recovery logic
 */

import { BackupManager } from '../../data/backupManager'
import { Flow } from '../../types'

const mockFlow: Flow = {
  id: 'test-flow-1',
  name: 'Test Flow',
  stages: [],
}

const mockFlow2: Flow = {
  id: 'test-flow-2',
  name: 'Test Flow 2',
  stages: [],
}

describe('BackupManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('createBackup', () => {
    it('should create backup successfully', () => {
      const result = BackupManager.createBackup(
        [mockFlow],
        'import',
        'Test backup'
      )

      expect(result.success).toBe(true)
      expect(result.backupId).toMatch(/^backup_\d+_\w+$/)
      expect(result.backupsRemoved).toBeUndefined()

      // Verify backup was stored
      const backups = BackupManager.getAllBackups()
      expect(backups).toHaveLength(1)
      expect(backups[0].operation).toBe('import')
      expect(backups[0].metadata?.description).toBe('Test backup')
      expect(backups[0].data).toEqual([mockFlow])
    })

    it('should create deep copy of data', () => {
      const originalData = [mockFlow]
      const result = BackupManager.createBackup(originalData, 'manual_backup')

      expect(result.success).toBe(true)

      const backup = BackupManager.getBackup(result.backupId!)!
      expect(backup.data).toEqual(originalData)
      expect(backup.data).not.toBe(originalData) // Should be different object reference
    })

    it('should maintain maximum backup limit', () => {
      // Create more than max backups
      const maxBackups = 10
      const results: string[] = []

      for (let i = 0; i < maxBackups + 3; i++) {
        const result = BackupManager.createBackup(
          [mockFlow],
          'manual_backup',
          `Backup ${i}`
        )
        if (result.backupId) {
          results.push(result.backupId)
        }
      }

      const backups = BackupManager.getAllBackups()
      expect(backups).toHaveLength(maxBackups)

      // Latest backup should be first
      expect(backups[0].metadata?.description).toBe(`Backup ${maxBackups + 2}`)

      // Oldest backups should be removed
      const oldestBackup = BackupManager.getBackup(results[0])
      expect(oldestBackup).toBeNull()
    })

    it('should include backup removal count when trimming', () => {
      // Create max backups first
      for (let i = 0; i < 10; i++) {
        BackupManager.createBackup([mockFlow], 'manual_backup')
      }

      // Create one more that should trigger trimming
      const result = BackupManager.createBackup([mockFlow], 'manual_backup')

      expect(result.success).toBe(true)
      expect(result.backupsRemoved).toBe(1)
    })
  })

  describe('getAllBackups', () => {
    it('should return empty array when no backups exist', () => {
      const backups = BackupManager.getAllBackups()
      expect(backups).toEqual([])
    })

    it('should return all stored backups', () => {
      BackupManager.createBackup([mockFlow], 'import', 'First backup')
      BackupManager.createBackup([mockFlow2], 'manual_backup', 'Second backup')

      const backups = BackupManager.getAllBackups()
      expect(backups).toHaveLength(2)
      expect(backups[0].metadata?.description).toBe('Second backup') // Latest first
      expect(backups[1].metadata?.description).toBe('First backup')
    })

    it('should handle corrupted localStorage data gracefully', () => {
      // Simulate corrupted data
      localStorage.setItem('bos_data_backups', 'invalid-json')

      const backups = BackupManager.getAllBackups()
      expect(backups).toEqual([])
    })
  })

  describe('getBackup', () => {
    it('should retrieve specific backup by ID', () => {
      const result = BackupManager.createBackup(
        [mockFlow],
        'import',
        'Test backup'
      )
      const backupId = result.backupId!

      const backup = BackupManager.getBackup(backupId)
      expect(backup).toBeDefined()
      expect(backup!.id).toBe(backupId)
      expect(backup!.data).toEqual([mockFlow])
    })

    it('should return null for non-existent backup', () => {
      const backup = BackupManager.getBackup('non-existent-id')
      expect(backup).toBeNull()
    })
  })

  describe('restoreFromBackup', () => {
    it('should restore data from valid backup', () => {
      const result = BackupManager.createBackup([mockFlow, mockFlow2], 'import')
      const backupId = result.backupId!

      const restoreResult = BackupManager.restoreFromBackup(backupId)

      expect(restoreResult.success).toBe(true)
      expect(restoreResult.data).toEqual([mockFlow, mockFlow2])
      expect(restoreResult.error).toBeUndefined()
    })

    it('should fail to restore from non-existent backup', () => {
      const restoreResult = BackupManager.restoreFromBackup('non-existent-id')

      expect(restoreResult.success).toBe(false)
      expect(restoreResult.error).toBe('Backup non-existent-id not found')
      expect(restoreResult.data).toBeUndefined()
    })
  })

  describe('deleteBackup', () => {
    it('should delete specific backup', () => {
      const result1 = BackupManager.createBackup([mockFlow], 'import')
      const result2 = BackupManager.createBackup([mockFlow2], 'manual_backup')

      const deleteResult = BackupManager.deleteBackup(result1.backupId!)

      expect(deleteResult.success).toBe(true)
      expect(BackupManager.getAllBackups()).toHaveLength(1)
      expect(BackupManager.getBackup(result1.backupId!)).toBeNull()
      expect(BackupManager.getBackup(result2.backupId!)).toBeDefined()
    })

    it('should fail to delete non-existent backup', () => {
      const deleteResult = BackupManager.deleteBackup('non-existent-id')

      expect(deleteResult.success).toBe(false)
      expect(deleteResult.error).toBe('Backup non-existent-id not found')
    })
  })

  describe('clearAllBackups', () => {
    it('should clear all backups', () => {
      BackupManager.createBackup([mockFlow], 'import')
      BackupManager.createBackup([mockFlow2], 'manual_backup')

      expect(BackupManager.getAllBackups()).toHaveLength(2)

      const result = BackupManager.clearAllBackups()

      expect(result.success).toBe(true)
      expect(BackupManager.getAllBackups()).toHaveLength(0)
    })
  })

  describe('storage health monitoring', () => {
    it('should report healthy status for small backups', () => {
      BackupManager.createBackup([mockFlow], 'import')

      const health = BackupManager.checkStorageHealth()

      expect(health.status).toBe('healthy')
      expect(health.message).toContain('1 backups stored')
      expect(health.storageSize).toBeGreaterThan(0)
    })

    it('should format backup info correctly', () => {
      const result = BackupManager.createBackup(
        [mockFlow, mockFlow2],
        'import',
        'Test backup'
      )
      const backup = BackupManager.getBackup(result.backupId!)!

      const info = BackupManager.formatBackupInfo(backup)

      expect(info).toContain('Test backup')
      expect(info).toContain('(2 flows)')
      expect(info).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/) // Date format
    })

    it('should use operation name when description is missing', () => {
      const result = BackupManager.createBackup([mockFlow], 'import')
      const backup = BackupManager.getBackup(result.backupId!)!

      const info = BackupManager.formatBackupInfo(backup)

      expect(info).toContain('import')
      expect(info).toContain('(1 flows)')
    })
  })
})
