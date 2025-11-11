
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';
import assignmentRoutes from './routes/assignment.js';
import submissionRoutes from './routes/submission.js';
import attendanceRoutes from './routes/attendance.js';
import examRoutes from './routes/exam.js';
import resultRoutes from './routes/result.js';
import feeRoutes from './routes/fee.js';
import announcementRoutes from './routes/announcement.js';
import dashboardRoutes from './routes/dashboard.js';
import materialRoutes from './routes/material.js';
import scheduleRoutes from './routes/schedule.js';
import admissionRoutes from './routes/admission.js';
import contactRoutes from './routes/contact.js';
import eventRoutes from './routes/event.js';
import notificationRoutes from './routes/notification.js';
import notesRoutes from './routes/notes.js';
import multer from 'multer';
// import { startFeeScheduler } from './utils/feeScheduler.js';
import { startAttendanceScheduler } from './utils/attendanceScheduler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes


// Add this line with other route declarations
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notes', notesRoutes);

// MongoDB Connection with retry logic

const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
   
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start background fee scheduler to apply late fees and send reminders
  // try {
  //    startFeeScheduler();
    startAttendanceScheduler();
  // } catch (err) {
  //   console.error('Failed to start fee scheduler:', err);
  // }
});