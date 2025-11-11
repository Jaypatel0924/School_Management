import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'Please provide grade'],
    enum: ['Grade 8', 'Grade 9', 'Grade 10']
  },
  feeType: {
    type: String,
    required: [true, 'Please provide fee type'],
    enum: ['Tuition', 'Lab', 'Activity', 'Transport', 'Other']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide due date']
  },
  academicYear: {
    type: String,
    required: [true, 'Please provide academic year']
  },
  term: {
    type: String,
    required: [true, 'Please provide term'],
    enum: ['Term 1', 'Term 2', 'Term 3']
  },
  payments: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending'
    },
    // Per-student late fee amount (accumulated by scheduler)
    lateFee: {
      type: Number,
      default: 0
    },
    paymentDate: Date,
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Bank Transfer', 'Razorpay']
    },
    transactionId: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
    createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
