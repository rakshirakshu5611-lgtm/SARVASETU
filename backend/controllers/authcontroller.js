
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const AdminLoginActivity = require("../models/AdminLoginActivity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  sendRegistrationOtpEmail,
} = require("../utils/emailService");

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  age: user.age,
  gender: user.gender,
  college: user.college,
  language: user.language,
  role: user.role,
  occupation: user.occupation,
  state: user.state,
  income: user.income,
});

// Start registration: save pending details and email OTP.
const registerUser = async (req, res) => {
  try {
    const {
      name, email, password, phone, age, gender,
      college, language, occupation, state, income,
    } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || !password ||
      phone === undefined || !String(phone).trim() ||
      age === undefined ||
      typeof gender !== "string" || !gender.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (
      name.trim().length > 100 ||
      email.trim().length > 150 ||
      password.length < 8 ||
      password.length > 128 ||
      String(phone).trim().length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check your registration details. Password must be 8–128 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const now = new Date();
    let pending = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (
      pending &&
      pending.expiresAt > now &&
      now - pending.lastSentAt < RESEND_COOLDOWN_MS
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const registrationData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: String(phone).trim(),
      age: Number(age),
      gender: gender.trim(),
      college,
      language,
      occupation,
      state,
      income: income === "" || income === undefined
        ? 0
        : Number(income),
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      attempts: 0,
      lastSentAt: now,
    };

    if (pending) {
      Object.assign(pending, registrationData);
      await pending.save();
    } else {
      pending = await PendingRegistration.create(registrationData);
    }

    try {
      await sendRegistrationOtpEmail({
        email: normalizedEmail,
        name: name.trim(),
        otp,
      });
    } catch (emailError) {
      await PendingRegistration.deleteOne({ _id: pending._id });
      console.error("REGISTRATION OTP EMAIL ERROR:", emailError.message);

      return res.status(502).json({
        success: false,
        message: "Could not send the verification email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. It expires in 5 minutes.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not start registration",
    });
  }
};

// Verify OTP and create the actual account.
const verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (
      typeof email !== "string" ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter your registered email and six-digit OTP",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "Registration request not found. Please register again.",
      });
    }

    if (pending.expiresAt <= new Date()) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }

    if (pending.attempts >= MAX_OTP_ATTEMPTS) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please register again.",
      });
    }

    if (hashOtp(otp) !== pending.otpHash) {
      pending.attempts += 1;
      await pending.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
        attemptsRemaining: MAX_OTP_ATTEMPTS - pending.attempts,
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await PendingRegistration.deleteOne({ _id: pending._id });

      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      phone: pending.phone,
      age: pending.age,
      gender: pending.gender,
      college: pending.college,
      language: pending.language || "English",
      role: "Citizen",
      occupation: pending.occupation || "Student",
      state: pending.state || "Karnataka",
      income: pending.income ?? 0,
    });

    await PendingRegistration.deleteOne({ _id: pending._id });

    return res.status(201).json({
      success: true,
      message: "Email verified! Registration successful. You can now log in.",
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("OTP VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not verify OTP",
    });
  }
};

// Resend OTP to an existing pending registration.
const resendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Registration request not found. Please register again.",
      });
    }

    const now = new Date();

    if (now - pending.lastSentAt < RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    pending.otpHash = hashOtp(otp);
    pending.expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    pending.attempts = 0;
    pending.lastSentAt = now;
    await pending.save();

    try {
      await sendRegistrationOtpEmail({
        email: normalizedEmail,
        name: pending.name,
        otp,
      });
    } catch (emailError) {
      console.error("RESEND OTP EMAIL ERROR:", emailError.message);

      return res.status(502).json({
        success: false,
        message: "Could not send a new OTP. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not resend OTP",
    });
  }
};

// Existing login flow preserved.
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (email.trim().length > 150 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid login input",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    if (String(user.role).toLowerCase() === "citizen") {
      try {
        await AdminLoginActivity.create({
          user: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          loggedInAt: new Date(),
        });
      } catch (activityError) {
        console.error(
          "LOGIN ACTIVITY LOGGING ERROR:",
          activityError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  registerUser,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  loginUser,
};
