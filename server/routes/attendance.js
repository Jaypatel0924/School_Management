import express from 'express';
import { 
  markAttendance, 
  markBulkAttendance, 
  getAttendanceByClass, 
  getStudentAttendance,
  getMyAttendance
} from '../controllers/attendanceController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.post('/', restrictTo('teacher'), markAttendance);
router.post('/bulk', restrictTo('teacher'), markBulkAttendance);
router.get('/class', restrictTo('teacher', 'admin'), getAttendanceByClass);

// Routes for students
router.get('/my-attendance', restrictTo('student'), getMyAttendance);

// Routes for both teachers and admin
router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentAttendance);

export default router;