import * as React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  headingLevel?: 'h2' | 'h3';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  headingLevel = 'h3',
  className,
  ...props
}: EmptyStateProps) {
  const HeadingTag = headingLevel;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50',
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-elevated)] border border-[var(--color-border)] text-[var(--color-glow)] mb-4">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <HeadingTag className="text-base font-semibold text-[var(--color-text)]">{title}</HeadingTag>
      {description && (
        <p className="text-sm text-[var(--color-muted)] max-w-sm mt-1.5 mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
