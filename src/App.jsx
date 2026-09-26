import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AppRoutes from './routes/AppRoutes';

/**
 * App — Root Application Component
 *
 * Configured with:
 * - BrowserRouter for client-side routing
 * - AuthProvider for RBAC & session state management
 * - AppRoutes for role-protected route trees
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
