import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasRequiredRole } from './role.utils';
import { Loader2 } from 'lucide-react';

/**
 * RoleRoute
 * ─────────
 * Role-Based Access Control route guard.
 * Checks authentication first, then validates user role against allowedRoles.
 *
 * @param {{ allowedRoles: string|string[], children?: React.ReactNode }} props
 */
export default function RoleRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <Loader2 size={36} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Checking permissions...</p>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but unauthorized for this role -> redirect to 403 unauthorized page
  if (!hasRequiredRole(user.role, allowedRoles)) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

  return children ? children : <Outlet />;
}
