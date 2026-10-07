import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Sequelize, Op } from 'sequelize';
import { sendCredentialsEmail, sendApprovalEmail, sendRejectionEmail } from '../utils/sendEmail.js';

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
  STOCKHOLDER: '/stockholder',
};

const generateTempPassword = () => {
  return 'AVG@' + Math.floor(100000 + Math.random() * 900000);
};

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

export const createUserByAdmin = async (req, res) => {
  const { name, email, mobile, role, territory, state, district, area } = req.body;

  if (role === 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Cannot create another Super Admin account.' });
  }

  const allowedRoles = ['ADMIN', 'DIRECTOR', 'HEAD_COORDINATOR', 'STATE_HEAD', 'SALES_MANAGER', 'FRANCHISE', 'STOCKHOLDER'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  if (!name || !email || !mobile || !role) {
    return res.status(400).json({ message: 'Please provide name, email, mobile, and role.' });
  }

  if (role === 'STOCKHOLDER' && (!state || !district || !area)) {
    return res.status(400).json({ message: 'State, District, and Area are required for Stockholders.' });
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
      territory,
      state,
      district,
      area,
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
        territory: newUser.territory,
        state: newUser.state,
        district: newUser.district,
        area: newUser.area,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.status === 'PENDING') {
      return res.status(403).json({
        message: 'Your franchise application is pending approval. You will receive an email once approved.'
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({
        message: 'Your franchise registration request was rejected. Please contact support.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact administration.' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      userCode: user.userCode,
      area: user.area,
      district: user.district,
      state: user.state,
      territory: user.territory,
      isPasswordResetRequired: user.isPasswordResetRequired,
      redirectTo: ROLE_REDIRECT_MAP[user.role],
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

export const registerFranchise = async (req, res) => {
  const { name, email, mobile, businessType, street, area, state, district, pincode, password } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ message: 'Name, Email, and Mobile are required fields.' });
  }

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { mobile }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or mobile number already exists' });
    }

    const userPassword = password || `AVG@${mobile.slice(-4)}`;
    const franchiseCount = await User.count({ where: { role: 'FRANCHISE' } });
    const stateCode = state ? state.substring(0, 2).toUpperCase() : 'IN';
    const distCode = district ? district.substring(0, 3).toUpperCase() : 'GEN';
    const userCode = `AVG-${stateCode}-${distCode}-${String(franchiseCount + 1).padStart(5, '0')}`;

    const newFranchise = await User.create({
      name,
      email,
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
      status: 'PENDING', // Locked until approval
      isActive: true,
      isPasswordResetRequired: false,
    });

    return res.status(201).json({
      success: true,
      message: 'Franchise application submitted! Please wait for Super Admin approval before logging in.',
      userCode: newFranchise.userCode,
      redirectTo: '/login'
    });
  } catch (error) {
    console.error('Error in registerFranchise:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getRoleCounts = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['role'], raw: true });

    const counts = {
      SUPER_ADMIN: 0,
      ADMIN: 0,
      DIRECTOR: 0,
      HEAD_COORDINATOR: 0,
      STATE_HEAD: 0,
      SALES_MANAGER: 0,
      FRANCHISE: 0,
      STOCKHOLDER: 0,
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

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await User.findAll({
      where: { role },
      attributes: ['id', 'userCode', 'name', 'email', 'mobile', 'territory', 'state', 'district', 'area', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 
        'userCode', 
        'name', 
        'email', 
        'mobile', 
        'role', 
        'state', 
        'district', 
        'isActive', 
        'createdAt'
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// GET /api/auth/territory-overview
export const getTerritoryOverview = async (req, res) => {
  try {
    // 1. Get all distinct states where users exist
    const stateRecords = await User.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('state')), 'state']],
      where: { state: { [Op.ne]: null } },
      raw: true,
    });

    const states = stateRecords.map((r) => r.state).filter(Boolean);

    // 2. Compute counts for each state dynamically from live User data
    const overview = await Promise.all(
      states.map(async (state) => {
        const stockholdersCount = await User.count({
          where: { role: 'STOCKHOLDER', state },
        });

        const franchiseCount = await User.count({
          where: { role: 'FRANCHISE', state },
        });

        const districtRecords = await User.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('district')), 'district']],
          where: { state, district: { [Op.ne]: null } },
          raw: true,
        });

        return {
          state,
          stockholdersCount,
          franchiseCount,
          districtCount: districtRecords.length,
        };
      })
    );

    return res.status(200).json(overview);
  } catch (error) {
    console.error('Error fetching territory overview:', error);
    return res.status(500).json({ message: 'Failed to aggregate territory statistics.' });
  }
};

// GET /api/auth/stockholders-by-state?state=Karnataka
export const getStockholdersByState = async (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({ message: 'State parameter is required.' });
    }

    const stockholders = await User.findAll({
      where: {
        role: 'STOCKHOLDER',
        state: state,
      },
      attributes: ['id', 'userCode', 'name', 'email', 'mobile', 'territory', 'state', 'district', 'area', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(stockholders);
  } catch (error) {
    console.error('Error fetching stockholders:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET PENDING APPROVALS
export const getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: { status: 'PENDING' },
      attributes: ['id', 'userCode', 'name', 'email', 'mobile', 'businessType', 'state', 'district', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    return res.json(pendingUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// APPROVE FRANCHISE
export const approveFranchise = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'APPROVED';
    user.approvedAt = new Date();
    await user.save();

    // Trigger Email Async
    sendApprovalEmail(user.email, user.name, user.userCode).catch(err => 
      console.error('Failed to send approval email:', err.message)
    );

    return res.json({ message: `Franchise ${user.name} approved successfully.` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//REJECT FRANCHISE
export const rejectFranchise = async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'REJECTED';
    await user.save();

    // Trigger Email Async
    sendRejectionEmail(user.email, user.name, reason).catch(err => 
      console.error('Failed to send rejection email:', err.message)
    );

    return res.json({ message: `Franchise ${user.name} application rejected.` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'userCode',
        'name',
        'email',
        'mobile',
        'role',
        'territory',
        'state',
        'district',
        'area',
        'isActive',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Failed to fetch user details' });
  }
};