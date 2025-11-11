import Student from '../models/Student.js';
import User from '../models/User.js';
import { nanoid } from 'nanoid';
import {sendNewUserCredentials, sendUpdatedCredentialsEmail} from '../utils/email.js'
// Get all students (admin only)
export const getAllStudents = async (req, res) => {
  try {
    const { grade, section } = req.query;
    
    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;

    const students = await Student.find(filter);

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
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
      password,
    } = req.body;

    // Generate unique 5-digit student ID
    let studentId;
    let isUnique = false;

    while (!isUnique) {
      studentId = nanoid(5).toUpperCase();
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
        message: 'Student with this email already exists',
      });
    }

    // Create user account first
    const newUser = await User.create({
      name,
      email,
      password,
      role: 'student',
      isVerified: true,
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
      userId: newUser._id,
    });

    // Send credentials email
    console.log('About to send credentials email to:', email);
    await sendNewUserCredentials(email, password, 'student');
    console.log('Credentials email function executed');
    

    res.status(201).json({
      status: 'success',
      data: {
        student: newStudent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update Studnet (admin only)
// export const updateStudent = async (req, res) => {
//   try {
//     const updatedStudent = await Student.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     );
    
//     if (!updatedStudent) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Student not found'
//       });
//     }
    
//     res.status(200).json({
//       status: 'success',
//       data: {
//         student: updatedStudent
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: error.message
//     });
//   }
// };
export const updateStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingStudent = await Student.findById(req.params.id);
    if (!existingStudent) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    // Check if updating email to one that already exists
    if (email && email !== existingStudent.email) {
      const emailExists = await Student.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use by another student',
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // If email or password is updated, update user and send credentials
    if (email || password) {
      const updatedUserData = {};
      if (email) updatedUserData.email = email;
      if (password) updatedUserData.password = password;

      await User.findByIdAndUpdate(existingStudent.userId, updatedUserData);

      await sendUpdatedCredentialsEmail(email || existingStudent.email, password || '••••••••');
    }

    res.status(200).json({
      status: 'success',
      data: {
        student: updatedStudent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
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
        message: 'Student not found',
      });
    }

    // Delete the associated user account
    await User.findByIdAndDelete(student.userId);

    // Delete the student
    await Student.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
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
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};