const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Scholarship",
        "Internship",
        "Skill",
        "Job",
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

    organization: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      default: "All",
    },

    eligibility: {
      type: String,
      required: true,
    },

    benefits: {
      type: String,
      default: "",
    },

    deadline: {
      type: String,
      default: "",
    },

    applyLink: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Opportunity", opportunitySchema);