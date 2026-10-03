import { Router } from 'express';
import { getAttendanceStatus, checkIn, checkOut, getAllAttendance } from '../controllers/attendanceController.js';

const router = Router();

router.get('/status/:franchiseId', getAttendanceStatus);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/all', getAllAttendance);

export default router;