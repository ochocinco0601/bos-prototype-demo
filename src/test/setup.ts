/**
 * Test setup configuration for Vitest
 * Sets up testing environment for BOS prototype
 */

import '@testing-library/jest-dom'

// Create a proper localStorage mock that behaves like the real thing
class LocalStorageMock {
  private store: Record<string, string> = {}

  getItem(key: string): string | null {
    return this.store[key] || null
  }

  setItem(key: string, value: string): void {
    this.store[key] = value
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  clear(): void {
    this.store = {}
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }

  get length(): number {
    return Object.keys(this.store).length
  }
}

const localStorageMock = new LocalStorageMock()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.confirm and alert for tests
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
})

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
})

// Clean up localStorage before each test
beforeEach(() => {
  localStorageMock.clear()
})
