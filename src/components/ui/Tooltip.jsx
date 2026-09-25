import { useState, useRef, useEffect } from 'react';

export default function Tooltip({ children, content, position = 'top', delay = 300 }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={`
            absolute z-50 ${positions[position]}
            px-2.5 py-1.5 text-xs font-medium
            text-white bg-slate-800 rounded-md
            whitespace-nowrap pointer-events-none
            animate-fade-in
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}
