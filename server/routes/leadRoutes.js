import express from 'express';
import { getLeads, createLead, deleteLead, syncWhatsAppLeads } from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getLeads);
router.post('/', createLead);
router.post('/sync-whatsapp', syncWhatsAppLeads); // Endpoint to trigger auto-sync
router.delete('/:id', deleteLead);

export default router;