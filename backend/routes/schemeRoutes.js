const express = require("express");

const router = express.Router();

const {
  addScheme,
  getSchemes,
  searchSchemes,
  filterSchemes,
  getSchemeById,
  compareSchemes,
  getEligibleSchemes,
  updateScheme,
  deleteScheme,
} = require("../controllers/schemeController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware_temp");

// =====================================================
// SCHEME ROUTES
// =====================================================

// Get all schemes
router.get("/all", getSchemes);

// Search schemes
router.get("/search", searchSchemes);

// Filter by category
router.get("/category/:category", filterSchemes);

// Compare schemes
router.post(
  "/compare",
  protect,
  compareSchemes
);

// Eligibility
router.post(
  "/eligibility",
  protect,
  getEligibleSchemes
);

// Get single scheme
router.get("/:id", getSchemeById);

// =====================================================
// ADMIN
// =====================================================

router.post(
  "/add",
  protect,
  admin,
  addScheme
);

router.put(
  "/:id",
  protect,
  admin,
  updateScheme
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteScheme
);

module.exports = router;