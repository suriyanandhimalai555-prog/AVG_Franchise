import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, FileCheck, HelpCircle, Settings, LogOut, X } from 'lucide-react';

const navItems = [
  { label: 'Overview', path: '/user/dashboard', icon: LayoutDashboard },
  { label: 'Profile & Roles', path: '/user/roles', icon: UserCheck },
  { label: 'My Application', path: '/user/application', icon: FileCheck },
  { label: 'Support & Help', path: '/user/support', icon: HelpCircle },
  { label: 'Account Settings', path: '/user/settings', icon: Settings },
];

const UserSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white text-slate-600 border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md">
            Partner Portal
          </span>
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150
                  ${isActive 
                    ? 'bg-slate-900 text-white font-semibold shadow-md shadow-slate-900/10' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;