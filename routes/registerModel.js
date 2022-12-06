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
  },
  password: {
    type: String,
  },
  password2: {
    type: String,
  },
  position: {
    type: String,
  },
  slugName: String,
});

userSchema.pre("validate", function (next) {
  if (this.name) {
    this.slugName = slugify(this.name); //slugify user name
  }
  next();
});

module.exports = new mongoose.model("userData", userSchema);
