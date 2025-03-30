import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide message'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Responded'],
    default: 'Unread',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;