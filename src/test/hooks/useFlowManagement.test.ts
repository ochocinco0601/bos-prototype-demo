/**
 * Tests for useFlowManagement hook - Critical BOS business logic
 */

import { renderHook, act } from '@testing-library/react'
import { useFlowManagement } from '../../hooks/useFlowManagement'
import { Flow } from '../../types'

// Mock data for testing
const mockFlow: Flow = {
  id: 'test-flow-1',
  name: 'Test Flow',
  description: 'Test flow description',
  stages: [
    {
      id: 'stage-1',
      name: 'Test Stage',
      steps: [
        {
          id: 'step-1',
          name: 'Test Step',
          stakeholders: [],
          dependencies: {},
          impacts: {},
          telemetry: {},
          signals: {},
          score: 0,
          services: [],
        },
      ],
    },
  ],
}

const mockFlow2: Flow = {
  id: 'test-flow-2',
  name: 'Test Flow 2',
  stages: [],
}

describe('useFlowManagement', () => {
  it('should initialize with empty flows and no selection', () => {
    const { result } = renderHook(() => useFlowManagement())

    expect(result.current.flows).toEqual([])
    expect(result.current.selectedFlow).toBeNull()
    expect(result.current.newFlowName).toBe('')
    expect(result.current.newFlowDescription).toBe('')
  })

  it('should update flows correctly', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow, mockFlow2])
    })

    expect(result.current.flows).toHaveLength(2)
    expect(result.current.flows[0]).toEqual(mockFlow)
    expect(result.current.flows[1]).toEqual(mockFlow2)
  })

  it('should select flow by ID', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow, mockFlow2])
    })

    act(() => {
      result.current.handleFlowChange('test-flow-2')
    })

    expect(result.current.selectedFlow).toEqual(mockFlow2)
  })

  it('should not change selection for invalid flow ID', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow])
      result.current.handleFlowChange('test-flow-1')
    })

    expect(result.current.selectedFlow).toEqual(mockFlow)

    act(() => {
      result.current.handleFlowChange('invalid-id')
    })

    // Selection should remain unchanged for invalid ID
    expect(result.current.selectedFlow).toEqual(mockFlow)
  })

  it('should create new flow with valid name', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.setNewFlowName('New Flow Name')
      result.current.setNewFlowDescription('New flow description')
    })

    let updatedFlows: Flow[] | undefined

    act(() => {
      updatedFlows = result.current.handleCreateFlow()
    })

    expect(updatedFlows).toBeDefined()
    expect(updatedFlows).toHaveLength(1)
    expect(updatedFlows![0].name).toBe('New Flow Name')
    expect(updatedFlows![0].description).toBe('New flow description')
    expect(updatedFlows![0].id).toMatch(/^\w{7}$/)
    expect(updatedFlows![0].stages).toEqual([])

    // Check state was reset
    expect(result.current.newFlowName).toBe('')
    expect(result.current.newFlowDescription).toBe('')
  })

  it('should not create flow with empty name', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.setNewFlowName('')
    })

    let updatedFlows: Flow[] | undefined

    act(() => {
      updatedFlows = result.current.handleCreateFlow()
    })

    expect(updatedFlows).toBeUndefined()
    expect(result.current.flows).toHaveLength(0)
  })

  it('should duplicate flow correctly', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow])
    })

    act(() => {
      result.current.handleDuplicateFlow(mockFlow)
    })

    expect(result.current.flows).toHaveLength(2)
    expect(result.current.flows[1].name).toBe('Test Flow (Copy)')
    expect(result.current.flows[1].id).not.toBe(mockFlow.id)
    expect(result.current.flows[1].stages).toHaveLength(mockFlow.stages.length)
  })

  it('should delete flow correctly when multiple flows exist', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow, mockFlow2])
      result.current.handleFlowChange('test-flow-1')
    })

    expect(result.current.selectedFlow).toEqual(mockFlow)

    act(() => {
      result.current.handleDeleteFlow('test-flow-1')
    })

    expect(result.current.flows).toHaveLength(1)
    expect(result.current.flows[0]).toEqual(mockFlow2)
    expect(result.current.selectedFlow).toEqual(mockFlow2) // Should select remaining flow
  })

  it('should not delete non-existent flow', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow])
    })

    act(() => {
      result.current.handleDeleteFlow('invalid-id')
    })

    expect(result.current.flows).toHaveLength(1)
  })

  it('should maintain selection when deleting different flow', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow, mockFlow2])
      result.current.handleFlowChange('test-flow-1')
    })

    act(() => {
      result.current.handleDeleteFlow('test-flow-2')
    })

    expect(result.current.flows).toHaveLength(1)
    expect(result.current.selectedFlow).toEqual(mockFlow)
  })

  it('should delete step from selected flow correctly', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow])
      result.current.handleFlowChange('test-flow-1')
    })

    expect(result.current.selectedFlow?.stages[0].steps).toHaveLength(1)

    act(() => {
      result.current.handleDeleteStep('step-1')
    })

    expect(result.current.selectedFlow?.stages[0].steps).toHaveLength(0)
    expect(result.current.flows[0].stages[0].steps).toHaveLength(0)
  })

  it('should return false when deleting step with no selected flow', () => {
    const { result } = renderHook(() => useFlowManagement())

    // Don't call updateFlows to ensure no flow is selected
    expect(result.current.selectedFlow).toBeNull()

    let success
    act(() => {
      success = result.current.handleDeleteStep('step-1')
    })

    expect(success).toBe(false)
  })

  it('should return true when successfully deleting step', () => {
    const { result } = renderHook(() => useFlowManagement())

    act(() => {
      result.current.updateFlows([mockFlow])
      result.current.handleFlowChange('test-flow-1')
    })

    let success
    act(() => {
      success = result.current.handleDeleteStep('step-1')
    })

    expect(success).toBe(true)
  })
})
