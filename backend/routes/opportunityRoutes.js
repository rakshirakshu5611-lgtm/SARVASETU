const express = require("express");
const router = express.Router();

const {
  addOpportunity,
  getOpportunities,
  searchOpportunities,
  filterOpportunities,
  getOpportunity,
} = require("../controllers/opportunityController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware_temp");

// Public Routes
router.get("/all", getOpportunities);
router.get("/search/:keyword", searchOpportunities);
router.get("/filter/:category", filterOpportunities);
router.get("/:id", getOpportunity);

// Admin Route
router.post("/add", protect, admin, addOpportunity);

module.exports = router;