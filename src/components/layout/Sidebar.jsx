import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Users,
  Receipt,
  Settings,
  HelpCircle,
  ChevronLeft,
  X,
} from 'lucide-react';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble },
  { id: 'residents', label: 'Residents', icon: Users },
  { id: 'billing', label: 'Billing', icon: Receipt },
];

const bottomNav = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar({
  open = false,
  onClose,
  collapsed = false,
  onToggleCollapse,
  activeItem = 'dashboard',
  onNavigate,
}) {
  const NavItem = ({ item }) => {
    const isActive = activeItem === item.id;
    const Icon = item.icon;

    return (
      <button
        type="button"
        onClick={() => onNavigate?.(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-md
          text-sm font-medium transition-colors duration-150 cursor-pointer
          ${collapsed ? 'justify-center' : ''}
          ${isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }
        `}
        title={collapsed ? item.label : undefined}
      >
        <Icon size={20} className="shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-white border-r border-slate-200
          flex flex-col
          transition-all duration-200
          ${collapsed ? 'w-16' : 'w-64'}
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo / Header */}
        <div className={`h-16 flex items-center border-b border-slate-200 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Nestify
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
          )}

          {/* Close button (mobile) */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="py-4 px-3 border-t border-slate-200 space-y-1">
          {bottomNav.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`
            hidden lg:flex items-center justify-center
            h-10 border-t border-slate-200
            text-slate-400 hover:text-slate-600 hover:bg-slate-50
            transition-colors cursor-pointer
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </aside>
    </>
  );
}
