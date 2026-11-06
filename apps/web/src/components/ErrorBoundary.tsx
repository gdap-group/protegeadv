import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    }
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-6 text-center shadow-lg">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)] mb-4">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-lg font-semibold mb-2">Algo deu errado. Recarregue a página.</h1>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              Ocorreu uma falha inesperada na interface. Clique no botão abaixo para tentar novamente.
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Recarregar</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
