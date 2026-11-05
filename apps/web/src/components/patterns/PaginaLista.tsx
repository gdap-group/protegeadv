import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { PageHeader, type BreadcrumbItem } from '../layout/PageHeader';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../ui/empty-state';
import { cn } from '../../lib/utils';

export interface QuickFilter {
  id: string;
  label: string;
  count: number;
}

export interface PrimaryAction {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface PaginaListaProps<TData, TValue> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  primaryAction?: PrimaryAction;
  customAction?: React.ReactNode;

  // Filtros
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  quickFilters?: QuickFilter[];
  activeQuickFilter?: string;
  onQuickFilterChange?: (filterId: string) => void;

  // Dados e Tabela
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  enableRowSelection?: boolean;

  // Estados de Controle
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;

  // Configuração do Estado Vazio
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}

export function PaginaLista<TData, TValue>({
  title,
  description,
  breadcrumbs,
  primaryAction,
  customAction,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar registros...',
  quickFilters = [],
  activeQuickFilter,
  onQuickFilterChange,
  columns,
  data,
  pageSize = 10,
  enableRowSelection = true,
  isLoading = false,
  isError = false,
  errorMessage = 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
  onRetry,
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription = 'Tente ajustar os filtros ou adicione um novo registro para começar.',
  emptyAction,
}: PaginaListaProps<TData, TValue>) {
  const renderedAction = customAction ?? (primaryAction ? (
    <Button variant="primary" onClick={primaryAction.onClick}>
      {primaryAction.icon && <span className="mr-1.5">{primaryAction.icon}</span>}
      {primaryAction.label}
    </Button>
  ) : null);

  const renderedEmptyAction = emptyAction ? (
    <Button variant="secondary" onClick={emptyAction.onClick}>
      {emptyAction.label}
    </Button>
  ) : null;

  const hasFilterBar = Boolean(
    onSearchChange || (quickFilters && quickFilters.length > 0)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        action={renderedAction}
      />

      {/* Barra de Filtros */}
      {hasFilterBar && (
        <section
          aria-label="Filtros da listagem"
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]"
        >
          {/* Busca por texto */}
          {onSearchChange && (
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)] pointer-events-none"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-9 h-9 text-xs sm:text-sm bg-[var(--color-bg)]"
              />
            </div>
          )}

          {/* Filtros rápidos com contagem */}
          {quickFilters && quickFilters.length > 0 && (
            <div
              role="group"
              aria-label="Filtros rápidos"
              className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
            >
              {quickFilters.map((qf) => {
                const isActive = activeQuickFilter === qf.id;
                return (
                  <button
                    key={qf.id}
                    type="button"
                    onClick={() => onQuickFilterChange?.(qf.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-input)] transition-colors cursor-pointer shrink-0 border',
                      isActive
                        ? 'bg-[var(--color-elevated)] border-[var(--color-primary)] text-[var(--color-glow)] font-semibold'
                        : 'bg-transparent border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)]/60'
                    )}
                  >
                    <span>{qf.label}</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.2 rounded-full text-[11px] font-mono',
                        isActive
                          ? 'bg-[var(--color-primary-hover)] text-[var(--color-text)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]'
                      )}
                    >
                      {qf.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Estados: Erro, Carregando, Vazio e Tabela Normal */}
      {isError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center p-8 bg-[var(--color-surface)] border border-[var(--color-danger)]/30 rounded-[var(--radius-card)] text-center space-y-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1 max-w-md">
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Falha ao carregar registros
            </h2>
            <p className="text-sm text-[var(--color-muted)]">{errorMessage}</p>
          </div>
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Tentar de novo
            </Button>
          )}
        </div>
      ) : isLoading ? (
        <div
          role="status"
          aria-label="Carregando dados da tabela"
          className="space-y-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]"
        >
          <span className="sr-only">Carregando dados...</span>
          {/* Skeleton do cabeçalho da tabela */}
          <div className="flex gap-4 pb-3 border-b border-[var(--color-border)]">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20 ml-auto" />
          </div>
          {/* Skeletons das linhas da tabela */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-3 border-b border-[var(--color-border)] last:border-b-0"
            >
              <Skeleton className="h-4 w-4 rounded-xs" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          headingLevel="h2"
          title={emptyTitle}
          description={emptyDescription}
          action={renderedEmptyAction}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pageSize={pageSize}
          enableRowSelection={enableRowSelection}
        />
      )}
    </div>
  );
}
