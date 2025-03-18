import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  marks: {
    type: Number,
    required: [true, 'Please provide marks']
  },
  grade: {
    type: String,
    required: [true, 'Please provide grade']
  },
  remarks: {
    type: String
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a student can only have one result per exam
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

const Result = mongoose.model('Result', resultSchema);
export default Result;