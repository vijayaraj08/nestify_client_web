import { ROLES, normalizeRole } from '../constants/roles';

/**
 * Returns the default dashboard landing path for a given role.
 *
 * @param {string} role
 * @returns {string}
 */
export function getDefaultRouteForRole(role) {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case ROLES.SUPER_ADMIN:
      return '/admin/dashboard';
    case ROLES.TENANT:
      return '/tenant/dashboard';
    case ROLES.END_USER:
      return '/user/dashboard';
    default:
      return '/login';
  }
}

/**
 * Checks if a user's role satisfies the required roles.
 *
 * @param {string} userRole
 * @param {string|string[]} allowedRoles
 * @returns {boolean}
 */
export function hasRequiredRole(userRole, allowedRoles) {
  if (!userRole) return false;
  if (!allowedRoles || (Array.isArray(allowedRoles) && allowedRoles.length === 0)) {
    return true; // No restriction
  }
  
  const normalizedUserRole = normalizeRole(userRole);
  const normalizedAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.map(normalizeRole)
    : [normalizeRole(allowedRoles)];
    
  return normalizedAllowed.includes(normalizedUserRole);
}

/**
 * Returns a UI badge styling variant for a given role.
 *
 * @param {string} role
 * @returns {{ label: string, badgeClass: string }}
 */
export function getRoleDisplayInfo(role) {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case ROLES.SUPER_ADMIN:
      return {
        label: 'Super Admin',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      };
    case ROLES.TENANT:
      return {
        label: 'Property Tenant',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case ROLES.END_USER:
    default:
      return {
        label: 'Resident / User',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
  }
}
