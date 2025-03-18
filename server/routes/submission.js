import express from 'express';
import { 
  submitAssignment, 
  gradeSubmission, 
  getSubmissionsByAssignment, 
  getMySubmissions,
  getSubmissionById
} from '../controllers/submissionController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for students
router.post('/', restrictTo('student'), submitAssignment);
router.get('/my-submissions', restrictTo('student'), getMySubmissions);

// Routes for teachers
router.patch('/:id/grade', restrictTo('teacher'), gradeSubmission);
router.get('/assignment/:assignmentId', restrictTo('teacher'), getSubmissionsByAssignment);

// Routes for both students and teachers
router.get('/:id', getSubmissionById);

export default router;