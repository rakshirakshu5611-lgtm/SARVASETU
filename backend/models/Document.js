const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    // User who owns this document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Document name
    documentName: {
      type: String,
      required: true,
      trim: true,
    },

    // Document category
    documentType: {
      type: String,
      required: true,
      enum: [
        "Aadhaar",
        "PAN Card",
        "Income Certificate",
        "Caste Certificate",
        "Domicile Certificate",
        "Marks Card",
        "College ID",
        "Other",
      ],
    },

    // File information
    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Document",
  documentSchema
);