import express from 'express';
import { 
  createAssignment, 
  getAllAssignments, 
  getAssignmentById, 
  updateAssignment, 
  deleteAssignment,
  getMyAssignments
} from '../controllers/assignmentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.route('/')
  .post(restrictTo('teacher'), createAssignment)
  .get(getAllAssignments);

router.get('/my-assignments', restrictTo('teacher'), getMyAssignments);

router.route('/:id')
  .get(getAssignmentById)
  .patch(restrictTo('teacher'), updateAssignment)
  .delete(restrictTo('teacher'), deleteAssignment);

export default router;