import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema({
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
  gradeApplying: {
    type: String,
    required: [true, 'Please provide grade'],
    enum: ['Grade 8', 'Grade 9', 'Grade 10'],
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admission = mongoose.model('Admission', admissionSchema);
export default Admission;