export default function DashboardHero({
  badgeText = 'Portal Overview',
  badgeVariant = 'primary', // 'primary' | 'emerald' | 'indigo' | 'amber'
  subtext,
  title,
  description,
  actionButton,
}) {
  const badgeClasses = {
    primary: 'bg-primary-50 text-primary-700 border-primary-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  }[badgeVariant] || 'bg-primary-50 text-primary-700 border-primary-100';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}>
            {badgeText}
          </span>
          {subtext && <span className="text-xs text-slate-400">• {subtext}</span>}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {actionButton && (
        <div className="flex items-center gap-3 shrink-0">
          {actionButton}
        </div>
      )}
    </div>
  );
}
