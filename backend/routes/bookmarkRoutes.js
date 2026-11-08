const express = require("express");
const router = express.Router();

const {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
} = require("../controllers/bookmarkController");

const protect = require("../middleware/authMiddleware");

// Save Bookmark
router.post("/save", protect, saveBookmark);

// Get Logged-in User Bookmarks
router.get("/my", protect, getBookmarks);

// Delete Bookmark
router.delete("/:id", protect, deleteBookmark);

module.exports = router;