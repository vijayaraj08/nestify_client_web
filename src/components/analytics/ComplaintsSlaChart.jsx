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
import { MessageSquareWarning, Clock } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';

export default function ComplaintsSlaChart({ data }) {
  const totalComplaints = data.reduce((acc, curr) => acc + curr.total, 0);
  const totalResolved = data.reduce((acc, curr) => acc + curr.resolved, 0);
  const resolutionRate = ((totalResolved / totalComplaints) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Resident Helpdesk & Resolution SLA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Departmental issue volume & turnaround speed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            <span>{resolutionRate}% Resolution Rate</span>
          </span>
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
              dataKey="total"
              name="Tickets Raised"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              dataKey="resolved"
              name="Resolved In SLA"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Avg Turnaround Time Footnote */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        {data.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{item.category}</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {item.avgHours}h
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
