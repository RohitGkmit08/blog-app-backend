const transporter = require('../config/nodeMailer');


const sendEmail = async (to, subject, html, overrides = {}) => {
  try {
    const fromAddress = `"Blog App" <${process.env.ADMIN_EMAIL || 'no-reply@blogapp.test'}>`;

    if (!to) {
      throw new Error('Recipient email address is required');
    }

    // Handle array of recipients
    const recipients = Array.isArray(to) ? to.join(', ') : to;

    const mailOptions = {
      from: fromAddress,
      to: recipients,
      subject,
      html,
      ...overrides,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, info };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };

