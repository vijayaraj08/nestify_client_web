import React from 'react';
import { formatINR } from '../../services/analyticsService';

export default function CustomChartTooltip({ active, payload, label, isCurrency = true }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700/80 text-xs min-w-[170px] pointer-events-none transition-all duration-150">
      <div className="font-semibold text-slate-200 mb-2 pb-1.5 border-b border-slate-700/60 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Telemetry</span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const val = entry.value;
          let displayVal = val;
          if (isCurrency && typeof val === 'number') {
            displayVal = formatINR(val);
          } else if (typeof val === 'number' && entry.name?.toLowerCase().includes('rate')) {
            displayVal = `${val}%`;
          } else if (typeof val === 'number' && (entry.name?.toLowerCase().includes('hour') || entry.name?.toLowerCase().includes('sla'))) {
            displayVal = `${val} hrs`;
          }

          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs"
                  style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
                />
                <span className="text-slate-300 font-medium capitalize truncate max-w-[130px]">
                  {entry.name}
                </span>
              </div>
              <span className="font-bold font-mono text-white text-right">
                {displayVal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
