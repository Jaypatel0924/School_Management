import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'Cash', 'Bank Transfer'],
    required: true
  },
  transactionId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpayOrderId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  receipt: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);