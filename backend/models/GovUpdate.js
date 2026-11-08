const mongoose = require("mongoose");

const govUpdateSchema = new mongoose.Schema(
  {
    // ==========================================
    // GOVERNMENT UPDATE INFORMATION
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Scheme",
        "Scholarship",
        "Internship",
        "Job",
        "Skill",
        "Loan",
        "Pension",
        "Agriculture",
        "Healthcare",
        "Women",
        "Startup",
        "Other",
      ],
      required: true,
    },

    // ==========================================
    // GOVERNMENT SOURCE
    // ==========================================

    sourceName: {
      type: String,
      required: true,
      trim: true,
    },

    sourceUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // RELATED SCHEME
    // ==========================================

    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      default: null,
    },

    // ==========================================
    // PUBLICATION
    // ==========================================

    publishedDate: {
      type: Date,
      default: Date.now,
    },

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    isNew: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model(
  "GovUpdate",
  govUpdateSchema
);