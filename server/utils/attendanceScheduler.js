import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';
import { sendAbsenceThresholdAlert } from './email.js';

// Runs daily to check monthly absences and send alerts when threshold exceeded.
export const startAttendanceScheduler = () => {
  const runChecks = async () => {
    console.log('Running attendance scheduler checks...');
    try {
      const threshold = parseInt(process.env.ATTENDANCE_ALERT_THRESHOLD || '5', 10); // default 5 absences
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-based

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      // Find all students
      const students = await Student.find({}).select('name email studentId _id grade section').lean();

      for (const student of students) {
        // Count absences for this month
        const absentCount = await Attendance.countDocuments({
          student: student._id,
          date: { $gte: startDate, $lte: endDate },
          status: 'Absent'
        });

        if (absentCount > threshold) {
          // Check if we've already sent an alert for this student for this month
          const monthYearKey = `${year}-${month + 1}`; // e.g., 2025-11
          const existing = await Notification.findOne({
            student: student._id,
            type: 'attendance',
            message: { $regex: monthYearKey }
          }).lean();

          if (!existing) {
            // Create a notification
            const message = `Absent ${absentCount} days in ${startDate.toLocaleString('default', { month: 'long' })} ${year} (${monthYearKey})`;

            await Notification.create({
              student: student._id,
              message,
              type: 'attendance',
              date: new Date(),
            });

            // Send email alert if student has email
            try {
              if (student.email) {
                await sendAbsenceThresholdAlert(student.email, student.name, `${startDate.toLocaleString('default', { month: 'long' })} ${year}`, absentCount, threshold);
              }
            } catch (err) {
              console.error('Failed to send absence threshold email to', student.email, err);
            }

            console.log(`Attendance alert created for student ${student._id} (${absentCount} absences)`);
          }
        }
      }
    } catch (error) {
      console.error('Attendance scheduler error:', error);
    }
  };

  // Run immediately and then every 24 hours
  runChecks();
  setInterval(runChecks, 24 * 60 * 60 * 1000);
};
