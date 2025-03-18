import express from 'express';
import { 
  createExam, 
  getAllExams, 
  getExamById, 
  updateExam, 
  deleteExam,
  getUpcomingExams
} from '../controllers/examController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.route('/')
  .post(restrictTo('teacher'), createExam)
  .get(getAllExams);

router.get('/upcoming', getUpcomingExams);

router.route('/:id')
  .get(getExamById)
  .patch(restrictTo('teacher'), updateExam)
  .delete(restrictTo('teacher'), deleteExam);

export default router;