import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Superadmin Layout & Pages
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
import TicketSuperAdmin from './pages/SuperAdmin/TicketSuperAdmin';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FranchiseList from './pages/Admin/FranchiseList';
import NewFranchiseSignup from './pages/Admin/NewFranchiseSignup';
import FranchiseLeads from './pages/Admin/FranchiseLeads';
import DailyEntries from './pages/Admin/DailyEntries';
import HierarchyManagement from './pages/Admin/HierarchyManagement';
import { OperationalApprovals, OperationalReports } from './pages/Admin/OperationalApprovals';
import TicketAdmin from './pages/Admin/TicketAdmin';

// Director Layout & Pages
import DirectorLayout from './layouts/DirectorLayout';
import DirectorDashboard from './pages/Director/DirectorDashboard';
import DirectorTerritories from './pages/Director/DirectorTerritories';
import DirectorFranchises from './pages/Director/DirectorFranchises';
import DirectorManagers from './pages/Director/DirectorManagers';
import DirectorRankings from './pages/Director/DirectorRankings';
import TicketDirector from './pages/Director/TicketDirector';

// Head Coordinator Layout & Pages
import CoordinatorLayout from './layouts/CoordinatorLayout';
import CoordinatorDashboard from './pages/HeadCoordinator/CoordinatorDashboard';
import StateHeadOperations from './pages/HeadCoordinator/StateHeadOperations';
import StateComparison from './pages/HeadCoordinator/StateComparison';
import CoordinatorApprovals from './pages/HeadCoordinator/CoordinatorApprovals';
import TicketHeadCoordinator from './pages/HeadCoordinator/TicketHeadCoordinator';

// State Head Layout & Pages
import StateHeadLayout from './layouts/StateHeadLayout';
import StateHeadDashboard from './pages/StateHead/StateHeadDashboard';
import DistrictOperations from './pages/StateHead/DistrictOperations';
import SalesManagers from './pages/StateHead/SalesManagers';
import StateReports from './pages/StateHead/StateReports';
import StateApprovals from './pages/StateHead/StateApprovals';
import TicketStateHead from './pages/StateHead/TicketStateHead';

// Sales Manager Layout & Pages
import SalesManagerLayout from './layouts/SalesManagerLayout';
import StateSalesManagerDashboard from './pages/SalesManager/StateSalesManagerDashboard';
import AssignedFranchises from './pages/SalesManager/AssignedFranchises';
import DailyEntryVerification from './pages/SalesManager/DailyEntryVerification';
import CollectionFollowup from './pages/SalesManager/CollectionFollowup';
import FranchiseVisits from './pages/SalesManager/FranchiseVisits';
import TicketSalesManager from './pages/SalesManager/TicketSalesManager';

// Franchise Layout & Pages
import FranchiseLayout from './layouts/FranchiseLayout';
import FranchiseDashboard from './pages/Franchise/FranchiseDashboard';
import StockRequestFranchise from './pages/Franchise/StockRequestFranchise';
import Collections from './pages/Franchise/Collections';
import Customers from './pages/Franchise/Customers';
import Leads from './pages/Franchise/Leads';
import CommissionEarnings from './pages/Franchise/CommissionEarnings';
import PendingTasks from './pages/Franchise/PendingTasks';
import TicketFranchise from './pages/Franchise/TicketFranchise';

// Stockholder Layout & Pages
import StockholderLayout from './layouts/StockholderLayout';
import StockholderDashboard from './pages/Stockholder/StockholderDashboard';
import StockUpdate from './pages/Stockholder/StockUpdate';
import StockRequest from './pages/Stockholder/StockRequest';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* 1. Super Admin Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
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
            <Route path="tickets" element={<TicketSuperAdmin />} />
          </Route>
        </Route>

        {/* 2. Operational Admin Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} />}>
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
            <Route path="tickets" element={<TicketAdmin />} />
          </Route>
        </Route>

        {/* 3. Director Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'DIRECTOR']} />}>
          <Route path="/director" element={<DirectorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DirectorDashboard />} />
            <Route path="territories" element={<DirectorTerritories />} />
            <Route path="franchises" element={<DirectorFranchises />} />
            <Route path="managers" element={<DirectorManagers />} />
            <Route path="rankings" element={<DirectorRankings />} />
            <Route path="tickets" element={<TicketDirector />} />
          </Route>
        </Route>

        {/* 4. Head Coordinator Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HEAD_COORDINATOR']} />}>
          <Route path="/head-coordinator" element={<CoordinatorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CoordinatorDashboard />} />
            <Route path="state-heads" element={<StateHeadOperations />} />
            <Route path="comparison" element={<StateComparison />} />
            <Route path="approvals" element={<CoordinatorApprovals />} />
            <Route path="tickets" element={<TicketHeadCoordinator />} />
          </Route>
        </Route>

        {/* 5. State Head Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STATE_HEAD']} />}>
          <Route path="/state-head" element={<StateHeadLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StateHeadDashboard />} />
            <Route path="districts" element={<DistrictOperations />} />
            <Route path="managers" element={<SalesManagers />} />
            <Route path="reports" element={<StateReports />} />
            <Route path="approvals" element={<StateApprovals />} />
            <Route path="tickets" element={<TicketStateHead />} />
          </Route>
        </Route>

        {/* 6. State Sales Manager Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SALES_MANAGER']} />}>
          <Route path="/sales-manager" element={<SalesManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StateSalesManagerDashboard />} />
            <Route path="franchises" element={<AssignedFranchises />} />
            <Route path="daily-verifications" element={<DailyEntryVerification />} />
            <Route path="collections" element={<CollectionFollowup />} />
            <Route path="visits" element={<FranchiseVisits />} />
            <Route path="tickets" element={<TicketSalesManager />} />
          </Route>
        </Route>

        {/* 7. Franchise Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'FRANCHISE']} />}>
          <Route path="/franchise" element={<FranchiseLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FranchiseDashboard />} />
            <Route path="stock-requests" element={<StockRequestFranchise />} />
            <Route path="entries" element={<DailyEntries />} />
            <Route path="collections" element={<Collections />} />
            <Route path="customers" element={<Customers />} />
            <Route path="leads" element={<Leads />} />
            <Route path="commissions" element={<CommissionEarnings />} />
            <Route path="tasks" element={<PendingTasks />} />
            <Route path="tickets" element={<TicketFranchise />} />
          </Route>
        </Route>

        {/* 8. Stockholder Section */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STOCKHOLDER']} />}>
          <Route path="/stockholder" element={<StockholderLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StockholderDashboard />} />
            <Route path="stock-update" element={<StockUpdate />} />
            <Route path="stock-requests" element={<StockRequest />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;