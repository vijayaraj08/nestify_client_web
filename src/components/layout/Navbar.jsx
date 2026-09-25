import { Menu, Bell, Search } from 'lucide-react';
import Avatar from '../ui/Avatar';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <Avatar name="Admin User" size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">Admin User</p>
            <p className="text-xs text-slate-500 leading-tight">admin@nestify.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
