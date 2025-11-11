import Event from '../models/Event.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Notification from '../models/Notification.js';

// Create new event (admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, category, location } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      category,
      location,
      createdBy: req.user.id,
    });

    // Create notifications for all students and teachers
    const students = await Student.find({});
    const teachers = await Teacher.find({});

    const notifications = [
      ...students.map(student => ({
        recipient: student._id,
        recipientModel: 'Student',
        message: `New event scheduled: ${title} on ${new Date(date).toLocaleDateString()} at ${startTime}`,
        type: 'event',
        date: new Date()
      })),
      ...teachers.map(teacher => ({
        recipient: teacher._id,
        recipientModel: 'Teacher',
        message: `New event scheduled: ${title} on ${new Date(date).toLocaleDateString()} at ${startTime}`,
        type: 'event',
        date: new Date()
      }))
    ];

    await Notification.insertMany(notifications);

    res.status(201).json({
      status: 'success',
      data: {
        event: newEvent,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name')
      // sort by date then startTime so timewise ordering is preserved
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found',
      });
    }

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