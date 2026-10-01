import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a real app, log this error to a service like Sentry
    console.error('ErrorBoundary ha intercettato un errore:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-card">
          <div className="error-icon-wrapper">
            <AlertTriangle size={32} className="text-warning" />
          </div>
          <h3>Ops, qualcosa è andato storto.</h3>
          <p className="text-muted">Il modulo non è riuscito a caricare correttamente i dati.</p>
          <div className="error-actions mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => this.setState({ hasError: false })}
            >
              <RefreshCcw size={16} /> Riprova Modulo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
