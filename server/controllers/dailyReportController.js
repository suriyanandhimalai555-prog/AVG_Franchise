import DailyReport from '../models/DailyReport.js';
import User from '../models/User.js';

// POST /api/daily-reports
export const createDailyReport = async (req, res) => {
  try {
    const { reportContent } = req.body;
    const user = req.user; // Attached by protect middleware

    if (!reportContent || !reportContent.trim()) {
      return res.status(400).json({ message: 'Report content cannot be empty.' });
    }

    const newReport = await DailyReport.create({
      userId: user.id,
      userName: user.name,
      userCode: user.userCode || 'SM-GEN',
      state: user.state || 'General',
      reportContent,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Daily EOD report submitted successfully.',
      report: newReport,
    });
  } catch (error) {
    console.error('Error creating daily report:', error);
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/daily-reports
export const getMyDailyReports = async (req, res) => {
  try {
    const user = req.user;

    // Sales managers see their own reports. Super Admins/Admins can see all or filter.
    const whereClause = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? {} : { userId: user.id };

    const reports = await DailyReport.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/daily-reports/state-reports (For State Head / Admins)
export const getStateSalesManagerReports = async (req, res) => {
  try {
    const currentUser = req.user; // Logged-in user (State Head or Admin)

    // If the user is a State Head, get their state
    let targetState = currentUser.state;

    // If super admin / admin provides a state query param, use it, else use user state
    if ((currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && req.query.state) {
      targetState = req.query.state;
    }

    if (!targetState) {
      return res.status(400).json({ message: 'State jurisdiction is missing for your profile.' });
    }

    // Fetch all reports
    const reports = await DailyReport.findAll({
      order: [['createdAt', 'DESC']],
    });

    // Match reports where the report's state matches the State Head's state (case-insensitive)
    const filteredReports = reports.filter(report => {
      return report.state && report.state.trim().toLowerCase() === targetState.trim().toLowerCase();
    });

    return res.status(200).json({
      state: targetState,
      reports: filteredReports,
    });
  } catch (error) {
    console.error('Error fetching state reports:', error);
    return res.status(500).json({ message: error.message });
  }
};