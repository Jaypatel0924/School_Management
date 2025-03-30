import express from 'express';
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, restrictTo('admin'), getAllContacts);
router.patch('/:id', protect, restrictTo('admin'), updateContactStatus);

export default router;