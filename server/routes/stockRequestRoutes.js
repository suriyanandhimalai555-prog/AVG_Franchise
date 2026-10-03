import { Router } from 'express';
import { getStockRequests, createStockRequest, updateRequestStatus } from '../controllers/stockRequestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getStockRequests);
router.post('/create', protect, createStockRequest);
router.patch('/:id/status', protect, updateRequestStatus);

export default router;