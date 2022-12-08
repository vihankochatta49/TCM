const mongoose = require("mongoose");
const slugify = require("slugify");
const markdown = require("markdown").markdown;

//schema for blog posts
const schema = new mongoose.Schema({
  event: String,
  title: String,
  markdown: String,
  price: String,
  name: String,
  blogNumber: Number,
  slugName: String,
  slug: { type: String },
  date: { type: Date, default: Date.now() },
  createdAt: String,
  sanitizedHtml: { type: String, required: true },
});

//pre validation
schema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title); //slugify title for urls
  }

  if (this.markdown) {
    this.sanitizedHtml = markdown.toHTML(this.markdown); //converting text to raw html
  }

  //changing date format
  if (this.date) {
    var tarikh = new Date(this.date);
    var d = tarikh.getDate();
    var m = tarikh.getMonth() + 1;
    var y = tarikh.getFullYear();
    this.createdAt = d + "/" + m + "/" + y;
  }

  if (this.name) {
    this.slugName = slugify(this.name); //slugify user name
  }
  next();
});

module.exports = new mongoose.model("Workshop", schema);
