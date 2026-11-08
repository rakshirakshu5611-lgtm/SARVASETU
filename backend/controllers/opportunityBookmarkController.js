const OpportunityBookmark = require("../models/OpportunityBookmark");

// Save Opportunity
const saveOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        message: "Opportunity ID is required",
      });
    }

    // Check if already saved
    const alreadySaved = await OpportunityBookmark.findOne({
      user: req.user._id,
      opportunity: opportunityId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Opportunity already saved",
      });
    }

    const bookmark = await OpportunityBookmark.create({
      user: req.user._id,
      opportunity: opportunityId,
    });

    res.status(201).json({
      success: true,
      message: "Opportunity saved successfully",
      bookmark,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get My Saved Opportunities
const getSavedOpportunities = async (req, res) => {
  try {
    const bookmarks = await OpportunityBookmark.find({
      user: req.user._id,
    })
      .populate("opportunity")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookmarks,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Remove Saved Opportunity
const removeOpportunity = async (req, res) => {
  try {
    const bookmark = await OpportunityBookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Saved opportunity not found",
      });
    }

    res.json({
      success: true,
      message: "Opportunity removed successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  saveOpportunity,
  getSavedOpportunities,
  removeOpportunity,
};