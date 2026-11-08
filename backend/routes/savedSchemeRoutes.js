const express = require("express");
const router = express.Router();

const {
  saveScheme,
  removeSavedScheme,
  getSavedSchemes,
} = require("../controllers/savedSchemeController");

const protect = require("../middleware/authMiddleware");

// Save a scheme
router.post("/:schemeId", protect, saveScheme);

// Remove a saved scheme
router.delete("/:schemeId", protect, removeSavedScheme);

// Get all saved schemes
router.get("/", protect, getSavedSchemes);

module.exports = router;