const mongoose = require("mongoose");
const slugify = require("slugify");

//schema for register data
const userSchema = new mongoose.Schema({
  teamName: String,
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
  member1: String,
  member1Email: String,
  member2: String,
  member2Email: String,
  teamNumber: Number,
  emails:[],
});

userSchema.pre("validate", function (next) {
  if (this.name) {
    this.slugName = slugify(this.name); //slugify user name
  }
  next();
});

module.exports = new mongoose.model("userData", userSchema);
