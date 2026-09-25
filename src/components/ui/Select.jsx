import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      required = false,
      disabled = false,
      options = [],
      placeholder = 'Select an option',
      className = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`
              block w-full rounded-md border bg-white
              px-3 py-2 pr-9 text-sm text-slate-900
              appearance-none
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
              ${error
                ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/20'
                : 'border-slate-300 focus:border-primary-500 focus:ring-primary-500/20'
              }
              ${className}
            `}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-danger-600" role="alert">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
