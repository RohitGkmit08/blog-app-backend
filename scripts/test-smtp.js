require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("Loaded SMTP ENV:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? "***" : undefined,
  secure: process.env.SMTP_SECURE,
});

async function run() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: "test@example.com",
      subject: "SMTP Test",
      text: "If you see this email, SMTP configuration is working.",
    });

    console.log("SUCCESS:", info);
  } catch (err) {
    console.log("ERROR:", err);
  }
}

run();
