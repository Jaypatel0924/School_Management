import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: true
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher']
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['attendance', 'assignment', 'result', 'schedule', 'fee', 'event'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;