import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  change,
  trend = 'up', // 'up' | 'down' | 'alert' | 'neutral'
  icon: Icon,
  color = 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300',
}) {
  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'down':
        return 'text-rose-600 dark:text-rose-400';
      case 'alert':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  const renderTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} />;
      case 'down':
        return <TrendingDown size={14} />;
      case 'alert':
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        {change && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${getTrendClass()}`}>
            {renderTrendIcon()}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
