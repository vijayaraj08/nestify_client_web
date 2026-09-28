import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-slate-900',
  secondary:
    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900',
  outline:
    'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-slate-900',
  ghost:
    'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 active:bg-slate-200 dark:active:bg-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900',
  danger:
    'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 focus-visible:ring-danger-500 dark:focus-visible:ring-offset-slate-900',
  success:
    'bg-success-500 text-white hover:bg-success-600 active:bg-success-700 focus-visible:ring-success-500 dark:focus-visible:ring-offset-slate-900',
  warning:
    'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 focus-visible:ring-warning-500 dark:focus-visible:ring-offset-slate-900',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  xl: 'px-6 py-3 text-base gap-2.5',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-md
          transition-all duration-150 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          cursor-pointer
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="animate-spin shrink-0" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
        {!loading && LeftIcon && <LeftIcon className="shrink-0" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
        {children}
        {!loading && RightIcon && <RightIcon className="shrink-0" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
