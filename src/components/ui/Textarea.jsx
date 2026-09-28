import { forwardRef } from 'react';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      required = false,
      disabled = false,
      rows = 4,
      className = '',
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={`
            block w-full rounded-md border bg-white dark:bg-slate-900
            px-3 py-2 text-sm text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            transition-colors duration-150
            resize-y
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed
            ${error
              ? 'border-danger-300 dark:border-danger-700 focus:border-danger-500 focus:ring-danger-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-danger-600 dark:text-danger-400" role="alert">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
