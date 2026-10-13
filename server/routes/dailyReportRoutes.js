import express from 'express';
import { createDailyReport, getMyDailyReports } from '../controllers/dailyReportController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('SUPER_ADMIN', 'SALES_MANAGER'), createDailyReport);
router.get('/', protect, getMyDailyReports);

export default router;