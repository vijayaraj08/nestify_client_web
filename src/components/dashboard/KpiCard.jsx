import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  change,
  trend = 'up', // 'up' | 'down' | 'alert' | 'neutral'
  icon: Icon,
  color = 'bg-primary-50 text-primary-700',
}) {
  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-rose-600';
      case 'alert':
        return 'text-amber-600';
      default:
        return 'text-slate-500';
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
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${color}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
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
