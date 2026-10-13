import express from 'express';
import { createDailyReport, getMyDailyReports, getStateSalesManagerReports } from '../controllers/dailyReportController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('SUPER_ADMIN', 'SALES_MANAGER'), createDailyReport);
router.get('/', protect, getMyDailyReports);

router.get('/state-reports', protect, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'STATE_HEAD'), getStateSalesManagerReports);

export default router;