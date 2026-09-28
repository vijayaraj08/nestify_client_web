import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { useState } from 'react';

const alertConfig = {
  info: {
    icon: Info,
    container: 'bg-info-50 dark:bg-sky-950/40 border-info-200 dark:border-sky-800 text-info-800 dark:text-sky-200',
    iconColor: 'text-info-500 dark:text-sky-400',
  },
  success: {
    icon: CheckCircle,
    container: 'bg-success-50 dark:bg-emerald-950/40 border-success-200 dark:border-emerald-800 text-success-800 dark:text-emerald-200',
    iconColor: 'text-success-500 dark:text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-warning-50 dark:bg-amber-950/40 border-warning-200 dark:border-amber-800 text-warning-800 dark:text-amber-200',
    iconColor: 'text-warning-500 dark:text-amber-400',
  },
  danger: {
    icon: XCircle,
    container: 'bg-danger-50 dark:bg-rose-950/40 border-danger-200 dark:border-rose-800 text-danger-800 dark:text-rose-200',
    iconColor: 'text-danger-500 dark:text-rose-400',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) {
  const [dismissed, setDismissed] = useState(false);
  const config = alertConfig[variant];
  const Icon = config.icon;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={`
        flex gap-3 p-4 rounded-lg border text-sm
        ${config.container}
        ${className}
      `}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="opacity-90">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
