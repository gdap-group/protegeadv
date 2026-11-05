import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle2, AlertTriangle, AlertCircle, MinusCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors duration-150',
  {
    variants: {
      variant: {
        success:
          'bg-[var(--color-elevated)] text-[var(--color-success)] border-[var(--color-border)]',
        warning:
          'bg-[var(--color-elevated)] text-[var(--color-warning)] border-[var(--color-border)]',
        danger:
          'bg-[var(--color-elevated)] text-[var(--color-danger)] border-[var(--color-border)]',
        neutro:
          'bg-[var(--color-elevated)] text-[var(--color-muted)] border-[var(--color-border)]',
        info:
          'bg-[var(--color-elevated)] text-[var(--color-glow)] border-[var(--color-border)]',
      },
    },
    defaultVariants: {
      variant: 'neutro',
    },
  }
);

const defaultIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  neutro: MinusCircle,
  info: Info,
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  hideIcon?: boolean;
}

function Badge({
  className,
  variant = 'neutro',
  icon,
  hideIcon = false,
  children,
  ...props
}: BadgeProps) {
  const IconComponent = variant ? defaultIcons[variant] : defaultIcons.neutro;

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {!hideIcon && (icon ?? (IconComponent ? <IconComponent className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null))}
      <span>{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
