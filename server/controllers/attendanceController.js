import Attendance from '../models/attendanceModel.js';
import { Op } from 'sequelize';

export const getAttendanceStatus = async (req, res) => {
  const { franchiseId } = req.params;

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const record = await Attendance.findOne({
      where: {
        franchise_id: franchiseId,
        check_in_time: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [['id', 'DESC']],
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

export const checkIn = async (req, res) => {
  const { franchiseId } = req.body;

  if (!franchiseId) {
    return res.status(400).json({ message: 'Franchise ID is required' });
  }

  try {
    const activeCheck = await Attendance.findOne({
      where: { franchise_id: franchiseId, status: 'ACTIVE' },
    });

    if (activeCheck) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    const record = await Attendance.create({
      franchise_id: franchiseId,
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

export const checkOut = async (req, res) => {
  const { franchiseId } = req.body;

  if (!franchiseId) {
    return res.status(400).json({ message: 'Franchise ID is required' });
  }

  try {
    const activeCheck = await Attendance.findOne({
      where: { franchise_id: franchiseId, status: 'ACTIVE' },
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