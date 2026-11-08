const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    ministry: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      default: "Central",
    },

    eligibility: {
      type: String,
      required: true,
    },

    minAge: {
      type: Number,
      default: 0,
    },

    maxAge: {
      type: Number,
      default: 100,
    },

    gender: {
      type: String,
      default: "All",
    },

    occupation: {
      type: String,
      default: "",
    },

    incomeLimit: {
      type: String,
      default: "",
    },

    benefits: {
      type: String,
      required: true,
    },

    documents: [
      {
        type: String,
      },
    ],

    applicationMode: {
      type: String,
      default: "Online",
    },

    applyLink: {
      type: String,
      required: true,
    },

    lastDate: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Active",
    },

    languages: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);