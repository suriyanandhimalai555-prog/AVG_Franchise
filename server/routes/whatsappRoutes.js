import express from 'express';
import { verifyWebhook, handleIncomingWebhook } from '../controllers/whatsappController.js';

const router = express.Router();

// GET request for Meta verification handshake
router.get('/webhook', verifyWebhook);

// POST request for incoming messages and updates
router.post('/webhook', handleIncomingWebhook);

export default router;