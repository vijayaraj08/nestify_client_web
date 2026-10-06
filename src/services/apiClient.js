import cacheService, { CACHE_KEYS } from './cacheService';
import { API_BASE_URL } from './authService';

export const AUTH_SESSION_EXPIRED_EVENT = 'nestify:auth:session_expired';

let isRedirectingToLogin = false;

/**
 * Handle unauthorized / expired session
 * Clears cached user state and redirects to login
 */
export function handleUnauthorized(message = 'Authentication required. No token provided.') {
  cacheService.remove(CACHE_KEYS.AUTH_USER);
  cacheService.remove(CACHE_KEYS.AUTH_TOKEN);
  cacheService.remove('token');

  // Dispatch custom event for UserContext / React components
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
      detail: { message },
    })
  );

  // Prevent multiple duplicate redirects
  if (isRedirectingToLogin) return;

  const currentPath = window.location.pathname;
  const isAuthPage = currentPath === '/' || currentPath === '/login' || currentPath === '/signin';

  if (!isAuthPage) {
    isRedirectingToLogin = true;
    const returnUrl = encodeURIComponent(currentPath + window.location.search);
    window.location.href = `/login?expired=true&returnUrl=${returnUrl}`;
  }
}

/**
 * Global API Request Wrapper with automatic 401 & token expiration interception
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');

  const headers = {
    Accept: 'application/json',
    ...(options.body && !(options.body instanceof FormData) && !(typeof options.body === 'string' && options.headers?.['Content-Type'])
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Automatically sends HTTP-only auth cookies
  };

  const response = await fetch(url, config);

  // 1. Intercept HTTP 401 Unauthorized
  if (response.status === 401) {
    let msg = 'Authentication required. No token provided.';
    try {
      const clonedJson = await response.clone().json();
      if (clonedJson && clonedJson.message) {
        msg = clonedJson.message;
      }
    } catch {
      // ignore json parse error
    }
    handleUnauthorized(msg);
    const err = new Error(msg);
    err.status = 401;
    throw err;
  }

  // 2. Intercept HTTP 403 Forbidden with auth token failure
  if (response.status === 403) {
    try {
      const clonedJson = await response.clone().json();
      if (
        clonedJson &&
        (clonedJson.message?.toLowerCase().includes('token') ||
          clonedJson.message?.toLowerCase().includes('authentication') ||
          clonedJson.message?.toLowerCase().includes('session expired'))
      ) {
        handleUnauthorized(clonedJson.message);
      }
    } catch {
      // ignore
    }
  }

  return response;
}

export default {
  apiRequest,
  handleUnauthorized,
  AUTH_SESSION_EXPIRED_EVENT,
};
