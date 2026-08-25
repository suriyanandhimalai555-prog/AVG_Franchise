import React from 'react';
import { Menu, Bell, UserCheck } from 'lucide-react';
import Logo from '../assets/logo.png';

const Navbar = ({ toggleSidebar, userRole = 'Admin' }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-100 rounded-xl border border-slate-200/60">
              <img src={Logo} alt="AVG Logo" className="w-7 h-7 object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-extrabold text-slate-900 leading-none tracking-tight">AVG</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Franchise Portal</span>
            </div>
          </div>
        </div>

        {/* Right Side: Profile & Notifications */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-3 pl-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
              {userRole === 'Admin' ? 'AD' : 'US'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">Arun Kumar</span>
              <span className="text-[11px] font-medium text-slate-400 capitalize">{userRole} Account</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;