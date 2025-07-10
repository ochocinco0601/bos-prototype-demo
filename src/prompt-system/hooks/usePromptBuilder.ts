/**
 * React hook for building and managing BOS translation prompts
 */

import { useState, useEffect, useCallback } from 'react';
import { PromptAssembler, AssembledPrompt } from '../utils/promptAssembler';

export interface PromptBuilderState {
  assembler: PromptAssembler | null;
  prompt: AssembledPrompt | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalModules: number;
    requiredModules: number;
    optionalModules: number;
    totalLength: number;
  } | null;
}

export function usePromptBuilder() {
  const [state, setState] = useState<PromptBuilderState>({
    assembler: null,
    prompt: null,
    isLoading: true,
    error: null,
    stats: null
  });

  /**
   * Initialize the prompt assembler
   */
  const initializeAssembler = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const assembler = new PromptAssembler();
      
      // TODO: Load all module files dynamically
      // For now, we'll need to manually add modules
      
      setState(prev => ({
        ...prev,
        assembler,
        isLoading: false
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize assembler',
        isLoading: false
      }));
    }
  }, []);

  /**
   * Build the complete prompt
   */
  const buildPrompt = useCallback(async (): Promise<AssembledPrompt | null> => {
    if (!state.assembler) {
      setState(prev => ({ ...prev, error: 'Assembler not initialized' }));
      return null;
    }

    try {
      const prompt = state.assembler.assemblePrompt();
      const stats = state.assembler.getStats();
      
      setState(prev => ({
        ...prev,
        prompt,
        stats,
        error: null
      }));
      
      return prompt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to build prompt';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, [state.assembler]);

  /**
   * Add or update a module
   */
  const updateModule = useCallback((moduleId: string, content: string) => {
    if (!state.assembler) {
      setState(prev => ({ ...prev, error: 'Assembler not initialized' }));
      return;
    }

    try {
      state.assembler.addModule(moduleId, content);
      setState(prev => ({ ...prev, error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update module';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [state.assembler]);

  /**
   * Get prompt in different formats
   */
  const exportPrompt = useCallback((format: 'markdown' | 'plaintext' | 'json') => {
    if (!state.prompt) {
      return null;
    }

    const { PromptExporter } = require('../utils/promptAssembler');
    
    switch (format) {
      case 'markdown':
        return PromptExporter.toMarkdown(state.prompt);
      case 'plaintext':
        return PromptExporter.toPlainText(state.prompt);
      case 'json':
        return PromptExporter.toJSON(state.prompt);
      default:
        return null;
    }
  }, [state.prompt]);

  /**
   * Copy prompt to clipboard
   */
  const copyToClipboard = useCallback(async (format: 'markdown' | 'plaintext' | 'json' = 'markdown') => {
    const content = exportPrompt(format);
    if (!content) {
      throw new Error('No prompt content to copy');
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(content);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [exportPrompt]);

  // Initialize on mount
  useEffect(() => {
    initializeAssembler();
  }, [initializeAssembler]);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    prompt: state.prompt,
    stats: state.stats,
    
    // Actions
    buildPrompt,
    updateModule,
    exportPrompt,
    copyToClipboard,
    
    // Utilities
    refresh: initializeAssembler
  };
}