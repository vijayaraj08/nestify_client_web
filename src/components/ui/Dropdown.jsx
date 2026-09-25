import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({
  trigger,
  items = [],
  align = 'left',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignment = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger || (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Options
            <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Menu */}
      {open && (
        <div
          className={`
            absolute ${alignment} mt-1 z-40
            min-w-[180px] bg-white rounded-md
            border border-slate-200 shadow-lg
            py-1 animate-slide-down
          `}
          role="menu"
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="border-t border-slate-100 my-1" />;
            }

            return (
              <button
                key={idx}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={`
                  w-full text-left px-3 py-2 text-sm
                  flex items-center gap-2
                  transition-colors duration-100
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${item.danger
                    ? 'text-danger-600 hover:bg-danger-50'
                    : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
              >
                {item.icon && <item.icon size={15} className="shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
