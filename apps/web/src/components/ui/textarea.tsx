import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, disabled, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm text-[var(--color-text)] shadow-sm transition-all duration-150',
          'placeholder:text-[var(--color-muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] focus-visible:border-[var(--color-primary)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]',
          className
        )}
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
