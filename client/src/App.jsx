import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Signup';

// Superadmin layout & Pages
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';
import RoleManagement from './pages/SuperAdmin/RoleManagement';
import UserManagement from './pages/SuperAdmin/UserManagement';
import BusinessVerticals from './pages/SuperAdmin/BusinessVerticals';
import TerritoryManagement from './pages/SuperAdmin/TerritoryManagement';
import CommissionSettings from './pages/SuperAdmin/CommissionSettings';
import TargetSettings from './pages/SuperAdmin/TargetSettings';
import ApprovalWorkflows from './pages/SuperAdmin/ApprovalWorkflows';
import AuditLogs from './pages/SuperAdmin/AuditLogs';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FranchiseList from './pages/Admin/FranchiseList';
import NewFranchiseSignup from './pages/Admin/NewFranchiseSignup';
import FranchiseLeads from './pages/Admin/FranchiseLeads';
import DailyEntries from './pages/Admin/DailyEntries';
import HierarchyManagement from './pages/Admin/HierarchyManagement';
import { OperationalApprovals, OperationalReports } from './pages/Admin/OperationalApprovals';

// Director Layout & Pages
import DirectorLayout from './layouts/DirectorLayout';
import DirectorDashboard from './pages/Director/DirectorDashboard';
import DirectorTerritories from './pages/Director/DirectorTerritories';
import DirectorFranchises from './pages/Director/DirectorFranchises';
import DirectorManagers from './pages/Director/DirectorManagers';
import DirectorRankings from './pages/Director/DirectorRankings';

import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/UserDashboard';

const AdminRoles = () => <div className="text-xl font-bold text-slate-800">Admin Roles Page</div>;
const UserRoles = () => <div className="text-xl font-bold text-slate-800">User Roles Page</div>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Super Admin Section */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="businesses" element={<BusinessVerticals />} />
          <Route path="territories" element={<TerritoryManagement />} />
          <Route path="commissions" element={<CommissionSettings />} />
          <Route path="targets" element={<TargetSettings />} />
          <Route path="approvals" element={<ApprovalWorkflows />} />
          <Route path="audit" element={<AuditLogs />} />
        </Route>

        {/* Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="franchises" element={<FranchiseList />} />
          <Route path="signup-new" element={<NewFranchiseSignup />} />
          <Route path="leads" element={<FranchiseLeads />} />
          <Route path="daily-entries" element={<DailyEntries />} />
          <Route path="hierarchy" element={<HierarchyManagement />} />
          <Route path="approvals" element={<OperationalApprovals />} />
          <Route path="reports" element={<OperationalReports />} />
        </Route>

        {/* Director Section */}
        <Route path="/director" element={<DirectorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DirectorDashboard />} />
          <Route path="territories" element={<DirectorTerritories />} />
          <Route path="franchises" element={<DirectorFranchises />} />
          <Route path="managers" element={<DirectorManagers />} />
          <Route path="rankings" element={<DirectorRankings />} />
        </Route>

        {/* User Section with Persistent Layout */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="roles" element={<UserRoles />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;