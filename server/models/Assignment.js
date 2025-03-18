import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide assignment title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide assignment description']
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject']
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
  dueDate: {
    type: Date,
    required: [true, 'Please provide due date']
  },
  maxMarks: {
    type: Number,
    required: [true, 'Please provide maximum marks']
  },
  attachmentUrl: {
    type: String
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;