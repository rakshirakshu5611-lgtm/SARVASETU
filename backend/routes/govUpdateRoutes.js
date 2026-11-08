const express = require("express");

const router = express.Router();

const {
  addGovUpdate,
  getLatestUpdates,
  getGovUpdate,
  markUpdateAsRead,
  updateGovUpdate,
  deleteGovUpdate,
} = require("../controllers/govUpdateController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware_temp");

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get latest government updates
router.get("/latest", getLatestUpdates);

// Get single government update
router.get("/:id", getGovUpdate);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Everything below this line requires:
// 1. Valid JWT token
// 2. Admin role

router.post(
  "/add",
  protect,
  admin,
  addGovUpdate
);

router.put(
  "/:id",
  protect,
  admin,
  updateGovUpdate
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteGovUpdate
);

// =====================================================
// USER ROUTE
// =====================================================

// Mark update as read
router.put(
  "/read/:id",
  protect,
  markUpdateAsRead
);

module.exports = router;