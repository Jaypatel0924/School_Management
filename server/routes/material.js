// import express from 'express';
// import {
//   uploadMaterial,
//   getMyMaterials,
//   deleteMaterial
// } from '../controllers/materialController.js';
// import { protect, restrictTo } from '../middleware/auth.js';

// const router = express.Router();

// // Protected routes
// router.use(protect);

// // Routes for teachers
// router.route('/')
//   .post(restrictTo('teacher'), uploadMaterial)
//   .get(restrictTo('teacher'), getMyMaterials);

// router.route('/:id')
//   .delete(restrictTo('teacher'), deleteMaterial);

// export default router;

import express from 'express';
import {
  uploadMaterial,
  getMyMaterials,
  getStudentMaterials,
  deleteMaterial
} from '../controllers/materialController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Routes for teachers
router.route('/')
  .post(restrictTo('teacher'), uploadMaterial)
  .get(restrictTo('teacher'), getMyMaterials);

// Routes for students
router.get('/student-materials', restrictTo('student'), getStudentMaterials);

router.route('/:id')
  .delete(restrictTo('teacher'), deleteMaterial);

export default router;