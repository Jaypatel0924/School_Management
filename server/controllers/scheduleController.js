import Schedule from '../models/Schedule.js';
import Teacher from '../models/Teacher.js';

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
      description
    } = req.body;

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
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
      teacher: teacher._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        schedule: newSchedule
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get teacher's schedule
export const getMySchedule = async (req, res) => {
  try {
    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({
        status: 'error',
        message: 'Teacher profile not found'
      });
    }

    const schedules = await Schedule.find({ teacher: teacher._id })
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: {
        schedules
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
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
        message: 'Schedule not found'
      });
    }

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the owner of the schedule
    if (schedule.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this schedule'
      });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
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
        schedule: updatedSchedule
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
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
        message: 'Schedule not found'
      });
    }

    // Find the teacher profile for the logged in user
    const teacher = await Teacher.findOne({ userId: req.user.id });
    
    // Check if the teacher is the owner of the schedule
    if (schedule.teacher.toString() !== teacher._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this schedule'
      });
    }

    await Schedule.findByIdAndDelete(req.params.id);

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