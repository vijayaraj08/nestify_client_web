import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`
          relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl
          border border-slate-200/80 dark:border-slate-800
          w-full ${sizes[size]}
          animate-scale-in
          max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-start justify-between p-5 pb-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
              )}
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="xs"
                onClick={onClose}
                className="ml-4 -mr-1 -mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <X size={18} />
              </Button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-5 pt-0 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
