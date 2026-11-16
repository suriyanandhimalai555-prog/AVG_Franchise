import Lead from '../models/lead.js';
import WhatsappMessage from '../models/whatsappMessage.js';
import axios from 'axios';

// Get all stored leads from PostgreSQL
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(leads);
  } catch (error) {
    console.error('Get Leads Error:', error);
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

// Create a new lead manually
export const createLead = async (req, res) => {
  try {
    const { name, phone, email, status, notes } = req.body;
    
    const [lead, created] = await Lead.findOrCreate({
      where: { phone },
      defaults: { name, email, status: status || 'Active', notes, leadSource: 'Manual' }
    });

    if (!created) {
      return res.status(400).json({ error: 'Lead with this phone number already exists.' });
    }

    return res.status(201).json(lead);
  } catch (error) {
    console.error('Create Lead Error:', error);
    return res.status(400).json({ error: error.message || 'Failed to create lead' });
  }
};

// Delete a lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Lead.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    return res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete Lead Error:', error);
    return res.status(500).json({ error: 'Failed to delete lead' });
  }
};

// 1. Sync WhatsApp Chat Leads
export const syncWhatsAppLeads = async (req, res) => {
  try {
    const messages = await WhatsappMessage.findAll({
      attributes: ['phone', 'name', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const uniqueMap = {};
    messages.forEach((msg) => {
      if (!uniqueMap[msg.phone]) {
        uniqueMap[msg.phone] = {
          name: msg.name !== 'Customer' ? msg.name : 'WhatsApp Lead',
          phone: msg.phone,
          status: 'Active',
          leadSource: 'WhatsApp',
          notes: 'Auto-synced from WhatsApp chat interaction',
        };
      }
    });

    for (const leadData of Object.values(uniqueMap)) {
      await Lead.findOrCreate({
        where: { phone: leadData.phone },
        defaults: leadData,
      });
    }

    const allLeads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ message: 'WhatsApp leads synced successfully', leads: allLeads });
  } catch (error) {
    console.error('Sync WhatsApp Leads Error:', error);
    return res.status(500).json({ error: 'Failed to sync WhatsApp leads' });
  }
};

// 2. Sync Meta Leads Across ALL Forms Automatically
export const syncMetaFormLeads = async (req, res) => {
  try {
    const rawToken = process.env.META_PAGE_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    let PAGE_TOKEN = rawToken ? rawToken.trim() : '';
    const PAGE_ID = process.env.META_PAGE_ID;

    if (!PAGE_TOKEN || !PAGE_ID) {
      return res.status(400).json({ error: 'Meta Page Access Token or Page ID is missing in environment variables.' });
    }

    // Auto-exchange for Page Token if needed
    try {
      const tokenExchangeRes = await axios.get(`https://graph.facebook.com/v21.0/${PAGE_ID}`, {
        params: { fields: 'access_token', access_token: PAGE_TOKEN }
      });
      if (tokenExchangeRes.data?.access_token) {
        PAGE_TOKEN = tokenExchangeRes.data.access_token;
      }
    } catch (e) {
      // Use raw token as fallback
    }

    let formsUrl = `https://graph.facebook.com/v21.0/${PAGE_ID}/leadgen_forms?access_token=${PAGE_TOKEN}`;
    let allForms = [];

    while (formsUrl) {
      const formsResponse = await axios.get(formsUrl).catch(() => null);
      if (!formsResponse) break;
      allForms = allForms.concat(formsResponse.data?.data || []);
      formsUrl = formsResponse.data?.paging?.next || null;
    }

    let totalSyncedCount = 0;

    for (const form of allForms) {
      const FORM_ID = form.id;
      let formLeads = [];
      let nextUrl = `https://graph.facebook.com/v21.0/${FORM_ID}/leads?access_token=${PAGE_TOKEN}&limit=100`;

      while (nextUrl) {
        const metaResponse = await axios.get(nextUrl).catch(() => null);
        if (!metaResponse) break;
        formLeads = formLeads.concat(metaResponse.data?.data || []);
        nextUrl = metaResponse.data?.paging?.next || null;
      }

      for (const item of formLeads) {
        const fieldData = item.field_data || [];
        let name = 'Meta Form Lead';
        let phone = '';
        let email = '';

        fieldData.forEach(field => {
          if (field.name === 'full_name' || field.name === 'name') {
            name = field.values?.[0] || name;
          }
          if (field.name === 'phone_number' || field.name === 'phone') {
            phone = field.values?.[0]?.replace(/\D/g, '') || '';
          }
          if (field.name === 'email') {
            email = field.values?.[0] || '';
          }
        });

        if (phone) {
          const [, created] = await Lead.findOrCreate({
            where: { phone },
            defaults: {
              name,
              email,
              status: 'Active',
              leadSource: 'Meta Embedded Form',
              formId: FORM_ID,
              notes: `Submitted via Meta Form (ID: ${FORM_ID})`,
            }
          });
          if (created) totalSyncedCount++;
        }
      }
    }

    const allLeads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ 
      message: `Successfully synced ${totalSyncedCount} new lead(s) across ${allForms.length} Meta form(s)!`, 
      leads: allLeads 
    });

  } catch (error) {
    console.error('Sync Meta Multi-Form Error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to sync Meta form leads' });
  }
};

// 3. Verify Meta Webhook
export const verifyMetaWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'my_secure_verify_token_123';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED successfully');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
};

// 4. Handle Real-time Incoming Meta Lead Webhooks with Diagnostic Logging
export const handleMetaWebhook = async (req, res) => {
  try {
    console.log('--- WEBHOOK EVENT RECEIVED ---', JSON.stringify(req.body, null, 2));
    const body = req.body;

    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const change of entry.changes || []) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value?.leadgen_id;
            const formId = change.value?.form_id;
            const pageId = change.value?.page_id;

            console.log(`Processing Real-time Lead -> Lead ID: ${leadgenId}, Form ID: ${formId}`);

            const rawToken = process.env.META_PAGE_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
            let PAGE_TOKEN = rawToken ? rawToken.trim() : '';

            if (!PAGE_TOKEN) {
              console.error('Webhook Error: Page Access Token missing.');
              continue;
            }

            try {
              const tokenRes = await axios.get(`https://graph.facebook.com/v21.0/${pageId}`, {
                params: { fields: 'access_token', access_token: PAGE_TOKEN }
              });
              if (tokenRes.data?.access_token) {
                PAGE_TOKEN = tokenRes.data.access_token;
              }
            } catch (e) {
              // Fallback to existing token
            }

            // Fetch lead details using leadgen_id
            const leadResponse = await axios.get(`https://graph.facebook.com/v21.0/${leadgenId}`, {
              params: { access_token: PAGE_TOKEN }
            }).catch(err => {
              console.error('Failed to fetch individual lead from Graph API:', err.response?.data?.error || err.message);
              return null;
            });

            if (leadResponse && leadResponse.data) {
              const item = leadResponse.data;
              const fieldData = item.field_data || [];
              let name = 'Meta Form Lead';
              let phone = '';
              let email = '';

              fieldData.forEach(field => {
                if (field.name === 'full_name' || field.name === 'name') {
                  name = field.values?.[0] || name;
                }
                if (field.name === 'phone_number' || field.name === 'phone') {
                  phone = field.values?.[0]?.replace(/\D/g, '') || '';
                }
                if (field.name === 'email') {
                  email = field.values?.[0] || '';
                }
              });

              if (phone) {
                await Lead.findOrCreate({
                  where: { phone },
                  defaults: {
                    name,
                    email,
                    status: 'Active',
                    leadSource: 'Meta Embedded Form',
                    formId: formId,
                    notes: `Submitted instantly via Meta Webhook (Form ID: ${formId})`,
                  }
                });
                console.log(`Successfully saved real-time webhook lead: ${name} (${phone})`);
              }
            }
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    console.error('Webhook Processing Exception:', error.message);
    return res.status(500).json({ error: error.message });
  }
};