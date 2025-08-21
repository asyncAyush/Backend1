require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test connection
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Nodemailer error:", err);
  } else {
    console.log("✅ Nodemailer is ready to send emails");
  }
});

module.exports = transporter;
