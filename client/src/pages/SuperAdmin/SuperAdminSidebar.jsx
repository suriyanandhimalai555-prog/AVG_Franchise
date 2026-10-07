import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldCheck, Users, Briefcase, MapPin, 
  CheckSquare, LogOut, X, ChevronRight, BarChart3, User
} from 'lucide-react';
import Logo from '../../assets/logo.png';

const navItems = [
  { label: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { label: 'Franchise Owners Checkin', path: '/super-admin/franchise-checkin', icon: LayoutDashboard },
  { label: 'Branch Stock List', path: '/super-admin/branch-stock', icon: LayoutDashboard },
  { label: 'Role & Hierarchy', path: '/super-admin/roles', icon: ShieldCheck },
  { label: 'User Directory', path: '/super-admin/users', icon: Users },
  { label: 'Business Verticals', path: '/super-admin/businesses', icon: Briefcase },
  { label: 'Territory Mapping', path: '/super-admin/territories', icon: MapPin },
  { label: 'Approvals Queue', path: '/super-admin/approvals', icon: CheckSquare },
  { label: 'Ticket Management', path: '/super-admin/tickets', icon: BarChart3 },
];

const SuperAdminSidebar = ({ isOpen, onClose, user, onLogout }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-400 flex flex-col transition-transform duration-300 ease-out
        lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 mt-2">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="AVG Logo" className="w-9 h-9 bg-white border border-slate-300 rounded-lg object-contain p-0.5" />
            <div>
              <span className="text-sm font-bold text-white tracking-tight block leading-none">AVG Franchise</span>
              <span className="text-[10px] font-medium text-slate-500 mt-1 block">Super Admin Dashboard</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Menu Overview
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card / Sign Out */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* User Profile Info Card */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-800/40 rounded-xl border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@avg.com'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;