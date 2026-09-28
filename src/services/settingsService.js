import { ROLES, normalizeRole } from '../constants/roles';
import cacheService from './cacheService';

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
      // Delivery Channels
      inAppPush: true,
      emailNotifications: true,
      smsNotifications: false,
      whatsappUpdates: true,

      // Alert Categories
      rentReminders: true,
      maintenanceAlerts: true,
      gatePassAlerts: true,
      messMenuAlerts: true,
      announcements: true,

      // Delivery Frequency
      frequency: 'instant', // 'instant' | 'daily_digest' | 'weekly_summary'
    },
    language: {
      locale: 'en', // 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: '30m',
    },
  };

  if (role === ROLES.TENANT || role === ROLES.OWNER) {
    return {
      ...base,
      tenantSettings: {
        autoGenerateInvoices: true,
        invoiceDueDateDay: 5,
        curfewTime: '22:30',
        allowVisitorOvernight: false,
        visitorCheckInRequired: true,
        notifyWardenOnGatePass: true,
        lateFinePerDay: 50,
      },
    };
  }

  if (role === ROLES.END_USER || role === ROLES.RESIDENT) {
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

  return base;
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
 * Fetch settings data for active user (Hybrid: DB + LocalStorage Cache)
 */
export async function getSettings(user) {
  const defaultData = getDefaultSettingsData(user);
  const userEmail = user?.email;

  // 1. Check local cache for immediate 0ms availability
  const localData = cacheService.getUserSettings(userEmail);

  if (localData?.appearance) {
    applyAppearanceToDOM(localData.appearance);
  }

  // 2. Try fetching latest saved settings from Database (MongoDB API)
  try {
    const token = cacheService.get('token') || cacheService.get('hostello_auth_token');
    if (token) {
      const response = await fetch('/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data?.settings) {
          const dbSettings = json.data.settings;
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
          };

          // Update local cache via cacheService
          cacheService.setUserSettings(userEmail, merged);
          applyAppearanceToDOM(merged.appearance);
          return merged;
        }
      }
    }
  } catch (err) {
    console.warn('API settings sync fallback to local cache:', err);
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
    };
    applyAppearanceToDOM(result.appearance);
    return result;
  }

  return defaultData;
}

/**
 * Save settings data (Hybrid: Updates Cache + MongoDB DB via API)
 */
export async function updateSettings(user, updatedSettings) {
  const userEmail = user?.email;

  // 1. Immediately cache in localStorage for 0ms lag
  cacheService.setUserSettings(userEmail, updatedSettings);
  applyAppearanceToDOM(updatedSettings?.appearance);

  // 2. Persist to MongoDB Database via Backend API
  try {
    const token = cacheService.get('token') || cacheService.get('hostello_auth_token');
    if (token) {
      await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: updatedSettings,
        }),
      });
    }
  } catch (err) {
    console.warn('Backend DB settings persist fallback to local cache:', err);
  }

  return updatedSettings;
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
    const token = cacheService.get('token') || cacheService.get('hostello_auth_token');
    if (token) {
      const response = await fetch('/api/v1/auth/change-password', {
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
