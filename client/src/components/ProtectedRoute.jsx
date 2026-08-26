import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Role-to-Dashboard route mapping
const ROLE_DASHBOARDS = {
  SUPER_ADMIN: '/super-admin/dashboard',
  ADMIN: '/admin/dashboard',
  DIRECTOR: '/director/dashboard',
  HEAD_COORDINATOR: '/head-coordinator/dashboard',
  STATE_HEAD: '/state-head/dashboard',
  SALES_MANAGER: '/sales-manager/dashboard',
  FRANCHISE: '/franchise/dashboard',
};

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (err) {
    console.error('Failed to parse user session:', err);
  }

  // 1. Unauthenticated -> Redirect to Login & preserve attempted URL
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Unauthorized Role -> Redirect to their allowed home dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultHome = ROLE_DASHBOARDS[user.role] || '/login';
    return <Navigate to={defaultHome} replace />;
  }

  // 3. Authorized -> Render requested route
  return <Outlet />;
};

export default ProtectedRoute;