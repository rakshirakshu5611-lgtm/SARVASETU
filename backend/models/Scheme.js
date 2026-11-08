const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC SCHEME INFORMATION
    // ==========================================

    schemeName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    eligibility: {
      type: String,
      required: true,
      trim: true,
    },

    benefits: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // REQUIRED DOCUMENTS
    // ==========================================

    documents: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // OFFICIAL GOVERNMENT SOURCE
    // ==========================================

    sourceName: {
      type: String,
      trim: true,
      default: "",
    },

    sourceUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // APPLICATION LINK
    // ==========================================

    applyLink: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // GOVERNMENT SERVICE NAVIGATION
    // ==========================================

    serviceName: {
      type: String,
      trim: true,
      default: "",
    },

    serviceUrl: {
      type: String,
      trim: true,
      default: "",
    },

    serviceDescription: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // GOVERNMENT LEVEL
    // ==========================================

    governmentLevel: {
      type: String,
      enum: ["Central", "State"],
      default: "Central",
      trim: true,
    },

    // ==========================================
    // BASIC AI MATCHING FIELDS
    // ==========================================

    state: {
      type: String,
      default: "All",
      trim: true,
    },

    occupation: {
      type: String,
      default: "All",
      trim: true,
    },

    gender: {
      type: String,
      default: "All",
      trim: true,
    },

    // ==========================================
    // AGE ELIGIBILITY
    // ==========================================

    minimumAge: {
      type: Number,
      default: 0,
    },

    maximumAge: {
      type: Number,
      default: 100,
    },

    // ==========================================
    // INCOME ELIGIBILITY
    // ==========================================

    minimumIncome: {
      type: Number,
      default: 0,
    },

    maximumIncome: {
      type: Number,
      default: 99999999,
    },

    // ==========================================
    // AGRICULTURE / LAND ELIGIBILITY
    // ==========================================

    requiresLandOwnership: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // SOCIAL CATEGORY ELIGIBILITY
    // ==========================================

    socialCategories: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // STUDENT / EDUCATION ELIGIBILITY
    // ==========================================

    requiresStudent: {
      type: Boolean,
      default: false,
    },

    educationLevels: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // EMPLOYMENT ELIGIBILITY
    // ==========================================

    employmentStatuses: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // DISTRICT ELIGIBILITY
    // ==========================================

    eligibleDistricts: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // BPL ELIGIBILITY
    // ==========================================

    requiresBPL: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // SPECIAL BENEFICIARY ELIGIBILITY
    // ==========================================

    requiresDisability: {
      type: Boolean,
      default: false,
    },

    requiresMinority: {
      type: Boolean,
      default: false,
    },

    requiresSeniorCitizen: {
      type: Boolean,
      default: false,
    },

    requiresTransgender: {
      type: Boolean,
      default: false,
    },

    requiresWidow: {
      type: Boolean,
      default: false,
    },

    requiresSingleWoman: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // OCCUPATION / WORKER ELIGIBILITY
    // ==========================================

    requiresFarmer: {
      type: Boolean,
      default: false,
    },

    requiresArtisan: {
      type: Boolean,
      default: false,
    },

    requiresFisherman: {
      type: Boolean,
      default: false,
    },

    requiresConstructionWorker: {
      type: Boolean,
      default: false,
    },

    requiresSanitationWorker: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // APPLICATION DEADLINE
    // ==========================================

    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);