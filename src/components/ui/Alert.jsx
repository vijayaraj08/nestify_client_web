import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { useState } from 'react';

const alertConfig = {
  info: {
    icon: Info,
    container: 'bg-primary-50 border-primary-200 text-primary-800',
    iconColor: 'text-primary-500',
  },
  success: {
    icon: CheckCircle,
    container: 'bg-success-50 border-success-200 text-success-800',
    iconColor: 'text-success-500',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-warning-50 border-warning-200 text-warning-800',
    iconColor: 'text-warning-500',
  },
  danger: {
    icon: XCircle,
    container: 'bg-danger-50 border-danger-200 text-danger-800',
    iconColor: 'text-danger-500',
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
          className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
