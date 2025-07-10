/**
 * Data Migration Manager (Phase 1.3)
 * Handles data format migration and transformation between versions
 * Extracted from App.tsx for better code organization
 */

import {
  Flow,
  Stage,
  Step,
  Stakeholder,
  Service,
  Signal,
  Dependency,
  Impact,
  TelemetryMappingItem,
} from '../types'
import { DataTransformationUtils } from './transformationUtils'
import { SchemaValidator, ImportValidationResult } from './schemaValidator'

/**
 * Centralized data migration management for BOS prototype
 * Handles version migrations, format conversions, and data structure updates
 */
export const DataMigrationManager = {
  /**
   * Migrate any data format to current version with validation
   * Main entry point for data migration - handles multiple input formats
   *
   * @param {any} data - Data in any supported format
   * @returns {ImportValidationResult} Validation result with migrated data
   */
  migrateDataWithValidation: (data: any): ImportValidationResult => {
    // First validate and clean the data
    const validationResult = SchemaValidator.validateImportData(data)

    if (validationResult.valid && validationResult.data) {
      // Data is valid, apply migrations if needed
      const migratedFlows = DataMigrationManager.migrateFlows(
        validationResult.data
      )
      return {
        ...validationResult,
        data: migratedFlows,
      }
    }

    if (validationResult.recoveredData) {
      // Data was partially recovered, apply migrations
      const migratedFlows = DataMigrationManager.migrateFlows(
        validationResult.recoveredData
      )
      return {
        ...validationResult,
        data: migratedFlows,
      }
    }

    return validationResult
  },

  /**
   * Legacy migration method (preserved for compatibility)
   * @param {any} data - Data in any supported format
   * @returns {Flow[]} Array of flows in current format
   */
  migrateData: (data: any): Flow[] => {
    const result = DataMigrationManager.migrateDataWithValidation(data)
    return result.data || []
  },

  /**
   * Internal migration logic
   */
  _legacyMigrateData: (data: any): Flow[] => {
    // Handle unified data format
    if (data.flows && Array.isArray(data.flows)) {
      return DataMigrationManager.migrateFlows(data.flows)
    }

    // Handle direct array format
    if (Array.isArray(data)) {
      return DataMigrationManager.migrateFlows(data)
    }

    // Handle legacy BOS format
    if (data.methodology) {
      return DataTransformationUtils.migrateLegacyBOSData(data)
    }

    console.warn('Unknown data format, returning empty array')
    return []
  },

  /**
   * Migrate flows array to current format
   * Ensures all flows have required fields and proper structure
   *
   * @param {any[]} flows - Array of flows to migrate
   * @returns {Flow[]} Migrated flows array
   */
  migrateFlows: (flows: any[]): Flow[] => {
    return flows.map((flow, index) => ({
      id: flow.id || `flow-${index}`,
      name: flow.name || `Flow ${index + 1}`,
      description: flow.description || '',
      stages: DataMigrationManager.migrateStages(flow.stages || []),
    }))
  },

  /**
   * Migrate stages array to current format
   * Ensures all stages have required fields and proper structure
   *
   * @param {any[]} stages - Array of stages to migrate
   * @returns {Stage[]} Migrated stages array
   */
  migrateStages: (stages: any[]): Stage[] => {
    return stages.map((stage, index) => ({
      id: stage.id || `stage-${index}`,
      name: stage.name || `Stage ${index + 1}`,
      steps: DataMigrationManager.migrateSteps(stage.steps || []),
    }))
  },

  /**
   * Migrate steps array to current format
   * Ensures all steps have required fields and proper structure
   * Supports both legacy and new array-based BOS methodology structures
   *
   * @param {any[]} steps - Array of steps to migrate
   * @returns {Step[]} Migrated steps array
   */
  migrateSteps: (steps: any[]): Step[] => {
    return steps.map((step, index) => ({
      id: step.id || `step-${index}`,
      name: step.name || `Step ${index + 1}`,
      description: step.description || '',

      // New array-based BOS methodology (preferred format)
      stakeholders: DataMigrationManager.migrateStakeholdersArray(
        step.stakeholders || []
      ),
      dependencies: DataMigrationManager.migrateDependenciesArray(
        step.dependencies || []
      ),
      impacts: DataMigrationManager.migrateImpactsArray(step.impacts || []),
      telemetryMappings: DataMigrationManager.migrateTelemetryMappingsArray(
        step.telemetryMappings || []
      ),
      signals: DataMigrationManager.migrateSignalsArray(step.signals || []),

      // Legacy fields preserved for backward compatibility
      legacyDependencies:
        typeof step.dependencies === 'object' &&
        !Array.isArray(step.dependencies)
          ? step.dependencies
          : undefined,
      legacyImpacts:
        typeof step.impacts === 'object' && !Array.isArray(step.impacts)
          ? step.impacts
          : undefined,
      legacyTelemetry: step.telemetry || undefined,
      legacySignals:
        typeof step.signals === 'object' && !Array.isArray(step.signals)
          ? step.signals
          : undefined,

      score: DataMigrationManager.calculateScore(step),
      services: DataMigrationManager.migrateServices(step.services || []),
    }))
  },

  /**
   * Migrate stakeholders array to current format (legacy method)
   * Ensures all stakeholders have valid types and required fields
   *
   * @param {any[]} stakeholders - Array of stakeholders to migrate
   * @returns {Stakeholder[]} Migrated stakeholders array
   */
  migrateStakeholders: (stakeholders: any[]): Stakeholder[] => {
    return stakeholders.map(stakeholder => ({
      name: stakeholder.name || '',
      role: stakeholder.role || '',
      type: ['people', 'business', 'vendor'].includes(stakeholder.type)
        ? stakeholder.type
        : 'people',
    }))
  },

  /**
   * Migrate stakeholders array to enhanced format with IDs and relationships
   * Supports full BOS methodology stakeholder framework
   *
   * @param {any[]} stakeholders - Array of stakeholders to migrate
   * @returns {Stakeholder[]} Enhanced stakeholders array
   */
  migrateStakeholdersArray: (stakeholders: any[]): Stakeholder[] => {
    return stakeholders.map((stakeholder, index) => ({
      id: stakeholder.id || `stakeholder-${index}`,
      name: stakeholder.name || '',
      role: stakeholder.role || '',
      relationship: ['serves', 'maintains', 'integrates'].includes(
        stakeholder.relationship
      )
        ? stakeholder.relationship
        : 'serves',
      type: ['people', 'business', 'vendor'].includes(stakeholder.type)
        ? stakeholder.type
        : 'people',
      description: stakeholder.description || '',
      contactInfo: stakeholder.contactInfo || '',
    }))
  },

  /**
   * Migrate dependencies array to enhanced format
   * Supports stakeholder linkage and enhanced descriptions
   *
   * @param {any[]} dependencies - Array of dependencies to migrate
   * @returns {Dependency[]} Enhanced dependencies array
   */
  migrateDependenciesArray: (dependencies: any[]): Dependency[] => {
    return dependencies.map((dependency, index) => ({
      id: dependency.id || `dependency-${index}`,
      stakeholderId: dependency.stakeholderId || '',
      expectation: dependency.expectation || '',
      description: dependency.description || '',
    }))
  },

  /**
   * Migrate impacts array to enhanced format
   * Supports severity levels and measurability tracking
   *
   * @param {any[]} impacts - Array of impacts to migrate
   * @returns {Impact[]} Enhanced impacts array
   */
  migrateImpactsArray: (impacts: any[]): Impact[] => {
    return impacts.map((impact, index) => ({
      id: impact.id || `impact-${index}`,
      category: [
        'financial',
        'legal',
        'operational',
        'customer_experience',
      ].includes(impact.category)
        ? impact.category
        : 'operational',
      description: impact.description || '',
      measurabilityPattern: impact.measurabilityPattern || '',
      isMeasurable: Boolean(impact.isMeasurable),
      severity: ['low', 'medium', 'high', 'critical'].includes(impact.severity)
        ? impact.severity
        : 'medium',
    }))
  },

  /**
   * Migrate telemetry mappings array to enhanced format
   * Supports impact linkage and structured data sources
   *
   * @param {any[]} telemetryMappings - Array of telemetry mappings to migrate
   * @returns {TelemetryMappingItem[]} Enhanced telemetry mappings array
   */
  migrateTelemetryMappingsArray: (
    telemetryMappings: any[]
  ): TelemetryMappingItem[] => {
    return telemetryMappings.map((mapping, index) => ({
      id: mapping.id || `telemetry-${index}`,
      impactId: mapping.impactId || '',
      telemetryRequired: mapping.telemetryRequired || '',
      dataSources: mapping.dataSources || '',
      observableSignals: mapping.observableSignals || '',
    }))
  },

  /**
   * Migrate signals array to enhanced format with Business Impact Playbook support
   * Handles new 'kpi' signal type and dependency linkage for role-outcome mapping
   * Preserves existing signals while adding new capabilities
   *
   * @param {any[]} signals - Array of signals to migrate
   * @returns {Signal[]} Enhanced signals array with Business Impact Playbook support
   */
  migrateSignalsArray: (signals: any[]): Signal[] => {
    return signals.map((signal, index) => {
      const migratedSignal: Signal = {
        id: signal.id || `signal-${index}`,
        name: signal.name || '',
        type: ['business', 'process', 'system', 'kpi'].includes(signal.type)
          ? signal.type
          : 'system',
        description: signal.description || '',
        owner: signal.owner || '',
        metricName: signal.metricName || '',
        threshold: signal.threshold || '',
        alertConditions: Array.isArray(signal.alertConditions)
          ? signal.alertConditions
          : [],
        observableUnit: signal.observableUnit || '',
      }

      // Add dependencyId for KPI and Business signals only (Business Impact Playbook requirement)
      if (signal.type === 'kpi' || signal.type === 'business') {
        migratedSignal.dependencyId = signal.dependencyId || ''
      }

      return migratedSignal
    })
  },

  /**
   * Migrate services array to current format
   * Ensures all services have required fields and proper structure
   *
   * @param {any[]} services - Array of services to migrate
   * @returns {Service[]} Migrated services array
   */
  migrateServices: (services: any[]): Service[] => {
    return services.map(service => ({
      name: service.name || '',
      technical_description: service.technical_description || '',
      technical_flow: service.technical_flow || '',
    }))
  },

  /**
   * Calculate methodology score based on step completeness
   * Determines completion percentage based on BOS methodology steps
   *
   * @param {any} step - Step to calculate score for
   * @returns {number} Methodology completion score (0-100)
   */
  calculateScore: (step: any): number => {
    if (step.score !== undefined) return step.score

    let completedSteps = 0
    const totalSteps = 5

    if (step.stakeholders && step.stakeholders.length > 0) completedSteps++
    if (step.dependencies && Object.keys(step.dependencies).length > 0)
      completedSteps++
    if (step.impacts && Object.keys(step.impacts).length > 0) completedSteps++
    if (step.telemetry && Object.keys(step.telemetry).length > 0)
      completedSteps++
    if (step.signals && Object.keys(step.signals).length > 0) completedSteps++

    return Math.round((completedSteps / totalSteps) * 100)
  },
}
