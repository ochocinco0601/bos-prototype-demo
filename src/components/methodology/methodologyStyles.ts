import { CompletionState } from '../../hooks'

// Professional Input Styling System - Based on Main Application Design
export const inputBaseStyle = {
  padding: '0.75rem 1rem',
  border: '2px solid #e5e7eb',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  color: '#374151',
  boxSizing: 'border-box' as const,
  fontFamily: 'inherit',
  lineHeight: '1.5',
  width: '100%',
}

export const inputDisabledStyle = {
  ...inputBaseStyle,
  backgroundColor: '#f9fafb',
  color: '#9ca3af',
  cursor: 'not-allowed',
  borderColor: '#d1d5db',
}

export const textareaStyle = {
  ...inputBaseStyle,
  minHeight: '4rem',
  resize: 'vertical' as const,
  lineHeight: '1.6',
}

// Enhanced Visual Hierarchy System - SESSION 3
export const sectionHeaderStyle = {
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

export const subSectionHeaderStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '0.75rem',
  marginTop: '1.5rem',
}

export const formSectionStyle = {
  marginBottom: '2rem',
  padding: '1.5rem',
  backgroundColor: '#fafbfc',
  borderRadius: '0.75rem',
  border: '1px solid #e5e7eb',
}

export const fieldGroupStyle = {
  marginBottom: '1.5rem',
}

export const helpSectionStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '0.5rem',
  padding: '1rem',
  marginBottom: '1.5rem',
}

// Modern Tab System - SESSION 4
export const tabContainerStyle = {
  display: 'flex',
  borderBottom: '2px solid #e5e7eb',
  marginBottom: '2rem',
  position: 'relative' as const,
}

export const getTabStyle = (isActive: boolean, completionState: CompletionState) => {
  const baseStyle = {
    flex: 1,
    padding: '1rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: isActive ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    borderBottom: isActive ? '3px solid #dc2626' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: isActive ? '#dc2626' : '#6b7280',
    position: 'relative' as const,
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
  }

  // Add completion state indicator
  const completionColor = getCompletionColor(completionState)
  return {
    ...baseStyle,
    boxShadow: isActive 
      ? `inset 0 -3px 0 0 ${completionColor}, 0 2px 4px rgba(0,0,0,0.1)`
      : `inset 0 -3px 0 0 ${completionColor}`,
  }
}

export const tabContentStyle = {
  backgroundColor: 'white',
  borderRadius: '0 0 0.75rem 0.75rem',
  padding: '2rem',
  border: '1px solid #e5e7eb',
  borderTop: 'none',
  minHeight: '400px',
  position: 'relative' as const,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}

// Professional Button Styling System - Based on Main Application Design
export const buttonBaseStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  lineHeight: '1.5',
  display: 'inline-flex' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}

// Unified Button System - Phase 1 Enhancement
export const buttonPrimaryStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#dc2626',
  color: 'white',
}

export const buttonSecondaryStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#10b981',
  color: 'white',
}

export const buttonOutlineStyle = {
  ...buttonBaseStyle,
  backgroundColor: 'white',
  color: '#374151',
  border: '2px solid #e5e7eb',
  boxShadow: 'none',
}

export const buttonDangerStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#ef4444',
  color: 'white',
}

export const buttonWarningStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#f59e0b',
  color: 'white',
}

export const buttonDisabledStyle = {
  ...buttonBaseStyle,
  backgroundColor: '#9ca3af',
  color: 'white',
  cursor: 'not-allowed',
}

// Small button variant for compact spaces
export const buttonSmallStyle = {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
}

// Phase 1 Enhancement: Breadcrumb Navigation Styles
export const breadcrumbContainerStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '0.75rem',
  padding: '1rem 1.5rem',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  fontSize: '0.875rem',
  color: '#475569',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

export const breadcrumbItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontWeight: '500',
}

export const breadcrumbSeparatorStyle = {
  color: '#94a3b8',
  fontSize: '0.75rem',
}

export const breadcrumbSubtitleStyle = {
  fontSize: '0.75rem',
  color: '#6b7280',
  fontWeight: '400',
  marginTop: '0.25rem',
}

// Phase 2 Enhancement: Enterprise Sidebar Layout Styles (1400px)
export const phase2ModalContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  width: '95%',
  maxWidth: '1400px', // Enterprise width: increased from 1000px
  maxHeight: '85vh',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column' as const,
}

export const phase2ContentLayoutStyle = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
}

export const phase2MainContentStyle = {
  flex: 1,
  padding: '2rem',
  overflow: 'auto',
}

// Professional Select Styling System
export const selectStyle = {
  ...inputBaseStyle,
  backgroundColor: 'white',
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 0.75rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.25rem 1.25rem',
  paddingRight: '2.5rem',
  appearance: 'none' as const,
}

// Helper function to get background color for 3-state completion
export const getCompletionColor = (state: CompletionState) => {
  switch (state) {
    case 'blank':
      return '#f3f4f6' // Faded gray
    case 'partial':
      return '#FF8C00' // Orange
    case 'complete':
      return '#10B981' // Green
  }
}