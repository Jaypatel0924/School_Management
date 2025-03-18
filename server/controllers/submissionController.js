import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Submit assignment
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, attachmentUrl } = req.body;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assignment not found'
      });
    }

    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
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
      // Update existing submission
      existingSubmission.attachmentUrl = attachmentUrl;
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
      attachmentUrl,
      status: 'Submitted'
    });

    res.status(201).json({
      status: 'success',
      data: {
        submission: newSubmission
      }
    });
  } catch (error) {
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

    const submissions = await Submission.find({ student: student._id })
      .populate({
        path: 'assignment',
        select: 'title subject dueDate maxMarks',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      })
      .sort({ submissionDate: -1 });

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

// Get submission by ID
export const getSubmissionById = async (req, res) => {
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

    // Check if the user is the student who submitted or the teacher who assigned
    const student = await Student.findOne({ userId: req.user.id });
    const teacher = await Teacher.findOne({ userId: req.user.id });

    if (student && submission.student._id.toString() === student._id.toString()) {
      // Student is viewing their own submission
      return res.status(200).json({
        status: 'success',
        data: {
          submission
        }
      });
    }

    if (teacher && submission.assignment.teacher._id.toString() === teacher._id.toString()) {
      // Teacher is viewing a submission for their assignment
      return res.status(200).json({
        status: 'success',
        data: {
          submission
        }
      });
    }

    // Neither the student nor the teacher
    return res.status(403).json({
      status: 'error',
      message: 'You are not authorized to view this submission'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};