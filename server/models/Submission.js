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
  attachmentUrl: {
    type: String
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

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;