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

// 2. Sync Meta Embedded Forms / Lead Ads Leads
export const syncMetaFormLeads = async (req, res) => {
  try {
    const rawToken = process.env.META_PAGE_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    const PAGE_TOKEN = rawToken ? rawToken.trim() : '';
    const PAGE_ID = process.env.META_PAGE_ID; // Your Facebook Page ID

    console.log("--- Meta Multi-Form Lead Sync Debug ---");
    console.log("Token Present:", !!PAGE_TOKEN, "Length:", PAGE_TOKEN.length);
    console.log("Page ID Configured:", PAGE_ID);

    if (!PAGE_TOKEN || PAGE_TOKEN.length < 20) {
      return res.status(400).json({ 
        error: 'Access token is missing, empty, or malformed in environment variables.' 
      });
    }

    if (!PAGE_ID) {
      return res.status(400).json({ 
        error: 'Meta Page ID is not configured. Please set META_PAGE_ID in your environment variables.' 
      });
    }

    // Step A: Fetch ALL Lead Forms associated with this Facebook Page automatically
    let formsUrl = `https://graph.facebook.com/v21.0/${PAGE_ID}/leadgen_forms?access_token=${PAGE_TOKEN}`;
    let allForms = [];

    while (formsUrl) {
      const formsResponse = await axios.get(formsUrl).catch(err => {
        const errorData = err.response?.data?.error;
        console.error('Meta API Fetch Forms Error:', errorData || err.message);
        throw new Error(errorData?.message || 'Failed to fetch lead forms from Meta API');
      });

      const formsData = formsResponse.data;
      if (formsData?.data) {
        allForms = allForms.concat(formsData.data);
      }
      formsUrl = formsData?.paging?.next || null;
    }

    console.log(`Found ${allForms.length} Lead Form(s) for Page ID ${PAGE_ID}`);

    let totalSyncedCount = 0;
    let grandTotalFormLeads = 0;

    // Step B: Loop through EVERY form found and fetch its leads with pagination
    for (const form of allForms) {
      const FORM_ID = form.id;
      let formLeads = [];
      let nextUrl = `https://graph.facebook.com/v21.0/${FORM_ID}/leads?access_token=${PAGE_TOKEN}&limit=100`;

      while (nextUrl) {
        const metaResponse = await axios.get(nextUrl).catch(err => {
          console.error(`Failed to fetch leads for Form ID ${FORM_ID}:`, err.response?.data?.error?.message || err.message);
          return null;
        });

        if (!metaResponse) break;

        const responseData = metaResponse.data;
        if (responseData?.data) {
          formLeads = formLeads.concat(responseData.data);
        }
        nextUrl = responseData?.paging?.next || null;
      }

      grandTotalFormLeads += formLeads.length;

      // Step C: Save each lead into PostgreSQL
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
          const [lead, created] = await Lead.findOrCreate({
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