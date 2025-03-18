import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide exam name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide exam type'],
    enum: ['Midterm', 'Final', 'Quiz', 'Test']
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
  date: {
    type: Date,
    required: [true, 'Please provide exam date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time']
  },
  maxMarks: {
    type: Number,
    required: [true, 'Please provide maximum marks']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;