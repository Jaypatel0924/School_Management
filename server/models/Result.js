// import mongoose from 'mongoose';

// const resultSchema = new mongoose.Schema({
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Student',
//     required: true
//   },
//   // exam: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Exam',
//   //   required: true
//   // },
//   marks: {
//     type: Number,
//     required: [true, 'Please provide marks']
//   },
//   grade: {
//     type: String,
//     required: [true, 'Please provide grade']
//   },
//   remarks: {
//     type: String
//   },
//   addedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Teacher',
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Compound index to ensure a student can only have one result per exam
// resultSchema.index({ student: 1, exam: 1 }, { unique: true });

// const Result = mongoose.model('Result', resultSchema);
// export default Result;
// models/Result.js
// import mongoose from 'mongoose';

// const resultSchema = new mongoose.Schema({
//   grade: {
//     type: String,
//     required: [true, 'Grade is required'],
//     enum: ['Grade 8', 'Grade 9', 'Grade 10']
//   },
//   examType: {
//     type: String,
//     required: [true, 'Exam type is required'],
//     enum: ['Midterm', 'Final', 'Quiz', 'Test']
//   },
//   subject: {
//     type: String,
//     required: [true, 'Subject is required']
//   },
//   resultFileUrl: {
//     type: String,
//     required: [true, 'Result file URL is required']
//   },
//   filePublicId: {
//     type: String,
//     required: [true, 'File public ID is required']
//   },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Uploader information is required']
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Result = mongoose.model('Result', resultSchema);



// export default Result;

// import mongoose from 'mongoose';

// const resultSchema = new mongoose.Schema({
//   grade: {
//     type: String,
//     required: [true, 'Grade is required'],
//     enum: ['Grade 8', 'Grade 9', 'Grade 10'],
//   },
//   examType: {
//     type: String,
//     required: [true, 'Exam type is required'],
//     enum: ['Midterm', 'Final', 'Quiz', 'Test'],
//   },
//   subject: {
//     type: String,
//     required: [true, 'Subject is required'],
//   },
//   resultFileUrl: {
//     type: String,
//     required: [true, 'Result file URL is required'],
//   },
//   filePublicId: {
//     type: String,
//     required: [true, 'File public ID is required'],
//   },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Uploader information is required'],
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Result = mongoose.model('Result', resultSchema);

// export default Result;

import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: [true, 'Please provide academic year'],
    // Format: "2025-2026"
    match: [/^\d{4}-\d{4}$/, 'Please provide academic year in format YYYY-YYYY']
  },
  title: {
    type: String,
    required: [true, 'Please provide result title'],
    trim: true
  },
  description: {
    type: String,
    // required: [true, 'Please provide result description']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  grade: {
    type: String,
    required: [true, 'Please provide grade'],
    enum: ['Grade 8', 'Grade 9', 'Grade 10']
  },
  section: {
    type: String,
    required: [true, 'Please provide section'],
    enum: ['Section A', 'Section B', 'Section C']
  },
  type: {
    type: String,
    required: [true, 'Please provide result type'],
    enum: ['Mid Term', 'Final Term', 'Unit Test', 'Other']
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft'
  },
  totalMarks: {
    type: Number
  },
  obtainedMarks: {
    type: Number
  },
  percentage: {
    type: Number
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotedToGrade: {
    type: String,
    enum: ['Grade 9', 'Grade 10', 'Graduated']
  },
  subjects: [{
    name: String,
    marks: Number,
    totalMarks: Number,
    grade: String
  }],
  fileUrl: {
    type: String,
    required: [true, 'Result file is required']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', resultSchema);
export default Result;