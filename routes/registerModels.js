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

userSchema.plugin(findOrCreate); //for google auth user

module.exports = new mongoose.model("userData", userSchema);
