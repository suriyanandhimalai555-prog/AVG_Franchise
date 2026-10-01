import Ticket from '../models/Ticket.js';

// Hierarchy Order Definition
const HIERARCHY_LEVELS = [
  'SALES_MANAGER',
  'STATE_HEAD',
  'HEAD_COORDINATOR',
  'DIRECTOR',
  'ADMIN',
  'SUPER_ADMIN',
];

// Create Ticket (Franchise)
export const createTicket = async (req, res) => {
  try {
    const { franchiseId, franchiseName, subject, description, priority } = req.body;

    if (!franchiseId || !subject || !description) {
      return res.status(400).json({ success: false, message: 'Required fields missing.' });
    }

    const ticketNumber = `TCK-${Date.now().toString().slice(-6)}`;

    const newTicket = await Ticket.create({
      ticket_number: ticketNumber,
      franchise_id: franchiseId,
      franchise_name: franchiseName,
      subject,
      description,
      priority: priority || 'MEDIUM',
      current_level: 'SALES_MANAGER', // Auto assigns to Sales Manager initially
      status: 'OPEN',
    });

    return res.status(201).json({ success: true, data: newTicket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch Tickets assigned to the requesting user's role/level
export const getTicketsForRole = async (req, res) => {
  try {
    const { role, franchiseId } = req.query;

    let filter = {};
    if (role === 'FRANCHISE') {
      filter = { franchise_id: franchiseId };
    } else {
      filter = { current_level: role };
    }

    const tickets = await Ticket.findAll({
      where: filter,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Forward Ticket to Next Role Hierarchy Level
export const forwardTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { forwardReason } = req.body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const currentIndex = HIERARCHY_LEVELS.indexOf(ticket.current_level);
    if (currentIndex === -1 || currentIndex === HIERARCHY_LEVELS.length - 1) {
      return res.status(400).json({
        success: false,
        message: 'Ticket is already at the highest escalation level (Super Admin).',
      });
    }

    const nextLevel = HIERARCHY_LEVELS[currentIndex + 1];
    ticket.current_level = nextLevel;
    ticket.status = 'FORWARDED';
    if (forwardReason) {
      ticket.resolution_notes = `[Escalated from ${HIERARCHY_LEVELS[currentIndex]}]: ${forwardReason}`;
    }

    await ticket.save();

    return res.status(200).json({
      success: true,
      message: `Ticket successfully forwarded to ${nextLevel.replace('_', ' ')}`,
      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Resolve Ticket
export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    ticket.status = 'RESOLVED';
    ticket.resolution_notes = resolutionNotes || 'Issue marked as resolved.';
    await ticket.save();

    return res.status(200).json({ success: true, message: 'Ticket resolved successfully.', data: ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};