/**
 * Utility functions for generating unique identifiers and other generated values
 * Extracted from App.tsx for better code organization
 */

/**
 * Generate unique ID for data entities
 * Uses Math.random() to create a base-36 string for unique identification
 *
 * @returns {string} A unique identifier string (7 characters)
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}
