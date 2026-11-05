import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PermissoesProvider } from './contexts/PermissoesContext';
import { MainLayout } from './components/layout/MainLayout';
import ProcessosPage from './pages/ProcessosPage';
import PublicacoesPage from './pages/PublicacoesPage';
import AgendaPage from './pages/AgendaPage';
import PessoasPage from './pages/PessoasPage';
import GedPage from './pages/GedPage';
import ContratosPage from './pages/ContratosPage';
import EmpresaPage from './pages/EmpresaPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';

const DesignPage = import.meta.env.DEV
  ? React.lazy(() => import('./pages/DesignPage'))
  : null;

export default function App() {
  return (
    <PermissoesProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)]" />}>
          <Routes>
            {/* Rota de Design System (fora da casca e estritamente em desenvolvimento) */}
            {import.meta.env.DEV && DesignPage && (
              <Route path="/_design" element={<DesignPage />} />
            )}

            {/* Casca do sistema envolvendo as páginas operacionais */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/processos" replace />} />
              <Route path="/processos" element={<ProcessosPage />} />
              <Route path="/publicacoes" element={<PublicacoesPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/pessoas" element={<PessoasPage />} />
              <Route path="/ged" element={<GedPage />} />
              <Route path="/contratos" element={<ContratosPage />} />
              <Route path="/empresa" element={<EmpresaPage />} />
              <Route path="/configuracoes" element={<ConfiguracoesPage />} />
            </Route>

            {/* Rota padrão para caminhos inexistentes */}
            <Route path="*" element={<Navigate to="/processos" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PermissoesProvider>
  );
}
