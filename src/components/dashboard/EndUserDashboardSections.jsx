import {
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  Wifi,
  Calendar,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';
import DashboardHero from './DashboardHero';
import KpiCard from './KpiCard';

export default function EndUserDashboardSections({ user }) {
  return (
    <div className="space-y-6">
      {/* Reusable Hero Banner */}
      <DashboardHero
        badgeText="Resident Member Portal"
        badgeVariant="indigo"
        subtext="Sunshine Grand Hostel (Room 204 - Bed B)"
        title={`Hi, ${user?.name || 'Resident'} 👋`}
        description="View your stay details, pay monthly rent, raise maintenance tickets, and check meal menus."
        actionButton={
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <CreditCard size={18} />
            <span>Pay Rent ₹8,500</span>
          </button>
        }
      />

      {/* Snapshot Cards */}
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

      {/* Grid: Services & Today's Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Resident Amenities & Quick Access */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">
            Hostel Services & Amenities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                <Wifi size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Hostel High-Speed Wi-Fi</h3>
                <p className="text-xs text-slate-500 mt-0.5">SSID: <span className="font-mono text-slate-700 font-semibold">Hostello_Resident_5G</span></p>
                <p className="text-xs text-slate-500">Password: <span className="font-mono text-slate-700 font-semibold">Sunshine@2026</span></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Gate Pass & Leave Request</h3>
                <p className="text-xs text-slate-500 mt-0.5">Standard Curfew: 10:30 PM</p>
                <button type="button" className="text-xs font-semibold text-primary-600 hover:text-primary-700 mt-1 cursor-pointer">
                  Request Night Out Pass →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 col: Today's Mess Menu */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={18} className="text-primary-600" />
              <h2 className="text-base font-bold text-slate-900">Today's Menu</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">Saturday</span>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-700">Breakfast (7:30 AM - 9:30 AM)</span>
              <p className="text-slate-500 mt-0.5">Idli, Sambar, Coconut Chutney, Tea / Coffee</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-700">Lunch (12:30 PM - 2:30 PM)</span>
              <p className="text-slate-500 mt-0.5">Paneer Butter Masala, Roti, Jeera Rice, Dal, Curd</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-700">Dinner (7:30 PM - 9:30 PM)</span>
              <p className="text-slate-500 mt-0.5">Veg Pulao, Raita, Mixed Veg Curry, Gulab Jamun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
