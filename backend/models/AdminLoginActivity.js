
const mongoose = require("mongoose");

const adminLoginActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "Citizen",
    },
    loggedInAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

adminLoginActivitySchema.index({ loggedInAt: -1 });

module.exports = mongoose.model(
  "AdminLoginActivity",
  adminLoginActivitySchema
);
