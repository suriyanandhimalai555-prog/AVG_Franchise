import nodemailer from 'nodemailer';

export const sendCredentialsEmail = async (toEmail, name, tempPassword, role, userCode) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"AVG Franchise Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your AVG Portal Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #1e293b;">Welcome to AVG Franchise Portal</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>An administrative account has been generated for you with the role of <b>${role}</b>.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #cbd5e1;">
          <p style="margin: 5px 0;"><b>User Code / ID:</b> ${userCode}</p>
          <p style="margin: 5px 0;"><b>Login Email:</b> ${toEmail}</p>
          <p style="margin: 5px 0;"><b>Temporary Password:</b> <span style="color: #2563eb; font-weight: bold;">${tempPassword}</span></p>
        </div>
        <p>Please log in and update your password immediately.</p>
        <br/>
        <p>Regards,<br/><b>AVG Operations Team</b></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};