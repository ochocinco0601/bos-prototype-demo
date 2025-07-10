import { useState, useCallback } from 'react'
import { Flow, Stage, Step } from '../types'
import { generateId } from '../utils/generators'

/**
 * Custom hook for managing flow CRUD operations
 *
 * Handles all flow-related state and operations including:
 * - Creating new flows
 * - Selecting flows
 * - Duplicating flows
 * - Deleting flows
 * - Managing flow form state
 */
export const useFlowManagement = (initialFlows: Flow[] = []) => {
  const [flows, setFlows] = useState<Flow[]>(initialFlows)
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(
    initialFlows.length > 0 ? initialFlows[0] : null
  )
  const [newFlowName, setNewFlowName] = useState('')
  const [newFlowDescription, setNewFlowDescription] = useState('')

  /**
   * Handle flow selection by ID
   */
  const handleFlowChange = useCallback(
    (flowId: string) => {
      const flow = flows.find(f => f.id === flowId)
      if (flow) {
        setSelectedFlow(flow)
      }
    },
    [flows]
  )

  /**
   * Create a new flow with the current form data
   */
  const handleCreateFlow = useCallback(() => {
    if (!newFlowName.trim()) return

    const newFlow: Flow = {
      id: generateId(),
      name: newFlowName.trim(),
      description: newFlowDescription.trim() || undefined,
      stages: [],
    }

    const updatedFlows = [...flows, newFlow]
    setFlows(updatedFlows)
    setSelectedFlow(newFlow)
    setNewFlowName('')
    setNewFlowDescription('')

    return updatedFlows
  }, [flows, newFlowName, newFlowDescription])

  /**
   * Duplicate an existing flow with new IDs
   */
  const handleDuplicateFlow = useCallback(
    (flow: Flow) => {
      const duplicatedFlow: Flow = {
        ...flow,
        id: generateId(),
        name: `${flow.name} (Copy)`,
        stages: flow.stages.map(stage => ({
          ...stage,
          id: generateId(),
          steps: stage.steps.map(step => ({
            ...step,
            id: generateId(),
          })),
        })),
      }

      const updatedFlows = [...flows, duplicatedFlow]
      setFlows(updatedFlows)
      setSelectedFlow(duplicatedFlow)

      return updatedFlows
    },
    [flows]
  )

  /**
   * Delete a flow by ID (prevents deleting the last flow)
   */
  const handleDeleteFlow = useCallback(
    (flowId: string) => {
      if (flows.length <= 1) return flows // Prevent deleting the last flow

      const updatedFlows = flows.filter(f => f.id !== flowId)
      setFlows(updatedFlows)

      // If the deleted flow was selected, select the first remaining flow
      if (selectedFlow?.id === flowId) {
        setSelectedFlow(updatedFlows[0] || null)
      }

      return updatedFlows
    },
    [flows, selectedFlow]
  )

  /**
   * Update flows state (used for data loading/importing)
   */
  const updateFlows = useCallback(
    (newFlows: Flow[]) => {
      setFlows(newFlows)
      if (newFlows.length > 0 && !selectedFlow) {
        setSelectedFlow(newFlows[0])
      }
      // Update selectedFlow if it exists and has been modified
      if (selectedFlow) {
        const updatedSelectedFlow = newFlows.find(
          flow => flow.id === selectedFlow.id
        )
        if (updatedSelectedFlow) {
          setSelectedFlow(updatedSelectedFlow)
        }
      }
    },
    [selectedFlow]
  )

  /**
   * Create a new step in the selected flow
   */
  const handleCreateStep = useCallback(
    (
      stepName: string,
      stepDescription: string,
      stageId: string,
      isNewStage: boolean,
      newStageName?: string
    ): Step | null => {
      if (!selectedFlow) return null

      const newStep: Step = {
        id: generateId(),
        name: stepName,
        ...(stepDescription && { description: stepDescription }),
        services: [],
        score: 0,
      }

      let targetStageId = stageId
      let workingFlows = [...flows]

      // Handle new stage creation
      if (isNewStage && newStageName) {
        targetStageId = generateId()
        const newStage: Stage = {
          id: targetStageId,
          name: newStageName,
          steps: [],
        }

        // Add new stage to the selected flow
        const updatedFlow = {
          ...selectedFlow,
          stages: [...selectedFlow.stages, newStage],
        }

        workingFlows = workingFlows.map(flow =>
          flow.id === selectedFlow.id ? updatedFlow : flow
        )

        setSelectedFlow(updatedFlow)
      }

      // Add step to the target stage using the working flows
      const finalFlows = workingFlows.map(flow => {
        if (flow.id === selectedFlow.id) {
          return {
            ...flow,
            stages: flow.stages.map(stage => {
              if (stage.id === targetStageId) {
                return {
                  ...stage,
                  steps: [...stage.steps, newStep],
                }
              }
              return stage
            }),
          }
        }
        return flow
      })

      setFlows(finalFlows)
      setSelectedFlow(
        finalFlows.find(f => f.id === selectedFlow.id) || selectedFlow
      )

      return newStep
    },
    [flows, selectedFlow]
  )

  /**
   * Delete a step from the selected flow
   */
  const handleDeleteStep = useCallback(
    (stepId: string): boolean => {
      if (!selectedFlow) return false

      const updatedFlows = flows.map(flow => {
        if (flow.id === selectedFlow.id) {
          return {
            ...flow,
            stages: flow.stages.map(stage => ({
              ...stage,
              steps: stage.steps.filter(step => step.id !== stepId),
            })),
          }
        }
        return flow
      })

      setFlows(updatedFlows)
      setSelectedFlow(
        updatedFlows.find(f => f.id === selectedFlow.id) || selectedFlow
      )

      return true
    },
    [flows, selectedFlow]
  )

  /**
   * Edit an existing flow's name and description
   */
  const handleEditFlow = useCallback(
    (flowId: string, newName: string, newDescription?: string): boolean => {
      if (!newName.trim()) return false

      const updatedFlows = flows.map(flow => {
        if (flow.id === flowId) {
          return {
            ...flow,
            name: newName.trim(),
            ...(newDescription?.trim() && {
              description: newDescription.trim(),
            }),
          }
        }
        return flow
      })

      setFlows(updatedFlows)

      // Update selected flow if it's the one being edited
      if (selectedFlow?.id === flowId) {
        setSelectedFlow(updatedFlows.find(f => f.id === flowId) || selectedFlow)
      }

      return true
    },
    [flows, selectedFlow]
  )

  /**
   * Edit an existing step's name and description
   */
  const handleEditStep = useCallback(
    (stepId: string, newName: string, newDescription?: string): boolean => {
      if (!selectedFlow || !newName.trim()) return false

      const updatedFlows = flows.map(flow => {
        if (flow.id === selectedFlow.id) {
          return {
            ...flow,
            stages: flow.stages.map(stage => ({
              ...stage,
              steps: stage.steps.map(step => {
                if (step.id === stepId) {
                  return {
                    ...step,
                    name: newName.trim(),
                    ...(newDescription?.trim() && {
                      description: newDescription.trim(),
                    }),
                  }
                }
                return step
              }),
            })),
          }
        }
        return flow
      })

      setFlows(updatedFlows)
      setSelectedFlow(
        updatedFlows.find(f => f.id === selectedFlow.id) || selectedFlow
      )

      return true
    },
    [flows, selectedFlow]
  )

  return {
    // State
    flows,
    selectedFlow,
    newFlowName,
    newFlowDescription,

    // Actions
    handleFlowChange,
    handleCreateFlow,
    handleDuplicateFlow,
    handleDeleteFlow,
    handleEditFlow,
    updateFlows,
    handleCreateStep,
    handleEditStep,
    handleDeleteStep,
    setSelectedFlow,
    setNewFlowName,
    setNewFlowDescription,
  }
}
