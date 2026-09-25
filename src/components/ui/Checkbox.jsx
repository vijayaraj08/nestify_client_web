import { forwardRef } from 'react';
import { Check } from 'lucide-react';

const Checkbox = forwardRef(
  ({ label, id, error, disabled = false, className = '', ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex items-start gap-2 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`
              w-4 h-4 rounded border flex items-center justify-center
              transition-colors duration-150 cursor-pointer
              peer-checked:bg-primary-600 peer-checked:border-primary-600
              peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/20 peer-focus-visible:ring-offset-1
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              ${error ? 'border-danger-300' : 'border-slate-300'}
            `}
            onClick={() => {
              const input = document.getElementById(checkboxId);
              if (input && !disabled) input.click();
            }}
          >
            <Check
              size={12}
              className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              style={{ opacity: 'inherit' }}
            />
          </div>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
