const mongoose = require("mongoose");
const slugify = require("slugify");
const markdown = require("markdown").markdown;

//schema
const schema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now() },
  description: String,
  likes: { type: Number, default: 0 },
  markdown: String,
  sanitizedHtml: { type: String, required: true },
  roomName: String,
  slug: { type: String },
  createdAt: String,
});

//pre validation
schema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lowerCase: true }); //slugify title for urls
  }
  if (this.markdown) {
    this.sanitizedHtml = markdown.toHTML(this.markdown); //converting text to raw html
  }

  if (this.date) {
    var tarikh = new Date(this.date);
    this.createdAt = tarikh.toDateString();
    // var d = tarikh.getDate()
    // var m = tarikh.getMonth()+1
    // var y = tarikh.getFullYear()
  }
  next();
});

module.exports = new mongoose.model("Blog", schema);
