/* eslint-disable react-refresh/only-export-components */
import { UserContext, UserProvider, useUser } from '../context/UserContext';

/**
 * AuthContext & AuthProvider
 * ──────────────────────────
 * Backwards and forwards compatible alias to UserContext and UserProvider.
 * Implements the 2-step HTTP-only cookie authentication & GET /users/me session lifecycle.
 */
export const AuthContext = UserContext;
export const AuthProvider = UserProvider;
export const useAuth = useUser;

export default AuthContext;
