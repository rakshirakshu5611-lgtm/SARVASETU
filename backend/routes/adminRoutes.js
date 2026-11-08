const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getLoginActivity,
  getAllSchemes,
  getScheme,
  updateScheme,
  deleteScheme,
  searchAdminSchemes,
  filterAdminSchemes,
  getAdminStats,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware_temp");

// =====================================================
// ADMIN AUTHENTICATION + AUTHORIZATION
// =====================================================

// Everything below this line requires:
// 1. Valid JWT token
// 2. Admin role
router.use(protect);
router.use(admin);


// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================

router.get("/stats", getAdminStats);


// =====================================================
// USER MANAGEMENT
// =====================================================

router.get("/users", getAllUsers);
router.get("/login-activity", getLoginActivity);

router.delete("/users/:id", deleteUser);


// =====================================================
// SCHEME MANAGEMENT
// =====================================================

// Static routes FIRST
router.get("/schemes", getAllSchemes);

router.get(
  "/schemes/search/:keyword",
  searchAdminSchemes
);

router.get(
  "/schemes/filter/:category",
  filterAdminSchemes
);

// Dynamic routes LAST
router.get(
  "/schemes/:id",
  getScheme
);

router.put(
  "/schemes/:id",
  updateScheme
);

router.delete(
  "/schemes/:id",
  deleteScheme
);


// =====================================================

module.exports = router;