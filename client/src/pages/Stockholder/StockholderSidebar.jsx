// src/pages/Stockholder/StockholderSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  CreditCard,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../assets/logo.png';

const StockholderSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/stockholder/dashboard', icon: LayoutDashboard },
    { label: 'Equity & Portfolio', path: '/stockholder/portfolio', icon: PieChart },
    { label: 'Dividends & Yield', path: '/stockholder/dividends', icon: TrendingUp },
    { label: 'Financial Reports', path: '/stockholder/reports', icon: FileText },
    { label: 'Transactions', path: '/stockholder/transactions', icon: CreditCard },
  ];

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-50 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shrink-0 border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Header & Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <img src={Logo} alt="AVG Logo" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-white tracking-tight">AVG</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest ml-2 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  Stock Holder
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Shareholder Portal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150
                    ${isActive 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Audited Badge and Logout Button */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audited Portfolio Data</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150 group"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default StockholderSidebar;