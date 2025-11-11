import Assignment from '../models/Assignment.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Submission from '../models/Submission.js';
import Notification from '../models/Notification.js';
import { sendAssignmentReminder } from '../utils/email.js';

// Create new assignment
export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      grade,
      section,
      dueDate,
      maxMarks,
      attachmentUrl
    } = req.body;

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    // If a file was uploaded via multer, construct an attachment URL
    let finalAttachmentUrl = attachmentUrl;
    if (req.file) {
      const host = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      finalAttachmentUrl = `${host}/uploads/${req.file.filename}`;
    }

    const newAssignment = await Assignment.create({
      title,
      description,
      subject,
      grade,
      section,
      dueDate: new Date(dueDate),
      maxMarks,
      attachmentUrl: finalAttachmentUrl,
      teacher: teacher._id
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        assignment: newAssignment
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get assignments based on user role
export const getAllAssignments = async (req, res) => {
  try {
    const { grade, section, subject } = req.query;
    
    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (subject) filter.subject = subject;

    // If user is a student, only show assignments for their grade and section
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        return res.status(404).json({
          status: 'error',
          message: 'Student profile not found'
        });
      }
      filter.grade = student.grade;
      filter.section = student.section;
    }
    
    const assignments = await Assignment.find(filter)
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: assignments.length,
      data: {
        assignments
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get assignment by ID
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher', 'name');
    
    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    // If user is a student, verify they can access this assignment
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (student.grade !== assignment.grade || student.section !== assignment.section) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to view this assignment'
        });
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        assignment
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }
    
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the owner of the assignment
    if (assignment.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this assignment'
      });
    }
    
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        assignment: updatedAssignment
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }
    
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the owner of the assignment
    if (assignment.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this assignment'
      });
    }
    
    // Delete all submissions for this assignment
    await Submission.deleteMany({ assignment: assignment._id });
    
    // Delete the assignment
    await Assignment.findByIdAndDelete(req.params.id);
    
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

// Send reminder email to all students in the assignment's class (grade + section)
export const sendAssignmentReminderToClass = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ status: 'error', message: 'Assignment not found' });
    }

    // Verify teacher ownership
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ status: 'error', message: 'Teacher profile not found' });
    }

    if (assignment.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'You are not authorized to send reminders for this assignment' });
    }

    // Find students for this grade/section
    const students = await Student.find({ grade: assignment.grade, section: assignment.section });

    const assignmentLink = `${process.env.FRONTEND_URL || ''}/assignments/${assignment._id}`;

    // Send email & create notification for each student (don't await all sequentially)
    const sendPromises = students.map(async (student) => {
      try {
        await sendAssignmentReminder(student.email, student.name, assignment.title, assignment.dueDate, assignmentLink);

        await Notification.create({
          student: student._id,
          message: `Reminder: Please complete assignment '${assignment.title}' by ${new Date(assignment.dueDate).toLocaleDateString()}`,
          type: 'assignment',
          date: new Date(),
        });
      } catch (err) {
        // log and continue
        console.error(`Failed to send reminder to ${student.email}:`, err.message);
      }
    });

    await Promise.all(sendPromises);

    res.status(200).json({ status: 'success', message: `Reminders sent to ${students.length} students` });
  } catch (error) {
    console.error('Error in sendAssignmentReminderToClass:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get assignments by teacher
export const getMyAssignments = async (req, res) => {
  try {
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }
    
    const assignments = await Assignment.find({ teacher: teacher._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: assignments.length,
      data: {
        assignments
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
