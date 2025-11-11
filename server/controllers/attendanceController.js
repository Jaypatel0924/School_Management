import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { sendAbsenceNotification } from '../utils/email.js';

// Mark bulk attendance
export const markBulkAttendance = async (req, res) => {
  try {
    const { attendanceRecords, date, grade, section } = req.body;

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found',
      });
    }

    const results = [];

    // Process each attendance record
    for (const record of attendanceRecords) {
      const { studentId, status } = record;

      // Check if attendance already exists for this student on this date
      const existingAttendance = await Attendance.findOne({
        student: studentId,
        date: new Date(date),
      });

      // Get student details for email notification
      const student = await Student.findById(studentId);

      if (existingAttendance) {
        // Update existing attendance
        existingAttendance.status = status;
        existingAttendance.markedBy = teacher._id;
        await existingAttendance.save();
        results.push(existingAttendance);

        // Send email if marked as absent
        if (status === 'Absent') {
          await sendAbsenceNotification(student.email, student.name, date);
        }
      } else {
        // Create new attendance record
        const newAttendance = await Attendance.create({
          student: studentId,
          date: new Date(date),
          status,
          grade,
          section,
          markedBy: teacher._id,
        });
        results.push(newAttendance);

        // Send email if marked as absent
        if (status === 'Absent') {
          await sendAbsenceNotification(student.email, student.name, date);
        }
      }
    }

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        attendanceRecords: results,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get attendance by class
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
        attendanceRecords,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get monthly attendance report for a class (grade + section)
export const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { grade, section, year, month } = req.query;

    if (!grade || !section || !year || !month) {
      return res.status(400).json({ status: 'error', message: 'grade, section, year and month are required' });
    }

    // month: 1-12
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
      return res.status(400).json({ status: 'error', message: 'Invalid year or month' });
    }

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0); // last day of month

    // Get all students in the class
    const students = await Student.find({ grade, section }).select('name studentId _id');

    // If no students found
    if (!students || students.length === 0) {
      return res.status(200).json({ status: 'success', results: 0, data: { report: [] } });
    }

    // Fetch attendance records for the time range and students in this class
    const attendanceRecords = await Attendance.find({
      student: { $in: students.map(s => s._id) },
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    // Build report per student
    const report = students.map(student => {
      const records = attendanceRecords.filter(r => r.student.toString() === student._id.toString());
      const totalDaysRecorded = records.length;
      const presentDays = records.filter(r => r.status === 'Present').length;
      const absentDays = records.filter(r => r.status === 'Absent').length;

      // If some days have no records, they are considered 'Not marked' and do not count towards present/absent totals.

      const attendancePercentage = totalDaysRecorded > 0 ? (presentDays / totalDaysRecorded) * 100 : 0;

      return {
        studentId: student.studentId,
        studentName: student.name,
        studentRef: student._id,
        totalDaysRecorded,
        presentDays,
        absentDays,
        attendancePercentage: attendancePercentage.toFixed(2)
      };
    });

    res.status(200).json({ status: 'success', results: report.length, data: { report } });
  } catch (error) {
    console.error('Monthly attendance report error:', error);
    res.status(400).json({ status: 'error', message: error.message });
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
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(filter).sort({ date: -1 });

    // Calculate attendance statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(
      (record) => record.status === 'Present'
    ).length;
    const absentDays = attendanceRecords.filter(
      (record) => record.status === 'Absent'
    ).length;

    const attendancePercentage =
      totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      status: 'success',
      data: {
        attendanceRecords,
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage: attendancePercentage.toFixed(2),
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get my attendance (for logged in student)
export const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found',
      });
    }

    const { startDate, endDate } = req.query;

    const filter = { student: student._id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendanceRecords = await Attendance.find(filter).sort({ date: -1 });

    // Calculate attendance statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(
      (record) => record.status === 'Present'
    ).length;
    const absentDays = attendanceRecords.filter(
      (record) => record.status === 'Absent'
    ).length;

    const attendancePercentage =
      totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      status: 'success',
      data: {
        attendanceRecords,
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          attendancePercentage: attendancePercentage.toFixed(2),
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};