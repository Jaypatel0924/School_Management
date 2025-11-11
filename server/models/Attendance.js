import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  grade: {
    type: String,
    required: true,
    enum: ['Grade 8', 'Grade 9', 'Grade 10'],
  },
  section: {
    type: String,
    required: true,
    enum: ['Section A', 'Section B', 'Section C'],
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
});

// Compound index to ensure a student can only have one attendance record per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;