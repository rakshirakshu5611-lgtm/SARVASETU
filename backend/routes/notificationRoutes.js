
const express = require("express");
const router = express.Router();

const {
  addNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  generateProactiveNotifications,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware_temp = require("../middleware/adminMiddleware_temp");

// Logged-in users can view their own and global notifications.
router.get("/all", protect, getNotifications);

// Logged-in users can mark accessible notifications as read.
router.patch("/:id/read", protect, markNotificationAsRead);

// Admin-only notification creation.
router.post(
  "/add",
  protect,
  adminMiddleware_temp,
  addNotification
);

// Generate personalized notifications for the logged-in user.
router.post(
  "/generate",
  protect,
  generateProactiveNotifications
);

// Admin-only notification deletion.
router.delete(
  "/:id",
  protect,
  adminMiddleware_temp,
  deleteNotification
);

module.exports = router;
