
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyRegistrationOtp,
  resendRegistrationOtp,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Start registration and send email OTP
router.post("/register", registerUser);

// Verify OTP and complete registration
router.post("/verify-registration-otp", verifyRegistrationOtp);

// Resend OTP
router.post("/resend-registration-otp", resendRegistrationOtp);

// Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SarvaSetu Protected Route",
    user: req.user,
  });
});

module.exports = router;
