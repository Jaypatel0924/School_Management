import Exam from '../models/Exam.js';
import Teacher from '../models/Teacher.js';
import Result from '../models/Result.js';

// Create new exam
export const createExam = async (req, res) => {
  try {
    const {
      name,
      type,
      subject,
      grade,
      section,
      date,
      startTime,
      endTime,
      maxMarks
    } = req.body;

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    const newExam = await Exam.create({
      name,
      type,
      subject,
      grade,
      section,
      date: new Date(date),
      startTime,
      endTime,
      maxMarks,
      createdBy: teacher._id
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        exam: newExam
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all exams
export const getAllExams = async (req, res) => {
  try {
    const { grade, section, subject, type } = req.query;
    
    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    
    const exams = await Exam.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    
    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: {
        exams
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        exam
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update exam
export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
      });
    }
    
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the creator of the exam
    if (exam.createdBy.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this exam'
      });
    }
    
    const updatedExam = await Exam.findByIdAndUpdate(
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
        exam: updatedExam
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
      });
    }
    
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the creator of the exam
    if (exam.createdBy.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this exam'
      });
    }
    
    // Delete all results for this exam
    await Result.deleteMany({ exam: exam._id });
    
    // Delete the exam
    await Exam.findByIdAndDelete(req.params.id);
    
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

// Get upcoming exams
export const getUpcomingExams = async (req, res) => {
  try {
    const { grade, section } = req.query;
    
    const filter = {
      date: { $gte: new Date() }
    };
    
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    
    const exams = await Exam.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    
    res.status(200).json({
      status: 'success',
      results: exams.length,
      data: {
        exams
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};