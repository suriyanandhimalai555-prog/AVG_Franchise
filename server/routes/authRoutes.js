import express from 'express';
import { 
  createSuperAdmin, 
  loginUser, 
  registerFranchise, 
  createUserByAdmin,
  changePassword,
  getRoleCounts,
  getUsersByRole,
  getAllUsers,
  getTerritoryOverview, 
  getStockholdersByState,
  getPendingApprovals,
  approveFranchise,
  rejectFranchise
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// One-time Super Admin setup via Postman
router.post('/setup-super-admin', createSuperAdmin);

// Unified Login for all roles
router.post('/login', loginUser);

// Password update after first login
router.post('/change-password', protect, changePassword);

// Public Franchise Onboarding / Signup
router.post('/register-franchise', registerFranchise);

// Protected account creation (SUPER_ADMIN & ADMIN only)
router.post(
  '/create-user',
  protect,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  createUserByAdmin
);

router.get('/pending-approvals', protect, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getPendingApprovals);
router.put('/approve-franchise/:userId', protect, authorizeRoles('SUPER_ADMIN', 'ADMIN'), approveFranchise);
router.put('/reject-franchise/:userId', protect, authorizeRoles('SUPER_ADMIN', 'ADMIN'), rejectFranchise);

// Get role metrics and user listings
router.get('/role-counts', protect, getRoleCounts);
router.get('/users-by-role/:role', protect, getUsersByRole);
router.get('/all-users', protect, getAllUsers);

router.get('/territory-overview', protect, getTerritoryOverview);
router.get('/stockholders-by-state', protect, getStockholdersByState);

export default router;