import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Globe2, MapPin, Layers, Clock, AlertTriangle, 
  BarChart2, LogOut, X, ChevronRight 
} from 'lucide-react';
import Logo from '../../assets/logo.png';

const coordinatorNavItems = [
  { label: 'Regional Overview', path: '/head-coordinator/dashboard', icon: Globe2 },
  { label: 'State Head Operations', path: '/head-coordinator/state-heads', icon: MapPin },
  { label: 'State Comparison Matrix', path: '/head-coordinator/comparison', icon: BarChart2 },
  { label: 'Approvals & Escalations', path: '/head-coordinator/approvals', icon: Clock },
];

const CoordinatorSidebar = ({ isOpen, onClose }) => {
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
            <img src={Logo} alt="AVG Logo" className="w-9 h-9 bg-white border border-slate-300 rounded-lg p-0.5 object-contain" />
            <div>
              <span className="text-sm font-bold text-white tracking-tight block leading-none">AVG Franchise</span>
              <span className="text-[10px] font-medium text-slate-500 mt-1 block">State Head Coordinator Panel</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Multi-State Oversight
          </div>
          {coordinatorNavItems.map((item) => {
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

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-800/80">
          <NavLink
            to="/login"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default CoordinatorSidebar;