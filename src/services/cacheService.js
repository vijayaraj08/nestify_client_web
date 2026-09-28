/**
 * Centralized Cache & Storage Manager (cacheService.js)
 * ───────────────────────────────────────────────────
 * Provides unified, safe, and observable client-side caching for:
 * - User preferences & theme settings (with instant pre-mount access)
 * - User profiles & business data
 * - Auth session tokens
 *
 * Facilitates easy cross-checking, debugging, validation, and syncing with MongoDB.
 */

export const CACHE_KEYS = {
  THEME: 'nestify_theme',
  ACCENT: 'nestify_accent',
  SETTINGS_PREFIX: 'hostello_user_settings_data',
  PROFILE_PREFIX: 'hostello_user_profile_data',
  AUTH_USER: 'hostello_auth_user',
  AUTH_TOKEN: 'hostello_auth_token',
};

/**
 * Low-level safe localStorage getter
 */
export function getCache(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    const parsed = JSON.parse(raw);

    // If item has a TTL metadata wrapper
    if (parsed && typeof parsed === 'object' && parsed.__isCacheWrapper) {
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      return parsed.value;
    }

    return parsed;
  } catch (err) {
    // Return raw string if not JSON
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

/**
 * Low-level safe localStorage setter with optional TTL
 */
export function setCache(key, value, ttlMs = null) {
  try {
    let payload = value;
    if (ttlMs) {
      payload = {
        __isCacheWrapper: true,
        expiry: Date.now() + ttlMs,
        value,
      };
    }
    localStorage.setItem(key, typeof payload === 'string' ? payload : JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn(`[CacheService] Failed to set cache for key "${key}":`, err);
    return false;
  }
}

/**
 * Safe localStorage remover
 */
export function removeCache(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// User-Scoped Settings Cache Helpers
// ─────────────────────────────────────────────────────────────

export function getUserSettingsCacheKey(userEmail) {
  return `${CACHE_KEYS.SETTINGS_PREFIX}_${userEmail || 'default'}`;
}

export function getUserSettingsCache(userEmail) {
  const key = getUserSettingsCacheKey(userEmail);
  return getCache(key, null);
}

export function setUserSettingsCache(userEmail, settingsData) {
  const key = getUserSettingsCacheKey(userEmail);
  return setCache(key, settingsData);
}

// ─────────────────────────────────────────────────────────────
// User-Scoped Profile Cache Helpers
// ─────────────────────────────────────────────────────────────

export function getUserProfileCacheKey(userEmail) {
  return `${CACHE_KEYS.PROFILE_PREFIX}_${userEmail || 'default'}`;
}

export function getUserProfileCache(userEmail) {
  const key = getUserProfileCacheKey(userEmail);
  return getCache(key, null);
}

export function setUserProfileCache(userEmail, profileData) {
  const key = getUserProfileCacheKey(userEmail);
  return setCache(key, profileData);
}

// ─────────────────────────────────────────────────────────────
// Theme & Accent Cache Helpers
// ─────────────────────────────────────────────────────────────

export function getThemeCache(defaultValue = 'light') {
  return getCache(CACHE_KEYS.THEME, defaultValue);
}

export function setThemeCache(themeMode) {
  return setCache(CACHE_KEYS.THEME, themeMode);
}

export function getAccentCache(defaultValue = 'indigo') {
  return getCache(CACHE_KEYS.ACCENT, defaultValue);
}

export function setAccentCache(accentColor) {
  return setCache(CACHE_KEYS.ACCENT, accentColor);
}

// ─────────────────────────────────────────────────────────────
// Cache Diagnostic & Cross-Checking Utilities
// ─────────────────────────────────────────────────────────────

/**
 * Inspect all currently cached entries in one call (useful for debugging and state validation)
 */
export function inspectCache() {
  const snapshot = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        snapshot[key] = getCache(key);
      }
    }
  } catch (err) {
    console.warn('[CacheService] Error inspecting cache:', err);
  }
  return snapshot;
}

/**
 * Purges all cached session data for a specific user (e.g. upon logout)
 */
export function clearUserSessionCache(userEmail) {
  removeCache(CACHE_KEYS.AUTH_USER);
  removeCache(CACHE_KEYS.AUTH_TOKEN);
  if (userEmail) {
    removeCache(getUserSettingsCacheKey(userEmail));
    removeCache(getUserProfileCacheKey(userEmail));
  }
}

export default {
  get: getCache,
  set: setCache,
  remove: removeCache,
  getUserSettings: getUserSettingsCache,
  setUserSettings: setUserSettingsCache,
  getUserProfile: getUserProfileCache,
  setUserProfile: setUserProfileCache,
  getTheme: getThemeCache,
  setTheme: setThemeCache,
  getAccent: getAccentCache,
  setAccent: setAccentCache,
  inspect: inspectCache,
  clearUserSession: clearUserSessionCache,
};
