const crypto = require("crypto");
const AccountDeletionNotice = require("../models/AccountDeletionNotice");
const { sendAccountDeletionEmail } = require("../utils/emailService");
const AdminLoginActivity = require("../models/AdminLoginActivity");
const Scheme = require("../models/Scheme");
const User = require("../models/User");
const GovUpdate = require("../models/GovUpdate");

// =====================================================
// GET ALL SCHEMES
// =====================================================

// =====================================================
// GET ALL SCHEMES
// =====================================================

const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();

    res.json({
      success: true,
      schemes,
    });
  } catch (error) {
    console.log("GET ALL SCHEMES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load schemes",
    });
  }
};
// =====================================================
// SEARCH ADMIN SCHEMES
// =====================================================

// =====================================================
// SEARCH ADMIN SCHEMES
// =====================================================

const searchAdminSchemes = async (req, res) => {
  try {
    const keyword = req.params.keyword?.trim();

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    const schemes = await Scheme.find({
      schemeName: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.json({
      success: true,
      schemes,
    });
  } catch (error) {
    console.log("SEARCH ADMIN SCHEMES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search schemes",
    });
  }
};

// =====================================================
// FILTER ADMIN SCHEMES
// =====================================================

// =====================================================
// FILTER ADMIN SCHEMES
// =====================================================

const filterAdminSchemes = async (req, res) => {
  try {
    const category = req.params.category?.trim();

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const schemes = await Scheme.find({
      category: {
        $regex: category,
        $options: "i",
      },
    });

    res.json({
      success: true,
      schemes,
    });
  } catch (error) {
    console.log("FILTER ADMIN SCHEMES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to filter schemes",
    });
  }
};
// =====================================================
// GET ONE SCHEME
// =====================================================

// =====================================================
// GET ONE SCHEME
// =====================================================

const getScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.json({
      success: true,
      scheme,
    });
  } catch (error) {
    console.log("GET SCHEME ERROR:", error);

    res.status(400).json({
      success: false,
      message: "Invalid scheme ID",
    });
  }
};

// UPDATE SCHEME
// =====================================================

const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.json({
      success: true,
      message: "Scheme Updated Successfully",
      scheme,
    });
  } catch (error) {
    console.log("UPDATE SCHEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE SCHEME
// =====================================================

const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.json({
      success: true,
      message: "Scheme Deleted Successfully",
    });
  } catch (error) {
    console.log("DELETE SCHEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN STATISTICS
// =====================================================

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalSchemes = await Scheme.countDocuments();

    const categories = await Scheme.distinct("category");

    const totalAnnouncements = await GovUpdate.countDocuments({
      isActive: true,
    });

    res.json({
      success: true,
      totalUsers,
      totalSchemes,
      categories: categories.length,
      totalAnnouncements,
    });
  } catch (error) {
    console.log("GET ADMIN STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.log("GET ALL USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================



const deleteUser = async (req, res) => {
  let noticeId = null;
  let userDeleted = false;
  let emailAccepted = false;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      return res.status(500).json({
        success: false,
        message:
          "FRONTEND_URL is missing from backend .env. Account was not deleted.",
      });
    }

    // Generate a secure, random notice token.
    const noticeToken = crypto.randomBytes(32).toString("hex");

    // Store only its SHA-256 hash in MongoDB.
    const noticeTokenHash = crypto
      .createHash("sha256")
      .update(noticeToken)
      .digest("hex");

    const message =
      "Your SARVASETU account has been removed by an administrator. " +
      "Your account access and associated login credentials are no longer available. " +
      "If you believe this action was a mistake, contact the SARVASETU support team.";

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create the notice independently of the citizen account.
    const notice = await AccountDeletionNotice.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      message,
      noticeTokenHash,
      expiresAt,
    });

    noticeId = notice._id;

    const noticeUrl =
      `${frontendUrl.replace(/\/+$/, "")}` +
      `/account-deletion-notice/${noticeToken}`;

    // Send the email before deleting the account.
    await sendAccountDeletionEmail({
      name: user.name,
      email: user.email,
      message,
      noticeUrl,
    });

    emailAccepted = true;

    // Delete the citizen only after the email service accepts the message.
    const deletedUser = await User.findByIdAndDelete(user._id);

    if (!deletedUser) {
      // Keep the notice because the email was already sent.
      return res.status(409).json({
        success: false,
        message:
          "The email was sent, but the account was not deleted. " +
          "The notice has been retained; please verify the user record.",
      });
    }

    userDeleted = true;

    // Update notice metadata without risking deletion of the notice.
    try {
      await AccountDeletionNotice.updateOne(
        { _id: noticeId },
        { $set: { emailSentAt: new Date() } }
      );
    } catch (metadataError) {
      console.error(
        "NOTICE METADATA UPDATE ERROR:",
        metadataError
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully. The account-deletion email was sent.",
      noticeRetained: true,
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    // Never remove the notice if the citizen was deleted or
    // the email service accepted the message.
    if (noticeId && !userDeleted && !emailAccepted) {
      try {
        await AccountDeletionNotice.findByIdAndDelete(noticeId);
      } catch (cleanupError) {
        console.error("NOTICE CLEANUP ERROR:", cleanupError);
      }
    }

    if (userDeleted) {
      return res.status(200).json({
        success: true,
        message:
          "User deleted successfully. The notice was retained, " +
          "but an additional operation failed.",
        noticeRetained: true,
      });
    }

    return res.status(502).json({
      success: false,
      message:
        "The account deletion could not be completed or confirmed. " +
        "Check the server logs before retrying.",
      noticeRetained: Boolean(noticeId && emailAccepted),
    });
  }
};

 // =====================================================
// GET CITIZEN LOGIN ACTIVITY — ADMIN ONLY
// =====================================================

const getLoginActivity = async (req, res) => {
  try {
    const activities = await AdminLoginActivity.find()
      .sort({ loggedInAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      totalActivities: activities.length,
      activities,
    });
  } catch (error) {
    console.error("GET LOGIN ACTIVITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load login activity",
    });
  }
};


// =====================================================
// EXPORT ALL ADMIN CONTROLLERS
// =====================================================

module.exports = {
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
};