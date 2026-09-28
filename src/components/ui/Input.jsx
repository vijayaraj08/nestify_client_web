import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      required = false,
      disabled = false,
      className = '',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon size={16} className="text-slate-400 dark:text-slate-500" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              block w-full rounded-md border bg-white dark:bg-slate-900
              px-3 py-2 text-sm text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed
              ${LeftIcon ? 'pl-9' : ''}
              ${RightIcon ? 'pr-9' : ''}
              ${error
                ? 'border-danger-300 dark:border-danger-700 focus:border-danger-500 focus:ring-danger-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20'
              }
              ${className}
            `}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <RightIcon size={16} className="text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger-600 dark:text-danger-400" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
