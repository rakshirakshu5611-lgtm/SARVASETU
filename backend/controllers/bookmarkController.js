const Bookmark = require("../models/Bookmark");

// Save Bookmark
const saveBookmark = async (req, res) => {
  try {
    const { schemeId } = req.body;

    const alreadySaved = await Bookmark.findOne({
      user: req.user._id,
      scheme: schemeId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Scheme already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      scheme: schemeId,
    });

    res.status(201).json({
      success: true,
      message: "Bookmark saved successfully",
      bookmark,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Bookmarks
const getBookmarks = async (req, res) => {
  try {

    const bookmarks = await Bookmark.find({
      user: req.user._id,
    }).populate("scheme");

    res.json({
      success: true,
      bookmarks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Bookmark
// Delete Bookmark
const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    res.json({
      success: true,
      message: "Bookmark removed",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveBookmark,
  getBookmarks,
  deleteBookmark,
};