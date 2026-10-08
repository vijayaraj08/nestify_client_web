import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../constants/roles';
import { getDefaultRouteForRole } from '../auth/role.utils';
import RoleRoute from '../auth/RoleRoute';
import ProtectedRoute from '../auth/ProtectedRoute';
import { AppLayout } from '../layouts';

// Pages
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import GenericPage from '../pages/GenericPage';
import DesignSystemPreview from '../pages/DesignSystemPreview';
import PlansManagement from '../pages/admin/PlansManagement';
import AnalyticsReports from '../pages/admin/AnalyticsReports';
import TenantsManagement from '../pages/admin/TenantsManagement';
import TenantOnboardingPage from '../pages/admin/TenantOnboardingPage';
import PropertiesUnitsPage from '../pages/admin/PropertiesUnitsPage';
import PropertyDetailsPage from '../pages/admin/PropertyDetailsPage';

/**
 * Root Redirection Handler for '/'
 * Directs authenticated users to their specific role dashboard,
 * or unauthenticated users to '/login'.
 */
function RootRedirect() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Restoring session...</p>
      </div>
    );
  }

  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Navigate to="/" replace />;
}

/**
 * Login Route Guard:
 * If user is already authenticated, redirect them directly to their role dashboard.
 */
function PublicLoginRoute() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Login />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/" element={<PublicLoginRoute />} />
      <Route path="/login" element={<PublicLoginRoute />} />
      <Route path="/signin" element={<PublicLoginRoute />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/design-system" element={<DesignSystemPreview />} />

      {/* ========================================================= */}
      {/* COMMON TOP-LEVEL PROTECTED ROUTES                         */}
      {/* ========================================================= */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================================= */}
      {/* 1. SUPER ADMIN ROUTES (/admin/*)                          */}
      {/* ========================================================= */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <AppLayout role={ROLES.SUPER_ADMIN} />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tenants" element={<TenantsManagement />} />
        <Route path="tenants/new" element={<TenantOnboardingPage />} />
        <Route path="properties" element={<PropertiesUnitsPage />} />
        <Route path="properties/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="bookings" element={<GenericPage title="Platform Bookings" />} />
        <Route path="move-outs" element={<GenericPage title="Move-Out Requests" />} />
        <Route path="residents" element={<GenericPage title="All Residents" />} />
        <Route path="operations" element={<GenericPage title="Operations & Staff" />} />
        <Route path="finance" element={<GenericPage title="Payments & Finance" />} />
        <Route path="approvals" element={<GenericPage title="KYC & Approvals" />} />
        <Route path="compliance" element={<GenericPage title="Compliance & Legal" />} />
        <Route path="reports" element={<AnalyticsReports />} />
        <Route path="notifications" element={<GenericPage title="Platform Notifications" />} />
        <Route path="subscriptions" element={<PlansManagement />} />
        <Route path="plans" element={<PlansManagement />} />
        <Route path="referrals" element={<GenericPage title="Referrals & Affiliates" />} />
        <Route path="audit-logs" element={<GenericPage title="System Audit Logs" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* ========================================================= */}
      {/* 2. TENANT / PROPERTY MANAGER ROUTES (/tenant/*)           */}
      {/* ========================================================= */}
      <Route
        path="/tenant"
        element={
          <RoleRoute allowedRoles={[ROLES.TENANT]}>
            <AppLayout role={ROLES.TENANT} />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<PropertiesUnitsPage />} />
        <Route path="properties/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="rooms" element={<PropertiesUnitsPage />} />
        <Route path="rooms/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="beds" element={<PropertiesUnitsPage />} />
        <Route path="beds/:propertyId" element={<PropertyDetailsPage />} />
        <Route path="bookings" element={<GenericPage title="Resident Bookings" />} />
        <Route path="residents" element={<GenericPage title="Resident Roster" />} />
        <Route path="payments" element={<GenericPage title="Payments & Invoices" />} />
        <Route path="reports" element={<AnalyticsReports />} />
        <Route path="analytics" element={<AnalyticsReports />} />
        <Route path="complaints" element={<GenericPage title="Complaints & Issues" />} />
        <Route path="maintenance" element={<GenericPage title="Maintenance Tasks" />} />
        <Route path="staff" element={<GenericPage title="Hostel Staff & Wardens" />} />
        <Route path="inventory" element={<GenericPage title="Hostel Inventory & Assets" />} />
        <Route path="food-menu" element={<GenericPage title="Mess & Food Menu" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/tenant/dashboard" replace />} />
      </Route>

      {/* ========================================================= */}
      {/* 3. END USER / RESIDENT ROUTES (/user/*)                   */}
      {/* ========================================================= */}
      <Route
        path="/user"
        element={
          <RoleRoute allowedRoles={[ROLES.END_USER]}>
            <AppLayout role={ROLES.END_USER} />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="booking" element={<GenericPage title="My Booking" />} />
        <Route path="room" element={<GenericPage title="Room & Bed Details" />} />
        <Route path="payments" element={<GenericPage title="Rent & Invoices" />} />
        <Route path="complaints" element={<GenericPage title="Complaints & Helpdesk" />} />
        <Route path="documents" element={<GenericPage title="Documents & Agreement" />} />
        <Route path="notifications" element={<GenericPage title="Personal Notifications" />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
