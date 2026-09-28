import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import { Receipt, Zap } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';
import { formatINR } from '../../services/analyticsService';

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#64748b" className="text-xs font-semibold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#0f172a" className="text-sm font-bold font-mono">
        {formatINR(value, true)}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 11}
        fill={fill}
      />
    </g>
  );
};

export default function ExpenseBreakdownChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Operating Expenses & Utilities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total operational expenditure: <span className="font-semibold text-slate-900 dark:text-white">{formatINR(totalExpense)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-6 h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip isCurrency={true} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="md:col-span-6 space-y-2">
          {data.map((item, idx) => {
            const pct = ((item.value / totalExpense) * 100).toFixed(1);
            const isHovered = activeIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                  isHovered
                    ? 'bg-slate-50 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600 shadow-xs translate-x-1'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                    {formatINR(item.value)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{pct}% share</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
