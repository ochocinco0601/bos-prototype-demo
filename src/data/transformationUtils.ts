/**
 * Data Transformation Utilities (Phase 1.2)
 * For import/export and data migration functionality
 * Extracted from App.tsx for better code organization
 */

import { Flow } from '../types'
import { generateId } from '../utils/generators'

/**
 * Collection of data transformation utilities for BOS prototype
 * Handles legacy data migration, format conversion, and validation
 */
export const DataTransformationUtils = {
  /**
   * Convert legacy BOS data to unified format
   * Migrates old data structures to the current unified schema
   *
   * @param {any} legacyData - Legacy BOS data structure
   * @returns {Flow[]} Array of flows in unified format
   */
  migrateLegacyBOSData: (legacyData: any): Flow[] => {
    return (
      legacyData.flows?.map((flow: any) => ({
        ...flow,
        description: flow.description || `${flow.name} business process`,
        stages: flow.stages?.map((stage: any) => ({
          ...stage,
          steps: stage.steps?.map((step: any) => ({
            ...step,
            services: step.services || [], // Add empty services if missing
            stakeholders: (step.stakeholders || []).map((stakeholder: any) => ({
              ...stakeholder,
              // Convert old type format to new format
              type:
                stakeholder.type === 'people'
                  ? 'people'
                  : stakeholder.type === 'business'
                    ? 'business'
                    : stakeholder.type === 'vendor'
                      ? 'vendor'
                      : stakeholder.type,
            })),
          })),
        })),
      })) || []
    )
  },

  /**
   * Convert HL raw data to unified format
   * Transforms raw home lending data into the unified Flow structure
   *
   * @param {any[]} hlRawData - Raw home lending data array
   * @returns {Flow} Unified Flow structure
   */
  transformHLData: (hlRawData: any[]): Flow => {
    // Group HL data by flow -> stage -> step
    const groupedData = hlRawData.reduce((acc, row) => {
      const flowName = row.Flow
      const stageName = row.Stage
      const stepName = row.Step
      const serviceName = row.Service

      if (!acc[flowName]) acc[flowName] = {}
      if (!acc[flowName][stageName]) acc[flowName][stageName] = {}
      if (!acc[flowName][stageName][stepName])
        acc[flowName][stageName][stepName] = []

      acc[flowName][stageName][stepName].push(serviceName)
      return acc
    }, {})

    // Convert to unified Flow structure
    const flowName = Object.keys(groupedData)[0]
    return {
      id: generateId(),
      name: flowName,
      description: `${flowName} business process`,
      stages: Object.entries(groupedData[flowName]).map(
        ([stageName, stageSteps]) => ({
          id: generateId(),
          name: stageName,
          steps: Object.entries(stageSteps as any).map(
            ([stepName, serviceNames]) => ({
              id: generateId(),
              name: stepName,
              description: `${stepName} process step`,
              stakeholders: [],
              dependencies: {},
              impacts: {},
              telemetry: {},
              signals: {},
              score: 0,
              services: (serviceNames as string[]).map(serviceName => ({
                name: serviceName,
                technical_description: `Service: ${serviceName}`,
                technical_flow: (serviceNames as string[]).join(' -> '),
              })),
            })
          ),
        })
      ),
    }
  },

  /**
   * Validate data completeness and calculate methodology score
   * Analyzes flow data to determine completion percentage and identify missing components
   *
   * @param {Flow} flow - Flow to validate
   * @returns {Object} Validation result with score and missing items
   */
  validateDataCompleteness: (
    flow: Flow
  ): { score: number; missing: string[] } => {
    let totalFields = 0
    let completedFields = 0
    const missing: string[] = []

    flow.stages.forEach(stage => {
      stage.steps.forEach(step => {
        // Check methodology completeness
        totalFields += 5 // 5 methodology steps
        if (step.stakeholders.length > 0) completedFields++
        else missing.push(`${step.name}: Missing stakeholders`)

        if (Object.keys(step.dependencies).length > 0) completedFields++
        else missing.push(`${step.name}: Missing dependencies`)

        if (Object.keys(step.impacts).length > 0) completedFields++
        else missing.push(`${step.name}: Missing impacts`)

        if (Object.keys(step.telemetry).length > 0) completedFields++
        else missing.push(`${step.name}: Missing telemetry`)

        if (Object.keys(step.signals).length > 0) completedFields++
        else missing.push(`${step.name}: Missing signals`)

        // Check services completeness
        if (step.services.length === 0) {
          missing.push(`${step.name}: Missing services`)
        }
      })
    })

    return {
      score: Math.round((completedFields / totalFields) * 100),
      missing,
    }
  },
}
