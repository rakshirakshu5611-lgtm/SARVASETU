const mongoose = require("mongoose");

const userUpdateSeenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    update: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GovUpdate",
      required: true,
    },

    seenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from marking the same update multiple times
userUpdateSeenSchema.index(
  { user: 1, update: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "UserUpdateSeen",
  userUpdateSeenSchema
);