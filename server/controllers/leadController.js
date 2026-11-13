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
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const FORM_ID = req.body.formId || process.env.META_FORM_ID; // Optional environment or request form ID

    if (!FORM_ID) {
      return res.status(400).json({ error: 'Meta Form ID is required for syncing embedded form leads.' });
    }

    // Call Meta Graph API to get leads submitted through the specific form
    const metaResponse = await axios.get(
      `https://graph.facebook.com/v17.0/${FORM_ID}/leads`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
      }
    ).catch(err => {
      console.error('Meta API Form Leads Error:', err.response?.data);
      throw new Error(err.response?.data?.error?.message || 'Failed to fetch leads from Meta API');
    });

    const formLeads = metaResponse.data?.data || [];
    let syncedCount = 0;

    for (const item of formLeads) {
      // Meta form field data comes as an array of field objects: [{name: 'full_name', values: [...]}, {name: 'phone_number', values: [...]}, ...]
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
            notes: `Submitted via Meta Embedded Form (ID: ${FORM_ID})`,
          }
        });

        if (created) syncedCount++;
      }
    }

    const allLeads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ 
      message: `Successfully synced ${syncedCount} new lead(s) from Meta Embedded Forms!`, 
      leads: allLeads 
    });

  } catch (error) {
    console.error('Sync Meta Form Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to sync Meta form leads' });
  }
};