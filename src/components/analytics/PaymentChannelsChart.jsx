import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CreditCard, Smartphone } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';

export default function PaymentChannelsChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Payment Gateway & Channel Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              UPI, Netbanking, Cards & Automated Collections
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6 h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip isCurrency={false} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-6 space-y-2">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <span className="font-bold font-mono text-slate-900 dark:text-white">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
