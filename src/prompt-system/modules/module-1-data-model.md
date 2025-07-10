### Module 1: Complete BOS Data Model Context

#### Core TypeScript Interfaces

```typescript
// Flow → Stage → Step → Services hierarchy
export interface Flow {
  id: string
  name: string
  description?: string
  stages: Stage[]
}

export interface Stage {
  id: string
  name: string
  steps: Step[]
}

export interface Step {
  id: string
  name: string
  description?: string
  
  // BOS Methodology Fields (OPTIONAL - populated later)
  stakeholders?: Stakeholder[]
  dependencies?: Dependency[]
  impacts?: Impact[]
  telemetryMappings?: TelemetryMappingItem[]
  signals?: Signal[]
  
  // Services Fields (REQUIRED for process structure)
  services: Service[]
}

export interface Service {
  name: string
  technical_description: string
  technical_flow: string
}

// BOS Methodology Interfaces
export interface Stakeholder {
  id?: string
  name: string
  role?: string
  relationship: 'serves' | 'maintains' | 'integrates'
  type: 'people' | 'business' | 'vendor'
  description?: string
  contactInfo?: string
}

export interface Dependency {
  id?: string
  stakeholderId?: string
  expectation: string
  description?: string
}

export interface Impact {
  id?: string
  category: 'financial' | 'legal' | 'operational' | 'customer_experience'
  description: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  isMeasurable?: boolean
}

export interface TelemetryMappingItem {
  id?: string
  impactId?: string
  telemetryRequired: string
  dataSources: string
  observableSignals: string
}

export interface Signal {
  id?: string
  name: string
  type: 'business' | 'process' | 'system' | 'kpi'
  description?: string
  owner?: string
  metricName?: string
  threshold?: string
  dependencyId?: string // Links KPI/Business signals to dependencies
}
```

#### Data Structure Rules
- **Flow**: Top-level business process (e.g., "Loan Origination Process")
- **Stage**: Process phases, often corresponding to swim lanes or major process divisions
- **Step**: Individual activities or tasks within a stage
- **Service**: Technical components that execute the step (may be empty if not specified)
- **Methodology Fields**: Always optional in translation - populated later through collaborative BOS workflow