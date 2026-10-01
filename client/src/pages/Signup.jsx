import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, Lock, Briefcase, MapPin, Building, Home, Hash, ArrowRight, ShieldCheck, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import Logo from '../assets/logo.png';
import { INDIA_LOCATIONS } from '../data/indiaLocations';

// Fallback handles Vite dev server proxy or standalone backend port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    businessType: '',
    street: '',
    area: '',
    state: 'Tamil Nadu',
    district: INDIA_LOCATIONS['Tamil Nadu'] ? INDIA_LOCATIONS['Tamil Nadu'][0] : '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const defaultDistrict = INDIA_LOCATIONS[selectedState] ? INDIA_LOCATIONS[selectedState][0] : '';
    setFormData({
      ...formData,
      state: selectedState,
      district: defaultDistrict
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Safe dynamic target URL
      const targetUrl = API_BASE_URL.endsWith('/')
        ? `${API_BASE_URL}api/auth/register-franchise`
        : `${API_BASE_URL}/api/auth/register-franchise`;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Safely parse JSON response to prevent crashing on non-JSON HTML error responses
      const contentType = response.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error(`Server returned status ${response.status} (${response.statusText})`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Franchise registration failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate(data.redirectTo || '/franchise');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/80 p-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
        
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
          <h1 className="text-2xl font-bold text-slate-800 mt-4 tracking-tight">Apply for Franchise</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium text-center">
            Complete your details to initialize your onboarding workflow
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Applicant Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Arun Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="arun@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Business Type
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Education Center / Retail Outlet / Mart"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-3">Address Details</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Street Name / Door No.
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="No 42, Anna Salai"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Area / Landmark
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="T. Nagar"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  State
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition appearance-none cursor-pointer"
                  >
                    {Object.keys(INDIA_LOCATIONS).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  District
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition appearance-none cursor-pointer"
                  >
                    {(INDIA_LOCATIONS[formData.state] || []).map((dt) => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pincode
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    placeholder="600017"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.99] flex items-center justify-center gap-2 text-sm transition-all duration-150 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-center text-xs text-slate-500 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In Here
            </Link>
          </p>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official AVG Franchise Onboarding Portal</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;