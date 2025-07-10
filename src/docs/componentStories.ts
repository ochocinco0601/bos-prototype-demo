/**
 * Component Story Documentation System
 * Provides comprehensive documentation and examples for BOS components
 * Enables consistent patterns when building new screens and components
 */

import { Flow, Step, Service } from '../types'
import {
  createCompleteMethodologyFlow,
  createBasicFlow,
} from '../data/mockData'

export interface ComponentStory {
  name: string
  description: string
  component: string
  category: 'layout' | 'form' | 'display' | 'modal' | 'navigation'
  usage: ComponentUsage
  examples: ComponentExample[]
  patterns: DesignPattern[]
  accessibility: AccessibilityGuidelines
  styling: StylingGuidelines
}

export interface ComponentUsage {
  when: string
  purpose: string
  props: PropDocumentation[]
  hooks: string[]
  dependencies: string[]
}

export interface PropDocumentation {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: any
  examples: any[]
}

export interface ComponentExample {
  name: string
  description: string
  props: Record<string, any>
  code: string
  notes?: string[]
}

export interface DesignPattern {
  name: string
  description: string
  when: string
  implementation: string
  benefits: string[]
  considerations: string[]
}

export interface AccessibilityGuidelines {
  keyboardNavigation: string[]
  screenReader: string[]
  colorContrast: string[]
  focusManagement: string[]
}

export interface StylingGuidelines {
  theme: string
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, string>
  responsiveness: string[]
}

/**
 * Component Story Documentation System
 * Maintains comprehensive documentation for all BOS components
 */
export class ComponentStorybook {
  private static instance: ComponentStorybook
  private stories: Map<string, ComponentStory> = new Map()

  private constructor() {
    this.initializeDefaultStories()
  }

  static getInstance(): ComponentStorybook {
    if (!ComponentStorybook.instance) {
      ComponentStorybook.instance = new ComponentStorybook()
    }
    return ComponentStorybook.instance
  }

  /**
   * Initialize documentation for all existing BOS components
   */
  private initializeDefaultStories(): void {
    this.addStory(this.createFlowManagerStory())
    this.addStory(this.createGridViewStory())
    this.addStory(this.createCompactViewStory())
    this.addStory(this.createDetailPanelStory())
    this.addStory(this.createImportModalStory())
    this.addStory(this.createExportModalStory())
  }

  /**
   * FlowManager component documentation
   */
  private createFlowManagerStory(): ComponentStory {
    const testData = this.getTestData()

    return {
      name: 'FlowManager',
      description:
        'Manages flow selection, creation, duplication, and deletion',
      component: 'FlowManager',
      category: 'navigation',
      usage: {
        when: 'User needs to switch between different business flows or manage flow lifecycle',
        purpose: 'Provides centralized flow management with CRUD operations',
        props: [
          {
            name: 'flows',
            type: 'Flow[]',
            required: true,
            description: 'Array of available flows to display',
            examples: [testData.flows],
          },
          {
            name: 'selectedFlowId',
            type: 'string | null',
            required: true,
            description: 'ID of currently selected flow',
            examples: [testData.completeFlow.id, null],
          },
          {
            name: 'onFlowSelect',
            type: '(flowId: string) => void',
            required: true,
            description: 'Callback when user selects a flow',
            examples: ['(id) => setSelectedFlow(id)'],
          },
          {
            name: 'onFlowCreate',
            type: '() => void',
            required: true,
            description: 'Callback when user creates new flow',
            examples: ['() => createNewFlow()'],
          },
          {
            name: 'onFlowDuplicate',
            type: '(flowId: string) => void',
            required: true,
            description: 'Callback when user duplicates a flow',
            examples: ['(id) => duplicateFlow(id)'],
          },
          {
            name: 'onFlowDelete',
            type: '(flowId: string) => void',
            required: true,
            description: 'Callback when user deletes a flow',
            examples: ['(id) => deleteFlow(id)'],
          },
        ],
        hooks: ['useFlowManagement'],
        dependencies: [],
      },
      examples: [
        {
          name: 'Basic Usage',
          description: 'Standard flow manager with multiple flows',
          props: {
            flows: testData.flows,
            selectedFlowId: testData.completeFlow.id,
            onFlowSelect: () => {},
            onFlowCreate: () => {},
            onFlowDuplicate: () => {},
            onFlowDelete: () => {},
          },
          code: `<FlowManager
  flows={flows}
  selectedFlowId={selectedFlowId}
  onFlowSelect={handleFlowSelect}
  onFlowCreate={handleFlowCreate}
  onFlowDuplicate={handleFlowDuplicate}
  onFlowDelete={handleFlowDelete}
/>`,
        },
        {
          name: 'Empty State',
          description: 'Flow manager with no flows available',
          props: {
            flows: [],
            selectedFlowId: null,
            onFlowSelect: () => {},
            onFlowCreate: () => {},
            onFlowDuplicate: () => {},
            onFlowDelete: () => {},
          },
          code: `<FlowManager
  flows={[]}
  selectedFlowId={null}
  onFlowSelect={handleFlowSelect}
  onFlowCreate={handleFlowCreate}
  onFlowDuplicate={handleFlowDuplicate}
  onFlowDelete={handleFlowDelete}
/>`,
          notes: ['Shows create flow button prominently when no flows exist'],
        },
      ],
      patterns: [
        {
          name: 'Flow Management Pattern',
          description: 'Centralized flow operations with consistent UI',
          when: 'Managing multiple business processes or workflows',
          implementation:
            'Use dropdown selector with action buttons for CRUD operations',
          benefits: ['Consistent UX', 'Centralized control', 'Clear actions'],
          considerations: [
            'Confirm destructive actions',
            'Handle loading states',
          ],
        },
      ],
      accessibility: {
        keyboardNavigation: [
          'Tab through flow selector and action buttons',
          'Enter to select flows or trigger actions',
          'Arrow keys for dropdown navigation',
        ],
        screenReader: [
          'Label flow selector clearly',
          'Announce flow changes',
          'Provide action button descriptions',
        ],
        colorContrast: [
          'Ensure button text meets WCAG contrast ratios',
          'Use distinct colors for destructive actions',
        ],
        focusManagement: [
          'Focus management for create flow modal',
          'Return focus after modal close',
        ],
      },
      styling: this.getDefaultStyling(),
    }
  }

  /**
   * GridView component documentation
   */
  private createGridViewStory(): ComponentStory {
    const testData = this.getTestData()

    return {
      name: 'GridView',
      description: 'Displays flow stages and steps in a visual grid layout',
      component: 'GridView',
      category: 'display',
      usage: {
        when: 'User needs visual overview of flow structure with stage-step relationships',
        purpose:
          'Provides intuitive visual representation of business process flow',
        props: [
          {
            name: 'flow',
            type: 'Flow',
            required: true,
            description: 'Flow object containing stages and steps',
            examples: [testData.completeFlow, testData.basicFlow],
          },
          {
            name: 'selectedStepId',
            type: 'string | null',
            required: true,
            description: 'ID of currently selected step',
            examples: [testData.completeStep.id, null],
          },
          {
            name: 'onStepSelect',
            type: '(stepId: string) => void',
            required: true,
            description: 'Callback when user selects a step',
            examples: ['(id) => setSelectedStep(id)'],
          },
        ],
        hooks: ['useStepManagement'],
        dependencies: [],
      },
      examples: [
        {
          name: 'Complete Flow Grid',
          description: 'Grid view showing complex flow with multiple stages',
          props: {
            flow: testData.completeFlow,
            selectedStepId: testData.completeStep.id,
            onStepSelect: () => {},
          },
          code: `<GridView
  flow={completeFlow}
  selectedStepId={selectedStepId}
  onStepSelect={handleStepSelect}
/>`,
        },
        {
          name: 'Basic Flow Grid',
          description: 'Grid view showing simple flow structure',
          props: {
            flow: testData.basicFlow,
            selectedStepId: testData.basicStep.id,
            onStepSelect: () => {},
          },
          code: `<GridView
  flow={basicFlow}
  selectedStepId={selectedStepId}
  onStepSelect={handleStepSelect}
/>`,
        },
      ],
      patterns: [
        {
          name: 'Visual Flow Representation',
          description: 'Grid-based layout showing process stages and steps',
          when: 'Users need to understand flow structure and navigate between steps',
          implementation:
            'Use CSS Grid with responsive columns for stages and steps',
          benefits: [
            'Visual clarity',
            'Easy navigation',
            'Process understanding',
          ],
          considerations: [
            'Mobile responsiveness',
            'Large flow handling',
            'Performance',
          ],
        },
      ],
      accessibility: this.getDefaultAccessibility(),
      styling: this.getDefaultStyling(),
    }
  }

  /**
   * CompactView component documentation
   */
  private createCompactViewStory(): ComponentStory {
    const testData = this.getTestData()

    return {
      name: 'CompactView',
      description: 'Displays flow in compact list format for smaller screens',
      component: 'CompactView',
      category: 'display',
      usage: {
        when: 'Limited screen space or user prefers list-based navigation',
        purpose: 'Provides space-efficient flow navigation alternative',
        props: [
          {
            name: 'flow',
            type: 'Flow',
            required: true,
            description: 'Flow object to display in compact format',
            examples: [testData.completeFlow, testData.basicFlow],
          },
          {
            name: 'selectedStepId',
            type: 'string | null',
            required: true,
            description: 'ID of currently selected step',
            examples: [testData.completeStep.id, null],
          },
          {
            name: 'onStepSelect',
            type: '(stepId: string) => void',
            required: true,
            description: 'Callback when user selects a step',
            examples: ['(id) => setSelectedStep(id)'],
          },
        ],
        hooks: ['useStepManagement'],
        dependencies: [],
      },
      examples: [
        {
          name: 'Mobile Compact View',
          description: 'Compact view optimized for mobile screens',
          props: {
            flow: testData.completeFlow,
            selectedStepId: testData.completeStep.id,
            onStepSelect: () => {},
          },
          code: `<CompactView
  flow={flow}
  selectedStepId={selectedStepId}
  onStepSelect={handleStepSelect}
/>`,
        },
      ],
      patterns: [
        {
          name: 'Responsive Design Pattern',
          description: 'Adaptive layout based on screen size',
          when: 'Supporting multiple device types and screen sizes',
          implementation:
            'Use media queries or CSS container queries for layout switching',
          benefits: [
            'Mobile optimization',
            'Better UX on small screens',
            'Performance',
          ],
          considerations: [
            'Consistent navigation',
            'Feature parity',
            'Touch targets',
          ],
        },
      ],
      accessibility: this.getDefaultAccessibility(),
      styling: this.getDefaultStyling(),
    }
  }

  /**
   * DetailPanel component documentation
   */
  private createDetailPanelStory(): ComponentStory {
    const testData = this.getTestData()

    return {
      name: 'DetailPanel',
      description:
        'Shows detailed BOS methodology information for selected step',
      component: 'DetailPanel',
      category: 'display',
      usage: {
        when: 'User needs to view or edit detailed step information and BOS methodology data',
        purpose:
          'Provides comprehensive step details with methodology framework',
        props: [
          {
            name: 'step',
            type: 'Step | null',
            required: true,
            description: 'Step object to display details for',
            examples: [testData.completeStep, testData.basicStep, null],
          },
          {
            name: 'onClose',
            type: '() => void',
            required: true,
            description: 'Callback when user closes the panel',
            examples: ['() => setSelectedStep(null)'],
          },
        ],
        hooks: ['useStepManagement'],
        dependencies: ['BOS methodology framework'],
      },
      examples: [
        {
          name: 'Complete Step Details',
          description: 'Detail panel showing fully populated BOS methodology',
          props: {
            step: testData.completeStep,
            onClose: () => {},
          },
          code: `<DetailPanel
  step={selectedStep}
  onClose={handleClosePanel}
/>`,
        },
        {
          name: 'Basic Step Details',
          description: 'Detail panel showing minimal step information',
          props: {
            step: testData.basicStep,
            onClose: () => {},
          },
          code: `<DetailPanel
  step={basicStep}
  onClose={handleClosePanel}
/>`,
        },
        {
          name: 'No Step Selected',
          description:
            'Detail panel when no step is selected (renders nothing)',
          props: {
            step: null,
            onClose: () => {},
          },
          code: `<DetailPanel
  step={null}
  onClose={handleClosePanel}
/>`,
          notes: ['Component returns null when no step is provided'],
        },
      ],
      patterns: [
        {
          name: 'BOS Methodology Display',
          description: 'Structured display of 5-step BOS methodology',
          when: 'Showing comprehensive business observability information',
          implementation:
            'Organize data into stakeholders, dependencies, impacts, telemetry, signals',
          benefits: [
            'Methodology compliance',
            'Structured information',
            'Educational',
          ],
          considerations: [
            'Handle incomplete data',
            'Progressive disclosure',
            'Validation feedback',
          ],
        },
      ],
      accessibility: this.getDefaultAccessibility(),
      styling: this.getDefaultStyling(),
    }
  }

  /**
   * Modal component documentation patterns
   */
  private createImportModalStory(): ComponentStory {
    return {
      name: 'ImportModal',
      description: 'Handles data import with file selection and validation',
      component: 'ImportModal',
      category: 'modal',
      usage: {
        when: 'User needs to import flow data from external sources',
        purpose: 'Provides secure and validated data import functionality',
        props: [
          {
            name: 'isOpen',
            type: 'boolean',
            required: true,
            description: 'Controls modal visibility',
            examples: [true, false],
          },
          {
            name: 'onClose',
            type: '() => void',
            required: true,
            description: 'Callback when modal should close',
            examples: ['() => setImportModalOpen(false)'],
          },
          {
            name: 'onImport',
            type: '(data: any) => void',
            required: true,
            description: 'Callback when import is successful',
            examples: ['(data) => handleImportData(data)'],
          },
        ],
        hooks: ['useDataPersistence'],
        dependencies: ['Schema validation', 'File handling'],
      },
      examples: [
        {
          name: 'Open Import Modal',
          description: 'Modal open and ready for file selection',
          props: {
            isOpen: true,
            onClose: () => {},
            onImport: () => {},
          },
          code: `<ImportModal
  isOpen={importModalOpen}
  onClose={handleCloseImport}
  onImport={handleImportData}
/>`,
        },
      ],
      patterns: [
        {
          name: 'Data Import Pattern',
          description: 'Safe data import with validation and error handling',
          when: 'Users need to import external data safely',
          implementation: 'File selection, validation, preview, confirmation',
          benefits: ['Data safety', 'User confidence', 'Error prevention'],
          considerations: [
            'File size limits',
            'Format validation',
            'Error messages',
          ],
        },
      ],
      accessibility: this.getDefaultAccessibility(),
      styling: this.getDefaultStyling(),
    }
  }

  private createExportModalStory(): ComponentStory {
    return {
      name: 'ExportModal',
      description: 'Handles data export with format options and download',
      component: 'ExportModal',
      category: 'modal',
      usage: {
        when: 'User needs to export flow data for backup or sharing',
        purpose: 'Provides formatted data export functionality',
        props: [
          {
            name: 'isOpen',
            type: 'boolean',
            required: true,
            description: 'Controls modal visibility',
            examples: [true, false],
          },
          {
            name: 'onClose',
            type: '() => void',
            required: true,
            description: 'Callback when modal should close',
            examples: ['() => setExportModalOpen(false)'],
          },
          {
            name: 'data',
            type: 'any',
            required: true,
            description: 'Data to be exported',
            examples: ['{ flows: [...] }'],
          },
        ],
        hooks: ['useDataPersistence'],
        dependencies: ['Data formatting'],
      },
      examples: [
        {
          name: 'Export Flow Data',
          description: 'Modal for exporting current flow data',
          props: {
            isOpen: true,
            onClose: () => {},
            data: { flows: [] },
          },
          code: `<ExportModal
  isOpen={exportModalOpen}
  onClose={handleCloseExport}
  data={flowData}
/>`,
        },
      ],
      patterns: [
        {
          name: 'Data Export Pattern',
          description: 'User-friendly data export with format options',
          when: 'Users need to backup or share their data',
          implementation: 'Format selection, preview, download generation',
          benefits: [
            'Data portability',
            'Backup capability',
            'Sharing support',
          ],
          considerations: [
            'File naming',
            'Format options',
            'Download handling',
          ],
        },
      ],
      accessibility: this.getDefaultAccessibility(),
      styling: this.getDefaultStyling(),
    }
  }

  /**
   * Get test data for examples
   */
  private getTestData() {
    const completeFlow = createCompleteMethodologyFlow()
    const basicFlow = createBasicFlow()

    return {
      completeFlow,
      basicFlow,
      completeStep: completeFlow.stages[0].steps[0],
      basicStep: basicFlow.stages[0].steps[0],
      flows: [completeFlow, basicFlow],
    }
  }

  /**
   * Default accessibility guidelines
   */
  private getDefaultAccessibility(): AccessibilityGuidelines {
    return {
      keyboardNavigation: [
        'Tab order follows logical reading flow',
        'Enter activates primary actions',
        'Escape closes modals and panels',
        'Arrow keys for list navigation',
      ],
      screenReader: [
        'Semantic HTML elements (button, nav, main, etc.)',
        'ARIA labels for complex interactions',
        'Live regions for dynamic content',
        'Descriptive text for icons and images',
      ],
      colorContrast: [
        'Text contrast ratio of at least 4.5:1',
        'Focus indicators with 3:1 contrast',
        "Don't rely solely on color for meaning",
      ],
      focusManagement: [
        'Visible focus indicators',
        'Logical focus order',
        'Focus trapping in modals',
        'Focus restoration after interactions',
      ],
    }
  }

  /**
   * Default styling guidelines
   */
  private getDefaultStyling(): StylingGuidelines {
    return {
      theme: 'Corporate red theme with inline styles',
      colors: {
        primary: '#c41e3a',
        primaryDark: '#a01729',
        background: '#ffffff',
        text: '#333333',
        border: '#cccccc',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        fontWeight: 'normal',
      },
      responsiveness: [
        'Mobile-first approach',
        'Flexible layouts with CSS Grid/Flexbox',
        'Touch-friendly target sizes (44px minimum)',
        'Readable text sizes on all devices',
      ],
    }
  }

  /**
   * Add a new component story
   */
  addStory(story: ComponentStory): void {
    this.stories.set(story.name, story)
  }

  /**
   * Get a specific component story
   */
  getStory(componentName: string): ComponentStory | undefined {
    return this.stories.get(componentName)
  }

  /**
   * Get all component stories
   */
  getAllStories(): ComponentStory[] {
    return Array.from(this.stories.values())
  }

  /**
   * Get stories by category
   */
  getStoriesByCategory(category: ComponentStory['category']): ComponentStory[] {
    return Array.from(this.stories.values()).filter(
      story => story.category === category
    )
  }

  /**
   * Generate comprehensive documentation
   */
  generateDocumentation(): string {
    let doc = '# BOS Component Library Documentation\n\n'
    doc +=
      'This documentation provides comprehensive information about all BOS components, their usage patterns, and implementation guidelines.\n\n'

    // Table of contents
    doc += '## Table of Contents\n\n'
    const categories = [
      'layout',
      'navigation',
      'display',
      'form',
      'modal',
    ] as const
    for (const category of categories) {
      const stories = this.getStoriesByCategory(category)
      if (stories.length > 0) {
        doc += `- [${category.charAt(0).toUpperCase() + category.slice(1)} Components](#${category}-components)\n`
        stories.forEach(story => {
          doc += `  - [${story.name}](#${story.name.toLowerCase()})\n`
        })
      }
    }
    doc += '\n'

    // Component documentation by category
    for (const category of categories) {
      const stories = this.getStoriesByCategory(category)
      if (stories.length > 0) {
        doc += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Components\n\n`

        stories.forEach(story => {
          doc += this.generateStoryDocumentation(story)
        })
      }
    }

    return doc
  }

  /**
   * Generate documentation for a single story
   */
  private generateStoryDocumentation(story: ComponentStory): string {
    let doc = `### ${story.name}\n\n`
    doc += `${story.description}\n\n`

    // Usage
    doc += `**When to use**: ${story.usage.when}\n\n`
    doc += `**Purpose**: ${story.usage.purpose}\n\n`

    // Props
    if (story.usage.props.length > 0) {
      doc += `#### Props\n\n`
      doc += '| Name | Type | Required | Description |\n'
      doc += '|------|------|----------|-------------|\n'
      story.usage.props.forEach(prop => {
        doc += `| ${prop.name} | \`${prop.type}\` | ${prop.required ? 'Yes' : 'No'} | ${prop.description} |\n`
      })
      doc += '\n'
    }

    // Examples
    if (story.examples.length > 0) {
      doc += `#### Examples\n\n`
      story.examples.forEach(example => {
        doc += `##### ${example.name}\n\n`
        doc += `${example.description}\n\n`
        doc += '```tsx\n'
        doc += example.code
        doc += '\n```\n\n'
        if (example.notes) {
          doc += 'Notes:\n'
          example.notes.forEach(note => (doc += `- ${note}\n`))
          doc += '\n'
        }
      })
    }

    // Patterns
    if (story.patterns.length > 0) {
      doc += `#### Design Patterns\n\n`
      story.patterns.forEach(pattern => {
        doc += `**${pattern.name}**: ${pattern.description}\n\n`
        doc += `- **When**: ${pattern.when}\n`
        doc += `- **Implementation**: ${pattern.implementation}\n`
        doc += `- **Benefits**: ${pattern.benefits.join(', ')}\n`
        doc += `- **Considerations**: ${pattern.considerations.join(', ')}\n\n`
      })
    }

    return doc
  }

  /**
   * Search stories by keyword
   */
  searchStories(keyword: string): ComponentStory[] {
    const lowerKeyword = keyword.toLowerCase()
    return Array.from(this.stories.values()).filter(
      story =>
        story.name.toLowerCase().includes(lowerKeyword) ||
        story.description.toLowerCase().includes(lowerKeyword) ||
        story.usage.purpose.toLowerCase().includes(lowerKeyword)
    )
  }
}

// Export singleton instance
export const componentStorybook = ComponentStorybook.getInstance()
