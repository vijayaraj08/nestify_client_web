import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute
 * ──────────────
 * Route guard that ensures the user is authenticated before granting access.
 * Shows loading spinner while authentication is being restored.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <Loader2 size={36} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
