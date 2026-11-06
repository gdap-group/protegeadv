import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Calendar,
  Users,
  Shield,
  Menu,
  X,
  Info,
} from 'lucide-react';
import { useDemo } from './DemoContext';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

interface DemoNavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export function DemoLayout() {
  const { unreadPublicacoesCount } = useDemo();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const location = useLocation();

  const navItems: DemoNavItem[] = [
    { title: 'Processos', path: '/demo/processos', icon: Briefcase },
    {
      title: 'Publicações',
      path: '/demo/publicacoes',
      icon: FileText,
      badgeCount: unreadPublicacoesCount,
    },
    { title: 'Agenda', path: '/demo/agenda', icon: Calendar },
    { title: 'Pessoas', path: '/demo/pessoas', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      {/* Banner Fixo no Topo de TODAS as Telas da Demonstração */}
      <div
        role="banner"
        className="sticky top-0 z-50 flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium text-center bg-[var(--color-elevated)] border-b border-[var(--color-primary)] text-[var(--color-glow)] shadow-sm"
      >
        <span
          className="inline-block h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse shrink-0"
          aria-hidden="true"
        />
        <span className="font-semibold">Demonstração com dados fictícios</span>
        <span className="hidden md:inline text-[var(--color-muted)]">
          — Apresentação comercial interativa sem vínculo com dados reais
        </span>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop */}
        <aside
          aria-label="Menu da Demonstração"
          className="hidden md:flex flex-col w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] select-none sticky top-8 h-[calc(100vh-2rem)]"
        >
          {/* Logo Demo */}
          <div className="flex h-16 items-center px-4 gap-3 border-b border-[var(--color-border)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-input)] bg-[var(--color-primary-hover)] text-[var(--color-text)] shadow-sm">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm tracking-tight text-[var(--color-text)]">
                Protege ADV
              </span>
              <span className="text-[11px] text-[var(--color-glow)] font-mono font-medium">
                MODO DEMO
              </span>
            </div>
          </div>

          {/* Links da Navegação */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-input)] text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-elevated)] text-[var(--color-glow)] font-semibold border-l-2 border-[var(--color-primary)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)]/60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-[var(--color-glow)]' : 'text-[var(--color-muted)]'
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.title}</span>
                  </div>
                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <Badge variant="warning" className="px-1.5 py-0.2 text-[10px] font-mono">
                      {item.badgeCount}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Rodapé Demo */}
          <div className="p-3 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-[var(--color-glow)]" aria-hidden="true" />
              <span>Memória local</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--color-glow)]">DEMO</span>
          </div>
        </aside>

        {/* Header Mobile com Drawer */}
        <div className="md:hidden flex flex-col flex-1">
          <header className="flex h-14 items-center justify-between px-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--color-primary)]" />
              <span className="font-semibold text-sm">Protege ADV (Demo)</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Abrir menu de navegação da demonstração"
              className="p-2 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              <Menu className="h-5 w-5" />
            </button>
          </header>

          {mobileDrawerOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex">
              <div className="w-64 bg-[var(--color-surface)] h-full p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-4">
                    <span className="font-semibold text-sm">Menu Demonstração</span>
                    <button
                      type="button"
                      onClick={() => setMobileDrawerOpen(false)}
                      aria-label="Fechar menu"
                      className="p-1 rounded-[var(--radius-input)] text-[var(--color-muted)]"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.path);
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-[var(--radius-input)] text-sm font-medium',
                            isActive
                              ? 'bg-[var(--color-elevated)] text-[var(--color-glow)] font-semibold'
                              : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                            <Badge variant="warning" className="px-1.5 py-0.2 text-[10px] font-mono">
                              {item.badgeCount}
                            </Badge>
                          )}
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
            </div>
          )}
        </div>

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

