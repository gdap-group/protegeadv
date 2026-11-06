import { AlertCircle } from 'lucide-react';

export default function DemoDesligadaPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-6 text-center shadow-lg">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] mb-4">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-lg font-semibold mb-2">Demonstração desligada</h1>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          A demonstração está desligada. Defina{' '}
          <code className="font-mono text-[var(--color-glow)] bg-[var(--color-elevated)] px-1.5 py-0.5 rounded text-xs">
            VITE_MODO_DEMO=true
          </code>{' '}
          em{' '}
          <code className="font-mono text-[var(--color-glow)] bg-[var(--color-elevated)] px-1.5 py-0.5 rounded text-xs">
            apps/web/.env
          </code>{' '}
          e reinicie o servidor.
        </p>
      </div>
    </div>
  );
}
