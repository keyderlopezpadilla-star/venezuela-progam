import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Botón base con jerarquía visual (primary / secondary / ghost / outline / destructive)
 * y soporte para tamaños, iconos, loading y asChild (para usar con Link).
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-soft hover:bg-primary-600 hover:shadow-glow-primary active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary-600 hover:shadow-soft-xl active:scale-[0.98]',
        emergency:
          'bg-emergency text-emergency-foreground shadow-soft hover:bg-emergency-600 hover:shadow-glow-emergency active:scale-[0.98]',
        accent:
          'bg-accent text-accent-foreground shadow-soft hover:bg-accent-600 hover:shadow-soft-xl active:scale-[0.98]',
        outline:
          'border border-border bg-background hover:bg-muted hover:border-primary/30',
        ghost:
          'hover:bg-muted hover:text-foreground',
        glass:
          'glass text-foreground hover:bg-white/90 dark:hover:bg-dark-card/90 shadow-soft',
        link:
          'text-primary underline-offset-4 hover:underline',
        soft:
          'bg-primary/10 text-primary hover:bg-primary/15',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        xl: 'h-16 px-10 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };