import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry or LogRocket here
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-[var(--color-app-bg)] flex flex-col items-center justify-center p-4">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-app-text)] mb-2">Something went wrong.</h1>
          <p className="text-[var(--color-app-text-muted)] text-center max-w-md mb-6">
            We've been notified and our team is looking into the issue.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2.5 bg-[var(--color-app-text)] text-[var(--color-app-bg)] rounded-xl font-medium hover:scale-105 active:scale-95 transition-all"
          >
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
