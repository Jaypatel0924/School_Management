import express from 'express';
import {
  createSchedule,
  getMySchedule,
  updateSchedule,
  deleteSchedule,
  getStudentSchedule
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
  .put(restrictTo('teacher'), updateSchedule)
  .delete(restrictTo('teacher'), deleteSchedule);

// Routes for students
router.get('/student-schedule', restrictTo('student'), getStudentSchedule);

export default router;
