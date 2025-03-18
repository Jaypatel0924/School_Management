import Fee from '../models/Fee.js';
import Student from '../models/Student.js';

// Create fee record
export const createFeeRecord = async (req, res) => {
  try {
    const {
      studentId,
      feeType,
      amount,
      dueDate,
      academicYear,
      term
    } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    // Check if fee record already exists for this student, fee type, academic year and term
    const existingFee = await Fee.findOne({
      student: studentId,
      feeType,
      academicYear,
      term
    });

    if (existingFee) {
      return res.status(400).json({
        status: 'error',
        message: 'Fee record already exists for this student, fee type, academic year and term'
      });
    }

    const newFee = await Fee.create({
      student: studentId,
      feeType,
      amount,
      dueDate: new Date(dueDate),
      academicYear,
      term,
      createdBy: req.user.id
    });

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

// Update fee record
export const updateFeeRecord = async (req, res) => {
  try {
    const feeId = req.params.id;
    const updateData = req.body;

    // Add updatedBy and updatedAt
    updateData.updatedBy = req.user.id;
    updateData.updatedAt = Date.now();

    const updatedFee = await Fee.findByIdAndUpdate(
      feeId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedFee) {
      return res.status(404).json({
        status: 'error',
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        fee: updatedFee
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Record fee payment
export const recordFeePayment = async (req, res) => {
  try {
    const feeId = req.params.id;
    const { paymentMethod, transactionId } = req.body;

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({
        status: 'error',
        message: 'Fee record not found'
      });
    }

    fee.status = 'Paid';
    fee.paymentDate = Date.now();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    fee.updatedBy = req.user.id;
    fee.updatedAt = Date.now();

    await fee.save();

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

// Get all fee records
export const getAllFeeRecords = async (req, res) => {
  try {
    const { status, feeType, academicYear, term } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;
    if (academicYear) filter.academicYear = academicYear;
    if (term) filter.term = term;

    const fees = await Fee.find(filter)
      .populate('student', 'name rollNumber grade section')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ dueDate: 1 });

    res.status(200).json({
      status: 'success',
      results: fees.length,
      data: {
        fees
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get fee records by student
export const getStudentFeeRecords = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }

    const fees = await Fee.find({ student: studentId })
      .sort({ dueDate: 1 });

    // Calculate fee statistics
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees
      .filter(fee => fee.status === 'Paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const pendingFees = fees
      .filter(fee => fee.status === 'Pending')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const overdueFees = fees
      .filter(fee => fee.status === 'Overdue')
      .reduce((sum, fee) => sum + fee.amount, 0);

    res.status(200).json({
      status: 'success',
      data: {
        fees,
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

// Get my fee records (for logged in student)
export const getMyFeeRecords = async (req, res) => {
  try {
    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    const fees = await Fee.find({ student: student._id })
      .sort({ dueDate: 1 });

    // Calculate fee statistics
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees
      .filter(fee => fee.status === 'Paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const pendingFees = fees
      .filter(fee => fee.status === 'Pending')
      .reduce((sum, fee) => sum + fee.amount, 0);
    const overdueFees = fees
      .filter(fee => fee.status === 'Overdue')
      .reduce((sum, fee) => sum + fee.amount, 0);

    res.status(200).json({
      status: 'success',
      data: {
        fees,
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