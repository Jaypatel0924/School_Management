import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    
    res.status(200).json({
      status: 'success',
      results: teachers.length,
      data: {
        teachers
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        teacher
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new teacher
export const createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      subject,
      qualification,
      experience,
      contactNumber,
      address,
      joiningDate,
      password
    } = req.body;

    // Check if teacher with this email or employee ID already exists
    const existingTeacher = await Teacher.findOne({ 
      $or: [{ email }, { employeeId }] 
    });
    
    if (existingTeacher) {
      return res.status(400).json({
        status: 'error',
        message: 'Teacher with this email or employee ID already exists'
      });
    }

    // Create user account first
    const newUser = await User.create({
      name,
      email,
      password,
      role: 'teacher',
      isVerified: true // Admin is creating the account, so we can mark it as verified
    });

    // Create teacher profile
    const newTeacher = await Teacher.create({
      name,
      email,
      employeeId,
      subject,
      qualification,
      experience,
      contactNumber,
      address,
      joiningDate: joiningDate ? new Date(joiningDate) : Date.now(),
      userId: newUser._id
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        teacher: newTeacher
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedTeacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        teacher: updatedTeacher
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher not found'
      });
    }
    
    // Delete the associated user account
    await User.findByIdAndDelete(teacher.userId);
    
    // Delete the teacher
    await Teacher.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get teachers by subject
export const getTeachersBySubject = async (req, res) => {
  try {
    const { subject } = req.query;
    
    const filter = {};
    if (subject) filter.subject = subject;
    
    const teachers = await Teacher.find(filter);
    
    res.status(200).json({
      status: 'success',
      results: teachers.length,
      data: {
        teachers
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get teacher profile for logged in teacher
export const getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        teacher
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};