import { ROLES, normalizeRole } from '../constants/roles';
import { superAdminNavigation } from './superAdminNavigation';
import { tenantNavigation } from './tenantNavigation';
import { endUserNavigation } from './endUserNavigation';

export const navigationRegistry = {
  [ROLES.SUPER_ADMIN]: superAdminNavigation,
  [ROLES.TENANT]: tenantNavigation,
  [ROLES.END_USER]: endUserNavigation,
};

/**
 * Returns the navigation items applicable for a given user role.
 * Filters items if item.roles is defined and doesn't match normalized role.
 *
 * @param {string} role
 * @returns {Array} Navigation items list
 */
export function getNavigationForRole(role) {
  const normalized = normalizeRole(role);
  const items = navigationRegistry[normalized] || [];

  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(normalized);
  });
}
