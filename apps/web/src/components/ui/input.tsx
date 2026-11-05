import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-1 text-sm text-[var(--color-text)] shadow-sm transition-all duration-150',
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
Input.displayName = 'Input';

export { Input };
