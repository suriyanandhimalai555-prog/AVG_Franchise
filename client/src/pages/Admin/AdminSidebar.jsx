import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Store, UserPlus, Users, FileSpreadsheet,
    CheckSquare, BarChart3, LogOut, X, ChevronRight, Layers
} from 'lucide-react';
import Logo from '../../assets/logo.png'

const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Franchise Directory', path: '/admin/franchises', icon: Store },
    { label: 'New Franchise Signup', path: '/admin/signup-new', icon: UserPlus },
    { label: 'Franchise Leads CRM', path: '/admin/leads', icon: Users },
    { label: 'Daily Entries & Verifications', path: '/admin/daily-entries', icon: FileSpreadsheet },
    { label: 'Hierarchy Staff Management', path: '/admin/hierarchy', icon: Layers },
    { label: 'Approvals & Workflows', path: '/admin/approvals', icon: CheckSquare },
    { label: 'Operational Reports & Audits', path: '/admin/reports', icon: BarChart3 },
];

const AdminSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" />}
            <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-[#0B132B] text-slate-400 flex flex-col transition-transform duration-300
        lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Top Sidebar Header */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 mt-2">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="AVG Logo" className="w-9 h-9 bg-white border border-slate-300 rounded-lg" />
                        <div>
                            <span className="text-sm font-bold text-white tracking-tight block leading-none">AVG Franchise</span>
                            <span className="text-[10px] font-medium text-slate-500 mt-1 block">Admin Panel</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Group Header */}
                <div className="px-6 pt-5 pb-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Menu Overview</span>
                </div>

                {/* Navigation Item List */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all
                  ${isActive ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                                            <span>{item.label}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800/80">
                    <NavLink to="/login" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Session</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;    