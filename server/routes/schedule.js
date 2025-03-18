import express from 'express';
import {
  createSchedule,
  getMySchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.route('/')
  .post(restrictTo('teacher'), createSchedule)
  .get(restrictTo('teacher'), getMySchedule);

router.route('/:id')
  .patch(restrictTo('teacher'), updateSchedule)
  .delete(restrictTo('teacher'), deleteSchedule);

export default router;