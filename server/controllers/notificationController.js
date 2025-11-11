import Notification from '../models/Notification.js';
import Student from '../models/Student.js';

import Teacher from '../models/Teacher.js';

export const getMyNotifications = async (req, res) => {
  try {
    let recipient;
    let recipientModel;
    
    if (req.user.role === 'student') {
      recipient = await Student.findOne({ userId: req.user.id });
      recipientModel = 'Student';
    } else if (req.user.role === 'teacher') {
      recipient = await Teacher.findOne({ userId: req.user.id });
      recipientModel = 'Teacher';
    }

    if (!recipient) {
      return res.status(404).json({
        status: 'error',
        message: `${req.user.role} profile not found`
      });
    }

    const notifications = await Notification.find({ 
      recipient: recipient._id,
      recipientModel,
      read: false 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        notifications
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch notifications'
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        notification
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read'
    });
  }
};