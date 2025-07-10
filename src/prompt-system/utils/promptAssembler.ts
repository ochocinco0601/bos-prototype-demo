/**
 * Prompt Assembly Utilities
 * 
 * Combines modular prompt components into complete BOS translation prompt
 */

import promptConfig from '../core/prompt-config.json';

export interface PromptModule {
  id: string;
  title: string;
  content: string;
  required: boolean;
}

export interface AssembledPrompt {
  content: string;
  modules: PromptModule[];
  version: string;
  generatedAt: Date;
}

/**
 * Assembles individual prompt modules into complete prompt
 */
export class PromptAssembler {
  private modules: Map<string, PromptModule> = new Map();
  
  /**
   * Load a module into the assembler
   */
  addModule(id: string, content: string): void {
    const moduleConfig = promptConfig.modules[id];
    if (!moduleConfig) {
      throw new Error(`Unknown module: ${id}`);
    }
    
    this.modules.set(id, {
      id,
      title: moduleConfig.title,
      content: content.trim(),
      required: moduleConfig.required
    });
  }
  
  /**
   * Assemble complete prompt from loaded modules
   */
  assemblePrompt(): AssembledPrompt {
    // Load template
    const template = this.loadTemplate();
    
    // Validate required modules
    this.validateRequiredModules();
    
    // Replace placeholders with module content
    let assembledContent = template;
    
    for (const [moduleId, module] of this.modules) {
      const placeholder = `{{${moduleId}}}`;
      assembledContent = assembledContent.replace(placeholder, module.content);
    }
    
    // Check for unreplaced placeholders
    const unreplacedPlaceholders = assembledContent.match(/\{\{[^}]+\}\}/g);
    if (unreplacedPlaceholders) {
      console.warn('Unreplaced placeholders found:', unreplacedPlaceholders);
    }
    
    return {
      content: assembledContent,
      modules: Array.from(this.modules.values()),
      version: promptConfig.version,
      generatedAt: new Date()
    };
  }
  
  /**
   * Load the main prompt template
   */
  private loadTemplate(): string {
    // In a real implementation, this would load from prompt-template.md
    // For now, return a placeholder that will be replaced by actual file reading
    return `# BOS Data Structure Translation System

## Introduction

This system translates your existing process documentation (text documents, process diagrams, sequence diagrams, flowcharts, technical specifications) into structured BOS (Business Observability System) data format. The output provides a clean process structure (Flow → Stage → Step → Services) ready for your teams to apply the BOS methodology.

**Please provide your process documentation for analysis.** Share your documentation in whatever format is available. You can provide multiple documents if needed - just let me know when you're ready for me to begin the analysis. I'll then create a structured BOS format, asking questions as needed to ensure accuracy.

---

{{MODULE_0_FOUNDATION}}

{{MODULE_1_DATA_MODEL}}

{{MODULE_2_DOMAIN}}

{{MODULE_3_EXTRACTION}}

{{MODULE_4_OUTPUT}}

{{MODULE_5_QUESTIONS}}

{{MODULE_6_ERRORS}}

{{MODULE_7_INTEGRATION}}

{{MODULE_8_REFINEMENT}}

{{MODULE_9_FINAL}}

---

## Ready to Begin

I'm ready to receive your process documentation. Please share your materials, and let me know when you'd like me to begin the analysis.`;
  }
  
  /**
   * Validate that all required modules are loaded
   */
  private validateRequiredModules(): void {
    const requiredModules = Object.entries(promptConfig.modules)
      .filter(([_, config]) => config.required)
      .map(([id, _]) => id);
    
    const missingModules = requiredModules.filter(id => !this.modules.has(id));
    
    if (missingModules.length > 0) {
      throw new Error(`Missing required modules: ${missingModules.join(', ')}`);
    }
  }
  
  /**
   * Get statistics about the assembled prompt
   */
  getStats(): {
    totalModules: number;
    requiredModules: number;
    optionalModules: number;
    totalLength: number;
  } {
    const assembledPrompt = this.assemblePrompt();
    const requiredCount = Array.from(this.modules.values()).filter(m => m.required).length;
    
    return {
      totalModules: this.modules.size,
      requiredModules: requiredCount,
      optionalModules: this.modules.size - requiredCount,
      totalLength: assembledPrompt.content.length
    };
  }
}

/**
 * Utility function to create a prompt assembler with all modules loaded
 */
export async function createPromptAssembler(): Promise<PromptAssembler> {
  const assembler = new PromptAssembler();
  
  // In a real implementation, this would dynamically load all module files
  // For now, we'll need to manually load each module
  
  return assembler;
}

/**
 * Export formats for the assembled prompt
 */
export class PromptExporter {
  static toMarkdown(prompt: AssembledPrompt): string {
    return prompt.content;
  }
  
  static toPlainText(prompt: AssembledPrompt): string {
    return prompt.content.replace(/#{1,6}\s/g, '').replace(/\*\*(.*?)\*\*/g, '$1');
  }
  
  static toJSON(prompt: AssembledPrompt): string {
    return JSON.stringify({
      content: prompt.content,
      metadata: {
        version: prompt.version,
        generatedAt: prompt.generatedAt.toISOString(),
        moduleCount: prompt.modules.length
      }
    }, null, 2);
  }
}