import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Add result
export const addResult = async (req, res) => {
  try {
    const { examId, studentId, marks, grade, remarks } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found'
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

    // Check if result already exists for this student and exam
    const existingResult = await Result.findOne({
      student: studentId,
      exam: examId
    });

    if (existingResult) {
      // Update existing result
      existingResult.marks = marks;
      existingResult.grade = grade;
      existingResult.remarks = remarks;
      existingResult.addedBy = teacher._id;
      await existingResult.save();

      return res.status(200).json({
        status: 'success',
        data: {
          result: existingResult
        }
      });
    }

    // Create new result
    const newResult = await Result.create({
      student: studentId,
      exam: examId,
      marks,
      grade,
      remarks,
      addedBy: teacher._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        result: newResult
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add bulk results
export const addBulkResults = async (req, res) => {
  try {
    const { examId, results } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
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

    const createdResults = [];

    // Process each result
    for (const result of results) {
      const { studentId, marks, grade, remarks } = result;

      // Check if student exists
      const student = await Student.findById(studentId);
      if (!student) {
        continue; // Skip this student if not found
      }

      // Check if result already exists for this student and exam
      const existingResult = await Result.findOne({
        student: studentId,
        exam: examId
      });

      if (existingResult) {
        // Update existing result
        existingResult.marks = marks;
        existingResult.grade = grade;
        existingResult.remarks = remarks;
        existingResult.addedBy = teacher._id;
        await existingResult.save();
        createdResults.push(existingResult);
      } else {
        // Create new result
        const newResult = await Result.create({
          student: studentId,
          exam: examId,
          marks,
          grade,
          remarks,
          addedBy: teacher._id
        });
        createdResults.push(newResult);
      }
    }

    res.status(200).json({
      status: 'success',
      results: createdResults.length,
      data: {
        results: createdResults
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get results by exam
export const getResultsByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        status: 'error',
        message: 'Exam not found'
      });
    }

    const results = await Result.find({ exam: examId })
      .populate('student', 'name rollNumber grade section')
      .populate('addedBy', 'name')
      .sort({ marks: -1 });

    // Calculate statistics
    const totalStudents = results.length;
    const totalMarks = exam.maxMarks * totalStudents;
    const marksObtained = results.reduce((sum, result) => sum + result.marks, 0);
    const averageMarks = totalStudents > 0 ? marksObtained / totalStudents : 0;
    const passPercentage = totalStudents > 0 
      ? (results.filter(result => result.marks >= (exam.maxMarks * 0.4)).length / totalStudents) * 100 
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        results,
        statistics: {
          totalStudents,
          totalMarks,
          marksObtained,
          averageMarks: averageMarks.toFixed(2),
          passPercentage: passPercentage.toFixed(2)
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

// Get student's results
export const getStudentResults = async (req, res) => {
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

    const results = await Result.find({ student: studentId })
      .populate({
        path: 'exam',
        select: 'name type subject date maxMarks',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .sort({ 'exam.date': -1 });

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        results
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get my results (for logged in student)
export const getMyResults = async (req, res) => {
  try {
    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    const results = await Result.find({ student: student._id })
      .populate({
        path: 'exam',
        select: 'name type subject date maxMarks',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .sort({ 'exam.date': -1 });

    // Group results by subject
    const resultsBySubject = {};
    results.forEach(result => {
      const subject = result.exam.subject;
      if (!resultsBySubject[subject]) {
        resultsBySubject[subject] = [];
      }
      resultsBySubject[subject].push(result);
    });

    res.status(200).json({
      status: 'success',
      data: {
        results,
        resultsBySubject
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};