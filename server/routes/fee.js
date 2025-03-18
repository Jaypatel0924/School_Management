import express from 'express';
import { 
  createFeeRecord, 
  updateFeeRecord, 
  recordFeePayment, 
  getAllFeeRecords, 
  getStudentFeeRecords,
  getMyFeeRecords
} from '../controllers/feeController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for admin
router.route('/')
  .post(restrictTo('admin'), createFeeRecord)
  .get(restrictTo('admin'), getAllFeeRecords);

router.patch('/:id', restrictTo('admin'), updateFeeRecord);
router.patch('/:id/payment', restrictTo('admin'), recordFeePayment);
router.get('/student/:studentId', restrictTo('admin'), getStudentFeeRecords);

// Routes for students
router.get('/my-fees', restrictTo('student'), getMyFeeRecords);

export default router;