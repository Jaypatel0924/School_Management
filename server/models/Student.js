import mongoose from 'mongoose';
import validator from 'validator';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    length: 5
  },
  name: {
    type: String,
    required: [true, 'Please provide student name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide student email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
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
  parentName: {
    type: String,
    required: [true, 'Please provide parent name']
  },
  parentContact: {
    type: String,
    required: [true, 'Please provide parent contact']
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide date of birth']
  },
  gender: {
    type: String,
    required: [true, 'Please provide gender'],
    enum: ['Male', 'Female', 'Other']
  },
  admissionDate: {
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

const Student = mongoose.model('Student', studentSchema);
export default Student;