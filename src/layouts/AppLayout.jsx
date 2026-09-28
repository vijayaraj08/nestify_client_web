import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronLeft,
  ChevronDown,
  X,
  Building2,
  LogOut,
  User as UserIcon,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNavigationForRole } from '../navigation/navigation.utils';
import { getRoleDisplayInfo } from '../auth/role.utils';
import Avatar from '../components/ui/Avatar';

export default function AppLayout({ role: layoutRole, children }) {
  const { user, role: authRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const effectiveRole = layoutRole || authRole;
  const navItems = getNavigationForRole(effectiveRole);
  const roleInfo = getRoleDisplayInfo(effectiveRole);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xs
          flex flex-col
          transition-all duration-200 ease-in-out
          ${sidebarCollapsed ? 'w-18' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-800 px-4 shrink-0 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
              <Building2 size={20} />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Hostello</span>
                <span className="text-[10px] uppercase font-semibold text-primary-600 dark:text-primary-400 tracking-wider mt-0.5">
                  {roleInfo.label}
                </span>
              </div>
            )}
          </div>

          {/* Close button (mobile) */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id || item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${sidebarCollapsed ? 'justify-center' : ''}
                  ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 shadow-xs border border-primary-100 dark:border-primary-900/60 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  }
                `}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-primary-700 dark:text-primary-300' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Role Portal Indicator / Badge at bottom */}
        {!sidebarCollapsed && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <Shield size={14} className="text-primary-600 dark:text-primary-400" />
              <span>Portal Scope:</span>
            </div>
            <p className="mt-1 text-slate-800 dark:text-slate-200 font-semibold text-[13px]">{roleInfo.label}</p>
          </div>
        )}

        {/* Collapse toggle button (desktop) */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex items-center justify-center h-11 border-t border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-18' : 'lg:ml-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile trigger & search */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="search"
                  placeholder="Quick search across portal..."
                  className="w-64 md:w-80 pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right: Theme Switcher, Notifications & User profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Theme Switch Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} className="text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer text-left"
                aria-expanded={userDropdownOpen}
              >
                <Avatar
                  name={user?.name || 'User'}
                  src={user?.profileImage}
                  size="sm"
                  status="online"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                    {roleInfo.label}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-1 hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                      {user?.email || 'admin@hostello.com'}
                    </p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800">
                      {roleInfo.label}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <UserIcon size={16} className="text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Shield size={16} className="text-slate-400" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-medium"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
