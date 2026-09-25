/**
 * Authentication Service
 * ─────────────────────
 * Centralised API layer for authentication operations.
 * Replace the placeholder implementation with real API calls
 * once the backend is ready.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Demo/dev accounts for testing.
 * These are NOT real production credentials.
 */
export const DEMO_ACCOUNTS = [
  {
    label: 'Admin Account',
    role: 'Admin',
    email: 'admin@nestify.com',
    password: 'Admin@123',
  },
  {
    label: 'Resident Account',
    role: 'Resident',
    email: 'resident@nestify.com',
    password: 'Resident@123',
  },
];

/**
 * Log a user in with email + password.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function loginUser({ email, password }) {
  // ── Placeholder: simulate network delay ──
  // Replace with a real fetch/axios call:
  //   const res = await fetch(`${API_BASE_URL}/auth/login`, { ... });
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Demo credential validation (dev only)
  const demo = DEMO_ACCOUNTS.find(
    (a) => a.email === email && a.password === password,
  );

  if (demo) {
    return {
      user: {
        id: crypto.randomUUID(),
        name: demo.label.replace(' Account', ''),
        email: demo.email,
        role: demo.role,
      },
      token: `demo-jwt-${Date.now()}`,
    };
  }

  // Simulate auth failure for unknown credentials
  throw new Error('Invalid email or password. Please try again.');
}

/**
 * Register a new user.
 *
 * @param {{ name: string, email: string, password: string, phone?: string, role?: string }} userData
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function registerUser({ name, email, password, phone, role = 'Resident' }) {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (!email || !password || !name) {
    throw new Error('Please fill in all required fields.');
  }

  return {
    user: {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      role,
    },
    token: `demo-jwt-reg-${Date.now()}`,
  };
}

/**
 * Log the current user out.
 */
export async function logoutUser() {
  // Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
}

export default {
  loginUser,
  registerUser,
  logoutUser,
  DEMO_ACCOUNTS,
};

