const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  password2: {
    type: String,
  },
  registerNumber: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("userData", userSchema);
