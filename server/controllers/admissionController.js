import Admission from '../models/Admission.js';

// Submit admission form
export const submitAdmission = async (req, res) => {
  try {
    const { firstName, lastName, email, gradeApplying, message } = req.body;

    const newAdmission = await Admission.create({
      firstName,
      lastName,
      email,
      gradeApplying,
      message,
    });

    res.status(201).json({
      status: 'success',
      data: {
        admission: newAdmission,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all admissions (admin only)
export const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: admissions.length,
      data: {
        admissions,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update admission status
export const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!admission) {
      return res.status(404).json({
        status: 'error',
        message: 'Admission not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        admission,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};