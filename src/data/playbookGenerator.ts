/**
 * Business Impact Playbook Generation
 *
 * Generates formatted business impact playbooks from BOS methodology data.
 * The playbook displays whatever data has been entered for the step.
 */

import {
  Step,
  Stakeholder,
  Impact,
  Signal,
  TelemetryMappingItem,
  Dependency,
} from '../types'

export interface PlaybookData {
  stepName: string
  description: string
  stakeholders: Stakeholder[]
  dependencies: Dependency[]
  impacts: Impact[]
  telemetryMappings: TelemetryMappingItem[]
  signals: Signal[]
}

export class PlaybookGenerator {
  /**
   * Generate playbook data from a step's BOS methodology information
   */
  generatePlaybook(step: Step): PlaybookData {
    return {
      stepName: step.name,
      description: step.description || '',
      stakeholders: step.stakeholders || [],
      dependencies: step.dependencies || [],
      impacts: Array.isArray(step.impacts)
        ? step.impacts
        : step.impacts
          ? (Object.values(step.impacts) as Impact[])
          : [],
      telemetryMappings: step.telemetryMappings || [],
      signals: Array.isArray(step.signals)
        ? step.signals
        : step.signals
          ? (Object.values(step.signals) as Signal[])
          : [],
    }
  }
}
