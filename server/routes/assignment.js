import express from 'express';
import { 
  createAssignment, 
  getAllAssignments, 
  getAssignmentById, 
  updateAssignment, 
  deleteAssignment,
  getMyAssignments,
  sendAssignmentReminderToClass
} from '../controllers/assignmentController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.route('/')
  .post(restrictTo('teacher'), upload.single('file'), createAssignment)
  .get(getAllAssignments);

router.get('/my-assignments', restrictTo('teacher'), getMyAssignments);

router.route('/:id')
  .get(getAssignmentById)
  .put(restrictTo('teacher'), updateAssignment)
  .delete(restrictTo('teacher'), deleteAssignment);

// Send reminder to class for a specific assignment
router.post('/:id/send-reminder', restrictTo('teacher'), sendAssignmentReminderToClass);

export default router;