import Assignment from '../models/Assignment.js';
import Teacher from '../models/Teacher.js';
import Submission from '../models/Submission.js';

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

    const newAssignment = await Assignment.create({
      title,
      description,
      subject,
      grade,
      section,
      dueDate: new Date(dueDate),
      maxMarks,
      attachmentUrl,
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

// Get all assignments
export const getAllAssignments = async (req, res) => {
  try {
    const { grade, section, subject } = req.query;
    
    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (subject) filter.subject = subject;
    
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