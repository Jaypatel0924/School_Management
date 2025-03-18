import express from 'express';
import { 
  getAllStudents, 
  // getStudentById, 
  createStudent, 
  // updateStudent, 
  deleteStudent,
  // getStudentsByClass,
  // getMyProfile
} from '../controllers/studentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for all authenticated users
// router.get('/me', getMyProfile);

// Routes restricted to admin
router.route('/')
  .get(restrictTo('admin', 'teacher'), getAllStudents)
  .post(restrictTo('admin'), createStudent);

// router.get('/class', restrictTo('admin', 'teacher'), getStudentsByClass);

router.route('/:id')
  // .get(restrictTo('admin', 'teacher'), getStudentById)
  // .patch(restrictTo('admin'), updateStudent)
  .delete(restrictTo('admin'), deleteStudent);

export default router;