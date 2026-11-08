const express = require("express");
const router = express.Router();

const {
  saveOpportunity,
  getSavedOpportunities,
  removeOpportunity,
} = require("../controllers/opportunityBookmarkController");

const protect = require("../middleware/authMiddleware");

// Save an opportunity
router.post("/save", protect, saveOpportunity);

// Get logged-in user's saved opportunities
router.get("/my", protect, getSavedOpportunities);

// Remove saved opportunity
router.delete("/:id", protect, removeOpportunity);

module.exports = router;
