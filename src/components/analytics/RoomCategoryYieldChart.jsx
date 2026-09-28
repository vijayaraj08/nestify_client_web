import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Layers, Sparkles } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';
import { formatINR } from '../../services/analyticsService';

export default function RoomCategoryYieldChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Room Sharing Yield & Bed Occupancy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Capacity distribution vs ADR (Average Daily/Monthly Rate)
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomChartTooltip isCurrency={false} />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              dataKey="beds"
              name="Total Beds"
              fill="#94a3b8"
              radius={[6, 6, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              dataKey="occupied"
              name="Occupied Beds"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yield sub-cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        {data.map((item, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate">
              {item.category}
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono block mt-0.5">
              {formatINR(item.adr)}/mo
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">
              {item.rate}% Occupied
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
