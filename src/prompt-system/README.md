# BOS Prompt System

This directory contains the BOS Data Structure Translation System prompt management capabilities.

## Overview

The prompt system enables BOS users to:
- View the complete BOS translation prompt
- Copy the prompt for use with their LLM access
- Iterate on prompt refinements
- Export prompts in multiple formats

## Architecture

### Core Components

- **`core/`** - Core prompt template and configuration
  - `prompt-template.md` - Master template with module placeholders
  - `prompt-config.json` - Configuration for modules and settings
  - `prompt-validator.ts` - Validation logic (future)

- **`modules/`** - Individual prompt modules
  - `module-0-foundation.md` - BOS Foundation Context
  - `module-1-data-model.md` - Data Model Context
  - `module-2-domain.md` - Domain Context
  - `module-3-extraction.md` - Extraction Rules
  - `module-4-output.md` - Output Format
  - `module-5-questions.md` - Question Framework
  - `module-6-errors.md` - Error Handling
  - `module-7-integration.md` - Integration Guidance
  - `module-8-refinement.md` - Refinement Protocol
  - `module-9-final.md` - Final Output Protocol

- **`utils/`** - Utility functions
  - `promptAssembler.ts` - Combines modules into complete prompt
  - `promptExporter.ts` - Exports in multiple formats
  - `versionManager.ts` - Version management (future)

- **`hooks/`** - React hooks
  - `usePromptBuilder.ts` - Main hook for prompt building
  - `usePromptVersioning.ts` - Version management (future)

- **`components/`** - React components
  - `PromptViewer.tsx` - Display and copy prompt
  - `PromptEditor.tsx` - Edit individual modules (future)
  - `PromptCopyButton.tsx` - Copy functionality (future)

## Usage

### Basic Usage

```typescript
import { usePromptBuilder } from './hooks/usePromptBuilder';

function MyComponent() {
  const { prompt, buildPrompt, copyToClipboard } = usePromptBuilder();
  
  const handleCopy = async () => {
    await copyToClipboard('markdown');
  };
  
  return (
    <div>
      <button onClick={buildPrompt}>Build Prompt</button>
      <button onClick={handleCopy}>Copy to Clipboard</button>
    </div>
  );
}
```

### With UI Component

```typescript
import { PromptViewer } from './components/PromptViewer';

function MyPromptPage() {
  return (
    <PromptViewer 
      showStats={true}
      showExportOptions={true}
      defaultFormat="markdown"
    />
  );
}
```

## Development

### Adding New Modules

1. Create new module file in `modules/`
2. Update `prompt-config.json` with module configuration
3. Add placeholder to `prompt-template.md`
4. Update `promptAssembler.ts` if needed

### Modifying Existing Modules

1. Edit the module file in `modules/`
2. Test prompt assembly
3. Update version in `prompt-config.json`

### Creating New Export Formats

1. Add export method to `PromptExporter` class
2. Update `usePromptBuilder` hook
3. Update UI components if needed

## Future Enhancements

- [ ] **Module Editor UI** - In-app editing of prompt modules
- [ ] **Version Management** - Track prompt versions and changes
- [ ] **A/B Testing** - Test different prompt variations
- [ ] **LLM Integration** - Direct LLM API integration for testing
- [ ] **Analytics** - Track prompt usage and effectiveness
- [ ] **Templates** - Multiple prompt templates for different use cases

## Integration with BOS

This prompt system is designed to integrate with the broader BOS ecosystem:

- **BOS Methodology** - Prompts teach BOS concepts to LLMs
- **Data Models** - Uses same TypeScript interfaces as main BOS system
- **UI Components** - Consistent with BOS prototype styling
- **Future Roadmap** - Supports planned LLM integration features

## Files Status

### ✅ Completed
- Directory structure
- Core configuration system
- Basic prompt assembly logic
- React hooks foundation
- Basic UI component
- Documentation

### 🔄 In Progress
- Extracting all prompt modules into separate files
- Complete prompt assembly testing

### 📋 TODO
- Complete module extraction
- Prompt validation system
- Version management
- Advanced UI components
- Integration with main BOS UI
- Testing and validation