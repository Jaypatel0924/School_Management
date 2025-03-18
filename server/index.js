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

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

// Update user verification status
const updatePendingVerifications = async () => {
  try {
    const User = mongoose.model('User');
    // Find users with expired verification tokens
    await User.updateMany(
      {
        isVerified: false,
        verificationTokenExpires: { $lt: Date.now() }
      },
      {
        $unset: { verificationToken: 1, verificationTokenExpires: 1 }
      }
    );
    console.log('Updated pending verifications');
  } catch (error) {
    console.error('Error updating pending verifications:', error);
  }
};

// Run the update every day
setInterval(updatePendingVerifications, 24 * 60 * 60 * 1000);

// Update overdue fees
const updateOverdueFees = async () => {
  try {
    const Fee = mongoose.model('Fee');
    // Find fees that are past due date and still pending
    await Fee.updateMany(
      {
        status: 'Pending',
        dueDate: { $lt: Date.now() }
      },
      {
        $set: { status: 'Overdue' }
      }
    );
    console.log('Updated overdue fees');
  } catch (error) {
    console.error('Error updating overdue fees:', error);
  }
};

// Run the update every day
setInterval(updateOverdueFees, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});