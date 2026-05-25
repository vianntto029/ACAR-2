import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#c00' }}>Error en la aplicación</h1>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto', maxWidth: '100%' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto', maxWidth: '100%', fontSize: 11 }}>
            {this.state.error.stack}
          </pre>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/login' }} style={{ marginTop: 16, padding: '8px 24px', background: '#3573A3', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Volver al inicio
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
