import { useState } from 'react';
import { KeyRound, Shield, Building2, User, ChevronDown } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../services/authService';
import { ROLES, ROLE_LABELS } from '../../constants/roles';

/**
 * DemoCredentials
 * ───────────────
 * Development-only demo credentials helper with liquid glassmorphic styling.
 */
export default function DemoCredentials({ onSelectAccount }) {
  const [isOpen, setIsOpen] = useState(false);

  // Show unique roles accounts
  const demoList = [
    DEMO_ACCOUNTS.find((a) => a.role === ROLES.SUPER_ADMIN),
    DEMO_ACCOUNTS.find((a) => a.role === ROLES.TENANT),
    DEMO_ACCOUNTS.find((a) => a.role === ROLES.END_USER),
  ].filter(Boolean);

  const getRoleIcon = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return <Shield size={12} className="text-primary-600 shrink-0" />;
      case ROLES.TENANT:
        return <Building2 size={12} className="text-indigo-600 shrink-0" />;
      case ROLES.END_USER:
      default:
        return <User size={12} className="text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div className="pt-2 border-t border-black/[0.06] mt-2 select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-xl hover:bg-white/50 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          <KeyRound size={13} className="text-indigo-600" />
          <span>Quick Demo Accounts (Dev / Testing)</span>
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 p-2.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-md animate-fade-in">
          {demoList.map((acc) => {
            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => onSelectAccount(acc)}
                className="text-left p-2.5 rounded-xl bg-white/80 hover:bg-white border border-white/90 hover:border-indigo-300 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-[11px] text-slate-800 group-hover:text-indigo-600 truncate flex items-center gap-1">
                    {getRoleIcon(acc.role)}
                    {ROLE_LABELS[acc.role] || acc.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono truncate">
                  {acc.email}
                </div>
                <div className="text-[9px] text-indigo-600 font-medium mt-1">
                  Password: <span className="font-mono text-slate-700">{acc.password}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
