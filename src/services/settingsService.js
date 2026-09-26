import { ROLES, normalizeRole } from '../constants/roles';

const STORAGE_SETTINGS_KEY = 'hostello_user_settings_data';

export function getDefaultSettingsData(user) {
  const role = normalizeRole(user?.role || ROLES.END_USER);

  const base = {
    appearance: {
      theme: 'light', // 'light' | 'dark' | 'system'
      accentColor: 'indigo',
      sidebarCondensed: false,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      rentReminders: true,
      maintenanceAlerts: true,
      announcements: true,
    },
    language: {
      locale: 'en',
      timezone: 'Asia/Kolkata (IST)',
      dateFormat: 'DD/MM/YYYY',
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: '30m',
    },
  };

  if (role === ROLES.TENANT) {
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

  if (role === ROLES.END_USER) {
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

  // Super Admin
  return {
    ...base,
    adminSettings: {
      platformMaintenanceMode: false,
      requireTenantKycBeforeLive: true,
      autoAuditLogRetentionDays: 90,
      platformFeePercentage: 2.5,
    },
  };
}

/**
 * Fetch settings data for active user
 */
export async function getSettings(user) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  try {
    const saved = localStorage.getItem(`${STORAGE_SETTINGS_KEY}_${user?.email}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Could not read cached settings:', err);
  }
  return getDefaultSettingsData(user);
}

/**
 * Save settings data
 */
export async function updateSettings(user, updatedSettings) {
  await new Promise((resolve) => setTimeout(resolve, 450));
  try {
    localStorage.setItem(
      `${STORAGE_SETTINGS_KEY}_${user?.email}`,
      JSON.stringify(updatedSettings)
    );
  } catch (err) {
    console.warn('Could not cache settings:', err);
  }
  return updatedSettings;
}

/**
 * Change password service method
 */
export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!currentPassword) {
    throw new Error('Current password is required');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }
  if (newPassword !== confirmPassword) {
    throw new Error('New passwords do not match');
  }

  return { success: true, message: 'Password updated successfully' };
}
