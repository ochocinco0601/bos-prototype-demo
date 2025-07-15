import { useState, useCallback } from 'react'
import { Step } from '../types'

/**
 * Custom hook for managing step selection and expansion state
 *
 * Handles all step-related UI state and operations including:
 * - Step selection for detail panel
 * - Detail panel visibility
 * - Step expansion/collapse state
 * - Step interaction handlers
 */
export const useStepManagement = () => {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<{
    [key: string]: boolean
  }>({})

  /**
   * Handle step click - select step and show detail panel, or toggle closed if same step
   */
  const handleStepClick = useCallback(
    (step: Step) => {
      if (selectedStep?.id === step.id && showDetailPanel) {
        setShowDetailPanel(false)
      } else {
        setSelectedStep(step)
        setShowDetailPanel(true)
      }
    },
    [selectedStep, showDetailPanel]
  )

  /**
   * Close detail panel and clear selected step
   */
  const closeDetailPanel = useCallback(() => {
    setShowDetailPanel(false)
    // Keep selectedStep for potential re-opening
  }, [])

  /**
   * Handle step expansion/collapse state change
   */
  const handleExpandedStepsChange = useCallback(
    (stepId: string, isExpanded: boolean) => {
      setExpandedSteps(prev => ({
        ...prev,
        [stepId]: isExpanded,
      }))
    },
    []
  )

  /**
   * Toggle expansion state for a specific step
   */
  const toggleStepExpansion = useCallback((stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId],
    }))
  }, [])

  /**
   * Expand all steps
   */
  const expandAllSteps = useCallback((stepIds: string[]) => {
    const expandedState = stepIds.reduce(
      (acc, stepId) => {
        acc[stepId] = true
        return acc
      },
      {} as { [key: string]: boolean }
    )
    setExpandedSteps(expandedState)
  }, [])

  /**
   * Collapse all steps
   */
  const collapseAllSteps = useCallback(() => {
    setExpandedSteps({})
  }, [])

  /**
   * Check if a step is expanded
   */
  const isStepExpanded = useCallback(
    (stepId: string): boolean => {
      return expandedSteps[stepId] || false
    },
    [expandedSteps]
  )

  /**
   * Clear selected step (useful when flow changes)
   */
  const clearSelectedStep = useCallback(() => {
    setSelectedStep(null)
    setShowDetailPanel(false)
  }, [])

  return {
    // State
    selectedStep,
    showDetailPanel,
    expandedSteps,

    // Actions
    handleStepClick,
    closeDetailPanel,
    handleExpandedStepsChange,
    toggleStepExpansion,
    expandAllSteps,
    collapseAllSteps,
    isStepExpanded,
    clearSelectedStep,

    // Direct state setters for convenience
    setSelectedStep,
    setShowDetailPanel,
    setExpandedSteps,
  }
}
