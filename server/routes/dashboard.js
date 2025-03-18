import express from 'express';
import { 
  getAdminDashboard, 
  getTeacherDashboard, 
  getStudentDashboard 
} from '../controllers/dashboardController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Role-specific dashboard routes
router.get('/admin', restrictTo('admin'), getAdminDashboard);
router.get('/teacher', restrictTo('teacher'), getTeacherDashboard);
router.get('/student', restrictTo('student'), getStudentDashboard);

export default router;