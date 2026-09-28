import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { UtensilsCrossed, Star } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';

export default function FoodSatisfactionChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Mess & Food Satisfaction Index
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Resident ratings across Breakfast, Lunch, and Dinner (1.0 to 5.0 scale)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>4.58 / 5.0 Avg</span>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} vertical={false} />
            <XAxis
              dataKey="day"
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
              domain={[3.5, 5.0]}
              tickFormatter={(v) => `${v}★`}
            />
            <Tooltip content={<CustomChartTooltip isCurrency={false} />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="breakfast"
              name="Breakfast"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="lunch"
              name="Lunch"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="dinner"
              name="Dinner"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
