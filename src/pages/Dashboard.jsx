import { useAuth } from '../auth/AuthContext';
import { ROLES, normalizeRole } from '../constants/roles';
import {
  SuperAdminDashboardSections,
  TenantDashboardSections,
  EndUserDashboardSections,
} from '../components/dashboard';

/**
 * Unified Role-Aware Dashboard Page
 * ─────────────────────────────────
 * Centralized dashboard component that renders role-specific UI sections
 * dynamically based on the authenticated user's role:
 *
 * - SUPER_ADMIN → SuperAdminDashboardSections
 * - TENANT      → TenantDashboardSections
 * - END_USER    → EndUserDashboardSections
 */
export default function Dashboard({ role: explicitRole }) {
  const { user, role: authRole } = useAuth();
  const effectiveRole = normalizeRole(explicitRole || authRole || user?.role);

  switch (effectiveRole) {
    case ROLES.SUPER_ADMIN:
      return <SuperAdminDashboardSections user={user} />;

    case ROLES.TENANT:
      return <TenantDashboardSections user={user} />;

    case ROLES.END_USER:
    default:
      return <EndUserDashboardSections user={user} />;
  }
}
