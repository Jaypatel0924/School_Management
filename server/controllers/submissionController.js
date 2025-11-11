import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import fs from 'fs';
import path from 'path';

// Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a file'
      });
    }

    const { assignmentId } = req.body;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      // Delete uploaded file if assignment doesn't exist
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      // Delete uploaded file if student profile not found
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    // Check if student has already submitted this assignment
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: student._id
    });

    if (existingSubmission) {
      // Delete old file if it exists
      if (existingSubmission.fileUrl && fs.existsSync(existingSubmission.fileUrl)) {
        fs.unlinkSync(existingSubmission.fileUrl);
      }

      // Update existing submission
      existingSubmission.fileUrl = req.file.path;
      existingSubmission.submissionDate = Date.now();
      existingSubmission.status = 'Submitted';
      await existingSubmission.save();

      return res.status(200).json({
        status: 'success',
        data: {
          submission: existingSubmission
        }
      });
    }

    // Create new submission
    const newSubmission = await Submission.create({
      assignment: assignmentId,
      student: student._id,
      fileUrl: req.file.path,
      status: 'Submitted'
    });

    res.status(201).json({
      status: 'success',
      data: {
        submission: newSubmission
      }
    });
  } catch (error) {
    // Delete uploaded file if database operation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Grade submission
export const gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const submissionId = req.params.id;

    // Find the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    // Find the assignment
    const assignment = await Assignment.findById(submission.assignment);
    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    // Check if the teacher is the owner of the assignment
    if (assignment.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to grade this submission'
      });
    }

    // Update the submission
    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'Graded';
    await submission.save();

    res.status(200).json({
      status: 'success',
      data: {
        submission
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get submissions for an assignment
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    // Check if the teacher is the owner of the assignment
    if (assignment.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view these submissions'
      });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name rollNumber grade section');

    res.status(200).json({
      status: 'success',
      results: submissions.length,
      data: {
        submissions
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get student's submissions
export const getMySubmissions = async (req, res) => {
  try {
    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    // Get submissions for assignments in student's grade and section
    const submissions = await Submission.find({ student: student._id })
      .populate({
        path: 'assignment',
        match: { 
          grade: student.grade,
          section: student.section
        },
        select: 'title subject dueDate maxMarks',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      })
      .sort({ submissionDate: -1 });

    // Filter out submissions where assignment is null (not in student's grade/section)
    const validSubmissions = submissions.filter(sub => sub.assignment !== null);

    res.status(200).json({
      status: 'success',
      results: validSubmissions.length,
      data: {
        submissions: validSubmissions
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Download submission
export const downloadSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'name rollNumber grade section')
      .populate({
        path: 'assignment',
        select: 'title description subject dueDate maxMarks',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      });

    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    // Check if user is authorized to download
    const isTeacher = await Teacher.findOne({ userId: req.user.id });
    const isStudent = await Student.findOne({ userId: req.user.id });

    if (isTeacher) {
      // Teacher can only download submissions for their assignments
      if (submission.assignment.teacher._id.toString() !== isTeacher._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to download this submission'
        });
      }
    } else if (isStudent) {
      // Student can only download their own submissions
      if (submission.student._id.toString() !== isStudent._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to download this submission'
        });
      }
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to download submissions'
      });
    }

    // Check if file exists
    if (!fs.existsSync(submission.fileUrl)) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission file not found'
      });
    }

    const filename = path.basename(submission.fileUrl);
    res.download(submission.fileUrl, filename);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete submission
export const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    
    // Check if the student is the owner of the submission
    if (submission.student.toString() !== student._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this submission'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(submission.fileUrl)) {
      fs.unlinkSync(submission.fileUrl);
    }

    // Delete submission from database
    await Submission.findByIdAndDelete(req.params.id);

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
