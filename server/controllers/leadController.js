import Lead from '../models/lead.js';
import WhatsappMessage from '../models/whatsappMessage.js';
import axios from 'axios';

const GRAPH_VERSION = 'v21.0';

// Explicit readable labels for "AVG – Franchise Partner Enquiry 26/10/2026" & standard Meta fields
const KNOWN_FIELD_LABELS = {
  full_name: 'Full Name',
  name: 'Full Name',
  phone_number: 'Phone Number',
  phone: 'Phone Number',
  email: 'Email Address',
  city: 'City',
  state: 'State',
  phone_number_verified: 'Phone Number Verified',
  'which_state/union_territory_are_you_interested_in_starting_the_franchise?':
    'State / UT Interested in Starting Franchise',
  'which_agilavetri_business_opportunity_are_you_most_interested_in?':
    'Agilavetri Business Opportunity Interested In',
  'when_are_you_planning_to_start_the_business?':
    'Planning to Start Business',
  'which_city/district_would_you_like_to_operate_in?':
    'Preferred City / District to Operate In',
};

const formatQuestionLabel = (key) => {
  if (!key) return 'Question';
  const trimmed = key.trim();
  const lower = trimmed.toLowerCase();
  if (KNOWN_FIELD_LABELS[lower]) return KNOWN_FIELD_LABELS[lower];

  return trimmed
    .replace(/[_/]+/g, ' ')
    .replace(/\?+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAnswerValue = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  const str = String(val).trim();
  if (!str) return '';
  if (str.includes('@') || str.startsWith('http') || /^\+?\d+$/.test(str)) {
    return str;
  }
  if (/^[a-z0-9]+(_[a-z0-9]+)+$/i.test(str)) {
    return str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return str;
};

// Use the exact Page Access Token configured in env (same token used in Postman)
const getMetaToken = () => {
  return (
    process.env.META_PAGE_ACCESS_TOKEN ||
    process.env.WHATSAPP_ACCESS_TOKEN ||
    ''
  ).trim();
};

const fetchFormSchema = async (formId, token) => {
  if (!formId) return { formName: 'Meta Form', questionMap: {} };
  try {
    const res = await axios.get(`https://graph.facebook.com/${GRAPH_VERSION}/${formId}`, {
      params: { fields: 'id,name,questions', access_token: token },
    });
    const formName = res.data?.name || `Form (${formId})`;
    const questionMap = {};
    for (const q of res.data?.questions || []) {
      if (q.key && q.label) {
        questionMap[q.key] = q.label;
      }
    }
    return { formName, questionMap };
  } catch (err) {
    console.warn(`Form schema lookup failed (${formId}):`, err.response?.data?.error?.message || err.message);
    return { formName: `Form (${formId})`, questionMap: {} };
  }
};

const resolveCampaignAndAd = async (item, token) => {
  let campaignName = item.campaign_name || '';
  let adName = item.ad_name || '';

  if ((!campaignName || !adName) && item.ad_id) {
    try {
      const adRes = await axios.get(`https://graph.facebook.com/${GRAPH_VERSION}/${item.ad_id}`, {
        params: { fields: 'name,campaign{name},adset{name}', access_token: token },
      });
      if (!adName && adRes.data?.name) adName = adRes.data.name;
      if (!campaignName && adRes.data?.campaign?.name) campaignName = adRes.data.campaign.name;
    } catch {
      // Ignore if token lacks ads_read
    }
  }

  if (!campaignName) {
    campaignName = item.campaign_id
      ? `Campaign ID: ${item.campaign_id}`
      : item.is_organic
      ? 'Organic / Page Post'
      : 'Direct / Test Lead';
  }

  if (!adName) {
    adName = item.ad_id
      ? `Ad ID: ${item.ad_id}`
      : item.is_organic
      ? 'Organic Lead'
      : 'N/A';
  }

  return { campaignName, adName };
};

const parseMetaFieldData = (fieldData = [], questionMap = {}) => {
  let name = '';
  let phone = '';
  let email = '';
  const allAnswers = {};

  for (const field of fieldData) {
    const rawKey = field.name || 'field';
    const lowerKey = rawKey.trim().toLowerCase();

    const label =
      KNOWN_FIELD_LABELS[lowerKey] ||
      questionMap[rawKey] ||
      formatQuestionLabel(rawKey);

    const rawJoined = Array.isArray(field.values)
      ? field.values.filter((v) => v !== undefined && v !== null && String(v).trim() !== '').join(', ')
      : String(field.values ?? '');

    const formattedVal = formatAnswerValue(rawJoined);
    const uniqueLabel = Object.prototype.hasOwnProperty.call(allAnswers, label)
      ? `${label} (${rawKey})`
      : label;

    allAnswers[uniqueLabel] = formattedVal;

    if (!name && (lowerKey === 'full_name' || lowerKey === 'name' || lowerKey === 'first_name')) {
      name = formattedVal;
    }
    if (!phone && (lowerKey === 'phone_number' || lowerKey === 'phone' || lowerKey.includes('mobile') || lowerKey.includes('phone'))) {
      phone = rawJoined.replace(/\D/g, '');
    }
    if (!email && (lowerKey === 'email' || lowerKey.includes('email'))) {
      email = rawJoined.trim();
    }
  }

  return {
    name: name || 'Meta Form Lead',
    phone,
    email,
    allAnswers,
  };
};

// Get all stored leads
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

// Create a lead manually
export const createLead = async (req, res) => {
  try {
    const { name, phone, email, status, notes } = req.body;
    const cleanPhone = (phone || '').replace(/\D/g, '') || phone;

    const [lead, created] = await Lead.findOrCreate({
      where: { phone: cleanPhone },
      defaults: {
        name,
        phone: cleanPhone,
        email,
        status: status || 'Active',
        notes,
        leadSource: 'Manual',
        formId: 'manual',
        campaignName: 'Manual Entry',
        adName: 'Manual Entry',
        rawFields: {
          'Lead Form Name': 'Manual Entry',
          'Source Type': 'Manual Creation',
        },
      },
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
    for (const msg of messages) {
      if (!uniqueMap[msg.phone]) {
        uniqueMap[msg.phone] = {
          name: msg.name && msg.name !== 'Customer' ? msg.name : 'WhatsApp Lead',
          phone: msg.phone,
          status: 'Active',
          leadSource: 'WhatsApp',
          formId: 'whatsapp_chat',
          notes: 'Auto-synced from WhatsApp chat interaction',
          campaignName: 'WhatsApp Chat',
          adName: 'Direct Interaction',
          rawFields: {
            'Lead Form Name': 'WhatsApp Chat',
            'Channel': 'WhatsApp Chat Interaction',
          },
        };
      }
    }

    for (const leadData of Object.values(uniqueMap)) {
      const [leadInstance] = await Lead.findOrCreate({
        where: { phone: leadData.phone },
        defaults: leadData,
      });

      await leadInstance.update({
        campaignName: leadInstance.campaignName || leadData.campaignName,
        adName: leadInstance.adName || leadData.adName,
        rawFields: {
          ...(leadInstance.rawFields || {}),
          ...leadData.rawFields,
        },
      });
    }

    const allLeads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({
      message: 'WhatsApp leads synced successfully',
      leads: allLeads,
    });
  } catch (error) {
    console.error('Sync WhatsApp Leads Error:', error);
    return res.status(500).json({ error: 'Failed to sync WhatsApp leads' });
  }
};

// 2. Sync Meta Leads (Uses exact META_PAGE_ACCESS_TOKEN like Postman)
export const syncMetaFormLeads = async (req, res) => {
  try {
    const token = getMetaToken();
    const pageId = (process.env.META_PAGE_ID || '').trim();
    const bodyFormId = (req.body?.formId || process.env.META_FORM_ID || '').trim();

    if (!token) {
      return res.status(400).json({
        error: 'META_PAGE_ACCESS_TOKEN is missing in backend environment variables.',
      });
    }

    let formsToSync = [];

    if (pageId) {
      let formsUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/leadgen_forms`;
      let formsParams = { fields: 'id,name,status,questions', access_token: token, limit: 100 };

      while (formsUrl) {
        const formsResponse = await axios.get(formsUrl, { params: formsParams });
        formsToSync.push(...(formsResponse.data?.data || []));
        formsUrl = formsResponse.data?.paging?.next || null;
        formsParams = {};
      }
    }

    if (formsToSync.length === 0 && bodyFormId) {
      const schema = await fetchFormSchema(bodyFormId, token);
      formsToSync.push({
        id: bodyFormId,
        name: schema.formName,
        questions: Object.entries(schema.questionMap).map(([key, label]) => ({ key, label })),
      });
    }

    if (formsToSync.length === 0) {
      return res.status(400).json({
        error: 'No Meta forms found. Set META_PAGE_ID or formId in .env.',
      });
    }

    let totalNewCount = 0;
    let totalUpdatedCount = 0;

    for (const form of formsToSync) {
      const formId = String(form.id);
      const formName = form.name || `Form (${formId})`;

      const questionMap = {};
      for (const q of form.questions || []) {
        if (q.key && q.label) {
          questionMap[q.key] = q.label;
        }
      }

      let leadsUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${formId}/leads`;
      let leadsParams = {
        fields: 'id,created_time,field_data,campaign_id,campaign_name,ad_id,ad_name,adset_id,adset_name,platform,is_organic',
        access_token: token,
        limit: 100,
      };
      const formLeads = [];

      while (leadsUrl) {
        const metaResponse = await axios.get(leadsUrl, { params: leadsParams });
        formLeads.push(...(metaResponse.data?.data || []));
        leadsUrl = metaResponse.data?.paging?.next || null;
        leadsParams = {};
      }

      for (const item of formLeads) {
        const { name, phone, email, allAnswers } = parseMetaFieldData(item.field_data, questionMap);
        if (!phone) continue;

        const { campaignName, adName } = await resolveCampaignAndAd(item, token);

        const structuredFields = {
          'Lead Form Name': formName,
          'Form ID': formId,
          'Meta Lead ID': String(item.id),
          ...(item.platform ? { Platform: String(item.platform).toUpperCase() } : {}),
          ...(item.adset_name ? { 'Ad Set Name': item.adset_name } : {}),
          ...(item.created_time ? { 'Submitted At': new Date(item.created_time).toLocaleString() } : {}),
          ...allAnswers,
        };

        const [leadInstance, created] = await Lead.findOrCreate({
          where: { phone },
          defaults: {
            name,
            phone,
            email,
            status: 'Active',
            leadSource: 'Meta Embedded Form',
            formId,
            campaignName,
            adName,
            rawFields: structuredFields,
            notes: `Submitted via "${formName}" (ID: ${formId})`,
          },
        });

        await leadInstance.update({
          name: name !== 'Meta Form Lead' ? name : leadInstance.name,
          email: email || leadInstance.email,
          leadSource: 'Meta Embedded Form',
          formId,
          campaignName,
          adName,
          rawFields: structuredFields,
          notes: `Submitted via "${formName}" (ID: ${formId})`,
        });

        if (created) {
          totalNewCount++;
        } else {
          totalUpdatedCount++;
        }
      }
    }

    const allLeads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({
      message: `Synced ${totalNewCount} new & updated ${totalUpdatedCount} lead(s) across ${formsToSync.length} form(s).`,
      leads: allLeads,
    });
  } catch (error) {
    const metaError = error.response?.data?.error?.message || error.message;
    console.error('Sync Meta Multi-Form Error:', metaError);
    return res.status(500).json({ error: metaError || 'Failed to sync Meta form leads' });
  }
};

// 3. Verify Meta Webhook
export const verifyMetaWebhook = (req, res) => {
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'my_secure_verify_token_123';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// 4. Handle Real-time Meta Lead Webhook
export const handleMetaWebhook = async (req, res) => {
  try {
    const body = req.body;
    if (body.object !== 'page') {
      return res.sendStatus(404);
    }

    const token = getMetaToken();
    if (!token) {
      return res.status(200).send('EVENT_RECEIVED');
    }

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'leadgen') continue;

        const leadgenId = change.value?.leadgen_id;
        const formId = change.value?.form_id ? String(change.value.form_id) : null;
        if (!leadgenId) continue;

        const leadResponse = await axios.get(`https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}`, {
          params: {
            fields: 'id,created_time,field_data,campaign_id,campaign_name,ad_id,ad_name,adset_id,adset_name,form_id,platform,is_organic',
            access_token: token,
          },
        });

        const item = leadResponse.data;
        if (!item) continue;

        const resolvedFormId = item.form_id ? String(item.form_id) : formId;
        const { formName, questionMap } = await fetchFormSchema(resolvedFormId, token);
        const { name, phone, email, allAnswers } = parseMetaFieldData(item.field_data, questionMap);
        if (!phone) continue;

        const { campaignName, adName } = await resolveCampaignAndAd(item, token);

        const structuredFields = {
          'Lead Form Name': formName,
          ...(resolvedFormId ? { 'Form ID': resolvedFormId } : {}),
          'Meta Lead ID': String(item.id),
          ...(item.platform ? { Platform: String(item.platform).toUpperCase() } : {}),
          ...(item.adset_name ? { 'Ad Set Name': item.adset_name } : {}),
          ...(item.created_time ? { 'Submitted At': new Date(item.created_time).toLocaleString() } : {}),
          ...allAnswers,
        };

        const [leadInstance] = await Lead.findOrCreate({
          where: { phone },
          defaults: {
            name,
            phone,
            email,
            status: 'Active',
            leadSource: 'Meta Embedded Form',
            formId: resolvedFormId,
            campaignName,
            adName,
            rawFields: structuredFields,
            notes: `Submitted via "${formName}" (ID: ${resolvedFormId})`,
          },
        });

        await leadInstance.update({
          name: name !== 'Meta Form Lead' ? name : leadInstance.name,
          email: email || leadInstance.email,
          leadSource: 'Meta Embedded Form',
          formId: resolvedFormId,
          campaignName,
          adName,
          rawFields: structuredFields,
          notes: `Submitted via "${formName}" (ID: ${resolvedFormId})`,
        });
      }
    }

    return res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Webhook Processing Exception:', error.message);
    return res.status(500).json({ error: error.message });
  }
};