const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  college: {
    type: String,
  },

  language: {
    type: String,
    default: "English",
  },

  role: {
    type: String,
     enum: ["Citizen", "admin","Admin"],
  default: "Citizen",
  },

  occupation: {
    type: String,
    default: "Student",
  },

  landOwnership: {
  type: Boolean,
  default: false,
}, 

  state: {
    type: String,
    default: "Karnataka",
  },

  district: {
  type: String,
  default: "",
},

  income: {
    type: Number,
    default: 0,
  },

  savedSchemes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
],

}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);