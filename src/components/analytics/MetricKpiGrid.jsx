import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BedDouble,
  Building2,
  AlertCircle,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { formatINR } from '../../services/analyticsService';

export default function MetricKpiGrid({ kpis }) {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Gross Revenue',
      value: formatINR(kpis.totalRevenue),
      delta: `${kpis.revenueGrowth >= 0 ? '+' : ''}${kpis.revenueGrowth}%`,
      isPositive: kpis.revenueGrowth >= 0,
      subtext: 'vs previous period',
      icon: DollarSign,
      color: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-200/60',
      iconBg: 'bg-emerald-500/15 text-emerald-600',
    },
    {
      title: 'Average Bed Occupancy',
      value: `${kpis.occupancyRate}%`,
      delta: `${kpis.occupancyGrowth >= 0 ? '+' : ''}${kpis.occupancyGrowth}%`,
      isPositive: kpis.occupancyGrowth >= 0,
      subtext: `${kpis.activeBeds} of ${kpis.totalBeds} beds`,
      icon: BedDouble,
      color: 'from-indigo-500/10 to-blue-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-200/60',
      iconBg: 'bg-indigo-500/15 text-indigo-600',
    },
    {
      title: 'Active Hostel Units',
      value: `${kpis.activeHostels}`,
      delta: `${kpis.hostelGrowth >= 0 ? '+' : ''}${kpis.hostelGrowth}%`,
      isPositive: kpis.hostelGrowth >= 0,
      subtext: 'verified properties',
      icon: Building2,
      color: 'from-purple-500/10 to-pink-500/5 text-purple-600 dark:text-purple-400 border-purple-200/60',
      iconBg: 'bg-purple-500/15 text-purple-600',
    },
    {
      title: 'Pending Rent & Dues',
      value: formatINR(kpis.pendingDues),
      delta: `${kpis.dueRate >= 0 ? '+' : ''}${kpis.dueRate}%`,
      isPositive: kpis.dueRate < 0, // Lower overdue is positive!
      subtext: 'uncollected receivables',
      icon: AlertCircle,
      color: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-200/60',
      iconBg: 'bg-amber-500/15 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all duration-200 group`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </div>
              <div
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.isPositive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{card.delta}</span>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {card.subtext}
            </p>

            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
