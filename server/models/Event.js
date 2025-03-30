import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please provide start time'],
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time'],
  },
  category: {
    type: String,
    required: [true, 'Please provide event category'],
    enum: ['Academic', 'Cultural', 'Sports', 'Meeting', 'Holiday'],
  },
  location: {
    type: String,
    required: [true, 'Please provide event location'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;