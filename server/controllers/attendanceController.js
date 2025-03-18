import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, grade, section } = req.body;

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

    // Check if attendance already exists for this student on this date
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: new Date(date)
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.markedBy = teacher._id;
      await existingAttendance.save();

      return res.status(200).json({
        status: 'success',
        data: {
          attendance: existingAttendance
        }
      });
    }

    // Create new attendance record
    const newAttendance = await Attendance.create({
      student: studentId,
      date: new Date(date),
      status,
      grade,
      section,
      markedBy: teacher._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        attendance: newAttendance
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Mark bulk attendance
export const markBulkAttendance = async (req, res) => {
  try {
    const { attendanceRecords, date, grade, section } = req.body;

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    const results = [];

    // Process each attendance record
    for (const record of attendanceRecords) {
      const { studentId, status } = record;

      // Check if attendance already exists for this student on this date
      const existingAttendance = await Attendance.findOne({
        student: studentId,
        date: new Date(date)
      });

      if (existingAttendance) {
        // Update existing attendance
        existingAttendance.status = status;
        existingAttendance.markedBy = teacher._id;
        await existingAttendance.save();
        results.push(existingAttendance);
      } else {
        // Create new attendance record
        const newAttendance = await Attendance.create({
          student: studentId,
          date: new Date(date),
          status,
          grade,
          section,
          markedBy: teacher._id
        });
        results.push(newAttendance);
      }
    }

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        attendanceRecords: results
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get attendance by date, grade, and section
export const getAttendanceByClass = async (req, res) => {
  try {
    const { date, grade, section } = req.query;

    const filter = {};
    if (date) filter.date = new Date(date);
    if (grade) filter.grade = grade;
    if (section) filter.section = section;

    const attendanceRecords = await Attendance.find(filter)
      .populate('student', 'name rollNumber')
      .populate('markedBy', 'name');

    res.status(200).json({
      status: 'success',
      results: attendanceRecords.length,
      data: {
        attendanceRecords
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get student's attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const filter = { student: studentId };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await Attendance.find(filter)
      .sort({ date: -1 });

    // Calculate attendance statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'Present').length;
    const absentDays = attendanceRecords.filter(record => record.status === 'Absent').length;
    const lateDays = attendanceRecords.filter(record => record.status === 'Late').length;
    
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      status: 'success',
      data: {
        attendanceRecords,
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          attendancePercentage: attendancePercentage.toFixed(2)
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

// Get my attendance (for logged in student)
export const getMyAttendance = async (req, res) => {
  try {
    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }

    const { startDate, endDate } = req.query;

    const filter = { student: student._id };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await Attendance.find(filter)
      .sort({ date: -1 });

    // Calculate attendance statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'Present').length;
    const absentDays = attendanceRecords.filter(record => record.status === 'Absent').length;
    const lateDays = attendanceRecords.filter(record => record.status === 'Late').length;
    
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      status: 'success',
      data: {
        attendanceRecords,
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          attendancePercentage: attendancePercentage.toFixed(2)
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