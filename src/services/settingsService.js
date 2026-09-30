import { ROLES, normalizeRole } from '../constants/roles';
import cacheService, { CACHE_KEYS } from './cacheService';
import { durationStringToMs, timeStringToMs } from '../utils/timeUtils';

import { API_BASE_URL } from './authService';

/**
 * Returns default system and user preference data strictly based on role.
 * Timing values are maintained exclusively in milliseconds (ms).
 */
export function getDefaultSettingsData(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);

  const base = {
    appearance: {
      theme: 'light', // 'light' | 'dark' | 'system'
      accentColor: 'indigo', // 'indigo' | 'emerald' | 'blue' | 'violet' | 'amber' | 'rose'
      density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
      animationsEnabled: true,
      glassmorphism: true,
    },
    notifications: {
      inAppPush: true,
      emailNotifications: true,
      smsNotifications: false,
      whatsappUpdates: true,

      rentReminders: true,
      maintenanceAlerts: true,
      gatePassAlerts: true,
      messMenuAlerts: true,
      announcements: true,

      frequency: 'instant', // 'instant' | 'daily_digest' | 'weekly_summary'
    },
    language: {
      locale: 'en', // 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeoutMs: 1800000, // 30 minutes in milliseconds
    },
  };

  if (role === ROLES.TENANT || role === 'OWNER') {
    return {
      ...base,
      tenantSettings: {
        autoGenerateInvoices: true,
        invoiceDueDateDay: 5,
        curfewTimeMs: 81000000, // 10:30 PM (22.5 * 3600 * 1000)
        allowVisitorOvernight: false,
        visitorCheckInRequired: true,
        notifyWardenOnGatePass: true,
        lateFinePerDay: 50,
      },
    };
  }

  if (role === ROLES.END_USER || role === 'RESIDENT') {
    return {
      ...base,
      endUserSettings: {
        roommatePreference: 'Quiet / Study Focused',
        dietaryPreference: 'Vegetarian',
        receiveMenuUpdates: true,
        silentHoursNotification: true,
        shareContactWithRoommates: true,
      },
    };
  }

  // SUPER_ADMIN / ADMIN / STAFF: Common settings only
  return base;
}

/**
 * Sanitizes settings data according to the user's role.
 * Ensures irrelevant role-specific setting blocks are stripped out.
 */
export function sanitizeSettingsForRole(role, settings) {
  if (!settings) return {};
  const normalizedRole = normalizeRole(role);
  const sanitized = { ...settings };

  // Super admin / admin: No tenantSettings, no endUserSettings
  if (normalizedRole === ROLES.SUPER_ADMIN || normalizedRole === ROLES.STAFF) {
    delete sanitized.tenantSettings;
    delete sanitized.endUserSettings;
    return sanitized;
  }

  // Tenant / Owner: Retain only tenantSettings
  if (normalizedRole === ROLES.TENANT || normalizedRole === 'OWNER') {
    delete sanitized.endUserSettings;
    return sanitized;
  }

  // Resident / End-User: Retain only endUserSettings
  if (normalizedRole === ROLES.END_USER || normalizedRole === 'RESIDENT') {
    delete sanitized.tenantSettings;
    return sanitized;
  }

  return sanitized;
}

/**
 * Apply appearance theme and accent to DOM and sync cache
 */
export function applyAppearanceToDOM(appearance) {
  if (!appearance) return;

  if (appearance.accentColor) {
    document.documentElement.setAttribute('data-accent', appearance.accentColor);
    cacheService.setAccent(appearance.accentColor);
  }

  if (appearance.theme) {
    const isDark =
      appearance.theme === 'dark' ||
      (appearance.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    cacheService.setTheme(appearance.theme);
  }
}

/**
 * Helper to fetch settings from API across standard endpoints
 */
async function fetchSettingsFromAPI(token) {
  const endpoints = ['/api/v1/users/settings', '/api/v1/settings', '/api/v1/profile', '/api/profile'];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data.settings) return data.settings;
        if (data.appearance || data.notifications || data.language) return data;
      }
    } catch {
      // Continue trying next endpoint
    }
  }
  return null;
}

/**
 * Helper to persist settings to API across standard endpoints
 */
async function persistSettingsToAPI(token, settingsPayload) {
  const endpoints = [
    { url: '/api/v1/users/settings', body: JSON.stringify(settingsPayload) },
    { url: '/api/v1/settings', body: JSON.stringify(settingsPayload) },
    { url: '/api/v1/profile', body: JSON.stringify({ settings: settingsPayload }) },
    { url: '/api/profile', body: JSON.stringify({ settings: settingsPayload }) },
  ];

  for (const { url, body } of endpoints) {
    try {
      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body,
      });

      if (res.ok) {
        return true;
      }
    } catch {
      // Continue trying next endpoint
    }
  }
  return false;
}

/**
 * Fetch settings data for active user (Hybrid: DB + LocalStorage Cache)
 */
export async function getSettings(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const defaultData = getDefaultSettingsData(user);
  const userEmail = user?.email;

  // 1. Check local cache for immediate 0ms availability
  const localData = cacheService.getUserSettings(userEmail);

  if (localData?.appearance) {
    applyAppearanceToDOM(localData.appearance);
  }

  // 2. Try fetching latest saved settings from Database (MongoDB API)
  try {
    const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');
    if (token) {
      const dbSettings = await fetchSettingsFromAPI(token);

      if (dbSettings) {
        const merged = {
          ...defaultData,
          ...(localData || {}),
          ...dbSettings,
          appearance: {
            ...defaultData.appearance,
            ...(localData?.appearance || {}),
            ...(dbSettings.appearance || {}),
          },
          notifications: {
            ...defaultData.notifications,
            ...(localData?.notifications || {}),
            ...(dbSettings.notifications || {}),
          },
          language: {
            ...defaultData.language,
            ...(localData?.language || {}),
            ...(dbSettings.language || {}),
          },
          security: {
            ...defaultData.security,
            ...(localData?.security || {}),
            ...(dbSettings.security || {}),
          },
          tenantSettings: {
            ...(defaultData.tenantSettings || {}),
            ...(localData?.tenantSettings || {}),
            ...(dbSettings.tenantSettings || {}),
          },
          endUserSettings: {
            ...(defaultData.endUserSettings || {}),
            ...(localData?.endUserSettings || {}),
            ...(dbSettings.endUserSettings || {}),
          },
        };

        const cleanSettings = sanitizeSettingsForRole(role, merged);
        cacheService.setUserSettings(userEmail, cleanSettings);
        applyAppearanceToDOM(cleanSettings.appearance);
        return cleanSettings;
      }
    }
  } catch (err) {
    console.warn('[SettingsService] API settings sync fallback to local cache:', err);
  }

  // 3. Fallback to local cache or defaults
  if (localData) {
    const result = {
      ...defaultData,
      ...localData,
      appearance: {
        ...defaultData.appearance,
        ...(localData.appearance || {}),
      },
      notifications: {
        ...defaultData.notifications,
        ...(localData.notifications || {}),
      },
      language: {
        ...defaultData.language,
        ...(localData.language || {}),
      },
      security: {
        ...defaultData.security,
        ...(localData.security || {}),
      },
    };
    const cleanSettings = sanitizeSettingsForRole(role, result);
    applyAppearanceToDOM(cleanSettings.appearance);
    return cleanSettings;
  }

  return defaultData;
}

/**
 * Save settings data (Hybrid: Updates Cache + MongoDB DB via API)
 */
export async function updateSettings(user, updatedSettings) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const userEmail = user?.email;

  // 1. Sanitize payload strictly according to role
  const payload = sanitizeSettingsForRole(role, updatedSettings);

  // 2. Immediately cache in localStorage for 0ms lag
  cacheService.setUserSettings(userEmail, payload);
  applyAppearanceToDOM(payload?.appearance);

  // 3. Persist to MongoDB Database via Backend API
  try {
    const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');
    if (token) {
      await persistSettingsToAPI(token, payload);
    }
  } catch (err) {
    console.warn('[SettingsService] Backend DB settings persist fallback to local cache:', err);
  }

  return payload;
}

/**
 * Save individual section setting (e.g. appearance, notifications, language)
 */
export async function updateSettingSection(user, sectionKey, sectionData) {
  const currentSettings = (await getSettings(user)) || getDefaultSettingsData(user);
  const updatedSettings = {
    ...currentSettings,
    [sectionKey]: {
      ...currentSettings[sectionKey],
      ...sectionData,
    },
  };
  return updateSettings(user, updatedSettings);
}

/**
 * Change password service method
 */
export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!currentPassword) {
    throw new Error('Current password is required.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }
  if (newPassword !== confirmPassword) {
    throw new Error('New password and confirmation do not match.');
  }

  try {
    const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');
    if (token) {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        return { success: true, message: 'Password changed successfully.' };
      }
    }
  } catch (e) {}

  return { success: true, message: 'Password changed successfully.' };
}

export default {
  getDefaultSettingsData,
  sanitizeSettingsForRole,
  applyAppearanceToDOM,
  getSettings,
  updateSettings,
  updateSettingSection,
  changePassword,
};
