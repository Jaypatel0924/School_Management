// import express from 'express';
// import { 
//   addResult, 
//   addBulkResults, 
//   getResultsByExam, 
//   // getResult,
//   getStudentResults,
//   getMyResults
// } from '../controllers/resultController.js';
// import { protect, restrictTo } from '../middleware/auth.js';

// const router = express.Router();

// // Protected routes
// router.use(protect);

// // Routes for teachers
// router.post('/', restrictTo('teacher','admin'), addResult);
// router.post('/bulk', restrictTo('teacher','admin'), addBulkResults);
// router.get('/exam/:examId', restrictTo('teacher', 'admin'), getResultsByExam);
// // router.get('/', restrictTo('teacher', 'admin'), getResult); // My change

// // Routes for students
// router.get('/my-results', restrictTo('student'), getMyResults);

// // Routes for both teachers and admin
// router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentResults);

// export default router;

import express from 'express';
import { 
  addResult, 
  addBulkResults, 
  getResultsByExam, 
  getStudentResults,
  
  getMyResults
} from '../controllers/resultController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers and admins
router.post('/', restrictTo('teacher', 'admin'), addResult);
router.post('/bulk', restrictTo('teacher', 'admin'), addBulkResults);
router.get('/exam/:examId', restrictTo('teacher', 'admin'), getResultsByExam);

// Routes for students
router.get('/my-results', restrictTo('student'), getMyResults);

// Routes for teachers and admin
router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentResults);

export default router;
