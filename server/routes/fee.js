import express from 'express';
import {
  createFeeRecord,
  getAllFeeRecords,
  getFeeStatistics,
  createPaymentOrder,
  verifyPayment,
  getMyFeeRecords
} from '../controllers/feeController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Admin routes
router.route('/')
  .post(restrictTo('admin'), createFeeRecord)
  .get(restrictTo('admin'), getAllFeeRecords);

router.get('/statistics', restrictTo('admin'), getFeeStatistics);

// Payment routes
router.post('/create-payment', createPaymentOrder);
router.post('/verify-payment', verifyPayment);

// Student routes
router.get('/my-fees', restrictTo('student'), getMyFeeRecords);

export default router;