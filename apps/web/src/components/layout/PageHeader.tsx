import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 pb-6 border-b border-[var(--color-border)] mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[var(--color-muted)]">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.label}>
                {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />}
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

      {/* Título e Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">{title}</h1>
          {description && (
            <p className="text-sm text-[var(--color-muted)] mt-1">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

