import { ROLES, normalizeRole } from '../constants/roles';

/**
 * Authentication Service
 * ─────────────────────
 * Centralized API layer for authentication operations.
 * Replace the placeholder implementation with real API calls
 * once the backend is ready.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Development / Demo accounts for testing the 3 major roles:
 * 1. SUPER_ADMIN
 * 2. TENANT
 * 3. END_USER
 */
export const DEMO_ACCOUNTS = [
  {
    label: 'Super Admin',
    role: ROLES.SUPER_ADMIN,
    email: 'admin@hostello.com',
    password: 'Admin@123',
    name: 'Super Admin',
  },
  {
    label: 'Property Tenant',
    role: ROLES.TENANT,
    email: 'tenant@hostello.com',
    password: 'Tenant@123',
    name: 'Hostel Manager',
  },
  {
    label: 'Resident User',
    role: ROLES.END_USER,
    email: 'user@hostello.com',
    password: 'User@123',
    name: 'Resident User',
  },
  {
    label: 'Resident User (Alt)',
    role: ROLES.END_USER,
    email: 'resident@hostello.com',
    password: 'Resident@123',
    name: 'Rahul Sharma',
  },
];

/**
 * Log a user in with email + password.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function loginUser({ email, password }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const trimmedEmail = String(email || '').trim().toLowerCase();
  
  // Demo credential validation (dev only)
  const demo = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === trimmedEmail && a.password === password
  );

  if (demo) {
    const user = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      name: demo.name || demo.label,
      email: demo.email,
      role: demo.role,
      avatar: null,
    };

    return {
      user,
      token: `demo-jwt-${Date.now()}`,
    };
  }

  // Fallback demo for any other email during testing
  if (password === 'Password@123' || password.length >= 4) {
    let role = ROLES.END_USER;
    if (trimmedEmail.includes('admin')) role = ROLES.SUPER_ADMIN;
    else if (trimmedEmail.includes('tenant') || trimmedEmail.includes('manager')) role = ROLES.TENANT;

    const user = {
      id: `usr-${Date.now()}`,
      name: trimmedEmail.split('@')[0].replace(/[._-]/g, ' '),
      email: trimmedEmail,
      role,
      avatar: null,
    };

    return {
      user,
      token: `demo-jwt-${Date.now()}`,
    };
  }

  // Simulate auth failure for invalid credentials
  throw new Error('Invalid email or password. Please try again or use a demo account.');
}

/**
 * Register a new user.
 *
 * @param {{ name: string, email: string, password: string, phone?: string, role?: string }} userData
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function registerUser({ name, email, password, phone, role = 'Resident' }) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!email || !password || !name) {
    throw new Error('Please fill in all required fields.');
  }

  const normalizedRole = normalizeRole(role);

  const user = {
    id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
    name,
    email: String(email).trim().toLowerCase(),
    phone,
    role: normalizedRole,
    avatar: null,
  };

  return {
    user,
    token: `demo-jwt-reg-${Date.now()}`,
  };
}

/**
 * Log the current user out.
 */
export async function logoutUser() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true };
}

export default {
  loginUser,
  registerUser,
  logoutUser,
  DEMO_ACCOUNTS,
};
