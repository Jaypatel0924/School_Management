import express from 'express';
import {
  markBulkAttendance,
  getAttendanceByClass,
  getStudentAttendance,
  getMyAttendance,
  getMonthlyAttendanceReport,
} from '../controllers/attendanceController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.post('/bulk', restrictTo('teacher'), markBulkAttendance);
router.get('/class', restrictTo('teacher', 'admin'), getAttendanceByClass);
// Monthly attendance report for a class: ?grade=Grade 8&section=Section A&year=2025&month=11
router.get('/monthly', restrictTo('teacher', 'admin'), getMonthlyAttendanceReport);

// Routes for students
router.get('/my-attendance', restrictTo('student'), getMyAttendance);

// Routes for both teachers and admin
router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentAttendance);

export default router;