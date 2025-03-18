import express from 'express';
import { 
  createAnnouncement, 
  getAllAnnouncements, 
  getAnnouncementById, 
  updateAnnouncement, 
  deleteAnnouncement,
  getMyAnnouncements
} from '../controllers/announcementController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for admin and teachers
router.route('/')
  .post(restrictTo('admin', 'teacher'), createAnnouncement)
  .get(getAllAnnouncements);

router.get('/my-announcements', getMyAnnouncements);

router.route('/:id')
  .get(getAnnouncementById)
  .patch(restrictTo('admin', 'teacher'), updateAnnouncement)
  .delete(restrictTo('admin', 'teacher'), deleteAnnouncement);

export default router;