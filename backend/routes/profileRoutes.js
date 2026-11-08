const express = require("express");
const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// =========================
// GET PROFILE
// =========================
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      profile: {
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        state: user.state || "",
        district: user.district || "",
        occupation: user.occupation || "",
        annualIncome: user.income || "",
        collegeName: user.college || "",
      },
    });
  } catch (error) {
    console.error("PROFILE LOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
});

// =========================
// SAVE / UPDATE PROFILE
// =========================
router.put("/", protect, async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      state,
      district,
      occupation,
      annualIncome,
      collegeName,
    } = req.body;

    if (!name || !age || !gender || !state || !occupation) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required profile fields",
      });
    }

    if (Number(age) < 1 || Number(age) > 120) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid age",
      });
    }

    if (annualIncome !== "" && Number(annualIncome) < 0) {
      return res.status(400).json({
        success: false,
        message: "Income cannot be negative",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name.trim();
    user.age = Number(age);
    user.gender = gender;
    user.state = state.trim();
    user.district = district ? district.trim() : "";
    user.occupation = occupation;
    user.income =
      annualIncome === "" ? 0 : Number(annualIncome);
    user.college = collegeName ? collegeName.trim() : "";

    await user.save();

    res.json({
      success: true,
      message: "Profile saved successfully",
      profile: {
        name: user.name,
        age: user.age,
        gender: user.gender,
        state: user.state,
        district: user.district,
        occupation: user.occupation,
        annualIncome: user.income,
        collegeName: user.college,
      },
    });
  } catch (error) {
    console.error("PROFILE SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save profile",
    });
  }
});

module.exports = router;