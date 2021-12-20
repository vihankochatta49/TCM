const mongoose = require("mongoose");
const slugify = require("slugify");

//schema for register data
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
  slugName: String,
});

userSchema.pre("validate", function (next) {
  if (this.name) {
    this.slugName = slugify(this.name);
  }
  next();
});

module.exports = new mongoose.model("userData", userSchema);
