const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Scheme",
        "Scholarship",
        "Internship",
        "Skill",
        "Loan",
        "Pension",
        "Healthcare",
        "Agriculture",
        "Women",
        "Jobs",
        "Other",
      ],
      default: "Other",
    },

    // User-specific notification.
    // null means the notification can be treated as global.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Importance of the notification
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },

    // What triggered the notification
    actionType: {
      type: String,
      enum: [
        "NewScheme",
        "Deadline",
        "SchemeUpdated",
        "MissingDocument",
        "GovernmentService",
        "Application",
        "Opportunity",
        "General",
      ],
      default: "General",
    },

    // Optional scheme associated with the notification
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional expiry time for time-sensitive alerts
    expiresAt: {
      type: Date,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);