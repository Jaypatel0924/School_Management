import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide announcement title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide announcement content']
  },
  type: {
    type: String,
    required: [true, 'Please provide announcement type'],
    enum: ['General', 'Event', 'Notice', 'Meeting', 'Holiday']
  },
  audience: {
    type: String,
    required: [true, 'Please provide target audience'],
    enum: ['All', 'Students', 'Teachers', 'Parents', 'Admin']
  },
  grade: {
    type: String,
    enum: ['All', 'Grade 8', 'Grade 9', 'Grade 10']
  },
  section: {
    type: String,
    enum: ['All', 'Section A', 'Section B', 'Section C']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide end date']
  },
  attachmentUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;