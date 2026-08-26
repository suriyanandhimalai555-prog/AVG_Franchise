import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const ROLE_REDIRECT_MAP = {
  SUPER_ADMIN: '/super-admin',
  ADMIN: '/admin',
  DIRECTOR: '/director',
  HEAD_COORDINATOR: '/head-coordinator',
  STATE_HEAD: '/state-head',
  SALES_MANAGER: '/sales-manager',
  FRANCHISE: '/franchise',
};

// @desc Setup initial Super Admin via Postman (Allowed ONLY ONCE)
// @route POST /api/auth/setup-super-admin
export const createSuperAdmin = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Strict Guard: Check if ANY Super Admin already exists
    const existingSuperAdmin = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
    if (existingSuperAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Super Admin account already exists. Only one Super Admin is allowed in the system.'
      });
    }

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'Please provide name, email, mobile, and password' });
    }

    const superAdmin = await User.create({
      name,
      email,
      mobile,
      password,
      role: 'SUPER_ADMIN',
      userCode: 'AVG-SUPERADMIN-001',
    });

    return res.status(201).json({
      message: 'Super Admin created successfully!',
      user: {
        id: superAdmin.id,
        name: superAdmin.name,
        email: superAdmin.email,
        mobile: superAdmin.mobile,
        userCode: superAdmin.userCode,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Single Login Endpoint for ALL Roles
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { mobile: identifier },
          { userCode: identifier },
        ],
      },
    });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        userCode: user.userCode,
        redirectTo: ROLE_REDIRECT_MAP[user.role],
        token: generateToken(user.id, user.role),
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Public Franchise Application
// @route POST /api/auth/register-franchise
export const registerFranchise = async (req, res) => {
  const { name, mobile, businessType, street, area, state, district, pincode, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { mobile } });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const userPassword = password || `AVG@${mobile.slice(-4)}`;
    const franchiseCount = await User.count({ where: { role: 'FRANCHISE' } });
    const stateCode = state ? state.substring(0, 2).toUpperCase() : 'IN';
    const distCode = district ? district.substring(0, 3).toUpperCase() : 'GEN';
    const userCode = `AVG-${stateCode}-${distCode}-${String(franchiseCount + 1).padStart(5, '0')}`;

    const newFranchise = await User.create({
      name,
      mobile,
      businessType,
      street,
      area,
      state,
      district,
      pincode,
      password: userPassword,
      role: 'FRANCHISE',
      userCode,
    });

    return res.status(201).json({
      message: 'Franchise application submitted successfully',
      userCode: newFranchise.userCode,
      redirectTo: ROLE_REDIRECT_MAP['FRANCHISE'],
      token: generateToken(newFranchise.id, newFranchise.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Internal Account Creation (Super Admin & Admin only)
// @route POST /api/auth/create-user
export const createUserByAdmin = async (req, res) => {
  const { name, email, mobile, password, role } = req.body;

  if (role === 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Cannot create another Super Admin account.' });
  }

  try {
    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role,
    });

    return res.status(201).json({
      message: `${role} account created successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};