// // import express from 'express';
// // import { 
// //   addResult, 
// //   addBulkResults, 
// //   getResultsByExam, 
// //   // getResult,
// //   getStudentResults,
// //   getMyResults
// // } from '../controllers/resultController.js';
// // import { protect, restrictTo } from '../middleware/auth.js';

// // const router = express.Router();

// // // Protected routes
// // router.use(protect);

// // // Routes for teachers
// // router.post('/', restrictTo('teacher','admin'), addResult);
// // router.post('/bulk', restrictTo('teacher','admin'), addBulkResults);
// // router.get('/exam/:examId', restrictTo('teacher', 'admin'), getResultsByExam);
// // // router.get('/', restrictTo('teacher', 'admin'), getResult); // My change

// // // Routes for students
// // router.get('/my-results', restrictTo('student'), getMyResults);

// // // Routes for both teachers and admin
// // router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentResults);

// // export default router;

// import express from 'express';
// import { 
//   addResult, 
//   addBulkResults, 
//   getResultsByExam, 
//   getStudentResults,

//   getMyResults
// } from '../controllers/resultController.js';
// import { protect, restrictTo } from '../middleware/auth.js';

// const router = express.Router();

// // Protected routes
// router.use(protect);

// // Routes for teachers and admins
// router.post('/', restrictTo('teacher', 'admin'), addResult);
// router.post('/bulk', restrictTo('teacher', 'admin'), addBulkResults);
// router.get('/exam/:examId', restrictTo('teacher', 'admin'), getResultsByExam);

// // Routes for students
// router.get('/my-results', restrictTo('student'), getMyResults);

// // Routes for teachers and admin
// router.get('/student/:studentId', restrictTo('teacher', 'admin'), getStudentResults);

// export default router;
// import express from 'express';
// import multer from 'multer';
// import {
//   // addResultFile,
//   // getResultsByGrade,
//   // getMyResults,
//   // deleteResult,
//   // getResults,
//   // downloadResult,
//   // uploadResult
// } from '../controllers/resultController.js';
// import { protect, restrictTo } from '../middleware/auth.js';

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.memoryStorage(); // Store file in memory before uploading to Cloudinary
// const upload = multer({ storage });

// // Protected routes
// router.use(protect);

// // Admin routes
// // router.post('/', restrictTo('admin'), addResultFile);  Changed to addResult
// // router.post('/',protect,restrictTo('admin', 'teacher'),upload.single('resultFile'),uploadResult);
// // router.get('/:id/download', protect, downloadResult);
// // router.get('/', restrictTo('admin'), getResults);
// // router.delete('/:id', restrictTo('admin'), deleteResult);

// // // Routes for all authenticated users
// // router.get('/grade/:grade', getResultsByGrade);

// // // Student routes
// // router.get('/my-results', restrictTo('student'), getMyResults);

// export default router;

// Today changes

// import express from 'express';
// import multer from 'multer';
// import {
//   addResultFile,
//   getResultsByGrade,
//   getMyResults,
//   deleteResult,
//   getResults,
//   downloadResult,
//   uploadResult
// } from '../controllers/resultController.js';
// import { protect, restrictTo } from '../middleware/auth.js';
// import {  downloadFileHandler,
//   proxyDownloadHandler} from '../utils/cloudinary.js';

// // Configure multer for file uploads
// // const storage = multer.memoryStorage(); // Store file in memory before uploading to Cloudinary
// // const upload = multer({ 
// //   storage,
// //   limits: {
// //     fileSize: 5 * 1024 * 1024 // 5MB limit
// //   }
// // });
// const storage = multer.memoryStorage(); // Store file in memory before uploading to Cloudinary
// const upload = multer({ storage });


// const router = express.Router();

// // Protected routes
// router.use(protect);

// // Admin/Teacher routes
// router.post(
//   '/',
//   restrictTo('admin', 'teacher'),
//   upload.single('resultFile'),
//   uploadResult
// );

// // router.get('/download/:publicId', downloadFileHandler);

// // Download endpoint (private files)
// // router.get('/download-proxy/:publicId', proxyDownloadHandler);

// router.get('/:id/download', downloadResult);
// router.get('/', restrictTo('admin','teacher'), getResults);
// router.delete('/:id', restrictTo('admin'), deleteResult);

// // Routes for all authenticated users
// router.get('/grade/:grade', getResultsByGrade);

// // Student routes
// router.get('/my-results', restrictTo('student'), getMyResults);

// export default router;

import express from 'express';
import * as resultController from '../controllers/resultController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Admin routes
router.route('/')
  .post(restrictTo('admin', 'teacher'), upload.single('file'), resultController.uploadResult)
  .get(restrictTo('admin' , 'teacher'), resultController.getAllResults);

router.get('/template', restrictTo('admin'), resultController.generateResultExcelTemplate);
router.delete('/:id', restrictTo('admin'), resultController.deleteResult);

// Process final exam results and promote students who passed
router.post('/process-final-results', restrictTo('admin'), resultController.processFinalResults);

//router.get(restrictTo('teacher'), resultController.getAllResults);

// Student routes
router.get('/my-results', restrictTo('student'), resultController.getMyResults);

// Download route
router.get('/download/:id', resultController.downloadResult);

// Common routes
router.get('/grade', resultController.getResultsByGrade);

export default router;