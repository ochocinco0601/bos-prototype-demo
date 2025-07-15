import { useMemo } from 'react'
import { Flow, Stage } from '../types'

interface CreationContext {
  suggestedType: 'flow' | 'stage' | 'step'
  parentFlow?: Flow
  parentStage?: Stage
  canCreateFlow: boolean
  canCreateStage: boolean
  canCreateStep: boolean
  contextMessage: string
  buttonLabel: string
}

interface UseCreationWorkflowProps {
  selectedFlow: Flow | null
  flows: Flow[]
}

export const useCreationWorkflow = ({ selectedFlow, flows }: UseCreationWorkflowProps) => {
  const creationContext = useMemo<CreationContext>(() => {
    // No flows exist - suggest creating a flow
    if (flows.length === 0) {
      return {
        suggestedType: 'flow',
        canCreateFlow: true,
        canCreateStage: false,
        canCreateStep: false,
        contextMessage: 'No flows exist. Create your first flow to get started.',
        buttonLabel: '➕ Create Flow'
      }
    }

    // No flow selected - suggest selecting or creating a flow
    if (!selectedFlow) {
      return {
        suggestedType: 'flow',
        canCreateFlow: true,
        canCreateStage: false,
        canCreateStep: false,
        contextMessage: 'Select a flow or create a new one.',
        buttonLabel: '➕ Create Flow'
      }
    }

    // Flow selected but has no stages - suggest creating a stage
    if (selectedFlow.stages.length === 0) {
      return {
        suggestedType: 'stage',
        parentFlow: selectedFlow,
        canCreateFlow: true,
        canCreateStage: true,
        canCreateStep: false,
        contextMessage: `Flow "${selectedFlow.name}" has no stages. Create a stage first.`,
        buttonLabel: '➕ Create Stage'
      }
    }

    // Flow has stages but no steps - suggest creating a step
    const hasSteps = selectedFlow.stages.some(stage => stage.steps.length > 0)
    if (!hasSteps) {
      return {
        suggestedType: 'step',
        parentFlow: selectedFlow,
        parentStage: selectedFlow.stages[0], // Default to first stage
        canCreateFlow: true,
        canCreateStage: true,
        canCreateStep: true,
        contextMessage: `Add your first step to "${selectedFlow.name}"`,
        buttonLabel: '➕ Add Step'
      }
    }

    // Normal state - flow has stages and steps
    return {
      suggestedType: 'step',
      parentFlow: selectedFlow,
      canCreateFlow: true,
      canCreateStage: true,
      canCreateStep: true,
      contextMessage: '',
      buttonLabel: '➕ Add Step'
    }
  }, [selectedFlow, flows])

  // Get available stages for step creation
  const availableStages = useMemo(() => {
    if (!selectedFlow) return []
    return selectedFlow.stages
  }, [selectedFlow])

  // Smart stage selection for new steps
  const suggestedStage = useMemo(() => {
    if (!selectedFlow || selectedFlow.stages.length === 0) return null
    
    // Find stage with fewest steps for balance
    const stageCounts = selectedFlow.stages.map(stage => ({
      stage,
      count: stage.steps.length
    }))
    
    stageCounts.sort((a, b) => a.count - b.count)
    return stageCounts[0].stage
  }, [selectedFlow])

  return {
    creationContext,
    availableStages,
    suggestedStage
  }
}