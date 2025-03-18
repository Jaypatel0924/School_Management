import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher,
  getTeachersBySubject,
  getMyProfile
} from '../controllers/teacherController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for all authenticated users
router.get('/me', getMyProfile);

// Routes restricted to admin
router.route('/')
  .get(restrictTo('admin'), getAllTeachers)
  .post(restrictTo('admin'), createTeacher);

router.get('/subject', restrictTo('admin'), getTeachersBySubject);

router.route('/:id')
  .get(restrictTo('admin'), getTeacherById)
  .patch(restrictTo('admin'), updateTeacher)
  .delete(restrictTo('admin'), deleteTeacher);

export default router;