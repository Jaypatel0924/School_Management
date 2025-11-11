// // import multer from "multer";

// // const storage=multer.diskStorage({
// //     filename:function(req,file,cb)
// //     {
// //         cb(null,`${Date.now()}-${file.originalname}`)
// //     }
// // })

// // export const upload=multer({storage:storage});

// import multer from 'multer';
// import path from 'path';

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../../uploads/results'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// // File filter to only allow certain file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
//   const ext = path.extname(file.originalname).toLowerCase();
  
//   if (allowedTypes.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF, Word, and Excel files are allowed'), false);
//   }
// };

// // Configure multer
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   }
// });

// // Middleware for single file upload
// export const uploadResultFile = upload.single('resultFile');

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/results');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `result-${uniqueSuffix}${ext}`);
  }
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel', // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // XLSX
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, and Excel files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default upload;