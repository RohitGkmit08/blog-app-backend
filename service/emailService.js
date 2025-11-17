const transporter = require('../config/nodeMailer');

exports.sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return { success: true, info };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
