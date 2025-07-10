/**
 * Tests for useDataPersistence hook - Critical data safety logic
 */

import { renderHook, act } from '@testing-library/react'
import { useDataPersistence } from '../../hooks/useDataPersistence'
import { Flow } from '../../types'
import { DataPersistenceManager } from '../../data/persistenceManager'

// Mock the persistence manager
vi.mock('../../data/persistenceManager', () => ({
  DataPersistenceManager: {
    loadData: vi.fn(),
    saveData: vi.fn(),
    exportData: vi.fn(),
    importData: vi.fn(),
  },
}))

const mockFlow: Flow = {
  id: 'test-flow-1',
  name: 'Test Flow',
  stages: [],
}

describe('useDataPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDataPersistence())

    expect(result.current.importData).toBe('')
    expect(result.current.exportData).toBe('')
    expect(result.current.showImportModal).toBe(false)
    expect(result.current.showExportModal).toBe(false)
  })

  it('should load initial data successfully', () => {
    const mockData = [mockFlow]
    vi.mocked(DataPersistenceManager.loadData).mockReturnValue(mockData)

    const { result } = renderHook(() => useDataPersistence())

    let loadedData: Flow[] | null

    act(() => {
      loadedData = result.current.loadInitialData()
    })

    expect(loadedData).toEqual(mockData)
    expect(DataPersistenceManager.loadData).toHaveBeenCalledTimes(1)
  })

  it('should handle auto-save correctly', () => {
    vi.mocked(DataPersistenceManager.saveData).mockReturnValue(true)

    const { result } = renderHook(() => useDataPersistence())

    act(() => {
      result.current.autoSave([mockFlow])
    })

    expect(DataPersistenceManager.saveData).toHaveBeenCalledWith([mockFlow])
  })

  it('should not auto-save empty flows', () => {
    const { result } = renderHook(() => useDataPersistence())

    act(() => {
      result.current.autoSave([])
    })

    expect(DataPersistenceManager.saveData).not.toHaveBeenCalled()
  })

  it('should handle successful import', () => {
    const mockImportData = '{"flows": []}'
    const mockResult = {
      success: true,
      data: [mockFlow],
      backupId: 'backup-123',
    }

    vi.mocked(DataPersistenceManager.importData).mockReturnValue(mockResult)

    const { result } = renderHook(() => useDataPersistence())

    act(() => {
      result.current.setImportData(mockImportData)
    })

    let importResult: any

    act(() => {
      importResult = result.current.handleImport([])
    })

    expect(importResult).toEqual(mockResult)
    expect(result.current.importData).toBe('') // Should be cleared on success
    expect(result.current.showImportModal).toBe(false) // Should be closed on success
  })

  it('should handle failed import with recovery data', () => {
    const mockImportData = '{"flows": []}'
    const mockResult = {
      success: false,
      error: 'Validation failed',
      recoveredData: [mockFlow],
      warnings: ['Warning message'],
      backupId: 'backup-123',
    }

    vi.mocked(DataPersistenceManager.importData).mockReturnValue(mockResult)

    const { result } = renderHook(() => useDataPersistence())

    act(() => {
      result.current.setImportData(mockImportData)
      result.current.openImportModal() // Open modal first
    })

    let importResult: any

    act(() => {
      importResult = result.current.handleImport([])
    })

    expect(importResult).toEqual(mockResult)
    expect(result.current.importData).toBe(mockImportData) // Should not be cleared on failure
    expect(result.current.showImportModal).toBe(true) // Should remain open on failure
  })

  it('should handle empty import data', () => {
    const { result } = renderHook(() => useDataPersistence())

    let importResult: any

    act(() => {
      importResult = result.current.handleImport([])
    })

    expect(importResult).toEqual({
      success: false,
      error: 'No data provided for import',
    })
    expect(DataPersistenceManager.importData).not.toHaveBeenCalled()
  })

  it('should handle export correctly', () => {
    const mockExportData = '{"flows": []}'
    vi.mocked(DataPersistenceManager.exportData).mockReturnValue(mockExportData)

    const { result } = renderHook(() => useDataPersistence())

    act(() => {
      result.current.handleExport([mockFlow])
    })

    expect(DataPersistenceManager.exportData).toHaveBeenCalledWith([mockFlow])
    expect(result.current.exportData).toBe(mockExportData)
    expect(result.current.showExportModal).toBe(true)
  })

  it('should manage modal states correctly', () => {
    const { result } = renderHook(() => useDataPersistence())

    // Test import modal
    act(() => {
      result.current.openImportModal()
    })
    expect(result.current.showImportModal).toBe(true)

    act(() => {
      result.current.closeImportModal()
    })
    expect(result.current.showImportModal).toBe(false)
    expect(result.current.importData).toBe('') // Should clear data when closing

    // Test export modal via handleExport
    act(() => {
      result.current.handleExport([mockFlow])
    })
    expect(result.current.showExportModal).toBe(true)
    expect(result.current.exportData).toBeDefined()

    act(() => {
      result.current.closeExportModal()
    })
    expect(result.current.showExportModal).toBe(false)
  })

  it('should update import data correctly', () => {
    const { result } = renderHook(() => useDataPersistence())

    act(() => {
      result.current.setImportData('test import data')
    })

    expect(result.current.importData).toBe('test import data')
  })
})
