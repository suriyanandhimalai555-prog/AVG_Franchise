import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Signup';

// superadmin pages
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

        {/* Admin Section with Persistent Layout */}
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