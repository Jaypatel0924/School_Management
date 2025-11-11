import Result from '../models/Result.js';
import Student from '../models/Student.js';
import fs from 'fs';
import path from 'path';
import { sendAssignmentReminder, sendResultNotification } from '../utils/email.js';
import { generateResultTemplate } from '../utils/excelGenerator.js';

const uploadResult = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a file'
      });
    }
    // For bulk/class result uploads we expect a file + grade/section/type/title/description
    const { title, description, grade, section, type } = req.body;

    // Get current academic year (June to April)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    
    // If current month is between June and December, academic year is currentYear-nextYear
    // If current month is between January and April, academic year is previousYear-currentYear
    const academicYear = currentMonth >= 6 
      ? `${currentYear}-${currentYear + 1}` 
      : `${currentYear - 1}-${currentYear}`;

    const newResult = await Result.create({
      title: title || `${type || 'Result'} - ${grade || ''} ${section || ''}`,
      description: description || '',
      grade: grade || '',
      section: section || '',
      type: type || 'Other',
      status: 'Draft',
      fileUrl: req.file.path,
      uploadedBy: req.user.id,
      academicYear // Add the academic year
    });

    // Find all students in this grade and section to send notifications
    const students = await Student.find({
      grade,
      section
    }).populate('userId', 'email name');

    // Send notifications to all affected students
    await Promise.all(students.map(student => 
      sendResultNotification(
        student.userId.email,
        student.userId.name,
        {
          title,
          type,
          grade,
          section
        }
      ).catch(err => console.error(`Failed to send notification to ${student.userId.email}:`, err))
    ));

    res.status(201).json({
      status: 'success',
      data: {
        result: newResult
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

const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name rollNumber')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

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

const getResultsByGrade = async (req, res) => {
  try {
    const { grade, section } = req.query;

    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;

    const results = await Result.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

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

const getMyResults = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    const results = await Result.find({
      grade: student.grade,
      section: student.section
    })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

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

const downloadResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Result not found'
      });
    }

    // Check if user is authorized to download
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student || student.grade !== result.grade || student.section !== result.section) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to download this result'
        });
      }
    }

    // Check if file exists
    if (!fs.existsSync(result.fileUrl)) {
      return res.status(404).json({
        status: 'error',
        message: 'Result file not found'
      });
    }

    const filename = path.basename(result.fileUrl);
    res.download(result.fileUrl, filename);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Result not found'
      });
    }

    // Delete file from filesystem
    if (fs.existsSync(result.fileUrl)) {
      fs.unlinkSync(result.fileUrl);
    }

    // Delete result from database
    await Result.findByIdAndDelete(req.params.id);

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

const generateResultExcelTemplate = async (req, res) => {
  try {
    const { grade, section } = req.query;

    if (!grade || !section) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both grade and section'
      });
    }

    // Check if admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only administrators can generate result templates'
      });
    }

    const workbook = await generateResultTemplate(grade, section);

    // Set the response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Result_Template_${grade}_${section}_${Date.now()}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating result template:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate result template',
      details: error.message
    });
  }
};

const processFinalResults = async (req, res) => {
  try {
    const { examType, results, academicYear } = req.body;

    if (!examType || !Array.isArray(results) || !academicYear) {
      return res.status(400).json({ status: 'error', message: 'Invalid payload. Please provide examType, results array, and academicYear' });
    }

    if (examType !== 'Final Term') {
      return res.status(200).json({ status: 'success', message: 'No promotion required for non-final exams' });
    }

    // Validate academic year format (e.g., "2025-2026")
    if (!/^\d{4}-\d{4}$/.test(academicYear)) {
      return res.status(400).json({ status: 'error', message: 'Invalid academic year format. Use YYYY-YYYY format' });
    }

    const gradeOrder = ['Grade 8', 'Grade 9', 'Grade 10'];
    const promoted = [];
    const endYear = academicYear.split('-')[1];
    const currentMonth = new Date().getMonth() + 1; // 1-12

    // Only process promotions between April and June
    if (currentMonth < 4 || currentMonth > 6) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Promotions can only be processed between April and June' 
      });
    }

    for (const r of results) {
      if (!r.studentId) continue;
      const student = await Student.findById(r.studentId);
      if (!student) continue;

      if (r.passed) {
        const currentIndex = gradeOrder.indexOf(student.grade);
        if (currentIndex >= 0 && currentIndex < gradeOrder.length - 1) {
          const newGrade = gradeOrder[currentIndex + 1];
          
          // Create promotion result record
          await Result.create({
            academicYear,
            title: `Final Result and Promotion - ${academicYear}`,
            student: student._id,
            grade: student.grade,
            section: student.section,
            type: 'Final Term',
            status: 'Published',
            isPromoted: true,
            promotedToGrade: newGrade,
            percentage: r.percentage || 0,
            totalMarks: r.totalMarks || 0,
            obtainedMarks: r.obtainedMarks || 0,
            uploadedBy: req.user.id,
            fileUrl: r.fileUrl || ''
          });

          // Update student's grade
          student.grade = newGrade;
          await student.save();
          
          promoted.push({ 
            studentId: student._id, 
            name: student.name,
            previousGrade: gradeOrder[currentIndex],
            newGrade: newGrade 
          });
        } else if (currentIndex === gradeOrder.length - 1) {
          // Handle graduation
          await Result.create({
            academicYear,
            title: `Graduation Result - ${academicYear}`,
            student: student._id,
            grade: student.grade,
            section: student.section,
            type: 'Final Term',
            status: 'Published',
            isPromoted: true,
            promotedToGrade: 'Graduated',
            percentage: r.percentage || 0,
            totalMarks: r.totalMarks || 0,
            obtainedMarks: r.obtainedMarks || 0,
            uploadedBy: req.user.id,
            fileUrl: r.fileUrl || ''
          });
        }
      }
    }

    res.status(200).json({ 
      status: 'success', 
      data: { 
        academicYear,
        promoted,
        message: `Successfully processed promotions for academic year ${academicYear}`
      } 
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Single export at the end
export {
  uploadResult,
  getAllResults,
  getResultsByGrade,
  getMyResults,
  downloadResult,
  deleteResult,
  processFinalResults,
  generateResultExcelTemplate
};
