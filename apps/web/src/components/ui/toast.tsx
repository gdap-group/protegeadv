import * as React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser utilizado dentro de um ToastProvider');
  }
  return context;
}

const toastIcons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const toastBorderVariants: Record<ToastVariant, string> = {
  default: 'border-[var(--color-border)] text-[var(--color-glow)]',
  success: 'border-[var(--color-border)] text-[var(--color-success)]',
  warning: 'border-[var(--color-border)] text-[var(--color-warning)]',
  danger: 'border-[var(--color-border)] text-[var(--color-danger)]',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = 'default', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <aside
        aria-label="Notificações do sistema"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        <div aria-live="polite" aria-atomic="true" className="flex flex-col gap-2">
          {toasts.map((item) => {
            const Icon = toastIcons[item.variant ?? 'default'];
            return (
              <div
                key={item.id}
                role="status"
                className={cn(
                  'pointer-events-auto flex items-start gap-3 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-5',
                  toastBorderVariants[item.variant ?? 'default']
                )}
              >
                <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1 space-y-1">
                  {item.title && (
                    <div className="font-semibold text-sm text-[var(--color-text)]">
                      {item.title}
                    </div>
                  )}
                  {item.description && (
                    <div className="text-xs text-[var(--color-muted)] leading-relaxed">
                      {item.description}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="rounded-[var(--radius-input)] p-1 text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
                  aria-label="Fechar notificação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    </ToastContext.Provider>
  );
}
