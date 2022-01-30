const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");

// chat schema
const chatSchema = new mongoose.Schema({
  roomName: String,
  userName: String,
  userChat: String,
});

module.exports = new mongoose.model("chat", chatSchema);
