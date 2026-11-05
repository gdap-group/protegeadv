import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const DesignPage = import.meta.env.DEV
  ? React.lazy(() => import('./pages/DesignPage'))
  : null;

function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center p-4">
      <div className="text-center p-8 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] glow-card max-w-md w-full">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          Protege ADV &amp; Protege Empresa
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Ambiente configurado com pnpm workspaces e tema canônico dark.
        </p>
        {import.meta.env.DEV && (
          <div className="mt-6">
            <Link
              to="/_design"
              className="inline-block py-2 px-4 rounded-[var(--radius-input)] text-xs font-mono font-medium text-[var(--color-text)] bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] transition-all duration-150 hover:brightness-110"
            >
              Abrir Teste de Cores (/_design)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {import.meta.env.DEV && DesignPage && (
            <Route path="/_design" element={<DesignPage />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
