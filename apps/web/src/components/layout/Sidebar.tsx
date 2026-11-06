import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { NAVIGATION_ITEMS } from './CommandPalette';
import { useModulosPermitidos } from '../../contexts/PermissoesContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { cn } from '../../lib/utils';

const STORAGE_KEY = 'protege_sidebar_collapsed';

function getInitialCollapsedState(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  } catch {
    return false;
  }
}

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export function Sidebar({
  collapsed: controlledCollapsed,
  onToggleCollapsed,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(getInitialCollapsedState);
  const location = useLocation();
  const { temPermissao } = useModulosPermitidos();

  const isCollapsed = isMobileDrawer ? false : (controlledCollapsed ?? internalCollapsed);

  const toggleCollapsed = () => {
    if (onToggleCollapsed) {
      onToggleCollapsed();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
          // Trata bloqueio de storage privado sem quebrar
        }
        return next;
      });
    }
  };

  const allowedItems = React.useMemo(
    () => NAVIGATION_ITEMS.filter((item) => temPermissao(item.modulo)),
    [temPermissao]
  );

  return (
    <aside
      aria-label="Menu Principal"
      className={cn(
        'flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-200 select-none',
        isMobileDrawer
          ? 'w-full h-full border-r-0'
          : isCollapsed
            ? 'w-16 h-screen sticky top-0'
            : 'w-64 h-screen sticky top-0'
      )}
    >
      {/* Topo / Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-input)] bg-[var(--color-primary-hover)] text-[var(--color-text)] shadow-sm">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </div>
          {(!isCollapsed || isMobileDrawer) && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm tracking-tight text-[var(--color-text)]">
                Protege ADV
              </span>
              <span className="text-[11px] text-[var(--color-muted)] font-mono truncate">
                Gestão Jurídica
              </span>
            </div>
          )}
        </div>

        {/* Botão de recolher/expandir (apenas em desktop) */}
        {!isMobileDrawer && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            className={cn(
              'p-1.5 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] cursor-pointer',
              isCollapsed && 'mx-auto mt-2'
            )}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Lista de Módulos */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          const linkContent = (
            <NavLink
              to={item.path}
              aria-label={isCollapsed && !isMobileDrawer ? item.title : undefined}
              onClick={onCloseMobileDrawer}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-input)] text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-[var(--color-elevated)] text-[var(--color-glow)] font-semibold border-l-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)]/60',
                isCollapsed && !isMobileDrawer && 'justify-center px-0'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-[var(--color-glow)]' : 'text-[var(--color-muted)]'
                )}
                aria-hidden="true"
              />
              {(!isCollapsed || isMobileDrawer) && (
                <span className="truncate">{item.title}</span>
              )}
            </NavLink>
          );

          if (isCollapsed && !isMobileDrawer) {
            return (
              <Tooltip key={item.modulo}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.modulo}>{linkContent}</div>;
        })}
      </nav>

      {/* Rodapé do Menu */}
      <div className="p-3 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
        {(!isCollapsed || isMobileDrawer) ? (
          <div className="flex items-center justify-between px-2">
            <span>Protege ADV v0.1.0</span>
            <span className="font-mono text-[10px] text-[var(--color-glow)]">PRO</span>
          </div>
        ) : (
          <div className="text-center font-mono text-[10px] text-[var(--color-glow)]">
            v0.1
          </div>
        )}
      </div>
    </aside>
  );
}

