import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[TEDx App ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#f5f5f2',
          padding: '40px 20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            border: '1px solid #E62B1E',
            backgroundColor: '#121212',
            padding: '24px'
          }}>
            <h1 style={{ color: '#E62B1E', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              TEDxCIT: Application Render Error
            </h1>
            <p style={{ color: '#bdbdbd', fontSize: '14px', marginBottom: '16px' }}>
              An error occurred while loading this page:
            </p>
            <div style={{
              backgroundColor: '#000',
              padding: '16px',
              border: '1px solid #333',
              color: '#ff6b6b',
              fontFamily: 'monospace',
              fontSize: '13px',
              whiteSpace: 'pre-wrap',
              marginBottom: '16px',
              overflowX: 'auto'
            }}>
              {this.state.error?.toString()}
            </div>
            {this.state.errorInfo?.componentStack && (
              <details style={{ color: '#888', fontSize: '12px', fontFamily: 'monospace' }}>
                <summary style={{ cursor: 'pointer', color: '#aaa', marginBottom: '8px' }}>
                  Component Stack Trace
                </summary>
                <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                style={{
                  backgroundColor: '#E62B1E',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}
              >
                Go to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#262626',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

