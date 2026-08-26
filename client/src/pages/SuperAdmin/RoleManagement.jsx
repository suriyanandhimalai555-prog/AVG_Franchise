import React, { useState, useEffect, useRef } from 'react';
import { Shield, MoreVertical, Layers, Search, Filter, X, UserPlus, Loader2, Eye, Mail, Phone, Hash, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const RoleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingCounts, setFetchingCounts] = useState(true);

  // Action Menu & User Modal States
  const [activeMenuRole, setActiveMenuRole] = useState(null);
  const [selectedRoleForView, setSelectedRoleForView] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);

  const menuRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'ADMIN',
  });

  const [roleCounts, setRoleCounts] = useState({
    SUPER_ADMIN: 0,
    ADMIN: 0,
    DIRECTOR: 0,
    HEAD_COORDINATOR: 0,
    STATE_HEAD: 0,
    SALES_MANAGER: 0,
    FRANCHISE: 0,
  });

  const roles = [
    { id: 'R-01', title: 'Super Admin', enumKey: 'SUPER_ADMIN', level: 'Level 0', desc: 'Full System Control & Audit Tracing' },
    { id: 'R-02', title: 'Operational Admin', enumKey: 'ADMIN', level: 'Level 1', desc: 'Vertical & Account Management' },
    { id: 'R-03', title: 'Director Analytics', enumKey: 'DIRECTOR', level: 'Level 2', desc: 'Read-only access to BI & Metrics' },
    { id: 'R-04', title: 'Head Coordinator', enumKey: 'HEAD_COORDINATOR', level: 'Level 3', desc: 'Multi-State Operational Oversight' },
    { id: 'R-05', title: 'State Head', enumKey: 'STATE_HEAD', level: 'Level 4', desc: 'State Franchise Signups & Commissions' },
    { id: 'R-06', title: 'Sales Manager', enumKey: 'SALES_MANAGER', level: 'Level 5', desc: 'Field Audits & Store Verifications' },
    { id: 'R-07', title: 'Franchise Partner', enumKey: 'FRANCHISE', level: 'Level 6', desc: 'Store Terminal Entry & Sales' },
  ];

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuRole(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch active user counts from the backend
  const fetchUserCounts = async () => {
    setFetchingCounts(true);
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}/api/auth/role-counts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoleCounts(data);
      }
    } catch (err) {
      console.error('Failed to fetch role counts:', err);
    } finally {
      setFetchingCounts(false);
    }
  };

  useEffect(() => {
    fetchUserCounts();
  }, []);

  // Fetch users belonging to the clicked role
  const handleViewRoleUsers = async (roleObj) => {
    setSelectedRoleForView(roleObj);
    setIsViewModalOpen(true);
    setActiveMenuRole(null);
    setLoadingRoleUsers(true);

    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${baseUrl}/api/auth/users-by-role/${roleObj.enumKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoleUsers(data);
      } else {
        toast.error('Failed to fetch users for this role.');
        setRoleUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch role users:', err);
      toast.error('Server error while retrieving users.');
    } finally {
      setLoadingRoleUsers(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}/api/auth/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`User ${data.user.name} created! ID: ${data.user.userCode}`);
        setFormData({ name: '', email: '', mobile: '', role: 'ADMIN' });
        setIsModalOpen(false);
        fetchUserCounts();
      } else {
        toast.error(data.message || 'Failed to create user account.');
      }
    } catch (err) {
      toast.error('Server connection failed. Check backend service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role Hierarchy & Access Rules</h1>
          <p className="text-xs text-slate-500 mt-1">Configure user roles, permissions, and create internal accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Create User for Role
        </button>
      </div>

      {/* Card Table Wrapper */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Filter roles..." className="bg-transparent border-none outline-none w-full text-slate-700" />
          </div>
          <button className="px-3 py-1.5 bg-white border border-slate-200/80 text-slate-600 text-xs font-medium rounded-xl flex items-center gap-2 self-start sm:self-auto hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Rules
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3.5 px-5">Role ID</th>
                <th className="py-3.5 px-5">Role Designation</th>
                <th className="py-3.5 px-5">Hierarchy Level</th>
                <th className="py-3.5 px-5">Active Users</th>
                <th className="py-3.5 px-5">Operational Scope</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {roles.map((r) => {
                const count = roleCounts[r.enumKey] ?? 0;
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors relative">
                    <td className="py-4 px-5 font-mono font-bold text-blue-600">{r.id}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-800">{r.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">
                        <Layers className="w-3 h-3 text-slate-400" /> {r.level}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-700">
                      {fetchingCounts ? (
                        <span className="inline-flex items-center gap-1 text-slate-400 font-normal">
                          <Loader2 className="w-3 h-3 animate-spin" /> Fetching...
                        </span>
                      ) : (
                        `${count.toLocaleString()} ${count === 1 ? 'User' : 'Users'}`
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-500 max-w-xs truncate">{r.desc}</td>
                    
                    {/* Actions Column with Dropdown Popover */}
                    <td className="py-4 px-5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuRole(activeMenuRole === r.id ? null : r.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuRole === r.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-5 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
                        >
                          <button
                            onClick={() => handleViewRoleUsers(r)}
                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-500" /> View Users
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW USERS FOR SELECTED ROLE MODAL */}
      {isViewModalOpen && selectedRoleForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {selectedRoleForView.title} Accounts
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Showing all registered active users under role key: <span className="font-mono text-blue-600">{selectedRoleForView.enumKey}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content / User Table */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingRoleUsers ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs font-medium">Loading user records...</span>
                </div>
              ) : roleUsers.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No users found for this role</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "Create User for Role" to generate an account under {selectedRoleForView.title}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-4">User Code</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Contact Details</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Created Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {roleUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">
                            {u.userCode || 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block">{u.name}</span>
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail className="w-3 h-3 text-slate-400" /> {u.email}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3 h-3 text-slate-400" /> {u.mobile}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {u.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
                                <XCircle className="w-3 h-3" /> Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-800">Create New Role Account</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="rajesh@avgfranchise.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign System Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                >
                  <option value="ADMIN">Operational Admin</option>
                  <option value="DIRECTOR">Director Analytics</option>
                  <option value="HEAD_COORDINATOR">Head Coordinator</option>
                  <option value="STATE_HEAD">State Head</option>
                  <option value="SALES_MANAGER">Sales Manager</option>
                  <option value="FRANCHISE">Franchise Partner</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? 'Generating Account...' : 'Generate & Email Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;