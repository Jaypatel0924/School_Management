import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (email, token) => {
  const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: {
      name: 'Modern Academy',
      address: process.env.EMAIL_FROM
    },
    to: email,
    subject: 'Email Verification - Modern Academy',
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
    `
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