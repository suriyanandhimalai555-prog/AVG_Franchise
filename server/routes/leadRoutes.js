import express from 'express';
import { 
  getLeads, 
  createLead, 
  deleteLead, 
  syncWhatsAppLeads, 
  syncMetaFormLeads 
} from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getLeads);
router.post('/', createLead);
router.post('/sync-whatsapp', syncWhatsAppLeads);
router.post('/sync-meta-form', syncMetaFormLeads); // New route for Meta Embedded Forms
router.delete('/:id', deleteLead);

export default router;