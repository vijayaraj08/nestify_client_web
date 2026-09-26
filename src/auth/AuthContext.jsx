/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { normalizeRole } from '../constants/roles';
import { hasRequiredRole } from './role.utils';

const STORAGE_KEY_USER = 'hostello_auth_user';
const STORAGE_KEY_TOKEN = 'hostello_auth_token';

const AuthContext = createContext(null);

function getInitialAuthState() {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.role) {
        parsedUser.role = normalizeRole(parsedUser.role);
        return { user: parsedUser, token: storedToken };
      }
    }
  } catch (err) {
    console.error('Failed to restore auth session:', err);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
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

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(normalizedUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, result.token);

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

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(normalizedUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, result.token);

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
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, []);

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
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
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
