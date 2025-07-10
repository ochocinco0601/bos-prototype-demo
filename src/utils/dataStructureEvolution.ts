/**
 * Data Structure Evolution Tools
 * Provides safe migration and evolution utilities for BOS data structures
 * Enables confident data structure modifications during development
 */

import { Flow, Step, Service } from '../types'
import { logger } from './logger'
import { bosFieldValidator } from './bosFieldValidator'
import { BackupManager } from '../data/backupManager'
import { schemaValidator } from '../data/schemaValidator'

export interface DataMigration {
  version: string
  description: string
  up: (data: any) => any
  down: (data: any) => any
  validate?: (data: any) => boolean
}

export interface EvolutionPlan {
  currentVersion: string
  targetVersion: string
  migrations: DataMigration[]
  backupRequired: boolean
  riskLevel: 'low' | 'medium' | 'high'
  estimatedTime: number
}

export interface FieldChange {
  type: 'add' | 'remove' | 'rename' | 'typeChange'
  path: string
  oldValue?: any
  newValue?: any
  description: string
  migration?: (data: any) => any
}

export interface EvolutionResult {
  success: boolean
  version: string
  migrationsApplied: string[]
  errors: string[]
  warnings: string[]
  backupId?: string
  rollbackAvailable: boolean
}

export interface CompatibilityCheck {
  compatible: boolean
  issues: CompatibilityIssue[]
  recommendations: string[]
  migrationPath?: string[]
}

export interface CompatibilityIssue {
  severity: 'error' | 'warning' | 'info'
  field: string
  message: string
  suggestion: string
}

/**
 * Data Structure Evolution Manager
 * Handles safe evolution of BOS data structures with migration support
 */
export class DataStructureEvolution {
  private static instance: DataStructureEvolution
  private migrations: Map<string, DataMigration> = new Map()

  private constructor() {
    this.initializeCoreMigrations()
  }

  static getInstance(): DataStructureEvolution {
    if (!DataStructureEvolution.instance) {
      DataStructureEvolution.instance = new DataStructureEvolution()
    }
    return DataStructureEvolution.instance
  }

  /**
   * Initialize core BOS data structure migrations
   */
  private initializeCoreMigrations(): void {
    // Example migration: Add score field to steps
    this.addMigration({
      version: '1.1.0',
      description:
        'Add score field to steps for BOS methodology completion tracking',
      up: data => {
        if (data.flows) {
          data.flows.forEach((flow: Flow) => {
            flow.stages.forEach(stage => {
              stage.steps.forEach(step => {
                if (step.score === undefined) {
                  step.score = this.calculateStepScore(step)
                }
              })
            })
          })
        }
        return data
      },
      down: data => {
        if (data.flows) {
          data.flows.forEach((flow: Flow) => {
            flow.stages.forEach(stage => {
              stage.steps.forEach(step => {
                delete (step as any).score
              })
            })
          })
        }
        return data
      },
      validate: data => {
        if (!data.flows) return true
        return data.flows.every((flow: Flow) =>
          flow.stages.every(stage =>
            stage.steps.every(step => typeof step.score === 'number')
          )
        )
      },
    })

    // Example migration: Add methodology field structure
    this.addMigration({
      version: '1.2.0',
      description: 'Restructure methodology fields for better organization',
      up: data => {
        if (data.flows) {
          data.flows.forEach((flow: Flow) => {
            flow.stages.forEach(stage => {
              stage.steps.forEach(step => {
                if (!step.methodology) {
                  step.methodology = {
                    stakeholder_categories:
                      this.convertStakeholdersToCategories(step.stakeholders),
                    dependencies: step.dependencies,
                    impact_categories: step.impacts,
                    telemetry_signals: step.telemetry,
                    observable_units: step.signals,
                  }
                }
              })
            })
          })
        }
        return data
      },
      down: data => {
        if (data.flows) {
          data.flows.forEach((flow: Flow) => {
            flow.stages.forEach(stage => {
              stage.steps.forEach(step => {
                if (step.methodology) {
                  step.stakeholders = this.convertCategoriesToStakeholders(
                    step.methodology.stakeholder_categories
                  )
                  step.dependencies = step.methodology.dependencies
                  step.impacts = step.methodology.impact_categories
                  step.telemetry = step.methodology.telemetry_signals
                  step.signals = step.methodology.observable_units
                  delete (step as any).methodology
                }
              })
            })
          })
        }
        return data
      },
    })
  }

  /**
   * Add a new migration
   */
  addMigration(migration: DataMigration): void {
    this.migrations.set(migration.version, migration)
    logger.info('Added data migration', {
      component: 'DataStructureEvolution',
      version: migration.version,
      description: migration.description,
    })
  }

  /**
   * Create evolution plan for data structure changes
   */
  createEvolutionPlan(
    currentVersion: string,
    targetVersion: string
  ): EvolutionPlan {
    const migrations = this.getMigrationsInRange(currentVersion, targetVersion)
    const riskLevel = this.assessRiskLevel(migrations)

    return {
      currentVersion,
      targetVersion,
      migrations,
      backupRequired: riskLevel !== 'low',
      riskLevel,
      estimatedTime: migrations.length * 1000, // 1 second per migration
    }
  }

  /**
   * Execute evolution plan
   */
  async executeEvolution(
    data: any,
    plan: EvolutionPlan
  ): Promise<EvolutionResult> {
    const result: EvolutionResult = {
      success: false,
      version: plan.currentVersion,
      migrationsApplied: [],
      errors: [],
      warnings: [],
      rollbackAvailable: false,
    }

    try {
      // Create backup if required
      if (plan.backupRequired) {
        const backupResult = BackupManager.createBackup(
          data.flows || [],
          'data_migration',
          `Evolution backup before ${plan.targetVersion}`
        )
        if (backupResult.success) {
          result.backupId = backupResult.backupId!
          result.rollbackAvailable = true
        } else {
          result.warnings.push('Failed to create backup')
        }
      }

      // Execute migrations sequentially
      let currentData = { ...data }

      for (const migration of plan.migrations) {
        try {
          logger.info('Applying migration', {
            component: 'DataStructureEvolution',
            version: migration.version,
          })

          currentData = migration.up(currentData)

          // Validate migration result
          if (migration.validate && !migration.validate(currentData)) {
            throw new Error(`Migration ${migration.version} validation failed`)
          }

          result.migrationsApplied.push(migration.version)
          result.version = migration.version
        } catch (error) {
          result.errors.push(
            `Migration ${migration.version} failed: ${(error as Error).message}`
          )
          break
        }
      }

      // Final validation
      if (result.errors.length === 0) {
        const validationResult = schemaValidator.validateFlowData(currentData)
        if (!validationResult.valid) {
          result.errors.push('Final schema validation failed')
          result.warnings.push(...validationResult.errors)
        } else {
          result.success = true
        }
      }

      return result
    } catch (error) {
      result.errors.push(
        `Evolution execution failed: ${(error as Error).message}`
      )
      return result
    }
  }

  /**
   * Rollback evolution to previous state
   */
  async rollbackEvolution(backupId: string): Promise<EvolutionResult> {
    try {
      const backup = BackupManager.restoreFromBackup(backupId)

      return {
        success: true,
        version: 'restored',
        migrationsApplied: [],
        errors: [],
        warnings: ['Data restored from backup'],
        rollbackAvailable: false,
      }
    } catch (error) {
      return {
        success: false,
        version: 'unknown',
        migrationsApplied: [],
        errors: [`Rollback failed: ${(error as Error).message}`],
        warnings: [],
        rollbackAvailable: false,
      }
    }
  }

  /**
   * Check compatibility between data versions
   */
  checkCompatibility(
    sourceData: any,
    targetVersion: string
  ): CompatibilityCheck {
    const issues: CompatibilityIssue[] = []
    const recommendations: string[] = []

    // Check for missing required fields in target version
    const targetRequirements = this.getVersionRequirements(targetVersion)

    for (const requirement of targetRequirements) {
      if (!this.hasRequiredField(sourceData, requirement.path)) {
        issues.push({
          severity: requirement.required ? 'error' : 'warning',
          field: requirement.path,
          message: `Field ${requirement.path} is ${requirement.required ? 'required' : 'recommended'} in version ${targetVersion}`,
          suggestion: requirement.suggestion || `Add ${requirement.path} field`,
        })
      }
    }

    // Generate recommendations
    if (issues.length > 0) {
      recommendations.push('Review data structure before migration')
      recommendations.push('Create backup before applying changes')

      if (issues.some(i => i.severity === 'error')) {
        recommendations.push('Fix critical issues before proceeding')
      }
    }

    return {
      compatible: issues.filter(i => i.severity === 'error').length === 0,
      issues,
      recommendations,
      migrationPath: this.getMigrationPath(sourceData, targetVersion),
    }
  }

  /**
   * Apply field changes to data structure
   */
  applyFieldChanges(data: any, changes: FieldChange[]): any {
    let modifiedData = { ...data }

    for (const change of changes) {
      try {
        switch (change.type) {
          case 'add':
            modifiedData = this.addField(
              modifiedData,
              change.path,
              change.newValue
            )
            break
          case 'remove':
            modifiedData = this.removeField(modifiedData, change.path)
            break
          case 'rename':
            modifiedData = this.renameField(
              modifiedData,
              change.path,
              change.newValue
            )
            break
          case 'typeChange':
            modifiedData = this.changeFieldType(
              modifiedData,
              change.path,
              change.newValue
            )
            break
        }

        // Apply custom migration if provided
        if (change.migration) {
          modifiedData = change.migration(modifiedData)
        }
      } catch (error) {
        logger.error('Field change application failed', {
          component: 'DataStructureEvolution',
          change: change.type,
          path: change.path,
          error: (error as Error).message,
        })
      }
    }

    return modifiedData
  }

  /**
   * Generate migration template for new field
   */
  generateMigrationTemplate(
    version: string,
    description: string,
    changes: FieldChange[]
  ): string {
    const upLogic = changes
      .map(change => {
        switch (change.type) {
          case 'add':
            return `    // Add ${change.path}\n    data = this.addField(data, '${change.path}', ${JSON.stringify(change.newValue)})`
          case 'remove':
            return `    // Remove ${change.path}\n    data = this.removeField(data, '${change.path}')`
          case 'rename':
            return `    // Rename ${change.path} to ${change.newValue}\n    data = this.renameField(data, '${change.path}', '${change.newValue}')`
          default:
            return `    // ${change.description}\n    // Custom logic needed`
        }
      })
      .join('\n')

    const downLogic = changes
      .map(change => {
        switch (change.type) {
          case 'add':
            return `    // Remove added ${change.path}\n    data = this.removeField(data, '${change.path}')`
          case 'remove':
            return `    // Restore ${change.path}\n    data = this.addField(data, '${change.path}', ${JSON.stringify(change.oldValue)})`
          case 'rename':
            return `    // Rename ${change.newValue} back to ${change.path}\n    data = this.renameField(data, '${change.newValue}', '${change.path}')`
          default:
            return `    // Reverse ${change.description}\n    // Custom logic needed`
        }
      })
      .join('\n')

    return `
// Migration: ${version}
// Description: ${description}
{
  version: '${version}',
  description: '${description}',
  up: (data) => {
${upLogic}
    return data
  },
  down: (data) => {
${downLogic}
    return data
  },
  validate: (data) => {
    // Add validation logic here
    return true
  }
}
`.trim()
  }

  /**
   * Utility methods
   */
  private calculateStepScore(step: Step): number {
    const summary = bosFieldValidator.validateStep(step)
    return Math.round(summary.overallScore)
  }

  private convertStakeholdersToCategories(stakeholders: any[]): any {
    if (!Array.isArray(stakeholders)) return {}

    const categories: any = {}
    stakeholders.forEach(stakeholder => {
      const type = stakeholder.type || 'unknown'
      if (!categories[type]) categories[type] = []
      categories[type].push(stakeholder)
    })

    return categories
  }

  private convertCategoriesToStakeholders(categories: any): any[] {
    if (!categories || typeof categories !== 'object') return []

    const stakeholders: any[] = []
    Object.values(categories).forEach((categoryStakeholders: any) => {
      if (Array.isArray(categoryStakeholders)) {
        stakeholders.push(...categoryStakeholders)
      }
    })

    return stakeholders
  }

  private getMigrationsInRange(from: string, to: string): DataMigration[] {
    // Simplified version comparison - in reality would use semver
    const migrations = Array.from(this.migrations.values())
    return migrations
      .filter(m => m.version > from && m.version <= to)
      .sort((a, b) => a.version.localeCompare(b.version))
  }

  private assessRiskLevel(
    migrations: DataMigration[]
  ): 'low' | 'medium' | 'high' {
    if (migrations.length === 0) return 'low'
    if (migrations.length <= 2) return 'medium'
    return 'high'
  }

  private getVersionRequirements(version: string): Array<{
    path: string
    required: boolean
    suggestion?: string
  }> {
    // Mock implementation - would be based on schema definitions
    return [
      { path: 'flows', required: true },
      { path: 'flows[].stages', required: true },
      { path: 'flows[].stages[].steps', required: true },
    ]
  }

  private hasRequiredField(data: any, path: string): boolean {
    // Simplified field check - would implement proper path traversal
    return data && typeof data === 'object'
  }

  private getMigrationPath(data: any, targetVersion: string): string[] {
    // Would determine optimal migration path
    return [targetVersion]
  }

  private addField(data: any, path: string, value: any): any {
    // Simplified implementation - would use proper path manipulation
    const modified = { ...data }
    // Implementation would handle nested paths
    return modified
  }

  private removeField(data: any, path: string): any {
    // Simplified implementation
    const modified = { ...data }
    // Implementation would handle nested paths
    return modified
  }

  private renameField(data: any, oldPath: string, newPath: string): any {
    // Simplified implementation
    const modified = { ...data }
    // Implementation would handle nested paths
    return modified
  }

  private changeFieldType(data: any, path: string, newType: any): any {
    // Simplified implementation
    const modified = { ...data }
    // Implementation would handle type conversion
    return modified
  }
}

// Export singleton instance
export const dataStructureEvolution = DataStructureEvolution.getInstance()

/**
 * Utility functions for common evolution scenarios
 */
export class DataEvolutionUtils {
  /**
   * Quick field addition helper
   */
  static addField(data: any, path: string, defaultValue: any): any {
    const change: FieldChange = {
      type: 'add',
      path,
      newValue: defaultValue,
      description: `Add ${path} field`,
    }
    return dataStructureEvolution.applyFieldChanges(data, [change])
  }

  /**
   * Safe field removal helper
   */
  static removeField(data: any, path: string): any {
    const change: FieldChange = {
      type: 'remove',
      path,
      description: `Remove ${path} field`,
    }
    return dataStructureEvolution.applyFieldChanges(data, [change])
  }

  /**
   * Field rename helper
   */
  static renameField(data: any, oldPath: string, newPath: string): any {
    const change: FieldChange = {
      type: 'rename',
      path: oldPath,
      newValue: newPath,
      description: `Rename ${oldPath} to ${newPath}`,
    }
    return dataStructureEvolution.applyFieldChanges(data, [change])
  }

  /**
   * Create evolution plan for common scenarios
   */
  static createQuickEvolutionPlan(
    scenario: 'addBOSField' | 'restructureMethodology' | 'addValidation'
  ): EvolutionPlan {
    const migrations: DataMigration[] = []

    switch (scenario) {
      case 'addBOSField':
        migrations.push({
          version: '1.0.1',
          description: 'Add new BOS methodology field',
          up: data => data,
          down: data => data,
        })
        break
      case 'restructureMethodology':
        migrations.push({
          version: '1.1.0',
          description: 'Restructure methodology organization',
          up: data => data,
          down: data => data,
        })
        break
      case 'addValidation':
        migrations.push({
          version: '1.0.2',
          description: 'Add validation metadata',
          up: data => data,
          down: data => data,
        })
        break
    }

    return {
      currentVersion: '1.0.0',
      targetVersion: migrations[0].version,
      migrations,
      backupRequired: true,
      riskLevel: 'low',
      estimatedTime: 1000,
    }
  }
}
