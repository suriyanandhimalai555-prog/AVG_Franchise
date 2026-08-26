import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../assets/logo.png';

// Fallback dashboard routes based on user role
const ROLE_DASHBOARDS = {
  SUPER_ADMIN: '/super-admin/dashboard',
  ADMIN: '/admin/dashboard',
  DIRECTOR: '/director/dashboard',
  HEAD_COORDINATOR: '/head-coordinator/dashboard',
  STATE_HEAD: '/state-head/dashboard',
  SALES_MANAGER: '/sales-manager/dashboard',
  FRANCHISE: '/franchise/dashboard',
};

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle varying API structure (whether user is inside data.user or at root of data)
        const userObj = data.user || {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          userCode: data.userCode,
          redirectTo: data.redirectTo,
        };

        const token = data.token;
        const role = userObj.role;

        // Save session details
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObj));

        toast.success(`Welcome back, ${userObj.name || 'User'}!`);

        // Navigate based on assigned role or backend redirect payload
        const targetPath = ROLE_DASHBOARDS[role] || data.redirectTo || '/login';
        navigate(targetPath, { replace: true });
      } else {
        toast.error(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Server connection failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/80 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3 shadow-inner">
            <img src={Logo} alt="AVG Franchise Logo" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">AVG</span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
              Franchise
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-4 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Enter your credentials to access the portal</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              User ID / Email / Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="AVG-TN-CHN-00125"
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.99] flex items-center justify-center gap-2 text-sm transition-all duration-150 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-center text-xs text-slate-500 font-medium">
            New Franchise Applicant?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Apply Here
            </Link>
          </p>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Enterprise Authentication</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;