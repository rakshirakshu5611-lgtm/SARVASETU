const User = require("../models/User");
const Scheme = require("../models/Scheme");

// SAVE SCHEME
const saveScheme = async (req, res) => {
  try {
    const userId = req.user._id;
    const schemeId = req.params.schemeId;

    const scheme = await Scheme.findById(schemeId);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    const user = await User.findById(userId);

    if (user.savedSchemes.includes(schemeId)) {
      return res.status(400).json({
        success: false,
        message: "Scheme already saved",
      });
    }

    user.savedSchemes.push(schemeId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Scheme saved successfully",
      savedSchemes: user.savedSchemes,
    });
  } catch (error) {
    console.log("SAVE SCHEME ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to save scheme",
    });
  }
};

// REMOVE SAVED SCHEME
const removeSavedScheme = async (req, res) => {
  try {
    const userId = req.user._id;
    const schemeId = req.params.schemeId;

    const user = await User.findById(userId);

    user.savedSchemes = user.savedSchemes.filter(
      (id) => id.toString() !== schemeId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Scheme removed from saved schemes",
      savedSchemes: user.savedSchemes,
    });
  } catch (error) {
    console.log("REMOVE SAVED SCHEME ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to remove saved scheme",
    });
  }
};

// GET SAVED SCHEMES
const getSavedSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("savedSchemes");

    res.status(200).json({
      success: true,
      savedSchemes: user.savedSchemes || [],
    });
  } catch (error) {
    console.log("GET SAVED SCHEMES ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get saved schemes",
    });
  }
};

module.exports = {
  saveScheme,
  removeSavedScheme,
  getSavedSchemes,
};