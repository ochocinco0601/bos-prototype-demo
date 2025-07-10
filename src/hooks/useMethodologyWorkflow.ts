import { useState, useCallback, useMemo } from 'react'
import {
  Step,
  Stakeholder,
  Dependency,
  Impact,
  Signal,
  TelemetryMappingItem,
} from '../types'

/**
 * Validation result interface for methodology data
 */
interface ValidationResult {
  isValid: boolean
  score: number
  feedback: string[]
  suggestions: string[]
}

/**
 * Completion state for methodology steps
 */
export type CompletionState = 'blank' | 'partial' | 'complete'

/**
 * Methodology workflow state interface
 */
interface MethodologyState {
  stakeholders: Stakeholder[]
  dependencies: Dependency[]
  impacts: Impact[]
  telemetryMappings: TelemetryMappingItem[]
  signals: Signal[]
}

/**
 * Helper function to safely convert legacy data to arrays
 * Handles both new array format and legacy object format
 */
const safeArrayConvert = (data: any): any[] => {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') return Object.values(data)
  return []
}

/**
 * Check if stakeholder data is complete (all required fields populated)
 */
const isStakeholderComplete = (stakeholder: Stakeholder): boolean => {
  return !!(stakeholder.name && stakeholder.role && stakeholder.relationship)
}

/**
 * Check if dependency data is complete (all required fields populated)
 */
const isDependencyComplete = (dependency: Dependency): boolean => {
  return !!(dependency.expectation && dependency.stakeholderId)
}

/**
 * Check if impact data is complete (all required fields populated)
 */
const isImpactComplete = (impact: Impact): boolean => {
  return !!(
    impact.description &&
    impact.category &&
    impact.severity !== undefined
  )
}

/**
 * Check if telemetry mapping data is complete (all required fields populated)
 */
const isTelemetryMappingComplete = (
  telemetry: TelemetryMappingItem
): boolean => {
  return !!(
    telemetry.dataSources &&
    telemetry.impactId &&
    telemetry.telemetryRequired &&
    telemetry.observableSignals
  )
}

/**
 * Check if signal data is complete (all required fields populated)
 */
const isSignalComplete = (signal: Signal): boolean => {
  return !!(signal.name && signal.type && signal.threshold !== undefined)
}

/**
 * Custom hook for managing BOS methodology workflow
 *
 * Provides state management and validation for BOS methodology data
 * Works alongside useStepManagement for step-specific methodology operations
 */
export const useMethodologyWorkflow = (selectedStep?: Step | null) => {
  // Initialize methodology state from selected step or empty state
  const [methodologyState, setMethodologyState] = useState<MethodologyState>(
    () => ({
      stakeholders: safeArrayConvert(selectedStep?.stakeholders),
      dependencies: safeArrayConvert(selectedStep?.dependencies),
      impacts: safeArrayConvert(selectedStep?.impacts),
      telemetryMappings: safeArrayConvert(selectedStep?.telemetryMappings),
      signals: safeArrayConvert(selectedStep?.signals),
    })
  )

  /**
   * Update methodology state when selected step changes
   */
  const syncWithStep = useCallback((step: Step | null) => {
    if (step) {
      setMethodologyState({
        stakeholders: safeArrayConvert(step.stakeholders),
        dependencies: safeArrayConvert(step.dependencies),
        impacts: safeArrayConvert(step.impacts),
        telemetryMappings: safeArrayConvert(step.telemetryMappings),
        signals: safeArrayConvert(step.signals),
      })
    }
  }, [])

  /**
   * Validate data completeness for BOS methodology (simplified for help system)
   */
  const validateDataCompleteness = useCallback(
    (state: MethodologyState): ValidationResult => {
      const feedback: string[] = []
      let completedSteps = 0
      const totalSteps = 5

      // Step 1: Stakeholder validation - basic presence check
      if (state.stakeholders.length === 0) {
        feedback.push('Step 1: No stakeholders defined')
      } else {
        completedSteps++
      }

      // Step 2: Dependencies validation - basic presence check
      if (state.dependencies.length === 0) {
        feedback.push('Step 2: No dependencies mapped')
      } else {
        completedSteps++
      }

      // Step 3: Impact validation - basic presence check
      if (state.impacts.length === 0) {
        feedback.push('Step 3: No impacts defined')
      } else {
        completedSteps++
      }

      // Step 4: Telemetry validation - basic presence check
      if (state.telemetryMappings.length === 0) {
        feedback.push('Step 4: No telemetry mappings defined')
      } else {
        completedSteps++
      }

      // Step 5: Signals validation - basic presence check
      if (state.signals.length === 0) {
        feedback.push('Step 5: No signals defined')
      } else {
        completedSteps++
      }

      const score = Math.round((completedSteps / totalSteps) * 100)
      const isValid = score >= 60

      return {
        isValid,
        score,
        feedback,
        suggestions: [], // Empty - guidance now provided through help system
      }
    },
    []
  )

  /**
   * Validate stakeholder relationships (simplified for help system)
   */
  const validateStakeholderRelationships = useCallback(
    (stakeholders: Stakeholder[]): ValidationResult => {
      const feedback: string[] = []

      if (stakeholders.length === 0) {
        feedback.push('No stakeholders defined')
      }

      const score = stakeholders.length > 0 ? 100 : 0

      return {
        isValid: stakeholders.length > 0,
        score,
        feedback,
        suggestions: [], // Empty - guidance now provided through help system
      }
    },
    []
  )

  /**
   * Provide impact validation (simplified for help system)
   */
  const provideMeasurabilityFeedback = useCallback(
    (impacts: Impact[]): ValidationResult => {
      const feedback: string[] = []

      if (impacts.length === 0) {
        feedback.push('No impacts defined')
      }

      const score = impacts.length > 0 ? 100 : 0

      return {
        isValid: impacts.length > 0,
        score,
        feedback,
        suggestions: [], // Empty - guidance now provided through help system
      }
    },
    []
  )

  /**
   * Get overall methodology validation for current state
   */
  const getOverallValidation = useCallback((): ValidationResult => {
    return validateDataCompleteness(methodologyState)
  }, [methodologyState, validateDataCompleteness])

  /**
   * Get stakeholder validation for current state
   */
  const getStakeholderValidation = useCallback((): ValidationResult => {
    return validateStakeholderRelationships(methodologyState.stakeholders)
  }, [methodologyState.stakeholders, validateStakeholderRelationships])

  /**
   * Get impact measurability validation for current state
   */
  const getImpactValidation = useCallback((): ValidationResult => {
    return provideMeasurabilityFeedback(methodologyState.impacts)
  }, [methodologyState.impacts, provideMeasurabilityFeedback])

  /**
   * Update stakeholders in methodology state
   */
  const updateStakeholders = useCallback((stakeholders: Stakeholder[]) => {
    setMethodologyState(prev => ({ ...prev, stakeholders }))
  }, [])

  /**
   * Update dependencies in methodology state
   */
  const updateDependencies = useCallback((dependencies: Dependency[]) => {
    setMethodologyState(prev => ({ ...prev, dependencies }))
  }, [])

  /**
   * Update impacts in methodology state
   */
  const updateImpacts = useCallback((impacts: Impact[]) => {
    setMethodologyState(prev => ({ ...prev, impacts }))
  }, [])

  /**
   * Update telemetry mappings in methodology state
   */
  const updateTelemetryMappings = useCallback(
    (telemetryMappings: TelemetryMappingItem[]) => {
      setMethodologyState(prev => ({ ...prev, telemetryMappings }))
    },
    []
  )

  /**
   * Update signals in methodology state
   */
  const updateSignals = useCallback((signals: Signal[]) => {
    setMethodologyState(prev => ({ ...prev, signals }))
  }, [])

  /**
   * Get methodology completion summary
   */
  const getCompletionSummary = useMemo(() => {
    const validation = validateDataCompleteness(methodologyState)
    return {
      score: validation.score,
      completedSteps:
        validation.feedback.length < 5 ? 5 - validation.feedback.length : 0,
      totalSteps: 5,
      isComplete: validation.score >= 100,
      hasMinimalData: validation.score >= 40,
    }
  }, [methodologyState, validateDataCompleteness])

  /**
   * Get completion state for a specific methodology step (3-state logic)
   */
  const getStepCompletionState = useCallback(
    (
      stepType:
        | 'stakeholders'
        | 'dependencies'
        | 'impacts'
        | 'telemetryMappings'
        | 'signals'
    ): CompletionState => {
      const data = methodologyState[stepType]

      // Blank: Array length = 0
      if (data.length === 0) {
        return 'blank'
      }

      // Check completeness based on step type
      let isAllComplete = false

      switch (stepType) {
        case 'stakeholders':
          isAllComplete = (data as Stakeholder[]).every(isStakeholderComplete)
          break
        case 'dependencies':
          isAllComplete = (data as Dependency[]).every(isDependencyComplete)
          break
        case 'impacts':
          isAllComplete = (data as Impact[]).every(isImpactComplete)
          break
        case 'telemetryMappings':
          isAllComplete = (data as TelemetryMappingItem[]).every(
            isTelemetryMappingComplete
          )
          break
        case 'signals':
          isAllComplete = (data as Signal[]).every(isSignalComplete)
          break
      }

      // Complete: Array length > 0 AND all items have all fields populated
      if (isAllComplete) {
        return 'complete'
      }

      // Partial: Array length > 0 AND some items missing fields
      return 'partial'
    },
    [methodologyState]
  )

  /**
   * Get completion states for all methodology steps
   */
  const getMethodologyCompletionStates = useCallback(() => {
    return {
      stakeholders: getStepCompletionState('stakeholders'),
      dependencies: getStepCompletionState('dependencies'),
      impacts: getStepCompletionState('impacts'),
      telemetryMappings: getStepCompletionState('telemetryMappings'),
      signals: getStepCompletionState('signals'),
    }
  }, [getStepCompletionState])

  return {
    // State
    methodologyState,

    // Synchronization
    syncWithStep,

    // Validation functions
    validateDataCompleteness,
    validateStakeholderRelationships,
    provideMeasurabilityFeedback,
    getOverallValidation,
    getStakeholderValidation,
    getImpactValidation,

    // State updates
    updateStakeholders,
    updateDependencies,
    updateImpacts,
    updateTelemetryMappings,
    updateSignals,

    // Computed properties
    getCompletionSummary,

    // 3-state completion functions
    getStepCompletionState,
    getMethodologyCompletionStates,

    // Direct state setter for convenience
    setMethodologyState,
  }
}
