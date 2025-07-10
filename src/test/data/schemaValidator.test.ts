/**
 * Tests for SchemaValidator - Critical data validation logic
 */

import { SchemaValidator } from '../../data/schemaValidator'
import { Flow } from '../../types'

describe('SchemaValidator', () => {
  describe('validateImportData', () => {
    it('should validate correct flow array', () => {
      const validFlow: Flow = {
        id: 'flow-1',
        name: 'Test Flow',
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

      const result = SchemaValidator.validateImportData([validFlow])

      expect(result.valid).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data![0]).toEqual(validFlow)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate object with flows array', () => {
      const validFlow: Flow = {
        id: 'flow-1',
        name: 'Test Flow',
        stages: [],
      }

      const result = SchemaValidator.validateImportData({ flows: [validFlow] })

      expect(result.valid).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data![0]).toEqual(validFlow)
    })

    it('should reject null/undefined data', () => {
      expect(SchemaValidator.validateImportData(null).valid).toBe(false)
      expect(SchemaValidator.validateImportData(undefined).valid).toBe(false)
    })

    it('should reject invalid data types', () => {
      expect(SchemaValidator.validateImportData('string').valid).toBe(false)
      expect(SchemaValidator.validateImportData(123).valid).toBe(false)
      expect(SchemaValidator.validateImportData(true).valid).toBe(false)
    })

    it('should handle legacy methodology format', () => {
      const legacyData = { methodology: { steps: [] } }
      const result = SchemaValidator.validateImportData(legacyData)

      expect(result.warnings).toContain(
        'Legacy format detected, attempting conversion'
      )
    })

    it('should recover partial data when possible', () => {
      const partialFlow = {
        // Missing id and name - should be generated
        stages: [
          {
            id: 'stage-1',
            name: 'Valid Stage',
            steps: [],
          },
        ],
      }

      const result = SchemaValidator.validateImportData([partialFlow])

      expect(result.valid).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.data![0].id).toMatch(/^flow-\d+-\w+$/)
      expect(result.data![0].name).toBe('Untitled Flow')
    })
  })

  describe('validateFlow', () => {
    it('should validate complete flow', () => {
      const validFlow = {
        id: 'flow-1',
        name: 'Test Flow',
        description: 'Test description',
        stages: [],
      }

      const result = SchemaValidator.validateFlow(validFlow)

      expect(result.valid).toBe(true)
      expect(result.data).toEqual(validFlow)
    })

    it('should generate missing required fields', () => {
      const partialFlow = {
        stages: [],
      }

      const result = SchemaValidator.validateFlow(partialFlow)

      expect(result.valid).toBe(true)
      expect(result.data!.id).toMatch(/^flow-\d+-\w+$/)
      expect(result.data!.name).toBe('Untitled Flow')
      expect(result.warnings).toContain('Flow: Generated missing ID')
      expect(result.warnings).toContain('Flow: Generated missing name')
    })

    it('should initialize empty stages array', () => {
      const flowWithoutStages = {
        id: 'flow-1',
        name: 'Test Flow',
      }

      const result = SchemaValidator.validateFlow(flowWithoutStages)

      expect(result.valid).toBe(true)
      expect(result.data!.stages).toEqual([])
      expect(result.warnings).toContain('Flow: Initialized empty stages array')
    })

    it('should reject invalid data types', () => {
      expect(SchemaValidator.validateFlow(null).valid).toBe(false)
      expect(SchemaValidator.validateFlow('string').valid).toBe(false)
      expect(SchemaValidator.validateFlow(123).valid).toBe(false)
    })
  })

  describe('validateStage', () => {
    it('should validate complete stage', () => {
      const validStage = {
        id: 'stage-1',
        name: 'Test Stage',
        steps: [],
      }

      const result = SchemaValidator.validateStage(validStage)

      expect(result.valid).toBe(true)
      expect(result.data).toEqual(validStage)
    })

    it('should generate missing fields for stage', () => {
      const partialStage = {
        steps: [],
      }

      const result = SchemaValidator.validateStage(partialStage)

      expect(result.valid).toBe(true)
      expect(result.data!.id).toMatch(/^stage-\d+-\w+$/)
      expect(result.data!.name).toBe('Untitled Stage')
    })
  })

  describe('validateStep', () => {
    it('should validate complete step with BOS methodology fields', () => {
      const validStep = {
        id: 'step-1',
        name: 'Test Step',
        description: 'Test description',
        stakeholders: [
          {
            name: 'Test Stakeholder',
            role: 'Test Role',
            type: 'people' as const,
          },
        ],
        dependencies: { key: 'value' },
        impacts: {
          category1: {
            financial: 'Impact',
            legal: 'Impact',
            operational: 'Impact',
            customer_experience: 'Impact',
          },
        },
        telemetry: { key: 'value' },
        signals: { key: 'value' },
        score: 85,
        services: [
          {
            name: 'Test Service',
            technical_description: 'Test Description',
            technical_flow: 'Test Flow',
          },
        ],
      }

      const result = SchemaValidator.validateStep(validStep)

      expect(result.valid).toBe(true)
      expect(result.data).toEqual(validStep)
    })

    it('should generate missing step fields', () => {
      const partialStep = {}

      const result = SchemaValidator.validateStep(partialStep)

      expect(result.valid).toBe(true)
      expect(result.data!.id).toMatch(/^step-\d+-\w+$/)
      expect(result.data!.name).toBe('Untitled Step')
      expect(result.data!.stakeholders).toEqual([])
      expect(result.data!.dependencies).toEqual({})
      expect(result.data!.score).toBe(0)
      expect(result.data!.services).toEqual([])
    })

    it('should validate and clean stakeholders array', () => {
      const stepWithStakeholders = {
        id: 'step-1',
        name: 'Test Step',
        stakeholders: [
          {
            name: 'Valid Stakeholder',
            role: 'Valid Role',
            type: 'business',
          },
          {
            name: 'Missing Type',
            role: 'Valid Role',
            // missing type - should default to 'people'
          },
          {
            // missing name and role - should get defaults
            type: 'vendor',
          },
          'invalid-stakeholder', // invalid type - should be filtered out
        ],
      }

      const result = SchemaValidator.validateStep(stepWithStakeholders)

      expect(result.valid).toBe(true)
      expect(result.data!.stakeholders).toHaveLength(3)
      expect(result.data!.stakeholders[0].type).toBe('business')
      expect(result.data!.stakeholders[1].type).toBe('people')
      expect(result.data!.stakeholders[2].name).toBe('Unknown')
      expect(result.data!.stakeholders[2].role).toBe('Unknown')
    })

    it('should validate and clean services array', () => {
      const stepWithServices = {
        id: 'step-1',
        name: 'Test Step',
        services: [
          {
            name: 'Valid Service',
            technical_description: 'Valid Description',
            technical_flow: 'Valid Flow',
          },
          {
            name: 'Partial Service',
            // missing description and flow - should get defaults
          },
          {
            // missing all fields - should get defaults
          },
          'invalid-service', // invalid type - should be filtered out
        ],
      }

      const result = SchemaValidator.validateStep(stepWithServices)

      expect(result.valid).toBe(true)
      expect(result.data!.services).toHaveLength(3)
      expect(result.data!.services[1].technical_description).toBe(
        'No description'
      )
      expect(result.data!.services[1].technical_flow).toBe('No flow defined')
      expect(result.data!.services[2].name).toBe('Unknown Service')
    })
  })
})
