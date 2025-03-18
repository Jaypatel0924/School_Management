import Announcement from '../models/Announcement.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// Create announcement
export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      audience,
      grade,
      section,
      startDate,
      endDate,
      attachmentUrl
    } = req.body;

    const newAnnouncement = await Announcement.create({
      title,
      content,
      type,
      audience,
      grade: grade || 'All',
      section: section || 'All',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      attachmentUrl,
      createdBy: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        announcement: newAnnouncement
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const { type, audience, grade, section } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (audience) filter.audience = audience;
    if (grade) filter.grade = { $in: [grade, 'All'] };
    if (section) filter.section = { $in: [section, 'All'] };

    // Only show active announcements (current date between start and end date)
    filter.startDate = { $lte: new Date() };
    filter.endDate = { $gte: new Date() };

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name role')
      .sort({ startDate: -1 });

    res.status(200).json({
      status: 'success',
      results: announcements.length,
      data: {
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

// Get announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name role');

    if (!announcement) {
      return res.status(404).json({
        status: 'error',
        message: 'Announcement not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        announcement
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: 'error',
        message: 'Announcement not found'
      });
    }

    // Check if the user is the creator of the announcement
    if (announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this announcement'
      });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
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
        announcement: updatedAnnouncement
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: 'error',
        message: 'Announcement not found'
      });
    }

    // Check if the user is the creator of the announcement
    if (announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this announcement'
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

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

// Get relevant announcements for current user
export const getMyAnnouncements = async (req, res) => {
  try {
    const filter = {
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    };

    // Determine user role and add appropriate filters
    if (req.user.role === 'student') {
      // Find the student profile for the logged in user
      const student = await Student.findOne({ userId: req.user.id });
      if (student) {
        filter.audience = { $in: ['All', 'Students'] };
        filter.grade = { $in: [student.grade, 'All'] };
        filter.section = { $in: [student.section, 'All'] };
      }
    } else if (req.user.role === 'teacher') {
      filter.audience = { $in: ['All', 'Teachers'] };
    } else if (req.user.role === 'admin') {
      filter.audience = { $in: ['All', 'Admin'] };
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name role')
      .sort({ startDate: -1 });

    res.status(200).json({
      status: 'success',
      results: announcements.length,
      data: {
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