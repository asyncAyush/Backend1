const transporter = require("../config/nodemailer");

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your OTP Code",
    html: `
      <p>Your OTP code is:</p>
      <h2 style="letter-spacing:4px;">${otp}</h2>
      <p>This code will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("📧 OTP email sent to", to);
}

module.exports = { sendOtpEmail };
