import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Attendance from '../models/Attendance.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import Fee from '../models/Fee.js';
import Announcement from '../models/Announcement.js';

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    // Get counts
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    
    // Get fee collection stats
    const fees = await Fee.find();
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const collectedFees = fees
      .filter(fee => fee.status === 'Paid')
      .reduce((sum, fee) => sum + fee.amount, 0);
    
    // Get recent activities
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentTeachers = await Teacher.find()
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentAnnouncements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Combine recent activities
    const recentActivities = [
      ...recentStudents.map(student => ({
        type: 'student_added',
        data: student,
        time: student.createdAt
      })),
      ...recentTeachers.map(teacher => ({
        type: 'teacher_added',
        data: teacher,
        time: teacher.createdAt
      })),
      ...recentAnnouncements.map(announcement => ({
        type: 'announcement_added',
        data: announcement,
        time: announcement.createdAt
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 10);
    
    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          studentCount,
          teacherCount,
          totalFees,
          collectedFees,
          feeCollectionPercentage: totalFees > 0 ? (collectedFees / totalFees) * 100 : 0
        },
        recentActivities
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Teacher Dashboard
export const getTeacherDashboard = async (req, res) => {
  try {
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }
    
    // Get assignments created by this teacher
    const assignments = await Assignment.find({ teacher: teacher._id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get submission stats for teacher's assignments
    const assignmentIds = assignments.map(assignment => assignment._id);
    const submissions = await Submission.find({ assignment: { $in: assignmentIds } });
    
    // Get upcoming exams created by this teacher
    const upcomingExams = await Exam.find({
      createdBy: teacher._id,
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(5);
    
    // Get recent results added by this teacher
    const recentResults = await Result.find({ addedBy: teacher._id })
      .populate('student', 'name rollNumber grade section')
      .populate('exam', 'name subject')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get announcements relevant to this teacher
    const announcements = await Announcement.find({
      audience: { $in: ['All', 'Teachers'] },
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).sort({ startDate: -1 }).limit(5);
    
    res.status(200).json({
      status: 'success',
      data: {
        teacher,
        stats: {
          assignmentCount: await Assignment.countDocuments({ teacher: teacher._id }),
          submissionCount: submissions.length,
          pendingGradingCount: submissions.filter(sub => sub.status === 'Submitted').length,
          examCount: await Exam.countDocuments({ createdBy: teacher._id })
        },
        assignments,
        upcomingExams,
        recentResults,
        announcements
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Student Dashboard
export const getStudentDashboard = async (req, res) => {
  try {
    // Find the student profile for the logged in user
    const student = await Student.findOne({ userId: req.user.id });
    
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found'
      });
    }
    
    // Get assignments for student's grade and section
    const assignments = await Assignment.find({
      grade: student.grade,
      section: student.section,
      dueDate: { $gte: new Date() }
    })
      .populate('teacher', 'name')
      .sort({ dueDate: 1 })
      .limit(5);
    
    // Get student's submissions
    const submissions = await Submission.find({ student: student._id })
      .populate({
        path: 'assignment',
        select: 'title subject dueDate maxMarks',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      })
      .sort({ submissionDate: -1 })
      .limit(5);
    
    // Get upcoming exams for student's grade and section
    const upcomingExams = await Exam.find({
      grade: student.grade,
      section: student.section,
      date: { $gte: new Date() }
    })
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .limit(5);
    
    // Get student's recent results
    const recentResults = await Result.find({ student: student._id })
      .populate({
        path: 'exam',
        select: 'name type subject date maxMarks'
      })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get student's attendance
    const attendanceRecords = await Attendance.find({ student: student._id })
      .sort({ date: -1 })
      .limit(30);
    
    // Calculate attendance statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'Present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    
    // Get announcements relevant to this student
    const announcements = await Announcement.find({
      audience: { $in: ['All', 'Students'] },
      grade: { $in: [student.grade, 'All'] },
      section: { $in: [student.section, 'All'] },
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).sort({ startDate: -1 }).limit(5);
    
    // Get fee status
    const fees = await Fee.find({ student: student._id });
    const pendingFees = fees.filter(fee => fee.status === 'Pending' || fee.status === 'Overdue');
    
    res.status(200).json({
      status: 'success',
      data: {
        student,
        stats: {
          attendancePercentage: attendancePercentage.toFixed(2),
          pendingAssignments: assignments.length,
          upcomingExams: upcomingExams.length,
          pendingFees: pendingFees.length
        },
        assignments,
        submissions,
        upcomingExams,
        recentResults,
        announcements,
        pendingFees
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};