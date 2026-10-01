import { Router } from 'express';
import { getAttendanceStatus, checkIn, checkOut } from '../controllers/attendanceController.js';

const router = Router();

router.get('/status/:franchiseId', getAttendanceStatus);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

export default router;