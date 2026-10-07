import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  IndianRupee,
  Receipt,
  Users,
  UserPlus,
  Percent,
  CheckSquare,
  LogOut,
  X,
  ChevronRight,
  Store,
  MapPin,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const navItems = [
  { label: 'Dashboard', path: '/franchise/dashboard', icon: LayoutDashboard },
  { label: 'Stock Requests Admin', path: '/franchise/stock-requests', icon: Store },
  { label: 'Daily Sales & Entries', path: '/franchise/entries', icon: Receipt },
  { label: 'Collections & Dues', path: '/franchise/collections', icon: IndianRupee },
  { label: 'Customers', path: '/franchise/customers', icon: Users },
  { label: 'Leads & Conversions', path: '/franchise/leads', icon: UserPlus },
  { label: 'Commission Earnings', path: '/franchise/commissions', icon: Percent },
  { label: 'Pending Tasks', path: '/franchise/tasks', icon: CheckSquare },
  { label: 'Rise Ticket', path: '/franchise/tickets', icon: LogOut },
];

const FranchiseSidebar = ({ isOpen, onClose, currentUser }) => {
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
          console.error('Failed to load franchise profile in sidebar:', err);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const getUserInitials = (name) => {
    if (!name) return 'FR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const subLocation = [
    user.district !== user.area ? user.district : null,
    user.state,
    user.pincode
  ].filter(Boolean).join(', ');

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
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-400 flex flex-col transition-transform duration-300 ease-out shrink-0 border-r border-slate-800
        lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="AVG Logo" className="w-8 h-8 bg-white border border-slate-300 rounded-lg shrink-0 object-contain p-0.5" />
            <div className="min-w-0">
              <span className="text-sm font-bold text-white tracking-tight block truncate">AVG Franchise</span>
              <span className="text-[10px] font-medium text-blue-400 block truncate">
                {user.businessType || 'Branch Portal'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Branch Operations
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
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Branch Info & Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 shrink-0">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-800 flex items-start gap-3">
            {/* Avatar / Initials */}
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
              {getUserInitials(user.name)}
            </div>

            {/* All Profile Data Displayed Line by Line */}
            <div className="min-w-0 flex-1 space-y-1">
              {/* 1. Name */}
              <p className="text-xs font-bold text-white truncate leading-tight">
                {user.name || 'Franchise Owner'}
              </p>

              {/* 2. Business Type Badge */}
              {user.businessType && (
                <div className="flex items-center gap-1 text-[10px] text-blue-400 font-medium">
                  <Briefcase className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate">{user.businessType}</span>
                </div>
              )}

              {/* 3. Primary Area */}
              {user.area && user.area.toLowerCase() !== 'post' && (
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-semibold pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{user.area}</span>
                </div>
              )}

              {/* 4. District, State, Pincode */}
              {(user.district || user.state || user.pincode) && (
                <p className="text-[10px] text-slate-400 leading-snug pl-4 border-l border-slate-700/60 my-1">
                  {[
                    user.district !== user.area ? user.district : null,
                    user.state,
                    user.pincode ? `PIN: ${user.pincode}` : null
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              )}
            </div>
          </div>

          {/* Sign Out Button */}
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

export default FranchiseSidebar;