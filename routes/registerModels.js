const mongoose = require("mongoose");
const slugify = require("slugify");
var findOrCreate = require("mongoose-findorcreate");

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
    // required: true,
  },
  password2: {
    type: String,
  },
  registerNumber: {
    type: String,
    // required: true,
  },
  slugName: String,
  proivder: String,
});

userSchema.pre("validate", function (next) {
  if (this.name) {
    this.slugName = slugify(this.name);
  }
  next();
});
userSchema.plugin(findOrCreate);

module.exports = new mongoose.model("userData", userSchema);
