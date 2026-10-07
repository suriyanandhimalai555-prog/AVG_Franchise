import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  PieChart,
  TrendingUp,
  FileText,
  ShieldCheck,
  CreditCard,
  LogOut,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const StockholderSidebar = ({ isOpen, onClose, currentUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(currentUser || {});

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      setUser(currentUser);
    } else {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          }
        } catch (err) {
          console.error('Failed to load user profile in sidebar:', err);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  const navItems = [
    { label: 'Dashboard', path: '/stockholder/dashboard', icon: LayoutDashboard },
    { label: 'Stock Update', path: '/stockholder/stock-update', icon: PieChart },
    { label: 'Stock Requests', path: '/stockholder/stock-requests', icon: TrendingUp },
    { label: 'Financial Reports', path: '/stockholder/reports', icon: FileText },
    { label: 'Transactions', path: '/stockholder/transactions', icon: CreditCard },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const getUserInitials = (name) => {
    if (!name) return 'SH';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Combine Area, District, and State for Sidebar
  const locationParts = [
    user.area,
    user.district || user.city || user.location,
    user.state || user.province,
  ].filter(Boolean);

  const locationString = locationParts.join(', ');

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

        {/* Sidebar Footer with Area, District, State */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              {getUserInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-snug">
                {user.name || 'Stockholder'}
              </p>

              {locationString ? (
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{user.area || user.district}</span>
                  </div>
                  {(user.state || user.district) && (
                    <p className="text-[10px] text-slate-400 truncate pl-4">
                      {[user.district !== user.area ? user.district : null, user.state].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {user.email || 'Verified Shareholder'}
                </p>
              )}
            </div>
          </div>

          <div className="px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-2 text-[10px] font-medium text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Audited Portfolio Active</span>
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