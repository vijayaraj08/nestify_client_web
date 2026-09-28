import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { BedDouble, ShieldCheck } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';

export default function OccupancyTrendChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bed Capacity & Occupancy Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Allocated vs occupied beds with 90% benchmark threshold
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Target: 90% Occupancy</span>
          </span>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#06b6d4"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[60, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomChartTooltip isCurrency={false} />} />

            <ReferenceLine
              yAxisId="right"
              y={90}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Target 90%',
                fill: '#10b981',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            <Bar
              yAxisId="left"
              dataKey="occupied"
              name="Occupied Beds"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              yAxisId="left"
              dataKey="total"
              name="Total Capacity"
              fill="#cbd5e1"
              opacity={0.4}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              name="Occupancy Rate %"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
