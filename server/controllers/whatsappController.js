// 1. Webhook Verification (GET)
export const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WHATSAPP_WEBHOOK_VERIFIED');
      return res.status(200).send(challenge); // Must return the challenge string back
    } else {
      return res.sendStatus(403); // Forbidden if tokens don't match
    }
  }
  return res.sendStatus(400);
};

// 2. Receive Messages & Status Updates (POST)
export const handleIncomingWebhook = (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        const value = change.value;
        if (value.messages) {
          const incomingMessage = value.messages[0];
          const senderPhone = incomingMessage.from;
          const messageText = incomingMessage.text?.body;

          console.log(`Received WhatsApp message from ${senderPhone}: ${messageText}`);
          
          // TODO: Save message to your PostgreSQL database / CRM lead record
        }
      });
    });

    return res.status(200).send('EVENT_RECEIVED');
  } else {
    return res.sendStatus(404);
  }
};