import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('ErrorBoundary caught:', error); }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-4 text-red-500 font-mono text-xs uppercase tracking-widest">Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}