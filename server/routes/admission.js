import express from 'express';
import {
  submitAdmission,
  getAllAdmissions,
  updateAdmissionStatus,
} from '../controllers/admissionController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitAdmission);
router.get('/', protect, restrictTo('admin'), getAllAdmissions);
router.patch('/:id', protect, restrictTo('admin'), updateAdmissionStatus);

export default router;