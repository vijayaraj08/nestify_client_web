import {
  Building2,
  Users,
  CreditCard,
  ShieldAlert,
  ArrowUpRight,
  Activity,
  Plus,
} from 'lucide-react';
import KpiCard from './KpiCard';

export default function SuperAdminDashboardSections() {
  const stats = [
    {
      title: 'Total Hostels & Tenants',
      value: '142',
      change: '+12.5%',
      trend: 'up',
      icon: Building2,
      color: 'bg-primary-50 text-primary-700',
    },
    {
      title: 'Active Residents',
      value: '3,890',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Monthly GMV',
      value: '₹48.6L',
      change: '+15.4%',
      trend: 'up',
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Pending Approvals',
      value: '7',
      change: 'Action req.',
      trend: 'alert',
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="w-full space-y-4 pb-8">
      {/* ── KPI Cards Grid (Starts directly at top of page) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KpiCard key={i} {...stat} />
        ))}
      </div>

      {/* ── Grid: Tenant Activity & Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Recent Tenants */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Tenant Onboardings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Newly registered hostel partners across cities</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Onboard Tenant</span>
              </button>
              <button
                type="button"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 cursor-pointer pl-1"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {[
              { name: 'Nest Stay Residency', city: 'Bengaluru, KA', rooms: '48 Rooms', status: 'Active', plan: 'Enterprise' },
              { name: 'Elite Haven Co-living', city: 'Pune, MH', rooms: '32 Rooms', status: 'Active', plan: 'Growth' },
              { name: 'Urban Pods Living', city: 'Hyderabad, TS', rooms: '64 Rooms', status: 'Pending KYC', plan: 'Enterprise' },
              { name: 'Grand Oak Hostels', city: 'Chennai, TN', rooms: '24 Rooms', status: 'Active', plan: 'Starter' },
            ].map((tenant, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {tenant.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{tenant.name}</h3>
                    <p className="text-xs text-slate-500">{tenant.city} • {tenant.rooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {tenant.plan}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      tenant.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                  >
                    {tenant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Platform Health & Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">System Health</h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                <Activity size={12} className="animate-pulse" /> Operational
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>API Response Time</span>
                  <span className="text-emerald-600 font-bold">42ms</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Payment Gateway Uptime</span>
                  <span className="text-emerald-600 font-bold">99.98%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99%' }} />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Storage Utilization</span>
                  <span className="text-indigo-600 font-bold">34.2%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary-600 h-full rounded-full" style={{ width: '34%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 text-[11px] text-slate-400">
            Node cluster IN-BLR-01 • Uptime 99.99%
          </div>
        </div>
      </div>
    </div>
  );
}
