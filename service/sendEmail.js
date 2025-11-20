// backend/service/sendEmail.js

const transporter = require("../config/nodeMailer");

exports.sendEmail = async (to, subject, html, overrides = {}) => {
  try {
    
    const fromAddress = `"Blog App" <no-reply@blogapp.test>`;

    if (!to) {
      throw new Error("Recipient email address is required");
    }

    const recipients = Array.isArray(to) ? to.join(",") : to;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipients,
      subject,
      html,
      ...overrides,
    });

    return { success: true, info };

  } catch (err) {
    console.error("MAIL ERROR:", err);
    return { success: false, error: err.message };
  }
};
