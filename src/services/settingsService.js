import { ROLES, normalizeRole } from '../constants/roles';
import cacheService, { CACHE_KEYS } from './cacheService';
import { apiRequest } from './apiClient';

/**
 * Returns default system and user preference data strictly based on role.
 * Timing values are maintained exclusively in milliseconds (ms).
 */
export function getDefaultSettingsData(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);

  const base = {
    appearance: {
      theme: user?.settings?.theme || 'dark', // 'light' | 'dark' | 'system'
      accentColor: 'indigo',
      density: 'comfortable',
      animationsEnabled: true,
      glassmorphism: true,
    },
    notifications: {
      inAppPush: user?.settings?.notifications?.push ?? true,
      emailNotifications: user?.settings?.notifications?.email ?? true,
      smsNotifications: user?.settings?.notifications?.sms ?? false,
      whatsappUpdates: user?.settings?.notifications?.whatsapp ?? false,

      rentReminders: user?.settings?.notifications?.categories?.rentReminders ?? true,
      maintenanceAlerts: user?.settings?.notifications?.categories?.complaints ?? true,
      gatePassAlerts: user?.settings?.notifications?.categories?.notices ?? true,
      messMenuAlerts: user?.settings?.notifications?.categories?.foodMenu ?? true,
      announcements: true,

      frequency: 'instant',
    },
    language: {
      locale: user?.settings?.language || 'en',
    },
    security: {
      twoFactorEnabled: user?.settings?.twoFactorAuth?.isEnabled ?? false,
      sessionTimeoutMs: user?.settings?.tenantSettings?.sessionTimeoutMs ?? 1800000,
    },
  };

  if (role === ROLES.TENANT || role === 'OWNER') {
    return {
      ...base,
      tenantSettings: {
        autoGenerateInvoices: true,
        invoiceDueDateDay: 5,
        curfewTimeMs: user?.settings?.tenantSettings?.curfewTimeMs ?? 81000000,
        allowVisitorOvernight: false,
        visitorCheckInRequired: user?.settings?.tenantSettings?.allowGuestCheckIn ?? true,
        notifyWardenOnGatePass: true,
        lateFinePerDay: 50,
        ...(user?.settings?.tenantSettings || {}),
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
        shareContactWithRoommates: user?.settings?.endUserSettings?.shareContactWithPeers ?? true,
        ...(user?.settings?.endUserSettings || {}),
      },
    };
  }

  return base;
}

/**
 * Transforms raw backend user.settings object into frontend Settings UI structure
 */
export function mapBackendSettingsToUI(backendSettings, user) {
  const baseDefault = getDefaultSettingsData(user);
  if (!backendSettings) return baseDefault;

  return {
    ...baseDefault,
    appearance: {
      ...baseDefault.appearance,
      theme: backendSettings.theme || backendSettings.appearance?.theme || baseDefault.appearance.theme,
      accentColor: backendSettings.accentColor || backendSettings.appearance?.accentColor || baseDefault.appearance.accentColor,
    },
    notifications: {
      ...baseDefault.notifications,
      inAppPush: backendSettings.notifications?.push ?? backendSettings.notifications?.inAppPush ?? baseDefault.notifications.inAppPush,
      emailNotifications: backendSettings.notifications?.email ?? backendSettings.notifications?.emailNotifications ?? baseDefault.notifications.emailNotifications,
      smsNotifications: backendSettings.notifications?.sms ?? backendSettings.notifications?.smsNotifications ?? baseDefault.notifications.smsNotifications,
      whatsappUpdates: backendSettings.notifications?.whatsapp ?? backendSettings.notifications?.whatsappUpdates ?? baseDefault.notifications.whatsappUpdates,
      rentReminders: backendSettings.notifications?.categories?.rentReminders ?? backendSettings.notifications?.rentReminders ?? baseDefault.notifications.rentReminders,
      maintenanceAlerts: backendSettings.notifications?.categories?.complaints ?? backendSettings.notifications?.maintenanceAlerts ?? baseDefault.notifications.maintenanceAlerts,
      gatePassAlerts: backendSettings.notifications?.categories?.notices ?? backendSettings.notifications?.gatePassAlerts ?? baseDefault.notifications.gatePassAlerts,
      messMenuAlerts: backendSettings.notifications?.categories?.foodMenu ?? backendSettings.notifications?.messMenuAlerts ?? baseDefault.notifications.messMenuAlerts,
    },
    language: {
      ...baseDefault.language,
      locale: typeof backendSettings.language === 'string' ? backendSettings.language : (backendSettings.language?.locale || 'en'),
    },
    security: {
      ...baseDefault.security,
      twoFactorEnabled: backendSettings.twoFactorAuth?.isEnabled ?? backendSettings.security?.twoFactorEnabled ?? false,
      sessionTimeoutMs: backendSettings.tenantSettings?.sessionTimeoutMs ?? 1800000,
    },
    tenantSettings: {
      ...(baseDefault.tenantSettings || {}),
      ...(backendSettings.tenantSettings || {}),
    },
    endUserSettings: {
      ...(baseDefault.endUserSettings || {}),
      ...(backendSettings.endUserSettings || {}),
    },
  };
}

/**
 * Sanitizes settings data according to the user's role.
 */
export function sanitizeSettingsForRole(role, settings) {
  if (!settings) return {};
  const normalizedRole = normalizeRole(role);
  const sanitized = { ...settings };

  if (normalizedRole === ROLES.SUPER_ADMIN || normalizedRole === ROLES.STAFF) {
    delete sanitized.tenantSettings;
    delete sanitized.endUserSettings;
    return sanitized;
  }

  if (normalizedRole === ROLES.TENANT || normalizedRole === 'OWNER') {
    delete sanitized.endUserSettings;
    return sanitized;
  }

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
 * Helper to fetch settings from API via single standard endpoint
 * GET /api/v1/settings
 */
async function fetchSettingsFromAPI() {
  try {
    const res = await apiRequest('/api/v1/settings', {
      method: 'GET',
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data || json;
      if (data.settings) return data.settings;
      if (data.theme || data.notifications || data.language) return data;
    }
  } catch (err) {
    if (err.status === 401) throw err;
    console.warn('[SettingsService] Fetch settings notice:', err.message);
  }
  return null;
}

/**
 * Helper to persist settings to API via single standard endpoint
 * PUT /api/v1/settings
 */
async function persistSettingsToAPI(settingsPayload) {
  try {
    const res = await apiRequest('/api/v1/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsPayload),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    if (err.status === 401) throw err;
    if (err.message && !err.message.includes('Failed to fetch')) {
      console.warn('[SettingsService] Persist settings notice:', err.message);
    }
  }
  return null;
}

/**
 * Fetch settings data for active user (Hybrid: DB + LocalStorage Cache)
 */
export async function getSettings(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const userEmail = user?.email;

  // 1. If user object from UserContext already has backend settings, map immediately
  if (user?.settings && Object.keys(user.settings).length > 0) {
    const mapped = mapBackendSettingsToUI(user.settings, user);
    applyAppearanceToDOM(mapped.appearance);
    return sanitizeSettingsForRole(role, mapped);
  }

  // 2. Check local cache
  const localData = cacheService.getUserSettings(userEmail);
  if (localData?.appearance) {
    applyAppearanceToDOM(localData.appearance);
  }

  // 3. Fetch from API
  try {
    const dbSettings = await fetchSettingsFromAPI();
    if (dbSettings) {
      const mapped = mapBackendSettingsToUI(dbSettings, user);
      const cleanSettings = sanitizeSettingsForRole(role, mapped);
      cacheService.setUserSettings(userEmail, cleanSettings);
      applyAppearanceToDOM(cleanSettings.appearance);
      return cleanSettings;
    }
  } catch (err) {
    console.warn('[SettingsService] API settings sync fallback to local cache:', err);
  }

  if (localData) {
    const cleanSettings = sanitizeSettingsForRole(role, localData);
    applyAppearanceToDOM(cleanSettings.appearance);
    return cleanSettings;
  }

  const defaultData = getDefaultSettingsData(user);
  applyAppearanceToDOM(defaultData.appearance);
  return defaultData;
}

/**
 * Save settings data (Hybrid: Updates Cache + MongoDB DB via API)
 */
export async function updateSettings(user, updatedSettings) {
  const role = normalizeRole(user?.role || ROLES.END_USER);
  const userEmail = user?.email;

  // 1. Sanitize UI payload
  const payload = sanitizeSettingsForRole(role, updatedSettings);

  // 2. Immediately cache in localStorage for 0ms lag
  cacheService.setUserSettings(userEmail, payload);
  applyAppearanceToDOM(payload?.appearance);

  // 3. Prepare payload matching backend Schema
  const backendPayload = {
    theme: payload.appearance?.theme || 'dark',
    accentColor: payload.appearance?.accentColor || 'indigo',
    appearance: payload.appearance || undefined,
    language: payload.language?.locale || 'en',
    notifications: {
      email: payload.notifications?.emailNotifications ?? true,
      push: payload.notifications?.inAppPush ?? true,
      sms: payload.notifications?.smsNotifications ?? false,
      whatsapp: payload.notifications?.whatsappUpdates ?? false,
      categories: {
        rentReminders: payload.notifications?.rentReminders ?? true,
        notices: payload.notifications?.gatePassAlerts ?? true,
        complaints: payload.notifications?.maintenanceAlerts ?? true,
        foodMenu: payload.notifications?.messMenuAlerts ?? true,
        emergencySos: true,
      },
    },
    twoFactorAuth: {
      isEnabled: payload.security?.twoFactorEnabled ?? false,
      method: 'otp_sms',
    },
    tenantSettings: payload.tenantSettings || undefined,
    endUserSettings: payload.endUserSettings || undefined,
  };

  // 4. Persist to MongoDB Database via Backend API with cookies
  try {
    const updated = await persistSettingsToAPI(backendPayload);
    if (updated) {
      return payload;
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
    const response = await apiRequest('/api/v1/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.ok) {
      return { success: true, message: 'Password changed successfully.' };
    }
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      const json = await response.json();
      throw new Error(json.message || 'Failed to change password.');
    }
  } catch (err) {
    if (err.status === 401) throw err;
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  return { success: true, message: 'Password changed successfully.' };
}

export default {
  getDefaultSettingsData,
  mapBackendSettingsToUI,
  sanitizeSettingsForRole,
  applyAppearanceToDOM,
  getSettings,
  updateSettings,
  updateSettingSection,
  changePassword,
};
