// // import express from 'express';
// // import { 
// //   submitAssignment, 
// //   gradeSubmission, 
// //   getSubmissionsByAssignment, 
// //   getMySubmissions,
// //   getSubmissionById
// // } from '../controllers/submissionController.js';
// // import { protect, restrictTo } from '../middleware/auth.js';

// // const router = express.Router();

// // // Protected routes
// // router.use(protect);

// // // Routes for students
// // router.post('/', restrictTo('student'), submitAssignment);
// // router.get('/my-submissions', restrictTo('student'), getMySubmissions);

// // // Routes for teachers
// // router.patch('/:id/grade', restrictTo('teacher'), gradeSubmission);
// // router.get('/assignment/:assignmentId', restrictTo('teacher'), getSubmissionsByAssignment);

// // // Routes for both students and teachers
// // router.get('/:id', getSubmissionById);

// // export default router;

// import express from 'express';
// import multer from 'multer';
// import {
//   submitAssignment,
//   getMySubmissions,
//   getSubmissionById,
//   getSubmissionsByAssignment
// } from '../controllers/submissionController.js';
// import { protect, restrictTo } from '../middleware/auth.js';

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Protected routes
// router.use(protect);

// // Routes for students
// router.post('/', restrictTo('student'), upload.single('file'), submitAssignment);
// // router.get('/', restrictTo('teacher'), getSubmissionsByAssignment);
// router.get('/assignment/:assignmentId', restrictTo('teacher'), getSubmissionsByAssignment);
// router.get('/my-submissions', restrictTo('student'), getMySubmissions);

// // Routes for both students and teachers
// router.get('/:id', getSubmissionById);

// export default router;

import express from 'express';
import { 
  submitAssignment, 
  gradeSubmission, 
  getSubmissionsByAssignment, 
  getMySubmissions,
  downloadSubmission,
  deleteSubmission
} from '../controllers/submissionController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for students
router.post('/', restrictTo('student'), upload.single('file'), submitAssignment);
router.get('/my-submissions', restrictTo('student'), getMySubmissions);
router.delete('/:id', restrictTo('student'), deleteSubmission);

// Routes for teachers
router.patch('/:id/grade', restrictTo('teacher'), gradeSubmission);
router.get('/assignment/:assignmentId', restrictTo('teacher'), getSubmissionsByAssignment);

// Download route (accessible by both students and teachers)
router.get('/download/:id', downloadSubmission);

export default router;