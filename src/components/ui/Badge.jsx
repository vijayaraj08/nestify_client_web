const badgeVariants = {
  success: 'bg-success-50 dark:bg-emerald-950/50 text-success-700 dark:text-emerald-300 border border-success-200 dark:border-emerald-800',
  warning: 'bg-warning-50 dark:bg-amber-950/50 text-warning-700 dark:text-amber-300 border border-warning-200 dark:border-amber-800',
  danger: 'bg-danger-50 dark:bg-rose-950/50 text-danger-700 dark:text-rose-300 border border-danger-200 dark:border-rose-800',
  info: 'bg-info-50 dark:bg-sky-950/50 text-info-700 dark:text-sky-300 border border-info-200 dark:border-sky-800',
  neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

/** Status badge mapping for PG/Hostel domain */
const statusMap = {
  paid: 'success',
  active: 'success',
  available: 'success',
  completed: 'success',
  verified: 'success',
  occupied: 'success',

  pending: 'warning',
  upcoming: 'warning',
  partial: 'warning',
  expiring: 'warning',

  overdue: 'danger',
  failed: 'danger',
  rejected: 'danger',
  blocked: 'danger',

  inactive: 'neutral',
  vacant: 'neutral',
  draft: 'neutral',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  status,
  dot = false,
  className = '',
}) {
  const resolvedVariant = status ? statusMap[status] || 'neutral' : variant;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        whitespace-nowrap leading-none
        ${badgeVariants[resolvedVariant]}
        ${badgeSizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full shrink-0
            ${resolvedVariant === 'success' ? 'bg-success-500' : ''}
            ${resolvedVariant === 'warning' ? 'bg-warning-500' : ''}
            ${resolvedVariant === 'danger' ? 'bg-danger-500' : ''}
            ${resolvedVariant === 'info' ? 'bg-info-500' : ''}
            ${resolvedVariant === 'neutral' ? 'bg-slate-400 dark:bg-slate-500' : ''}
          `}
        />
      )}
      {children}
    </span>
  );
}
