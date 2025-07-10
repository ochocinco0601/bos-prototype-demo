/**
 * TypeScript interfaces for the BOS (Business Observability System) prototype
 * Extracted from App.tsx to provide centralized type definitions
 */

// =============================================================================
// BASIC TYPES
// =============================================================================

/**
 * Dependency interface - BOS methodology Step 2
 * Maps stakeholder expectations to specific dependencies
 */
export interface Dependency {
  id?: string
  stakeholderId?: string
  expectation: string
  description?: string
}

/**
 * Telemetry Mapping interface - BOS methodology Step 4 (Enhanced)
 * Individual telemetry mapping with impact traceability
 */
export interface TelemetryMappingItem {
  id?: string
  impactId?: string
  telemetryRequired: string
  dataSources: string
  observableSignals: string
}

/**
 * Service interface - Represents a technical service in the system
 * Used to describe technical components and their execution flow
 */
export interface Service {
  name: string
  technical_description: string
  technical_flow: string // e.g., "Service A -> Service B -> Service C"
}

/**
 * Stakeholder interface - BOS methodology Step 1
 * Represents stakeholders in the Serves/Maintains/Integrates framework
 */
export interface Stakeholder {
  id?: string
  name: string
  role?: string
  relationship: 'serves' | 'maintains' | 'integrates' // Validated framework
  type: 'people' | 'business' | 'vendor'
  description?: string
  contactInfo?: string
}

/**
 * Impact interface - BOS methodology Step 3
 * Individual impact with measurability validation support
 */
export interface Impact {
  id?: string
  category: 'financial' | 'legal' | 'operational' | 'customer_experience'
  description: string
  measurabilityPattern?: string
  isMeasurable?: boolean
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Impact Category interface - BOS methodology Step 3 (Legacy)
 * Preserved for backward compatibility
 */
export interface ImpactCategory {
  financial: string
  legal: string
  operational: string
  customer_experience: string
}

// =============================================================================
// SIGNAL AND TELEMETRY TYPES
// =============================================================================

/**
 * Signal interface - BOS methodology Step 5
 * Enhanced signal definition with ownership and validation
 * Added 'kpi' type and optional dependencyId for Business Impact Playbook
 */
export interface Signal {
  id?: string
  name: string
  type: 'business' | 'process' | 'system' | 'kpi'
  description?: string
  owner?: string
  metricName?: string
  threshold?: string
  alertConditions?: string[]
  observableUnit?: string
  dependencyId?: string // Optional: Links KPI and Business signals to specific dependencies for role-outcome mapping
}

/**
 * Signal Definition interface - BOS methodology Step 5 (Legacy)
 * Preserved for backward compatibility
 */
export interface SignalDefinition {
  observable_unit: string
  signal_type: string // "Business Signal" | "Process Signal" | "System Signal"
  signal_name: string
  instrumentation_details: string
  threshold_conditions?: string
  implementation_notes?: string
}

/**
 * Signal Mapping interface - Organizes signals by impact category and type
 * Maintains BOS methodology structure for signal organization
 */
export interface SignalMapping {
  [impactCategory: string]: {
    business_signal: SignalDefinition
    process_signal: SignalDefinition
    system_signal: SignalDefinition
  }
}

/**
 * Telemetry Mapping interface - BOS methodology Step 4
 * Defines telemetry requirements and data sources structure
 */
export interface TelemetryMapping {
  [impactCategory: string]: {
    telemetry_required: string
    data_sources: string
    observable_signals: string
  }
}

/**
 * Role-Outcome Mapping interface - Business Impact Playbook Generation
 * Maps stakeholder goals to measurable signals for role-outcome table
 * Simplified 1-to-1 goal-to-signal approach for prototype feasibility
 */
export interface RoleOutcomeMapping {
  id: string
  stakeholderId: string
  dependencyId: string
  stakeholderName: string
  stakeholderRole: string
  goalExpectation: string
  signalId?: string // Optional: Links to specific KPI or Business signal
  signalName?: string
  signalType?: 'kpi' | 'business'
  signalMetric?: string
  signalThreshold?: string
}

// =============================================================================
// COMPLEX BUSINESS PROCESS TYPES
// =============================================================================

/**
 * Observable Unit interface - Enhanced service component model
 * Supports 1-to-many relationship with Services (validated approach)
 */
export interface ObservableUnit {
  id: string
  name: string
  type: 'service' | 'function' | 'job' | 'module' | 'process' | 'bot'
  description?: string
  owner?: string
  parentServiceId: string
  measurableAttributes?: string[]
  signalMappings?: string[]
}

/**
 * Enhanced Service interface - Now supports Observable Units
 * Maintains backward compatibility while adding 1-to-many relationship
 */
export interface EnhancedService extends Service {
  id?: string
  observableUnits?: ObservableUnit[]
  upstreamDependencies?: string[]
  owner?: string
}

/**
 * Step interface - Unified BOS methodology + Services
 * Made BOS methodology fields optional for progressive completion
 * Maintains backward compatibility with existing data
 */
export interface Step {
  id: string
  name: string
  description?: string

  // BOS Methodology Fields (NOW OPTIONAL for progressive completion)
  stakeholders?: Stakeholder[] // Step 1: WHO depends
  dependencies?: Dependency[] // Step 2: WHAT they expect (enhanced structure)
  impacts?: Impact[] // Step 3: WHAT breaks (enhanced structure)
  telemetryMappings?: TelemetryMappingItem[] // Step 4: WHAT telemetry (enhanced)
  signals?: Signal[] // Step 5: WHAT signals (enhanced structure)

  // Legacy BOS fields (preserved for backward compatibility)
  legacyDependencies?: { [key: string]: string }
  legacyImpacts?: { [key: string]: ImpactCategory }
  legacyTelemetry?: { [key: string]: TelemetryMapping }
  legacySignals?: { [key: string]: SignalMapping }

  score?: number // Methodology completion score (0-100, now optional)

  // Services Fields
  services: Service[] // Technical execution details (remains required)
}

/**
 * Stage interface - Groups related Steps
 * Unified structure supporting both visualization and methodology
 */
export interface Stage {
  id: string
  name: string
  steps: Step[]
}

/**
 * Flow interface - Top-level business process
 * Unified structure enhanced with description for visualization
 */
export interface Flow {
  id: string
  name: string
  description?: string
  stages: Stage[]
}
