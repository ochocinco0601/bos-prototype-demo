import { Signal } from '../types'

// Signal type to owner mapping
export const SIGNAL_OWNER_MAP = {
  business: 'Product Owner',
  process: 'Development Team',
  system: 'Platform SRE Team',
} as const

// Utility function to extract business-relevant key terms
export const extractKeyTerms = (businessContext: string): string[] => {
  if (!businessContext) return []

  // Business-relevant keywords to highlight
  const businessKeywords = [
    'customer',
    'credit',
    'loan',
    'underwriting',
    'regulatory',
    'compliance',
    'risk',
    'data quality',
    'accuracy',
    'timeliness',
    'actionable',
    'decision',
    'approval',
    'validation',
    'verification',
  ]

  // Extract terms that match business keywords (case-insensitive)
  const words = businessContext.toLowerCase().split(/\s+/)
  const foundTerms = new Set<string>()

  words.forEach(word => {
    businessKeywords.forEach(keyword => {
      if (word.includes(keyword)) {
        // Find original case version in context
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        const matches = businessContext.match(regex)
        if (matches) {
          foundTerms.add(matches[0])
        }
      }
    })
  })

  return Array.from(foundTerms).slice(0, 5) // Limit to 5 key terms
}

// Extract context-driven guidance from business context
export const extractContextGuidance = (businessContext: string): string[] => {
  const guidance: string[] = []
  const lowerContext = businessContext.toLowerCase()

  // Extract guidance based on context patterns
  if (lowerContext.includes('actionable')) {
    guidance.push('"actionable data" → What makes data actionable?')
  }
  if (lowerContext.includes('loan officer') || lowerContext.includes('staff')) {
    guidance.push('"for loan officers" → Who benefits from this measurement?')
  }
  if (
    lowerContext.includes('regulatory') ||
    lowerContext.includes('timeframe')
  ) {
    guidance.push('"regulatory timeframes" → What urgency drives thresholds?')
  }
  if (lowerContext.includes('quality')) {
    guidance.push('"data quality" → How do we measure quality?')
  }

  return guidance.length > 0
    ? guidance
    : ['Consider what business outcomes this step enables']
}
