const badgeVariants = {
  success: 'bg-success-50 text-success-700 border border-success-200',
  warning: 'bg-warning-50 text-warning-700 border border-warning-200',
  danger: 'bg-danger-50 text-danger-700 border border-danger-200',
  info: 'bg-info-50 text-info-700 border border-info-200',
  neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
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
            ${resolvedVariant === 'neutral' ? 'bg-slate-500' : ''}
          `}
        />
      )}
      {children}
    </span>
  );
}
