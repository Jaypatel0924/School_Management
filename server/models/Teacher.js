import mongoose from 'mongoose';
import validator from 'validator';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide teacher name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide teacher email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  employeeId: {
    type: String,
    required: [true, 'Please provide employee ID'],
    unique: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject']
  },
  qualification: {
    type: String,
    required: [true, 'Please provide qualification']
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience']
  },
  contactNumber: {
    type: String,
    required: [true, 'Please provide contact number']
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;