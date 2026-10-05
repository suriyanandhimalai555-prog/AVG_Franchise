import { Router } from 'express';
import { getAttendanceStatus, checkIn, checkOut, getAllAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js'; // Adjust path as per your project setup

const router = Router();

// Apply authentication middleware so req.user is always populated
router.get('/status/:franchiseId', protect, getAttendanceStatus);
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/all', protect, getAllAttendance);

export default router;