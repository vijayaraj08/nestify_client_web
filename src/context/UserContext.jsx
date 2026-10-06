/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';
import { normalizeRole } from '../constants/roles';
import { hasRequiredRole } from '../auth/role.utils';
import cacheService, { CACHE_KEYS } from '../services/cacheService';

export const UserContext = createContext(null);

function getCachedInitialUser() {
  try {
    const storedUser = cacheService.get(CACHE_KEYS.AUTH_USER);
    if (storedUser && (storedUser.id || storedUser.email)) {
      if (storedUser.role) {
        storedUser.role = normalizeRole(storedUser.role);
      }
      return storedUser;
    }
  } catch (err) {
    console.error('Failed to read cached user session:', err);
    cacheService.remove(CACHE_KEYS.AUTH_USER);
  }
  return null;
}

/**
 * UserProvider
 * ────────────
 * Centralized User Context managing the authenticated user session:
 * 1. POST /auth/login -> HTTP-only session cookie set by server
 * 2. GET /users/me    -> Hydrates UserContext with authenticated user details & permissions
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(getCachedInitialUser);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * On initial mount, verify active HTTP-only cookie session via GET /users/me
   */
  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          if (currentUser) {
            setUser(currentUser);
            cacheService.set(CACHE_KEYS.AUTH_USER, currentUser);

            // Apply saved theme & accent color from database immediately to UI
            if (currentUser.settings?.theme) {
              const isDark = currentUser.settings.theme === 'dark' || (currentUser.settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              document.documentElement.classList.toggle('dark', isDark);
              cacheService.setTheme(currentUser.settings.theme);
            }
            if (currentUser.settings?.accentColor) {
              document.documentElement.setAttribute('data-accent', currentUser.settings.accentColor);
              cacheService.setAccent(currentUser.settings.accentColor);
            }
          } else {
            // No active session cookie
            setUser(null);
            cacheService.remove(CACHE_KEYS.AUTH_USER);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[UserContext] Session hydration notice:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateSession();

    const handleSessionExpired = (e) => {
      if (isMounted) {
        setUser(null);
        setError(e.detail?.message || 'Session expired');
      }
    };

    window.addEventListener('nestify:auth:session_expired', handleSessionExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('nestify:auth:session_expired', handleSessionExpired);
    };
  }, []);

  /**
   * Execute authenticated login flow:
   *   POST /auth/login -> Sets HTTP-only cookie
   *   GET /users/me    -> Fetches authenticated user info
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginUser(credentials);
      const normalizedUser = {
        ...result.user,
        role: normalizeRole(result.user.role),
      };

      setUser(normalizedUser);
      cacheService.set(CACHE_KEYS.AUTH_USER, normalizedUser);

      return normalizedUser;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user and fetch user profile
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerUser(userData);
      const normalizedUser = {
        ...result.user,
        role: normalizeRole(result.user.role),
      };

      setUser(normalizedUser);
      cacheService.set(CACHE_KEYS.AUTH_USER, normalizedUser);

      return normalizedUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log user out and clear active session cookies and state
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout warning:', err);
    } finally {
      setUser(null);
      cacheService.clearUserSession(user?.email);
    }
  }, [user]);

  /**
   * Re-fetch user profile from GET /users/me
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const freshUser = await getCurrentUser();
      if (freshUser) {
        setUser(freshUser);
        cacheService.set(CACHE_KEYS.AUTH_USER, freshUser);
        return freshUser;
      }
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
    return null;
  }, []);

  /**
   * Update active user in state & cache
   */
  const refreshUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = {
        ...prev,
        ...updatedUserData,
        role: updatedUserData?.role ? normalizeRole(updatedUserData.role) : prev.role,
      };
      cacheService.set(CACHE_KEYS.AUTH_USER, updatedUser);
      return updatedUser;
    });
  }, []);

  /**
   * Check if active user has any of the specified roles
   */
  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user || !user.role) return false;
      return hasRequiredRole(user.role, allowedRoles);
    },
    [user]
  );

  /**
   * Check if active user has a specific permission
   */
  const hasPermission = useCallback(
    (permissionKey) => {
      if (!user || !Array.isArray(user.permissions)) return false;
      return user.permissions.includes(permissionKey);
    },
    [user]
  );

  const value = {
    user,
    role: user?.role || null,
    permissions: user?.permissions || [],
    profileImage: user?.profileImage || user?.avatar || null,
    isAuthenticated: Boolean(user && (user.id || user.email)),
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Custom hook to consume UserContext
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
