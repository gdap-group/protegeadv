import * as React from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Calendar,
  Users,
  FolderArchive,
  ScrollText,
  Building2,
  Settings,
  Search,
  X,
} from 'lucide-react';
import { useModulosPermitidos, type ModuloSistema } from '../../contexts/PermissoesContext';

interface NavigationItem {
  modulo: ModuloSistema;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { modulo: 'processos', title: 'Processos', path: '/processos', icon: Briefcase },
  { modulo: 'publicacoes', title: 'Publicações', path: '/publicacoes', icon: FileText },
  { modulo: 'agenda', title: 'Agenda', path: '/agenda', icon: Calendar },
  { modulo: 'pessoas', title: 'Pessoas', path: '/pessoas', icon: Users },
  { modulo: 'ged', title: 'GED (Arquivos)', path: '/ged', icon: FolderArchive },
  { modulo: 'contratos', title: 'Contratos', path: '/contratos', icon: ScrollText },
  { modulo: 'empresa', title: 'Protege Empresa', path: '/empresa', icon: Building2 },
  { modulo: 'configuracoes', title: 'Configurações', path: '/configuracoes', icon: Settings },
];

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { temPermissao } = useModulosPermitidos();

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  const allowedItems = React.useMemo(
    () => NAVIGATION_ITEMS.filter((item) => temPermissao(item.modulo)),
    [temPermissao]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de Comandos"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={() => onOpenChange(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onOpenChange(false);
        }
      }}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl glow-card animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full flex flex-col bg-transparent text-[var(--color-text)]">
          <div className="flex items-center border-b border-[var(--color-border)] px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--color-muted)] mr-2" aria-hidden="true" />
            <Command.Input
              autoFocus
              placeholder="Digite para buscar um módulo do sistema..."
              className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] cursor-pointer"
              aria-label="Fechar busca"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-[var(--color-muted)]">
              Nenhum módulo encontrado com esta busca.
            </Command.Empty>

            <Command.Group heading="Módulos Permitidos" className="text-xs font-semibold text-[var(--color-muted)] px-2 py-1.5 uppercase tracking-wider">
              {allowedItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.modulo}
                    value={item.title}
                    onSelect={() => {
                      onOpenChange(false);
                      navigate(item.path);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-input)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-elevated)] aria-selected:bg-[var(--color-elevated)] aria-selected:text-[var(--color-glow)] outline-none"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[var(--color-glow)]" aria-hidden="true" />
                    <span>{item.title}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-muted)] bg-[var(--color-elevated)]/40">
            <span>Navegue com &uarr; &darr; e pressione Enter</span>
            <span className="font-mono text-[10px] bg-[var(--color-elevated)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
              ESC para fechar
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

