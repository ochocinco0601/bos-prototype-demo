import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * ErrorBoundary - Prevents component crashes from bringing down the entire BOS app
 *
 * Used to wrap critical sections:
 * - Main flow visualization
 * - Data import/export operations
 * - Detail panels
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BOS Error Boundary caught an error:', error, errorInfo)

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add error reporting service integration
      // Error logged for production debugging
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI or use provided fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default BOS-styled error UI
      return (
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            margin: '1rem 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem',
                fontSize: '1rem',
              }}
            >
              ⚠️
            </div>
            <h3
              style={{
                margin: 0,
                color: '#dc2626',
                fontSize: '1.125rem',
                fontWeight: '600',
              }}
            >
              BOS Component Error
            </h3>
          </div>

          <p
            style={{
              color: '#7f1d1d',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          >
            A component in the Business Observability System encountered an
            error. Your data is safe, but this section cannot be displayed.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginBottom: '1rem' }}>
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#7f1d1d',
                  fontSize: '0.875rem',
                }}
              >
                Error Details (Development Mode)
              </summary>
              <pre
                style={{
                  backgroundColor: '#fee2e2',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#7f1d1d',
                  overflow: 'auto',
                  marginTop: '0.5rem',
                }}
              >
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              🔄 Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              🏠 Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
