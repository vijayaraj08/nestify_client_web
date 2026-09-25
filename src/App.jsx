import { useState } from 'react';
import Login from './pages/Login';
import { AppShell } from './components/layout';
import DesignSystemPreview from './pages/DesignSystemPreview';

/**
 * App — Root component.
 *
 * Currently uses a simple state-based page switch.
 * Once react-router is added, replace this with proper routing:
 *   /login          → Login
 *   /dashboard      → Dashboard
 *   /design-system  → DesignSystemPreview
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AppShell>
      <DesignSystemPreview />
    </AppShell>
  );
}

export default App;
