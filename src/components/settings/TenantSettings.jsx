import { Building2, Receipt, Clock } from 'lucide-react';

export default function TenantSettings({ settings, onChange }) {
  const ts = settings?.tenantSettings || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" />
            Hostel Operations & Business Rules
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated rent cycles, visitor policies, and curfew restrictions for your hostel.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          Tenant Settings
        </span>
      </div>

      <div className="space-y-5">
        {/* Invoicing Cycle */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <Receipt size={14} className="text-emerald-600" />
            Automated Billing & Late Fee
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Auto-Generate Monthly Invoices</p>
                <p className="text-[11px] text-slate-500">Create rent drafts on 1st of every month</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ts.autoGenerateInvoices ?? true}
                  onChange={(e) => onChange?.('tenantSettings', 'autoGenerateInvoices', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rent Due Day (Monthly)
              </label>
              <select
                value={ts.invoiceDueDateDay || 5}
                onChange={(e) => onChange?.('tenantSettings', 'invoiceDueDateDay', Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
              >
                <option value={1}>1st of month</option>
                <option value={5}>5th of month (Standard)</option>
                <option value={10}>10th of month</option>
                <option value={15}>15th of month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Curfew & Visitor Policy */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
            <Clock size={14} className="text-primary-600" />
            Curfew & Gate Pass Rules
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Evening Curfew Time
              </label>
              <input
                type="time"
                value={ts.curfewTime || '22:30'}
                onChange={(e) => onChange?.('tenantSettings', 'curfewTime', e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white text-slate-800"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Notify Warden on Late Check-in</p>
                <p className="text-[11px] text-slate-500">Send push notification to floor warden</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ts.notifyWardenOnGatePass ?? true}
                  onChange={(e) => onChange?.('tenantSettings', 'notifyWardenOnGatePass', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
