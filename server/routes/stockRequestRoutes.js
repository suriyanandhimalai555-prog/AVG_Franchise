import { Router } from 'express';
import { getStockRequests, createStockRequest, updateRequestStatus } from '../controllers/stockRequestController.js';

const router = Router();

router.get('/', getStockRequests);
router.post('/create', createStockRequest);
router.patch('/:id/status', updateRequestStatus);

export default router;