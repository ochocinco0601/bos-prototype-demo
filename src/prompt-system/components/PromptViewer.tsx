/**
 * React component for viewing and copying BOS translation prompts
 */

import React, { useState } from 'react';
import { usePromptBuilder } from '../hooks/usePromptBuilder';

export interface PromptViewerProps {
  className?: string;
  showStats?: boolean;
  showExportOptions?: boolean;
  defaultFormat?: 'markdown' | 'plaintext' | 'json';
}

export const PromptViewer: React.FC<PromptViewerProps> = ({
  className = '',
  showStats = true,
  showExportOptions = true,
  defaultFormat = 'markdown'
}) => {
  const {
    isLoading,
    error,
    prompt,
    stats,
    buildPrompt,
    exportPrompt,
    copyToClipboard
  } = usePromptBuilder();

  const [selectedFormat, setSelectedFormat] = useState<'markdown' | 'plaintext' | 'json'>(defaultFormat);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(selectedFormat);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleBuildPrompt = async () => {
    await buildPrompt();
  };

  if (isLoading) {
    return (
      <div className={`prompt-viewer ${className}`}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading BOS translation prompt...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`prompt-viewer ${className}`}>
        <div style={{ padding: '20px', color: '#dc3545' }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={handleBuildPrompt}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const promptContent = prompt ? exportPrompt(selectedFormat) : null;

  return (
    <div className={`prompt-viewer ${className}`}>
      <div style={{ marginBottom: '20px' }}>
        <h3>BOS Data Structure Translation Prompt</h3>
        
        {showStats && stats && (
          <div style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Prompt Statistics:</strong>
            <ul style={{ margin: '5px 0 0 20px' }}>
              <li>Total Modules: {stats.totalModules}</li>
              <li>Required Modules: {stats.requiredModules}</li>
              <li>Optional Modules: {stats.optionalModules}</li>
              <li>Total Length: {stats.totalLength.toLocaleString()} characters</li>
            </ul>
          </div>
        )}

        {showExportOptions && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginRight: '10px' }}>
              Format:
              <select 
                value={selectedFormat} 
                onChange={(e) => setSelectedFormat(e.target.value as any)}
                style={{ marginLeft: '5px', padding: '5px' }}
              >
                <option value="markdown">Markdown</option>
                <option value="plaintext">Plain Text</option>
                <option value="json">JSON</option>
              </select>
            </label>
            
            <button 
              onClick={handleCopy}
              style={{ 
                padding: '8px 16px',
                backgroundColor: copySuccess ? '#28a745' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>

      {promptContent ? (
        <div style={{ 
          border: '1px solid #ddd',
          borderRadius: '4px',
          maxHeight: '600px',
          overflow: 'auto'
        }}>
          <pre style={{ 
            margin: 0,
            padding: '15px',
            backgroundColor: '#f8f9fa',
            fontSize: '12px',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap'
          }}>
            {promptContent}
          </pre>
        </div>
      ) : (
        <div style={{ 
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f8f9fa'
        }}>
          <button 
            onClick={handleBuildPrompt}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Build Prompt
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptViewer;