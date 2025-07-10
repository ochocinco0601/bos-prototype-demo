import React from 'react'

// Declare the global variable for TypeScript
declare global {
  const __VERSION_INFO__: {
    version: string
    gitHash: string
    buildTime: string
  }
}

const BuildVersion: React.FC = () => {
  const versionInfo =
    typeof __VERSION_INFO__ !== 'undefined'
      ? __VERSION_INFO__
      : {
          version: '1.0.0',
          gitHash: 'dev',
          buildTime: new Date().toISOString(),
        }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '4px 8px',
        fontSize: '12px',
        color: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'monospace',
        zIndex: 1000,
      }}
    >
      Build: {versionInfo.version} ({versionInfo.gitHash})
    </div>
  )
}

export default BuildVersion
