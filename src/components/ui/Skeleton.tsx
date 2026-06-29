import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton con animación shimmer. Soporta variantes de forma.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-shimmer',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };