import express from 'express';
import { 
  createSuperAdmin, 
  loginUser, 
  registerFranchise, 
  createUserByAdmin,
  changePassword,
  getRoleCounts,
  getUsersByRole,
  getAllUsers
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

// Get role metrics and user listings
router.get('/role-counts', protect, getRoleCounts);
router.get('/users-by-role/:role', protect, getUsersByRole);
router.get('/all-users', protect, getAllUsers);

export default router;