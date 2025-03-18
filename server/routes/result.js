import express from 'express';
import { 
  addResult, 
  addBulkResults, 
  getResultsByExam, 
  getStudentResults,
  getMyResults
} from '../controllers/resultController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.post('/', restrictTo('teacher'), addResult);
router.post('/bulk', restrictTo('teacher'), addBulkResults);
router.get('/exam/:examId', restrictTo('teacher', 'admin'), getResultsByExam);

// Routes for students
router.get('/my-results', restrictTo('student'), getMyResults);

// Routes for both teachers and admin
router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentResults);

export default router;