import express from 'express';
import { 
  createSuperAdmin, 
  loginUser, 
  registerFranchise, 
  createUserByAdmin 
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// One-time Super Admin setup via Postman
router.post('/setup-super-admin', createSuperAdmin);

// Unified Login for all roles
router.post('/login', loginUser);

// Public Franchise Onboarding
router.post('/register-franchise', registerFranchise);

// Protected Admin creation route
router.post(
  '/create-user',
  protect,
  authorizeRoles('SUPER_ADMIN', 'ADMIN'),
  createUserByAdmin
);

export default router;