import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DollarSign, Layers, TrendingUp } from 'lucide-react';
import CustomChartTooltip from './CustomChartTooltip';
import { formatINR } from '../../services/analyticsService';

export default function RevenueFlowChart({ data }) {
  const [activeMetrics, setActiveMetrics] = useState({
    grossRevenue: true,
    netCollected: true,
    pendingDues: true,
    refunds: false,
  });

  const toggleMetric = (key) => {
    setActiveMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const metricDefs = [
    { key: 'grossRevenue', label: 'Gross Invoiced', color: '#6366f1', fill: 'url(#grossGrad)' },
    { key: 'netCollected', label: 'Net Collected', color: '#10b981', fill: 'url(#netGrad)' },
    { key: 'pendingDues', label: 'Pending Dues', color: '#f59e0b', fill: 'url(#duesGrad)' },
    { key: 'refunds', label: 'Refunds / Adjustments', color: '#f43f5e', fill: 'url(#refundGrad)' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue Inflow & Collection Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gross billing vs realized cash collections vs overdue receivables
              </p>
            </div>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
          {metricDefs.map((m) => {
            const isActive = activeMetrics[m.key];
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMetric(m.key)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 opacity-60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: m.color }}
                />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="duesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} vertical={false} />
            <XAxis
              dataKey="date"
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
              tickFormatter={(v) => formatINR(v, true)}
            />
            <Tooltip content={<CustomChartTooltip isCurrency={true} />} />

            {activeMetrics.grossRevenue && (
              <Area
                type="monotone"
                dataKey="grossRevenue"
                name="Gross Invoiced"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#grossGrad)"
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
            )}
            {activeMetrics.netCollected && (
              <Area
                type="monotone"
                dataKey="netCollected"
                name="Net Collected"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#netGrad)"
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
            )}
            {activeMetrics.pendingDues && (
              <Area
                type="monotone"
                dataKey="pendingDues"
                name="Pending Dues"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#duesGrad)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
            )}
            {activeMetrics.refunds && (
              <Area
                type="monotone"
                dataKey="refunds"
                name="Refunds"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#refundGrad)"
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
