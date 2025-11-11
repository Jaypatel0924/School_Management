import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';
import { sendFeePaidNotification } from '../utils/email.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_DoDqVroQiFWCCE",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "7iUVCRtpwAfWpFVZd8LhKoq7"
});

// Get fee statistics
export const getFeeStatistics = async (req, res) => {
  try {
    const { grade, section } = req.query;

    const filter = {};
    if (grade && grade !== 'All') filter.grade = grade;

    const fees = await Fee.find(filter).populate('payments.student', 'grade section');

    let totalFees = 0;
    let collectedFees = 0;
    let pendingFees = 0;

    fees.forEach(fee => {
      fee.payments.forEach(payment => {
        // Apply section filter if provided
        if (section && section !== 'All' && payment.student && payment.student.section !== section) {
          return;
        }

        totalFees += fee.amount;
        if (payment.status === 'Paid') {
          collectedFees += fee.amount;
        } else {
          pendingFees += fee.amount;
        }
      });
    });

    res.status(200).json({
      status: 'success',
      data: {
        statistics: {
          totalFees,
          collectedFees,
          pendingFees,
          collectionPercentage: totalFees > 0 ? (collectedFees / totalFees) * 100 : 0
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all fee records with filters
export const getAllFeeRecords = async (req, res) => {
  try {
    const { grade, section, feeType, academicYear, term, status, search } = req.query;

    const filter = {};
    if (grade && grade !== 'All') filter.grade = grade;
    if (feeType && feeType !== 'All') filter.feeType = feeType;
    if (academicYear && academicYear !== 'All') filter.academicYear = academicYear;
    if (term && term !== 'All') filter.term = term;

    const fees = await Fee.find(filter)
      .populate({
        path: 'payments.student',
        select: 'name rollNumber grade section studentId'
      })
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ dueDate: 1 });

    // Process fees to create a flat structure with payment information
    let feeRecords = [];
    fees.forEach(fee => {
      fee.payments.forEach(payment => {
        if (!payment.student) return; // Skip if student reference is missing

        // Apply section filter
        if (section && section !== 'All' && payment.student.section !== section) {
          return;
        }

        // Apply status filter
        if (status && status !== 'All' && payment.status !== status) {
          return;
        }

        // Apply search filter
        if (search) {
          const searchTerm = search.toLowerCase();
          const studentName = payment.student.name.toLowerCase();
          const studentId = payment.student.studentId.toLowerCase();
          if (!studentName.includes(searchTerm) && !studentId.includes(searchTerm)) {
            return;
          }
        }

        feeRecords.push({
          _id: fee._id,
          grade: fee.grade,
          feeType: fee.feeType,
          amount: fee.amount,
          dueDate: fee.dueDate,
          academicYear: fee.academicYear,
          term: fee.term,
          student: payment.student,
          status: payment.status,
          paymentDate: payment.paymentDate,
          paymentMethod: payment.paymentMethod,
          transactionId: payment.transactionId
        });
      });
    });

    res.status(200).json({
      status: 'success',
      results: feeRecords.length,
      data: {
        fees: feeRecords
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create fee record for a grade
export const createFeeRecord = async (req, res) => {
  try {
    const {
      grade,
      feeType,
      amount,
      dueDate,
      academicYear,
      term
    } = req.body;

    // Find all students in the specified grade
    const students = await Student.find({ grade });

    if (students.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No students found in this grade'
      });
    }

    // Check if fee record already exists for this grade, fee type, academic year and term
    const existingFee = await Fee.findOne({
      grade,
      feeType,
      academicYear,
      term
    });

    if (existingFee) {
      return res.status(400).json({
        status: 'error',
        message: 'Fee record already exists for this grade, fee type, academic year and term'
      });
    }

    // Create initial payment records for all students
    const payments = students.map(student => ({
      student: student._id,
      status: 'Pending'
    }));

    const newFee = await Fee.create({
      grade,
      feeType,
      amount,
      dueDate: new Date(dueDate),
      academicYear,
      term,
      payments,
      createdBy: req.user.id
    });

    await newFee.populate('payments.student', 'name rollNumber email');

    // Create notifications for all affected students
    const notifications = students.map(student => ({
      recipient: student._id,
      recipientModel: 'Student',
      message: `New ${feeType} fee (₹${amount}) has been added for ${academicYear} ${term}. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      type: 'fee',
      date: new Date()
    }));

    await Notification.insertMany(notifications);

    // Also update notification when payment is completed
    const feePaymentNotifications = newFee.payments
      .filter(payment => payment.status === 'Paid')
      .map(payment => ({
        recipient: payment.student._id,
        recipientModel: 'Student',
        message: `Your ${feeType} fee payment for ${academicYear} ${term} has been received.`,
        type: 'fee',
        date: new Date()
      }));

    if (feePaymentNotifications.length > 0) {
      await Notification.insertMany(feePaymentNotifications);
    }

    res.status(201).json({
      status: 'success',
      data: {
        fee: newFee
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get my fee records (for logged in student)
export const getMyFeeRecords = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    const fees = await Fee.find({ grade: student.grade })
      .populate('payments.student', 'name rollNumber')
      .sort({ dueDate: 1 });

    // Ensure new students (added after fee creation) have a payment record
    for (const fee of fees) {
      const hasPayment = fee.payments.some(p => {
        // handle populated and raw refs
        const sid = p.student && (p.student._id ? p.student._id.toString() : p.student.toString());
        return sid === student._id.toString();
      });
      if (!hasPayment) {
        try {
          fee.payments.push({ student: student._id, status: 'Pending' });
          await fee.save();
        } catch (err) {
          console.error('Failed to create payment record for new student:', err);
        }
      }
    }

    const myFees = fees.map(fee => {
      const myPayment = fee.payments.find(p => {
        const sid = p.student && (p.student._id ? p.student._id.toString() : p.student.toString());
        return sid === student._id.toString();
      });
      return {
        _id: fee._id,
        grade: fee.grade,
        feeType: fee.feeType,
        amount: fee.amount,
        dueDate: fee.dueDate,
        academicYear: fee.academicYear,
        term: fee.term,
        status: myPayment ? myPayment.status : 'Pending',
        paymentDate: myPayment ? myPayment.paymentDate : null,
        paymentMethod: myPayment ? myPayment.paymentMethod : null,
        transactionId: myPayment ? myPayment.transactionId : null
      };
    });

    // Calculate fee statistics
    const totalFees = myFees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = myFees
      .filter(fee => fee.status === 'Paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const pendingFees = myFees
      .filter(fee => fee.status === 'Pending')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const overdueFees = myFees
      .filter(fee => fee.status === 'Overdue')
      .reduce((sum, fee) => sum + fee.amount, 0);

    res.status(200).json({
      status: 'success',
      data: {
        fees: myFees,
        statistics: {
          totalFees,
          paidFees,
          pendingFees,
          overdueFees,
          paymentPercentage: totalFees > 0 ? (paidFees / totalFees) * 100 : 0
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create Razorpay payment order
export const createPaymentOrder = async (req, res) => {
  try {
    const { feeId } = req.body;

    // Find the student
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Find the fee record
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({
        status: 'error',
        message: 'Fee record not found'
      });
    }

    // Find the student's payment record
    const payment = fee.payments.find(p => p.student.toString() === student._id.toString());
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment record not found'
      });
    }

    const options = {
      amount: fee.amount * 100, // Razorpay amount is in paisa
      currency: 'INR',
      receipt: `fee_${fee._id}`,
      notes: {
        feeId: fee._id.toString(),
        studentId: student._id.toString(),
        feeType: fee.feeType,
        academicYear: fee.academicYear,
        term: fee.term
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        order,
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_DoDqVroQiFWCCE"
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      feeId
    } = req.body;

    // Find the student
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "7iUVCRtpwAfWpFVZd8LhKoq7")
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payment signature'
      });
    }

    // Update fee record
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({
        status: 'error',
        message: 'Fee record not found'
      });
    }

    const paymentIndex = fee.payments.findIndex(p => p.student.toString() === student._id.toString());
    if (paymentIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment record not found'
      });
    }

    fee.payments[paymentIndex].status = 'Paid';
    fee.payments[paymentIndex].paymentDate = Date.now();
    fee.payments[paymentIndex].paymentMethod = 'Razorpay';
    fee.payments[paymentIndex].transactionId = razorpay_payment_id;

    fee.updatedBy = req.user.id;
    fee.updatedAt = Date.now();

    await fee.save();
    // Send payment confirmation email to student
    try {
      const paidPayment = fee.payments[paymentIndex];
      const studentEmail = student.email;
      const baseAmount = fee.amount;
      const lateAmount = paidPayment.lateFee || 0;
      const totalPaid = baseAmount + lateAmount;
      const isLate = lateAmount > 0;

      await sendFeePaidNotification(studentEmail, student.name, totalPaid, isLate, lateAmount);
    } catch (err) {
      console.error('Failed to send fee payment email:', err);
    }

    res.status(200).json({
      status: 'success',
      data: {
        fee
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
