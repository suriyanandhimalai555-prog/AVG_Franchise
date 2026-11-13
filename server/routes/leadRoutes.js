import express from 'express';
import { getLeads, createLead } from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getLeads);
router.post('/', createLead);

export default router;