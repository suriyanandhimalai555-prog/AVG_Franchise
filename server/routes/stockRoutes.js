import { Router } from 'express';
import { getStocks, createStock, getAllBranchStocks } from '../controllers/stockController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getStocks);
router.get('/all', protect, getAllBranchStocks);
router.post('/update', protect, createStock);

export default router;