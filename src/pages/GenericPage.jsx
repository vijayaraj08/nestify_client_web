import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getRoleDisplayInfo } from '../auth/role.utils';

export default function GenericPage({ title }) {
  const { role, user } = useAuth();
  const location = useLocation();
  const roleInfo = getRoleDisplayInfo(role);

  const [searchTerm, setSearchTerm] = useState('');

  // Derive title from pathname if not explicitly passed
  const pathParts = location.pathname.split('/').filter(Boolean);
  const routeName =
    title ||
    pathParts[pathParts.length - 1]
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') ||
    'Section View';

  // Sample data records for enterprise view
  const sampleRecords = [
    { id: 'REC-001', name: `${routeName} Record A`, reference: 'REF-8902', status: 'Active', updated: 'Today, 11:30 AM', priority: 'High' },
    { id: 'REC-002', name: `${routeName} Record B`, reference: 'REF-8903', status: 'Pending', updated: 'Yesterday, 04:15 PM', priority: 'Medium' },
    { id: 'REC-003', name: `${routeName} Record C`, reference: 'REF-8904', status: 'Active', updated: '24 Sep 2026', priority: 'Low' },
    { id: 'REC-004', name: `${routeName} Record D`, reference: 'REF-8905', status: 'In Review', updated: '22 Sep 2026', priority: 'High' },
  ];

  return (
    <div className="w-full space-y-4 pb-8">
      {/* ── Action Toolbar (Search, Filter, Actions) ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search across ${routeName.toLowerCase()}...`}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Filter size={14} className="text-slate-500" />
            <span>Filter</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Download size={14} className="text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>New {routeName.replace(/s$/, '')}</span>
          </button>
        </div>
      </div>

      {/* ── Enterprise Records Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{routeName} Overview</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
              4 Records
            </span>
          </div>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4 font-semibold">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
                    <span>ID / Item</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Reference</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {sampleRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="flex flex-col">
                      <span>{rec.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{rec.id}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                    {rec.reference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        rec.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : rec.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}
                    >
                      {rec.status === 'Active' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="text-xs font-medium">{rec.priority}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs">
                    {rec.updated}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4">
          <span>Scope: <strong>{roleInfo.label}</strong> • User: {user?.email}</span>
          <span className="font-mono text-slate-400">{location.pathname}</span>
        </div>
      </div>
    </div>
  );
}
