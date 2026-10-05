import nodemailer from 'nodemailer';

// Helper function to create the Nodemailer transporter instance
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Sends initial account creation credentials to new internal users/admins.
 */
export const sendCredentialsEmail = async (toEmail, name, tempPassword, role, userCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"AVG Franchise Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your AVG Portal Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a; margin-top: 0;">Welcome to AVG Franchise Portal</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>An administrative account has been generated for you with the role of <b>${role}</b>.</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #cbd5e1;">
          <p style="margin: 6px 0;"><b>User Code / ID:</b> ${userCode}</p>
          <p style="margin: 6px 0;"><b>Login Email:</b> ${toEmail}</p>
          <p style="margin: 6px 0;"><b>Temporary Password:</b> <span style="color: #2563eb; font-weight: bold; font-family: monospace;">${tempPassword}</span></p>
        </div>
        
        <p>Please log in and update your password upon first sign in.</p>
        
        <div style="margin-top: 24px; padding-top: 16px; border-t: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          Regards,<br/>
          <strong style="color: #334155;">AVG Operations Team</strong>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends notification when Super Admin approves a Franchise signup application.
 */
export const sendApprovalEmail = async (toEmail, name, userCode) => {
  const transporter = createTransporter();
  const loginUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : 'http://localhost:5173/login';

  const mailOptions = {
    from: `"AVG Franchise Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🎉 Franchise Application Approved - Welcome to AVG',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #2563eb; margin-top: 0;">Congratulations, ${name}!</h2>
        <p>Your franchise request for <strong>AVG Franchise</strong> has been officially approved by the Super Admin.</p>
        
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
          <p style="margin: 4px 0;"><b>Franchise ID:</b> <span style="font-family: monospace; font-weight: bold; color: #166534;">${userCode}</span></p>
          <p style="margin: 4px 0;"><b>Account Email:</b> ${toEmail}</p>
        </div>
        
        <p>You can now log in to your franchise dashboard using the password you set during registration.</p>
        
        <div style="margin: 24px 0;">
          <a href="${loginUrl}" 
             style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Access Dashboard
          </a>
        </div>
        
        <div style="margin-top: 24px; padding-top: 16px; border-t: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          Regards,<br/>
          <strong style="color: #334155;">AVG Management Team</strong>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Sends notification when Super Admin rejects a Franchise signup application.
 */
export const sendRejectionEmail = async (toEmail, name, reason = 'Criteria not met') => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"AVG Franchise Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Update on Your AVG Franchise Application',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a; margin-top: 0;">Application Status Update</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for your interest in partnering with AVG.</p>
        <p>After reviewing your franchise onboarding application, we regret to inform you that it has not been approved at this time.</p>
        
        <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca; color: #991b1b;">
          <p style="margin: 0; font-size: 14px;"><b>Reason:</b> ${reason}</p>
        </div>
        
        <p style="font-size: 14px;">If you have any questions or require clarification, please feel free to reach out to our support team.</p>
        
        <div style="margin-top: 24px; padding-top: 16px; border-t: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          Regards,<br/>
          <strong style="color: #334155;">AVG Management Team</strong>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};