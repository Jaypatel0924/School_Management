import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'deepaghera110@gmail.com',
    pass: 'kmmajqhptcqvttgr',
  },
  tls: {
    rejectUnauthorized: false
  },
});

//console.log('SMTP Transporter Configured:', transporter.options);


export const sendVerificationEmail = async (email, token) => {
  const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: 'Email Verification - Panchjanya Sikshan Sankul',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to Modern Academy!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationURL}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p>If the button doesn't work, you can also click this link:</p>
        <p><a href="${verificationURL}">${verificationURL}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendNewUserCredentials = async (email, password, role) => {
  console.log(email,password);
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: 'Welcome to Panchjanya Sikshan Sankul - Your Account Credentials',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #4F46E5; padding: 24px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Panchjanya Sikshan Sankul</h1>
  </div>
  
  <div style="padding: 24px;">
    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">Your ${role} account has been successfully created. Below are your login credentials:</p>
    
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <table style="width: 100%;">
        <tr>
          <td style="width: 100px; color: #6b7280; padding: 8px 0;">Email:</td>
          <td style="font-weight: 500; padding: 8px 0;">${email}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0;">Password:</td>
          <td style="font-weight: 500; padding: 8px 0;">${password}</td>
        </tr>
      </table>
    </div>
    
    <p style="font-size: 15px; color: #6b7280; margin-bottom: 24px; line-height: 1.5;">
      For security reasons, we recommend that you <strong>change your password immediately</strong> after logging in.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        Login to Your Account
      </a>
    </div>
    
    <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
      <p style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">Need help or have questions?</p>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">
        Contact our support team at <a href="mailto:support@panchjanya.edu" style="color: #4F46E5; text-decoration: none;">support@panchjanya.edu</a>
      </p>
    </div>
  </div>
  
  <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
      © ${new Date().getFullYear()} Panchjanya Sikshan Sankul. All rights reserved.
    </p>
  </div>
</div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Credentials email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending credentials email:', error);
    throw new Error('Failed to send credentials email');
  }
};
export const sendUpdatedCredentialsEmail = async (email, password) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: 'Your Panchjanya Sikshan Sankul Account Credentials Updated',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f59e0b; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Account Update Notification</h1>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">Your login credentials have been updated. Please find your new credentials below:</p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="width: 100px; color: #6b7280; padding: 8px 0;">Email:</td>
                <td style="font-weight: 500; padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Password:</td>
                <td style="font-weight: 500; padding: 8px 0;">${password}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 15px; color: #6b7280; margin-bottom: 24px;">Please change your password after logging in for better security.</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
              Login to Your Account
            </a>
          </div>
        </div>

        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">© ${new Date().getFullYear()} Panchjanya Sikshan Sankul. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Updated credentials email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending updated credentials email:', error);
    throw new Error('Failed to send updated credentials email');
  }
};


export const sendAbsenceNotification = async (email, studentName, date) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: 'Absence Notification - Panchjanya Sikshan Sankul',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <!-- Header -->
  <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
    <h2 style="color: white; margin: 0; font-size: 22px;">Absence Notification</h2>
  </div>
  
  <!-- Body -->
  <div style="padding: 24px;">
    <p style="font-size: 16px; color: #4b5563; margin-bottom: 16px;">Dear Parent/Guardian,</p>
    
    <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px; line-height: 1.5;">
      This is to inform you that <strong>${studentName}</strong> was marked absent on <strong>${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
    </p>
    
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
      <table style="width: 100%;">
        <tr>
          <td style="width: 120px; color: #6b7280; padding: 8px 0; vertical-align: top;">Student:</td>
          <td style="font-weight: 500; padding: 8px 0;">${studentName}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; padding: 8px 0; vertical-align: top;">Date of Absence:</td>
          <td style="font-weight: 500; padding: 8px 0;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
        </tr>
      </table>
    </div>
    
    <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px; line-height: 1.5;">
      If this absence was unexpected or you'd like to provide additional information, please contact the school administration at your earliest convenience.
    </p>
    
    <div style="text-align: center; margin: 28px 0 16px;">
      <a href="mailto:attendance@panchjanya.edu" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">
        Contact Attendance Office
      </a>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 13px; color: #9ca3af; margin: 0;">
      Panchjanya Sikshan Sankul • ${new Date().getFullYear()}<br>
      <span style="font-size: 12px;">This is an automated notification. Please do not reply to this email.</span>
    </p>
  </div>
</div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Absence notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending absence notification:', error);
    throw new Error('Failed to send absence notification');
  }
};

export const sendFeePaidNotification = async (email, studentName, amount, isLate = false, lateAmount = 0) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: `Fee Payment Confirmation - ${isLate ? 'Late Payment' : 'Payment Received'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Fee Payment Confirmation</h2>
        <p>Dear ${studentName},</p>
        <p>We have received your fee payment of <strong>₹${amount}</strong>.</p>
        ${isLate ? `<p>This payment includes a late fee of <strong>₹${lateAmount}</strong>.</p>` : ''}
        <p>Thank you for your prompt payment.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Fee paid notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending fee paid notification:', error);
    throw new Error('Failed to send fee paid notification');
  }
};

// export const sendFeeReminder = async (email, studentName, dueDate, amount) => {
//   const mailOptions = {
//     from: {
//       name: 'Panchjanya Sikshan Sankul',
//       address: process.env.EMAIL_FROM,
//     },
//     to: email,
//     subject: 'Fee Payment Reminder',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #4F46E5;">Fee Payment Reminder</h2>
//         <p>Dear ${studentName},</p>
//         <p>This is a friendly reminder that your fee of <strong>₹${amount}</strong> is due on <strong>${new Date(dueDate).toLocaleDateString()}</strong>.</p>
//         <p>Please pay on time to avoid late charges.</p>
//       </div>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Fee reminder sent:', info.messageId);
//     return true;
//   } catch (error) {
//     console.error('Error sending fee reminder:', error);
//     throw new Error('Failed to send fee reminder');
//   }
// };

export const sendAdmissionStatusEmail = async (email, fullName, status) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: 'Admission Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Admission Application Status</h2>
        <p>Dear ${fullName},</p>
        <p>Your admission application status has been updated to: <strong>${status}</strong>.</p>
        <p>Please log in to the portal or check your email for further details.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Admission status email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admission status email:', error);
    throw new Error('Failed to send admission status email');
  }
};

export const sendAbsenceThresholdAlert = async (email, studentName, monthYear, absentCount, threshold) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: `Attendance Alert for ${studentName} - ${monthYear}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Attendance Alert</h2>
        <p>Dear Parent/Guardian,</p>
        <p>This is to inform you that <strong>${studentName}</strong> has been absent <strong>${absentCount}</strong> times in ${monthYear}.</p>
        <p>Our threshold for alerts is <strong>${threshold}</strong> absences. Please contact the school if there are any concerns.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Absence threshold alert sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending absence threshold alert:', error);
    throw new Error('Failed to send absence threshold alert');
  }
};

export const sendAssignmentReminder = async (email, studentName, assignmentTitle, dueDate, link) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: `Reminder: Please complete assignment - ${assignmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Assignment Reminder</h2>
        <p>Dear ${studentName},</p>
        <p>This is a reminder to complete the assignment: <strong>${assignmentTitle}</strong>.</p>
        <p>The due date is <strong>${new Date(dueDate).toLocaleDateString()}</strong>.</p>
        ${link ? `<p><a href="${link}" style="display:inline-block;padding:8px 12px;background:#4F46E5;color:#fff;border-radius:6px;text-decoration:none;">Open Assignment</a></p>` : ''}
        <p>Please submit before the deadline to avoid penalties.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Assignment reminder sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending assignment reminder:', error);
    throw new Error('Failed to send assignment reminder');
  }
};

export const sendNewClassNotification = async (email, studentName, classDetails) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: `New Class Scheduled - ${classDetails.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4F46E5; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px;">New Class Scheduled</h2>
        </div>
        
        <div style="padding: 24px;">
          <p>Dear ${studentName},</p>
          <p>A new class has been scheduled for your grade:</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="width: 120px; color: #6b7280; padding: 8px 0;">Subject:</td>
                <td style="font-weight: 500;">${classDetails.subject}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Topic:</td>
                <td style="font-weight: 500;">${classDetails.topic}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Date:</td>
                <td style="font-weight: 500;">${new Date(classDetails.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Time:</td>
                <td style="font-weight: 500;">${classDetails.startTime} - ${classDetails.endTime}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Description:</td>
                <td style="font-weight: 500;">${classDetails.description}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL}/dashboard/student/schedule"
               style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              View Schedule
            </a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © ${new Date().getFullYear()} Panchjanya Sikshan Sankul. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('New class notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending new class notification:', error);
    throw new Error('Failed to send new class notification');
  }
};

export const sendNewMaterialNotification = async (email, studentName, materialDetails) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: `New Study Material Available - ${materialDetails.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4F46E5; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px;">New Study Material Available</h2>
        </div>
        
        <div style="padding: 24px;">
          <p>Dear ${studentName},</p>
          <p>New study material has been uploaded for your class:</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="width: 120px; color: #6b7280; padding: 8px 0;">Subject:</td>
                <td style="font-weight: 500;">${materialDetails.subject}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Title:</td>
                <td style="font-weight: 500;">${materialDetails.title}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Type:</td>
                <td style="font-weight: 500;">${materialDetails.type}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Description:</td>
                <td style="font-weight: 500;">${materialDetails.description}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL}/dashboard/student/materials"
               style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              View Material
            </a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © ${new Date().getFullYear()} Panchjanya Sikshan Sankul. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('New material notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending new material notification:', error);
    throw new Error('Failed to send new material notification');
  }
};

export const sendResultNotification = async (email, studentName, resultDetails) => {
  const mailOptions = {
    from: {
      name: 'Panchjanya Sikshan Sankul',
      address: process.env.EMAIL_FROM,
    },
    to: email,
    subject: `New Result Available - ${resultDetails.type}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4F46E5; padding: 24px; text-align: center;">
          <h2 style="color: white; margin: 0; font-size: 24px;">New Result Available</h2>
        </div>
        
        <div style="padding: 24px;">
          <p>Dear ${studentName},</p>
          <p>A new result has been uploaded for your class:</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="width: 120px; color: #6b7280; padding: 8px 0;">Title:</td>
                <td style="font-weight: 500;">${resultDetails.title}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Type:</td>
                <td style="font-weight: 500;">${resultDetails.type}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Grade:</td>
                <td style="font-weight: 500;">${resultDetails.grade}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; padding: 8px 0;">Section:</td>
                <td style="font-weight: 500;">${resultDetails.section}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL}/dashboard/student"
               style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              View Result
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
            You can view your result by logging into your student dashboard.
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            © ${new Date().getFullYear()} Panchjanya Sikshan Sankul. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Result notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending result notification:', error);
    throw new Error('Failed to send result notification');
  }
};