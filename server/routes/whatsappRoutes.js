import express from 'express';
import { 
  verifyWebhook, 
  handleIncomingWebhook, 
  sendWhatsAppMessage, 
  getChats, 
  getMessagesByPhone 
} from '../controllers/whatsappController.js';

const router = express.Router();

router.get('/webhook', verifyWebhook);
router.post('/webhook', handleIncomingWebhook);
router.post('/send', sendWhatsAppMessage);
router.get('/chats', getChats);
router.get('/messages/:phone', getMessagesByPhone);

export default router;