import Attendance from '../models/attendanceModel.js';
import { Op } from 'sequelize';

// Get Attendance Status for single franchise
export const getAttendanceStatus = async (req, res) => {
  const franchiseId = req.params.franchiseId || req.user?.id;

  if (!franchiseId) {
    return res.status(400).json({ message: 'Franchise ID is required' });
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch the latest record for today
    const record = await Attendance.findOne({
      where: {
        franchise_id: String(franchiseId),
        check_in_time: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['created_at', 'DESC'], ['id', 'DESC']],
    });

    if (!record) {
      return res.status(200).json({ status: 'NOT_CHECKED_IN', record: null });
    }

    if (record.status === 'ACTIVE') {
      return res.status(200).json({ status: 'CHECKED_IN', record });
    }

    return res.status(200).json({ status: 'CHECKED_OUT', record });
  } catch (error) {
    console.error('Error fetching attendance status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Check In
export const checkIn = async (req, res) => {
  const franchiseId = req.body.franchiseId || req.user?.id;

  if (!franchiseId) {
    return res.status(400).json({ message: 'Franchise ID is required' });
  }

  try {
    const activeCheck = await Attendance.findOne({
      where: { 
        franchise_id: String(franchiseId), 
        status: 'ACTIVE' 
      },
    });

    if (activeCheck) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    const record = await Attendance.create({
      franchise_id: String(franchiseId),
      check_in_time: new Date(),
      status: 'ACTIVE',
    });

    return res.status(201).json({
      message: 'Check-in successful',
      record,
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    return res.status(500).json({ message: 'Failed to process check-in' });
  }
};

// Check Out
export const checkOut = async (req, res) => {
  const franchiseId = req.body.franchiseId || req.user?.id;

  if (!franchiseId) {
    return res.status(400).json({ message: 'Franchise ID is required' });
  }

  try {
    const activeCheck = await Attendance.findOne({
      where: { 
        franchise_id: String(franchiseId), 
        status: 'ACTIVE' 
      },
      order: [['id', 'DESC']],
    });

    if (!activeCheck) {
      return res.status(400).json({ message: 'No active check-in record found' });
    }

    activeCheck.check_out_time = new Date();
    activeCheck.status = 'COMPLETED';
    await activeCheck.save();

    return res.status(200).json({
      message: 'Check-out successful',
      record: activeCheck,
    });
  } catch (error) {
    console.error('Error during check-out:', error);
    return res.status(500).json({ message: 'Failed to process check-out' });
  }
};

// Get All Attendance Records (Superadmin & Franchise Owner support)
export const getAllAttendance = async (req, res) => {
  const { franchiseId, date } = req.query;

  try {
    const whereClause = {};

    // 1. Specific Query Filter
    if (franchiseId && franchiseId.trim() !== '') {
      whereClause.franchise_id = String(franchiseId.trim());
    } 
    // 2. Normal Franchise Owner: Restrict to their own ID only.
    //    If Superadmin/admin: Skip this to fetch ALL franchises.
    else if (req.user && req.user.role !== 'SUPERADMIN' && req.user.role !== 'admin' && req.user.role !== 'SUPER_ADMIN') {
      whereClause.franchise_id = String(req.user.id);
    }

    // Optional Date Filter
    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

      whereClause.check_in_time = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    const records = await Attendance.findAll({
      where: whereClause,
      order: [['check_in_time', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching all attendance records:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching attendance data' });
  }
};