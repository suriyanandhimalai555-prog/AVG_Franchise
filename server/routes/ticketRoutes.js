import express from 'express';
import {
  createTicket,
  getTicketsForRole,
  forwardTicket,
  resolveTicket,
} from '../controllers/ticketController.js';

const router = express.Router();

router.post('/', createTicket);
router.get('/', getTicketsForRole);
router.put('/:id/forward', forwardTicket);
router.put('/:id/resolve', resolveTicket);

export default router;