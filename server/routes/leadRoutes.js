import express from 'express';
import { 
  getLeads, 
  createLead, 
  deleteLead, 
  syncWhatsAppLeads, 
  syncMetaFormLeads,
  verifyMetaWebhook,
  handleMetaWebhook 
} from '../controllers/leadController.js';

const router = express.Router();

router.get('/', getLeads);
router.post('/', createLead);
router.post('/sync-whatsapp', syncWhatsAppLeads);
router.post('/sync-meta-form', syncMetaFormLeads); // New route for Meta Embedded Forms
router.delete('/:id', deleteLead);

// NEW Webhook Routes for Instant Lead Capture
router.get('/webhook', verifyMetaWebhook);
router.post('/webhook', handleMetaWebhook);

export default router;