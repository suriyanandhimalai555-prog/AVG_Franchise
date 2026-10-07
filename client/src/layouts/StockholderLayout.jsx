import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Mail,
  MapPin
} from 'lucide-react';
import StockholderSidebar from '../pages/Stockholder/StockholderSidebar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const StockholderLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch updated user profile safely on mount from backend port (5000)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get('content-type');
        if (response.ok && contentType && contentType.includes('application/json')) {
          const freshUserData = await response.json();
          setUser((prev) => {
            const merged = { ...prev, ...freshUserData };
            localStorage.setItem('user', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (error) {
        console.error('Failed to sync user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/login');
  };

  const getUserInitials = (name) => {
    if (!name) return 'SH';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Build string from area, district, state
  const locationParts = [
    user.area,
    user.district || user.city || user.location,
    user.state || user.province,
  ].filter(Boolean);

  const locationString = locationParts.join(', ');

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden text-slate-800 antialiased">
      {/* Sidebar with user data passed via prop */}
      <StockholderSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={user}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs w-72 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:bg-white focus-within:border-amber-400 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search statements, payouts, filings..."
                className="bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs w-full"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Equity Telemetry
            </span>

            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 pl-1 focus:outline-none group p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/20">
                  {getUserInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name || 'Stockholder'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate max-w-[160px]">
                    {locationString || 'Shareholder Account'}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Account Summary Header */}
                  <div className="px-4 py-3 border-b border-slate-100 space-y-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate leading-snug">
                        {user.name || 'Stockholder Account'}
                      </p>

                      {user.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Clean Location Block - No Badge Overflow */}
                    {locationString && (
                      <div className="pt-2 border-t border-slate-50 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{user.area || user.district || 'Territory'}</span>
                        </div>
                        {(user.state || user.district) && (
                          <p className="text-[10px] text-slate-400 truncate pl-5">
                            {[user.district !== user.area ? user.district : null, user.state].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dropdown Navigation Actions */}
                  <div className="pt-1">
                    <button
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      Portfolio Profile
                    </button>

                    <div className="h-px bg-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockholderLayout;