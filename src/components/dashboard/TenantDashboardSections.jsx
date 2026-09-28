import { Link } from 'react-router-dom';
import {
  BedDouble,
  Users,
  CreditCard,
  Wrench,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import KpiCard from './KpiCard';
import RevenueFlowChart from '../analytics/RevenueFlowChart';
import OccupancyTrendChart from '../analytics/OccupancyTrendChart';

export default function TenantDashboardSections() {
  const stats = [
    {
      title: 'Total Bed Capacity',
      value: '120 Beds',
      change: '88% Occupied',
      trend: 'up',
      icon: BedDouble,
      color: 'bg-primary-50 text-primary-700',
    },
    {
      title: 'Current Residents',
      value: '106',
      change: '+4 this week',
      trend: 'up',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Pending Collections',
      value: '₹84,000',
      change: '6 Residents pending',
      trend: 'alert',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Open Complaints',
      value: '3',
      change: '1 high priority',
      trend: 'alert',
      icon: Wrench,
      color: 'bg-rose-50 text-rose-700',
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

      {/* ── Grid: Room Status & Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Recent Check-ins & Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Check-ins & Bookings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Residents assigned to beds recently</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>New Booking</span>
              </button>
              <button
                type="button"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center gap-1 cursor-pointer pl-1"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {[
              { name: 'Rahul Sharma', room: 'Room 204 (Bed A)', date: 'Today, 10:30 AM', rent: '₹8,500/mo', status: 'Checked In' },
              { name: 'Priya Patel', room: 'Room 102 (Bed B)', date: 'Yesterday', rent: '₹9,000/mo', status: 'Checked In' },
              { name: 'Aditya Varma', room: 'Room 305 (Bed A)', date: '2 days ago', rent: '₹8,500/mo', status: 'Payment Due' },
              { name: 'Karthik Raja', room: 'Room 401 (Bed C)', date: '3 days ago', rent: '₹7,500/mo', status: 'Checked In' },
            ].map((resident, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                    {resident.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{resident.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resident.room} • {resident.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {resident.rent}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      resident.status === 'Checked In'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/60'
                    }`}
                  >
                    {resident.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Property Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Tasks</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">3 Pending</span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { title: 'AC repair in Room 302', tag: 'High Priority', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400' },
                { title: 'Verify KYC documents for 2 new tenants', tag: 'Verification', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400' },
                { title: 'Send rent reminders for Block B', tag: 'Finance', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400' },
              ].map((task, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${task.color}`}>
                      {task.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Hostel ID: HST-9021 • Floor 1 to 4 Active
          </div>
        </div>
      </div>

      {/* ── Property Occupancy & Collections Analytics Preview ── */}
      <div className="bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Hostel Performance & Collections</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live bed utilization and weekly cashflow</p>
            </div>
          </div>
          <Link
            to="/tenant/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Analytics & P&L Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RevenueFlowChart
            data={[
              { date: 'Mon', grossRevenue: 8500, netCollected: 8000, pendingDues: 500, refunds: 0 },
              { date: 'Tue', grossRevenue: 12000, netCollected: 11500, pendingDues: 500, refunds: 0 },
              { date: 'Wed', grossRevenue: 9500, netCollected: 9000, pendingDues: 500, refunds: 100 },
              { date: 'Thu', grossRevenue: 14000, netCollected: 13500, pendingDues: 500, refunds: 0 },
              { date: 'Fri', grossRevenue: 16500, netCollected: 15800, pendingDues: 700, refunds: 200 },
              { date: 'Sat', grossRevenue: 7500, netCollected: 7200, pendingDues: 300, refunds: 0 },
              { date: 'Sun', grossRevenue: 8000, netCollected: 7800, pendingDues: 200, refunds: 0 },
            ]}
          />
          <OccupancyTrendChart
            data={[
              { name: 'Mon', occupied: 102, total: 120, rate: 85.0 },
              { name: 'Tue', occupied: 104, total: 120, rate: 86.6 },
              { name: 'Wed', occupied: 105, total: 120, rate: 87.5 },
              { name: 'Thu', occupied: 105, total: 120, rate: 87.5 },
              { name: 'Fri', occupied: 106, total: 120, rate: 88.3 },
              { name: 'Sat', occupied: 106, total: 120, rate: 88.3 },
              { name: 'Sun', occupied: 106, total: 120, rate: 88.3 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
