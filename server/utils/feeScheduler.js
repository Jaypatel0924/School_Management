import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { sendFeeReminder } from './email.js';

// Runs once on start and then every 24 hours.
export const startFeeScheduler = () => {
  const runChecks = async () => {
    console.log('Running fee scheduler checks...');
    try {
      const fees = await Fee.find().lean();
      const now = new Date();

      for (const fee of fees) {
        let feeModified = false;

        for (let i = 0; i < (fee.payments || []).length; i++) {
          const payment = fee.payments[i];
          if (!payment || !payment.student) continue;

          // Ensure dueDate exists on fee
          if (!fee.dueDate) continue;

          const due = new Date(fee.dueDate);

          // 1) Send reminder one day before due date
          const oneDayBefore = new Date(due);
          oneDayBefore.setDate(oneDayBefore.getDate() - 1);

          const isOneDayBefore =
            oneDayBefore.getFullYear() === now.getFullYear() &&
            oneDayBefore.getMonth() === now.getMonth() &&
            oneDayBefore.getDate() === now.getDate();

          if (isOneDayBefore && (!payment.status || payment.status === 'Pending')) {
            try {
              const student = await Student.findById(payment.student).lean();
              if (student && student.email) {
                await sendFeeReminder(student.email, student.name, fee.dueDate, fee.amount);
              }
            } catch (err) {
              console.error('Failed to send reminder for student', payment.student, err);
            }
          }

          // 2) Apply monthly late fee after due date for pending/overdue payments
          if (now > due && (payment.status === 'Pending' || payment.status === 'Overdue')) {
            // Calculate months late (at least 1 if overdue by any days)
            const msPerMonth = 1000 * 60 * 60 * 24 * 30; // approximate
            const monthsLate = Math.ceil((now - due) / msPerMonth);
            const newLate = monthsLate * 500; // ₹500 per month

            if ((payment.lateFee || 0) !== newLate) {
              // Update lateFee
              const FeeModel = await Fee.findById(fee._id);
              if (FeeModel) {
                FeeModel.payments[i].lateFee = newLate;
                FeeModel.payments[i].status = 'Overdue';
                FeeModel.markModified('payments');
                await FeeModel.save();
                feeModified = true;
              }
            }
          }
        }

        if (feeModified) {
          console.log('Updated late fees for fee id', fee._id);
        }
      }
    } catch (error) {
      console.error('Fee scheduler error:', error);
    }
  };

  // Run immediately and then every 24 hours
  runChecks();
  setInterval(runChecks, 24 * 60 * 60 * 1000);
};
