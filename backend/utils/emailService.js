
const nodemailer = require("nodemailer");

const sendAccountDeletionEmail = async ({
  name,
  email,
  message,
  noticeUrl,
}) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP settings are missing from backend .env");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SARVASETU" <${SMTP_USER}>`,
    to: email,
    subject: "Important notice about your SARVASETU account",
    text: `${name},\n\n${message}\n\nView your retained account notice securely here:\n${noticeUrl}\n\nIf you did not expect this change, contact the SARVASETU support team.`,
  });
};


const sendRegistrationOtpEmail = async ({ email, name, otp }) => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP settings are missing from backend .env");
  }

  const transporter = require("nodemailer").createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SARVASETU" <${SMTP_USER}>`,
    to: email,
    subject: "Your SARVASETU registration OTP",
    text: `Hello ${name},\n\nYour SARVASETU verification code is ${otp}.\n\nIt expires in 5 minutes. Do not share this code with anyone.\n\nIf you did not request this code, you can ignore this email.`,
  });
};

module.exports = {
  sendAccountDeletionEmail,
  sendRegistrationOtpEmail,
};

