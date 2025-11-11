import mongoose from 'mongoose';

const StudentFeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  fee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee',
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid'],
    default: 'Unpaid'
  },
  dueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('StudentFee', StudentFeeSchema);