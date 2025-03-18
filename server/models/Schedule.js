import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
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
    required: [true, 'Please provide class date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time']
  },
  topic: {
    type: String,
    required: [true, 'Please provide class topic']
  },
  description: {
    type: String,
    required: [true, 'Please provide class description']
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

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;