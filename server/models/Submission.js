// import mongoose from 'mongoose';

// const submissionSchema = new mongoose.Schema({
//   assignment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Assignment',
//     required: true
//   },
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Student',
//     required: true
//   },
//   submissionDate: {
//     type: Date,
//     default: Date.now
//   },
//   attachmentUrl: {
//     type: String
//   },
//   marks: {
//     type: Number
//   },
//   feedback: {
//     type: String
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Submitted', 'Graded'],
//     default: 'Pending'
//   }
// });

// const Submission = mongoose.model('Submission', submissionSchema);
// export default Submission;



// // as per the backend assignment submission in student dashboard as per teacher dashboard see assignment submission

import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  fileUrl: {
    type: String,
    required: true
  },
  marks: {
    type: Number
  },
  feedback: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Graded'],
    default: 'Pending'
  }
});

// Compound index to ensure a student can only have one submission per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;