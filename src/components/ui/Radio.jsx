import { forwardRef } from 'react';

const Radio = forwardRef(
  ({ label, id, name, disabled = false, className = '', ...props }, ref) => {
    const radioId = id || `${name}-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          disabled={disabled}
          className={`
            w-4 h-4 border border-slate-300
            text-primary-600
            focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            accent-primary-600
            cursor-pointer
          `}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className={`text-sm cursor-pointer select-none ${
              disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700'
            }`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
