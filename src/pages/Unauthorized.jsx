import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getDefaultRouteForRole, getRoleDisplayInfo } from '../auth/role.utils';
import { ShieldAlert, ArrowRight, LogOut, Home } from 'lucide-react';
import Button from '../components/ui/Button';

/**
 * Unauthorized (403) Page
 * ────────────────────────
 * Displayed when an authenticated user attempts to access a route restricted to another role.
 */
export default function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role;
  const roleInfo = getRoleDisplayInfo(userRole);
  const dashboardPath = getDefaultRouteForRole(userRole);
  const attemptedPath = location.state?.attemptedPath;

  const handleGoDashboard = () => {
    navigate(dashboardPath, { replace: true });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 text-center animate-scale-in">
        {/* Shield Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-amber-600 shadow-sm">
          <ShieldAlert size={32} />
        </div>

        {/* 403 Status code pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold mb-3">
          <span>HTTP 403 • ACCESS DENIED</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2 font-sans">
          Unauthorized Access
        </h1>

        {/* Explanation */}
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          You don&apos;t have permission to view this resource. This section is restricted to authorized roles.
        </p>

        {/* Current user session pill */}
        {user && (
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left mb-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Signed in as:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Your Current Role:</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${roleInfo.badgeClass}`}>
                {roleInfo.label}
              </span>
            </div>
            {attemptedPath && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[10px] text-slate-400">
                <span>Restricted path:</span>
                <span className="truncate max-w-[180px]">{attemptedPath}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoDashboard}
            className="w-full flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            leftIcon={Home}
            rightIcon={ArrowRight}
          >
            Go to Your Dashboard
          </Button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign out / Switch account</span>
          </button>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-400 relative z-10">
        &copy; {new Date().getFullYear()} Hostello RBAC Security Gateway
      </footer>
    </div>
  );
}
