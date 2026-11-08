const GovUpdate = require("../models/GovUpdate");
const Scheme = require("../models/Scheme");
const UserUpdateSeen = require("../models/UserUpdateSeen");

// Add Government Update
// ==========================================
// ADD GOVERNMENT UPDATE
// ==========================================

const addGovUpdate = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      sourceName,
      sourceUrl,
      publishedDate,
      scheme,
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (
      !title ||
      !description ||
      !category ||
      !sourceName ||
      !sourceUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ==========================================
    // CHECK RELATED SCHEME
    // ==========================================

    if (scheme) {
      const relatedScheme = await Scheme.findById(scheme);

      if (!relatedScheme) {
        return res.status(404).json({
          success: false,
          message: "Related scheme not found",
        });
      }
    }

    // ==========================================
    // PREVENT DUPLICATE UPDATE
    // ==========================================

    const existingUpdate = await GovUpdate.findOne({
      title: {
        $regex: `^${title}$`,
        $options: "i",
      },
      sourceUrl,
    });

    if (existingUpdate) {
      return res.status(400).json({
        success: false,
        message: "This update already exists",
      });
    }

    // ==========================================
    // CREATE GOVERNMENT UPDATE
    // ==========================================

    const update = await GovUpdate.create({
      title,
      description,
      category,
      sourceName,
      sourceUrl,
      scheme: scheme || null,
      publishedDate: publishedDate || Date.now(),
      isNew: true,
      isActive: true,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message: "Government update added successfully",
      update,
    });

  } catch (error) {
    console.log(
      "ADD GOV UPDATE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Latest Updates
// ==========================================
// GET LATEST GOVERNMENT UPDATES
// WITH RELATED SCHEME DETAILS
// ==========================================

const getLatestUpdates = async (req, res) => {
  try {
    const updates = await GovUpdate.find({
      isActive: true,
    })
      .populate(
        "scheme",
        "schemeName department description eligibility benefits documents applyLink category state occupation minimumAge maximumAge maximumIncome"
      )
      .sort({
        publishedDate: -1,
      })
      .limit(20);

    res.json({
      success: true,
      total: updates.length,
      updates,
    });

  } catch (error) {
    console.log(
      "GET GOV UPDATES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Update
const getGovUpdate = async (req, res) => {
  try {
    const update = await GovUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Government update not found",
      });
    }

    res.json({
      success: true,
      update,
    });

  } catch (error) {
    console.log("GET GOV UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Government Update
const updateGovUpdate = async (req, res) => {
  try {
    const {
  title,
  description,
  category,
  sourceName,
  sourceUrl,
  publishedDate,
  scheme,
  isNew,
  isActive,
} = req.body;

const update = await GovUpdate.findByIdAndUpdate(
  req.params.id,
  {
    title,
    description,
    category,
    sourceName,
    sourceUrl,
    publishedDate,
    scheme,
    isNew,
    isActive,
  },
  {
    new: true,
    runValidators: true,
  }
);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Government update not found",
      });
    }

    res.json({
      success: true,
      message: "Government update updated successfully",
      update,
    });

  } catch (error) {
    console.log("UPDATE GOV UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Government Update
const deleteGovUpdate = async (req, res) => {
  try {
    const update = await GovUpdate.findByIdAndDelete(
      req.params.id
    );

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Government update not found",
      });
    }

    res.json({
      success: true,
      message: "Government update deleted successfully",
    });

  } catch (error) {
    console.log("DELETE GOV UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Update as Read / Not New
const markUpdateAsRead = async (req, res) => {
  try {
    const update = await GovUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Government update not found",
      });
    }

    await UserUpdateSeen.findOneAndUpdate(
      {
        user: req.user._id,
        update: req.params.id,
      },
      {
        user: req.user._id,
        update: req.params.id,
        seenAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      message: "Update marked as read",
    });

  } catch (error) {
    console.log("MARK UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addGovUpdate,
  getLatestUpdates,
  getGovUpdate,
  markUpdateAsRead,
  updateGovUpdate,
  deleteGovUpdate,
};