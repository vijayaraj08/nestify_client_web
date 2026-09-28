import {
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  Wifi,
  Calendar,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';
import KpiCard from './KpiCard';

export default function EndUserDashboardSections() {
  return (
    <div className="w-full space-y-4 pb-8">
      {/* ── Snapshot KPI Cards (Starts directly at top of page) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="My Stay"
          value="Room 204 • Bed B"
          change="Deluxe 2-Sharing AC • 2nd Floor"
          trend="neutral"
          icon={BedDouble}
          color="bg-primary-50 text-primary-700"
        />
        <KpiCard
          title="Upcoming Due"
          value="₹8,500"
          change="Due on 5th October 2026"
          trend="alert"
          icon={CreditCard}
          color="bg-amber-50 text-amber-700"
        />
        <KpiCard
          title="Active Requests"
          value="1 In Progress"
          change="WiFi speed issue in 2nd Floor"
          trend="alert"
          icon={MessageSquareWarning}
          color="bg-indigo-50 text-indigo-700"
        />
        <KpiCard
          title="KYC Status"
          value="Verified"
          change="Aadhaar & Agreement approved"
          trend="up"
          icon={ShieldCheck}
          color="bg-emerald-50 text-emerald-700"
        />
      </div>

      {/* ── Grid: Services & Today's Menu ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 cols: Resident Amenities & Quick Access */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Hostel Services & Amenities</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quick access to Wi-Fi, gate passes, and room service</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard size={14} />
              <span>Pay Rent ₹8,500</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shrink-0">
                <Wifi size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hostel High-Speed Wi-Fi</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">SSID: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">Hostello_Resident_5G</span></p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Password: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">Sunshine@2026</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gate Pass & Leave Request</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Standard Curfew: 10:30 PM</p>
                <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-1 cursor-pointer">
                  Request Night Out Pass →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 col: Today's Mess Menu */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={18} className="text-primary-600 dark:text-primary-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Menu</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Saturday</span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-200">Breakfast (7:30 AM - 9:30 AM)</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Idli, Sambar, Coconut Chutney, Tea / Coffee</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-200">Lunch (12:30 PM - 2:30 PM)</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Paneer Butter Masala, Roti, Jeera Rice, Dal, Curd</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="font-bold text-slate-700 dark:text-slate-200">Dinner (7:30 PM - 9:30 PM)</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Veg Pulao, Raita, Mixed Veg Curry, Gulab Jamun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
