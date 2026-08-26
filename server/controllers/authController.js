import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { sendCredentialsEmail } from '../utils/sendEmail.js';

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

const generateTempPassword = () => {
  return 'AVG@' + Math.floor(100000 + Math.random() * 900000);
};

// @desc Setup initial Super Admin via Postman (Allowed ONLY ONCE)
// @route POST /api/auth/setup-super-admin
export const createSuperAdmin = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingSuperAdmin = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
    if (existingSuperAdmin) {
      return res.status(403).json({
        message: 'Forbidden: Super Admin account already exists. Only one Super Admin is allowed.'
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
      isPasswordResetRequired: false,
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

// @desc Internal Account Creation (All roles EXCEPT SUPER_ADMIN)
// @route POST /api/auth/create-user
export const createUserByAdmin = async (req, res) => {
  const { name, email, mobile, role } = req.body;

  if (role === 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Cannot create another Super Admin account.' });
  }

  const allowedRoles = ['ADMIN', 'DIRECTOR', 'HEAD_COORDINATOR', 'STATE_HEAD', 'SALES_MANAGER', 'FRANCHISE'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  if (!name || !email || !mobile || !role) {
    return res.status(400).json({ message: 'Please provide name, email, mobile, and role.' });
  }

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { mobile }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or mobile already exists.' });
    }

    const tempPassword = generateTempPassword();
    const roleCount = await User.count({ where: { role } });
    const rolePrefix = role.replace('_', '').substring(0, 3).toUpperCase();
    const userCode = `AVG-${rolePrefix}-${String(roleCount + 1).padStart(4, '0')}`;

    const newUser = await User.create({
      name,
      email,
      mobile,
      password: tempPassword,
      role,
      userCode,
      isPasswordResetRequired: true,
    });

    try {
      await sendCredentialsEmail(email, name, tempPassword, role, userCode);
    } catch (emailErr) {
      console.error('Nodemailer Error:', emailErr.message);
    }

    return res.status(201).json({
      message: `${role} created successfully. Temporary password emailed to ${email}.`,
      user: {
        id: newUser.id,
        userCode: newUser.userCode,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
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
        isPasswordResetRequired: user.isPasswordResetRequired,
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

// @desc Force Password Change on First Login
// @route POST /api/auth/change-password
export const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    user.isPasswordResetRequired = false;
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
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
      isPasswordResetRequired: false,
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

export const getRoleCounts = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['role'],
      raw: true,
    });

    // Default template matching your frontend keys
    const counts = {
      SUPER_ADMIN: 0,
      ADMIN: 0,
      DIRECTOR: 0,
      HEAD_COORDINATOR: 0,
      STATE_HEAD: 0,
      SALES_MANAGER: 0,
      FRANCHISE: 0,
    };

    users.forEach((user) => {
      const roleKey = user.role ? user.role.toUpperCase() : null;
      if (roleKey && counts[roleKey] !== undefined) {
        counts[roleKey] += 1;
      }
    });

    return res.status(200).json(counts);
  } catch (error) {
    console.error('Error in getRoleCounts:', error);
    return res.status(500).json({ message: 'Failed to aggregate role counts' });
  }
};

// GET /api/auth/users-by-role/:role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await User.findAll({
      where: { role },
      attributes: ['id', 'userCode', 'name', 'email', 'mobile', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};