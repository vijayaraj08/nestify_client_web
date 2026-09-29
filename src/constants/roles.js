/**
 * Hostello Application Roles
 * ──────────────────────────
 * Centralized constant definitions for Role-Based Access Control (RBAC).
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT: 'TENANT',
  END_USER: 'END_USER',
  STAFF: 'STAFF',
};

/**
 * Human-readable role labels
 */
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.TENANT]: 'Property Tenant / Owner',
  [ROLES.END_USER]: 'Resident / User',
  [ROLES.STAFF]: 'Hostel Staff Member',
};

/**
 * Normalizes any legacy or mixed-case role strings into standard ROLES enum.
 * E.g., "Admin" -> "SUPER_ADMIN", "Resident" -> "END_USER", "Tenant" -> "TENANT", "Staff" -> "STAFF".
 *
 * @param {string} role
 * @returns {string}
 */
export function normalizeRole(role) {
  if (!role) return ROLES.END_USER;
  const upper = String(role).trim().toUpperCase().replace(/[\s-]/g, '_');
  
  if (upper === 'ADMIN' || upper === 'SUPER_ADMIN' || upper === 'SUPERADMIN') {
    return ROLES.SUPER_ADMIN;
  }
  if (upper === 'TENANT' || upper === 'PROPERTY_MANAGER' || upper === 'OWNER') {
    return ROLES.TENANT;
  }
  if (upper === 'STAFF' || upper === 'WARDEN' || upper === 'HOUSEKEEPING' || upper === 'MAINTENANCE') {
    return ROLES.STAFF;
  }
  if (upper === 'RESIDENT' || upper === 'USER' || upper === 'END_USER' || upper === 'STUDENT') {
    return ROLES.END_USER;
  }
  
  return ROLES[upper] || ROLES.END_USER;
}
