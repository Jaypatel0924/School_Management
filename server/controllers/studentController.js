import Student from '../models/Student.js';
import User from '../models/User.js';
import { nanoid } from 'nanoid';

// Get all students (admin only)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    
    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new student (admin only)
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      grade,
      section,
      parentName,
      parentContact,
      address,
      dateOfBirth,
      gender,
      password
    } = req.body;

    // Generate unique 5-digit student ID
    let studentId;
    let isUnique = false;
    
    while (!isUnique) {
      studentId = nanoid(5).toUpperCase(); // Generate 5 character unique ID
      const existingStudent = await Student.findOne({ studentId });
      if (!existingStudent) {
        isUnique = true;
      }
    }

    // Check if student with this email already exists
    const existingStudent = await Student.findOne({ email });
    
    if (existingStudent) {
      return res.status(400).json({
        status: 'error',
        message: 'Student with this email already exists'
      });
    }

    // Create user account first
    const newUser = await User.create({
      name,
      email,
      password,
      role: 'student',
      isVerified: true // Admin is creating the account, so we can mark it as verified
    });

    // Create student profile with generated ID
    const newStudent = await Student.create({
      studentId,
      name,
      email,
      grade,
      section,
      parentName,
      parentContact,
      address,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      userId: newUser._id
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        student: newStudent
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete student (admin only)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
      });
    }
    
    // Delete the associated user account
    await User.findByIdAndDelete(student.userId);
    
    // Delete the student
    await Student.findByIdAndDelete(req.params.id);
    
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

// Get student profile for logged in student
export const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        student
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};