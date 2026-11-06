import axios from 'axios';
import WhatsappMessage from '../models/whatsappMessage.js';
import { Op } from 'sequelize';

// 1. Webhook Verification (GET)
export const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WHATSAPP_WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
};

// 2. Receive Messages & Status Updates (POST) - Saves incoming chat to DB
export const handleIncomingWebhook = async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          
          // Capture user profile name if provided by Meta
          let senderName = 'Customer';
          if (value.contacts && value.contacts[0]?.profile?.name) {
            senderName = value.contacts[0].profile.name;
          }

          if (value.messages) {
            const incomingMessage = value.messages[0];
            const senderPhone = incomingMessage.from; // e.g. "919876543210"
            const messageText = incomingMessage.text?.body || '[Media/Unsupported Message]';
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            console.log(`Received WhatsApp message from ${senderPhone}: ${messageText}`);

            // Save inbound message to PostgreSQL database
            await WhatsappMessage.create({
              phone: senderPhone,
              name: senderName,
              direction: 'inbound',
              text: messageText,
              timestamp: currentTime,
            });
          }
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
};

// In your backend controllers/whatsappController.js
export const sendWhatsAppMessage = async (req, res) => {
  try {
    const { phone, message, name } = req.body;
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // Call Meta Cloud API
    const metaResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ).catch(err => {
      // This will capture Meta's exact rejection reason (e.g., 24-hour window violation)
      console.error('Meta Rejection:', err.response?.data);
      throw new Error(err.response?.data?.error?.message || 'Meta API rejected message');
    });

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const savedMsg = await WhatsappMessage.create({
      phone: phone,
      name: name || 'Customer',
      direction: 'outbound',
      text: message,
      timestamp: currentTime,
    });

    return res.status(200).json(savedMsg);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// 2. Get Unique List of Conversations for Sidebar
export const getChats = async (req, res) => {
  try {
    const messages = await WhatsappMessage.findAll({
      order: [['createdAt', 'DESC']],
    });

    const chatMap = {};
    messages.forEach((msg) => {
      if (!chatMap[msg.phone]) {
        chatMap[msg.phone] = {
          phone: msg.phone,
          name: msg.name || 'Customer',
          lastMessage: msg.text,
          time: msg.timestamp,
        };
      }
    });

    return res.status(200).json(Object.values(chatMap));
  } catch (error) {
    console.error('Get Chats Error:', error);
    return res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

// 3. Get Full Message History for a Specific Phone Number
export const getMessagesByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const messages = await WhatsappMessage.findAll({
      where: { phone },
      order: [['createdAt', 'ASC']],
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Get Messages Error:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};