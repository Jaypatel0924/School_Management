import express from 'express';
import { getMyNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/my-notifications', restrictTo('student'), getMyNotifications);
router.patch('/:id/read', restrictTo('student'), markNotificationAsRead);

export default router;