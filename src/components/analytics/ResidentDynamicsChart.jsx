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
import { UserCheck, UserMinus, Users } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';

export default function ResidentDynamicsChart({ data }) {
  const totalMoveIns = data.reduce((acc, curr) => acc + curr.moveIns, 0);
  const totalMoveOuts = data.reduce((acc, curr) => acc + curr.moveOuts, 0);
  const netAdditions = totalMoveIns - totalMoveOuts;

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Resident Admissions & Move-Out Flow
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New admissions vs departures & net resident retention
            </p>
          </div>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>+{totalMoveIns} Move-Ins</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold">
            <UserMinus className="w-3.5 h-3.5" />
            <span>-{totalMoveOuts} Move-Outs</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-bold">
            Net: +{netAdditions}
          </span>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#94a3b8"
              fontSize={12}
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
              dataKey="moveIns"
              name="New Move-Ins"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="moveOuts"
              name="Move-Outs"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
