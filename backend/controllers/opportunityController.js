const Opportunity = require("../models/Opportunity");

// Add Opportunity
const addOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      organization,
      state,
      eligibility,
      benefits,
      deadline,
      applyLink,
      isActive,
    } = req.body;

    const opportunity = await Opportunity.create({
      title,
      description,
      category,
      organization,
      state,
      eligibility,
      benefits,
      deadline,
      applyLink,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Opportunity added successfully",
      opportunity,
    });
  } catch (error) {
    console.error("ADD OPPORTUNITY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add opportunity",
    });
  }
};

// Get All Opportunities
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      opportunities,
    });
  } catch (error) {
    console.error("GET OPPORTUNITIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load opportunities",
    });
  }
};

// Search Opportunities
  const searchOpportunities = async (req, res) => {
  try {
    const keyword = req.params.keyword?.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    const opportunities = await Opportunity.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.json({
      success: true,
      opportunities,
    });
  } catch (error) {
    console.error("SEARCH OPPORTUNITIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search opportunities",
    });
  }
};
// Filter by Category
const filterOpportunities = async (req, res) => {
  try {
    const category = req.params.category?.trim();

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const opportunities = await Opportunity.find({
      category: {
        $regex: category,
        $options: "i",
      },
    });

    res.json({
      success: true,
      opportunities,
    });
  } catch (error) {
    console.error("FILTER OPPORTUNITIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to filter opportunities",
    });
  }
};

// Get Single Opportunity
// Get Single Opportunity
const getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
    }

    res.json({
      success: true,
      opportunity,
    });
  } catch (error) {
    console.error("GET OPPORTUNITY ERROR:", error);

    res.status(400).json({
      success: false,
      message: "Invalid opportunity ID",
    });
  }
};
module.exports = {
  addOpportunity,
  getOpportunities,
  searchOpportunities,
  filterOpportunities,
  getOpportunity,
};