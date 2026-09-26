import { useLocation } from 'react-router-dom';
import { Layers, CheckCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { getRoleDisplayInfo } from '../auth/role.utils';

export default function GenericPage({ title, description }) {
  const { role, user } = useAuth();
  const location = useLocation();
  const roleInfo = getRoleDisplayInfo(role);

  // Derive title from pathname if not explicitly passed
  const pathParts = location.pathname.split('/').filter(Boolean);
  const routeName =
    title ||
    pathParts[pathParts.length - 1]
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') ||
    'Section View';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
            {roleInfo.label}
          </span>
          <span className="text-xs text-slate-400 font-mono">{location.pathname}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">{routeName}</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {description ||
            `Manage and view ${routeName.toLowerCase()} records, settings, and updates configured for your account.`}
        </p>
      </div>

      {/* Main Content Placeholder Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <div className="max-w-xl mx-auto text-center py-6">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100">
            <Layers size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {routeName} Module
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            This module is fully RBAC protected and assigned to <strong className="text-slate-800">{roleInfo.label}</strong> permissions.
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>Authenticated Role:</span>
              <span className="font-bold text-primary-700 font-mono">{role}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>User Email:</span>
              <span className="text-slate-800 font-mono">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>Route Path:</span>
              <span className="text-slate-800 font-mono">{location.pathname}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>RBAC Guard Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle size={14} /> Authorized & Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
