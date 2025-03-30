import express from 'express';
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllEvents);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', restrictTo('admin'), createEvent);
router.patch('/:id', restrictTo('admin'), updateEvent);
router.delete('/:id', restrictTo('admin'), deleteEvent);

export default router;