import { Router } from 'express';
import { getStocks, createStock } from '../controllers/stockController.js';

const router = Router();

router.get('/', getStocks);
router.post('/update', createStock);

export default router;