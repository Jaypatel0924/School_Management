import Schedule from '../models/Schedule.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { sendNewClassNotification } from '../utils/email.js';

// Create class schedule
export const createSchedule = async (req, res) => {
  try {
    const {
      subject,
      grade,
      section,
      date,
      startTime,
      endTime,
      topic,
      description,
    } = req.body;

    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found',
      });
    }

    const newSchedule = await Schedule.create({
      subject,
      grade,
      section,
      date: new Date(date),
      startTime,
      endTime,
      topic,
      description,
      teacher: teacher._id,
    });

    // Find all students in this grade and section
    const students = await Student.find({ grade, section }).populate('userId', 'name email');

    // Send email notifications to all students
    await Promise.all(students.map(student =>
      sendNewClassNotification(
        student.userId.email,
        student.userId.name,
        {
          subject,
          topic,
          date,
          startTime,
          endTime,
          description
        }
      ).catch(err => console.error(`Failed to send class notification to ${student.userId.email}:`, err))
    ));
    
    // Create notifications for all affected students
    const studentNotifications = students.map(student => ({
      recipient: student._id,
      recipientModel: 'Student',
      message: `New class scheduled: ${subject} on ${new Date(date).toLocaleDateString()} at ${startTime}`,
      type: 'schedule',
      date: new Date()
    }));

    // Also notify other teachers who teach the same grade and section
    const teachers = await Teacher.find({
      _id: { $ne: teacher._id }, // Exclude the creating teacher
      grades: grade,
      sections: section
    });

    const teacherNotifications = teachers.map(otherTeacher => ({
      recipient: otherTeacher._id,
      recipientModel: 'Teacher',
      message: `New class scheduled for ${grade} ${section}: ${subject} on ${new Date(date).toLocaleDateString()} at ${startTime}`,
      type: 'schedule',
      date: new Date()
    }));

    await Notification.insertMany([...studentNotifications, ...teacherNotifications]);

    res.status(201).json({
      status: 'success',
      data: {
        schedule: newSchedule,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get schedule for logged in user (teacher or student)
export const getMySchedule = async (req, res) => {
  try {
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: req.user.id });
      if (!teacher) {
        return res.status(404).json({
          status: 'error',
          message: 'Teacher profile not found',
        });
      }

      const schedules = await Schedule.find({ teacher: teacher._id })
        .sort({ date: 1, startTime: 1 })
        .populate('teacher', 'name');

      return res.status(200).json({
        status: 'success',
        results: schedules.length,
        data: {
          schedules,
        },
      });
    } else if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        return res.status(404).json({
          status: 'error',
          message: 'Student profile not found',
        });
      }

      const schedules = await Schedule.find({
        grade: student.grade,
        section: student.section,
        date: { $gte: new Date() },
      })
        .sort({ date: 1, startTime: 1 })
        .populate('teacher', 'name');

      return res.status(200).json({
        status: 'success',
        results: schedules.length,
        data: {
          schedules,
        },
      });
    }

    res.status(400).json({
      status: 'error',
      message: 'Invalid user role',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update schedule
export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Schedule not found',
      });
    }

    const teacher = await Teacher.findOne({ userId: req.user.id });

    if (schedule.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this schedule',
      });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        schedule: updatedSchedule,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete schedule
export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({
        status: 'error',
        message: 'Schedule not found',
      });
    }

    const teacher = await Teacher.findOne({ userId: req.user.id });

    if (schedule.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this schedule',
      });
    }

    await Schedule.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
// Add this to your existing exports
export const getStudentSchedule = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found',
      });
    }

    const schedules = await Schedule.find({
      grade: student.grade,
      section: student.section,
      date: { $gte: new Date() }, // Only upcoming classes
    })
      .sort({ date: 1, startTime: 1 })
      .populate('teacher', 'name');

    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: {
        schedules,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};