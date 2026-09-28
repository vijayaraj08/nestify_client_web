import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

/**
 * App — Root Application Component
 *
 * Configured with:
 * - ThemeProvider for dynamic light/dark theme & brand accent state
 * - BrowserRouter for client-side routing
 * - AuthProvider for RBAC & session state management
 * - AppRoutes for role-protected route trees
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
