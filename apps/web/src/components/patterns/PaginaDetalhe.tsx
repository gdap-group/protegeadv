import * as React from 'react';
import { Badge, type BadgeProps } from '../ui/badge';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { type BreadcrumbItem } from '../layout/PageHeader';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface DetalheStatus {
  label: string;
  variant?: BadgeProps['variant'];
  icon?: React.ComponentType<{ className?: string }>;
}

export interface QuickDataItem {
  label: string;
  value: React.ReactNode;
}

export interface DetalheTab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export interface PaginaDetalheProps {
  title: string;
  codigoMono?: string; // Ex: número CNJ formatado
  breadcrumbs?: BreadcrumbItem[];
  status?: DetalheStatus;
  actions?: React.ReactNode;

  // Abas
  tabs: DetalheTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  defaultTab?: string;

  // Card Lateral de Dados Rápidos
  sideTitle?: string;
  sideItems?: QuickDataItem[];
  sideFooter?: React.ReactNode;
  sideContent?: React.ReactNode;
}

export function PaginaDetalhe({
  title,
  codigoMono,
  breadcrumbs,
  status,
  actions,
  tabs,
  activeTab,
  onTabChange,
  defaultTab,
  sideTitle = 'Dados Rápidos',
  sideItems = [],
  sideFooter,
  sideContent,
}: PaginaDetalheProps) {
  const initialTab = activeTab ?? defaultTab ?? tabs[0]?.id ?? '';
  const [currentTab, setCurrentTab] = React.useState<string>(initialTab);

  const handleTabChange = (val: string) => {
    setCurrentTab(val);
    onTabChange?.(val);
  };

  const StatusIcon = status?.icon;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-1.5 text-xs text-[var(--color-muted)]"
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.label}>
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
                )}
                {isLast || !item.href ? (
                  <span className={isLast ? 'text-[var(--color-text)] font-medium' : ''}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-[var(--color-glow)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] rounded-xs"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Cabeçalho de Identificação */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              {title}
            </h1>
            {status && (
              <Badge variant={status.variant ?? 'neutro'} className="gap-1.5 py-0.5 px-2.5">
                {StatusIcon && <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{status.label}</span>
              </Badge>
            )}
          </div>

          {codigoMono && (
            <div className="inline-flex items-center">
              <span className="font-mono text-xs sm:text-sm text-[var(--color-glow)] bg-[var(--color-elevated)] px-2.5 py-1 rounded-[var(--radius-input)] border border-[var(--color-border)] select-all tracking-wide">
                {codigoMono}
              </span>
            </div>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </header>

      {/* Layout Responsivo: Conteúdo Principal + Card Lateral (empilha no mobile < 768px) */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Área de Conteúdo com Abas */}
        <main className="flex-1 w-full min-w-0">
          <Tabs
            value={activeTab ?? currentTab}
            onValueChange={handleTabChange}
            className="w-full space-y-4"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="gap-2 shrink-0 cursor-pointer"
                  >
                    {TabIcon && <TabIcon className="h-4 w-4" aria-hidden="true" />}
                    <span>{tab.label}</span>
                    {typeof tab.count === 'number' && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono bg-[var(--color-elevated)] text-[var(--color-muted)] border border-[var(--color-border)]">
                        {tab.count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-4 focus-visible:outline-none"
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </main>

        {/* Card Lateral de Dados Rápidos (Stacking < 768px) */}
        {(sideContent || sideItems.length > 0) && (
          <aside
            aria-label="Dados rápidos laterais"
            className="w-full md:w-80 lg:w-96 shrink-0 order-last"
          >
            {sideContent ?? (
              <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
                <CardHeader className="pb-3 border-b border-[var(--color-border)]">
                  <h2 className="text-sm font-semibold text-[var(--color-text)]">
                    {sideTitle}
                  </h2>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <dl className="space-y-3.5">
                    {sideItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-1 pb-3 border-b border-[var(--color-border)] last:border-b-0 last:pb-0"
                      >
                        <dt className="text-xs text-[var(--color-muted)] font-medium">
                          {item.label}
                        </dt>
                        <dd className="text-sm font-medium text-[var(--color-text)] break-words">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {sideFooter && (
                    <div className="pt-2 border-t border-[var(--color-border)]">
                      {sideFooter}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
