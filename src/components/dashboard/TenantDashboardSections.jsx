import {
  BedDouble,
  Users,
  CreditCard,
  Wrench,
  ArrowUpRight,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import DashboardHero from './DashboardHero';
import KpiCard from './KpiCard';

export default function TenantDashboardSections({ user }) {
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
    <div className="space-y-6">
      {/* Reusable Hero Banner */}
      <DashboardHero
        badgeText="Hostel Property Management"
        badgeVariant="emerald"
        subtext="Sunshine Grand Hostel"
        title={`Welcome back, ${user?.name || 'Property Manager'}`}
        description="Monitor room occupancy, resident check-ins, rent collection, and maintenance issues."
        actionButton={
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={18} />
            <span>New Booking</span>
          </button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KpiCard key={i} {...stat} />
        ))}
      </div>

      {/* Grid: Room Status & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Check-ins & Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Check-ins & Bookings</h2>
              <p className="text-xs text-slate-500">Residents assigned to beds recently</p>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {[
              { name: 'Rahul Sharma', room: 'Room 204 (Bed A)', date: 'Today, 10:30 AM', rent: '₹8,500/mo', status: 'Checked In' },
              { name: 'Priya Patel', room: 'Room 102 (Bed B)', date: 'Yesterday', rent: '₹9,000/mo', status: 'Checked In' },
              { name: 'Aditya Varma', room: 'Room 305 (Bed A)', date: '2 days ago', rent: '₹8,500/mo', status: 'Payment Due' },
              { name: 'Karthik Raja', room: 'Room 401 (Bed C)', date: '3 days ago', rent: '₹7,500/mo', status: 'Checked In' },
            ].map((resident, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {resident.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{resident.name}</h3>
                    <p className="text-xs text-slate-500">{resident.room} • {resident.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700">
                    {resident.rent}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      resident.status === 'Checked In'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Today's Tasks</h2>
              <span className="text-xs font-semibold text-slate-500">3 Pending</span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { title: 'AC repair in Room 302', tag: 'High Priority', color: 'text-rose-600 bg-rose-50' },
                { title: 'Verify KYC documents for 2 new tenants', tag: 'Verification', color: 'text-amber-600 bg-amber-50' },
                { title: 'Send rent reminders for Block B', tag: 'Finance', color: 'text-indigo-600 bg-indigo-50' },
              ].map((task, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{task.title}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${task.color}`}>
                      {task.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Hostel ID: HST-9021 • Floor 1 to 4 Active
          </div>
        </div>
      </div>
    </div>
  );
}
