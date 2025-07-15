import React, { useState } from 'react'
import { Step } from '../../types'
import BusinessImpactPlaybook from '../BusinessImpactPlaybook'
import DashboardRequirements from '../DashboardRequirements'
import DashboardVisual from '../DashboardVisual'

/**
 * Task4ArtifactView Component
 * Provides navigation between the three Task 4 artifacts:
 * 1. Business Impact Playbook
 * 2. Dashboard Requirements
 * 3. Dashboard Visual
 */
interface Task4ArtifactViewProps {
  step: Step | null
  flowName?: string
  stageName?: string
}

const Task4ArtifactView: React.FC<Task4ArtifactViewProps> = ({
  step,
  flowName,
  stageName,
}) => {
  const [selectedArtifact, setSelectedArtifact] = useState<
    'playbook' | 'requirements' | 'visual'
  >('playbook')

  // Enhanced Visual Hierarchy System - SESSION 3
  const sectionHeaderStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }

  return (
    <div>
      <h3 style={sectionHeaderStyle}>
        <span>🎯</span>
        Task 4: Business Impact Artifacts
      </h3>

      {/* Artifact Selection Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#fafbfc',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <button
          onClick={() => setSelectedArtifact('playbook')}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor:
              selectedArtifact === 'playbook' ? '#dc2626' : '#e5e7eb',
            color: selectedArtifact === 'playbook' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          📄 Business Impact Playbook
        </button>
        <button
          onClick={() => setSelectedArtifact('requirements')}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor:
              selectedArtifact === 'requirements' ? '#dc2626' : '#e5e7eb',
            color: selectedArtifact === 'requirements' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          📊 Dashboard Requirements
        </button>
        <button
          onClick={() => setSelectedArtifact('visual')}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor:
              selectedArtifact === 'visual' ? '#dc2626' : '#e5e7eb',
            color: selectedArtifact === 'visual' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          📈 Dashboard Visual
        </button>
      </div>

      {/* Artifact Content */}
      <div>
        {selectedArtifact === 'playbook' && (
          <BusinessImpactPlaybook
            step={step}
            flowName={flowName}
            stageName={stageName}
          />
        )}
        {selectedArtifact === 'requirements' && (
          <DashboardRequirements
            step={step}
            flowName={flowName}
            stageName={stageName}
          />
        )}
        {selectedArtifact === 'visual' && (
          <DashboardVisual
            step={step}
            flowName={flowName}
            stageName={stageName}
          />
        )}
      </div>
    </div>
  )
}

export default Task4ArtifactView