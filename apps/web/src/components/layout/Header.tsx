import * as React from 'react';
import {
  Bell,
  Menu,
  Search,
  User,
  LogOut,
  Sliders,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  EmptyState,
} from '../ui';
import { CommandPalette } from './CommandPalette';

export interface HeaderProps {
  onOpenMobileDrawer: () => void;
}

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <>
      <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Esquerda: Botão Menu Mobile e Busca Global */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="Abrir menu de navegação"
            className="md:hidden p-2 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Busca Global (Ctrl+K / Cmd+K) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Buscar módulos no sistema (atalho Ctrl+K ou Cmd+K)"
            className="w-full max-w-md flex items-center justify-between px-3 py-1.5 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)]/60 hover:bg-[var(--color-elevated)] text-sm text-[var(--color-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Buscar no sistema...</span>
              <span className="sm:hidden">Buscar...</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-muted)]">
              <span>Ctrl</span> K
            </kbd>
          </button>
        </div>

        {/* Direita: Avisos e Menu do Usuário */}
        <div className="flex items-center gap-3">
          {/* Sino de Avisos (Sheet lateral com EmptyState) */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Avisos e Notificações"
                className="relative p-2 rounded-[var(--radius-input)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Avisos e Notificações</SheetTitle>
                <SheetDescription>
                  Alertas em tempo real sobre publicações capturadas e prazos fatais.
                </SheetDescription>
              </SheetHeader>
              <div className="py-8">
                <EmptyState
                  title="Nenhum aviso por enquanto"
                  description="Você será notificado aqui e no WhatsApp quando houver novas publicações ou prazos."
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Menu do Usuário (Rótulo estático "Minha conta", sem nome falso) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Menu do usuário"
                className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] hover:bg-[var(--color-surface)] text-sm text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-glow)]">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <span className="font-medium text-xs hidden sm:inline">Minha conta</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-medium text-xs text-[var(--color-muted)]">
                Minha conta
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="h-4 w-4 mr-2" aria-hidden="true" />
                <span>Perfil (Passo 2.4)</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Sliders className="h-4 w-4 mr-2" aria-hidden="true" />
                <span>Preferências</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled danger>
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                <span>Sair da Conta (Passo 2.4)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Paleta de Comandos Global */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
}

