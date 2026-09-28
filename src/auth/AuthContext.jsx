/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { normalizeRole } from '../constants/roles';
import { hasRequiredRole } from './role.utils';
import cacheService, { CACHE_KEYS } from '../services/cacheService';

const AuthContext = createContext(null);

function getInitialAuthState() {
  try {
    const storedUser = cacheService.get(CACHE_KEYS.AUTH_USER);
    const storedToken = cacheService.get(CACHE_KEYS.AUTH_TOKEN);

    if (storedUser && storedToken) {
      if (storedUser.role) {
        storedUser.role = normalizeRole(storedUser.role);
        return { user: storedUser, token: storedToken };
      }
    }
  } catch (err) {
    console.error('Failed to restore auth session:', err);
    cacheService.remove(CACHE_KEYS.AUTH_USER);
    cacheService.remove(CACHE_KEYS.AUTH_TOKEN);
  }
  return { user: null, token: null };
}

/**
 * AuthProvider
 * ────────────
 * Centralized authentication and RBAC state manager.
 */
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);
  const [isLoading, setIsLoading] = useState(false);

  const { user, token } = authState;

  /**
   * Log user in and persist session
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const result = await loginUser(credentials);
      const normalizedUser = {
        ...result.user,
        role: normalizeRole(result.user.role),
      };

      setAuthState({ user: normalizedUser, token: result.token });

      cacheService.set(CACHE_KEYS.AUTH_USER, normalizedUser);
      cacheService.set(CACHE_KEYS.AUTH_TOKEN, result.token);

      return normalizedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user and persist session
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const result = await registerUser(userData);
      const normalizedUser = {
        ...result.user,
        role: normalizeRole(result.user.role),
      };

      setAuthState({ user: normalizedUser, token: result.token });

      cacheService.set(CACHE_KEYS.AUTH_USER, normalizedUser);
      cacheService.set(CACHE_KEYS.AUTH_TOKEN, result.token);

      return normalizedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log user out and clear session
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setAuthState({ user: null, token: null });
      cacheService.clearUserSession(user?.email);
    }
  }, [user]);

  /**
   * Refresh the active user object
   */
  const refreshUser = useCallback((updatedUserData) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = {
        ...prev.user,
        ...updatedUserData,
        role: updatedUserData?.role ? normalizeRole(updatedUserData.role) : prev.user.role,
      };
      cacheService.set(CACHE_KEYS.AUTH_USER, updatedUser);
      return { ...prev, user: updatedUser };
    });
  }, []);

  /**
   * Check if current user possesses any of the required roles
   */
  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user || !user.role) return false;
      return hasRequiredRole(user.role, allowedRoles);
    },
    [user]
  );

  const value = {
    user,
    role: user?.role || null,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume the AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
