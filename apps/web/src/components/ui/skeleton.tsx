import * as React from 'react';
import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[var(--radius-input)] bg-[var(--color-elevated)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
