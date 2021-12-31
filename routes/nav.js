const express = require("express");
const blogdb = require("./../routes/models");
const userdb = require("./../routes/registerModels");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

//home page route
router.get("/feed", ensureAuthenticated, async (req, res) => {
  const profile = req.user;
  const blogs = await blogdb.find().sort({ date: -1 });
  res.render("feed", { profile, blogs });
});

//profile route
router.get("/:name/:registerNumber", ensureAuthenticated, async (req, res) => {
  const profile = await userdb.findOne({
    registerNumber: req.params.registerNumber,
    slugName: req.params.name,
  });
  const blogs = await blogdb
    .find({
      registerNumber: req.params.registerNumber,
    })
    .sort({ date: -1 });
  if (profile != null) res.render("dashboard", { profile, blogs });
  else res.render("404Page");
});

//other-profile route
router.get("/other-profile/:name/:registerNumber", async (req, res) => {
  const profile = await userdb.findOne({
    registerNumber: req.params.registerNumber,
  });
  const blogs = await blogdb.find({
    registerNumber: req.params.registerNumber,
  });
  if (profile != null) res.render("otherProfile", { profile, blogs });
  else res.render("404Page");
});

//read more route
router.get("/readMore/:slug/:blogNumber", async (req, res) => {
  const blogs = await blogdb.findOne({ blogNumber: req.params.blogNumber });
  if (blogs != null) res.render("show", { blogs });
  else res.render("404Page");
});

//comment route
router.get("/comment/:slug/:blogNumber/:registerNumber", async (req, res) => {
  const profile = await userdb.findOne({
    registerNumber: req.params.registerNumber,
  });
  const blogs = await blogdb.findOne({ blogNumber: req.params.blogNumber });
  if (blogs != null && profile != null)
    res.render("comment", { blogs, profile });
  else res.render("404Page");
});

//creating new blog route
router.get("/new-article/create/:registerNumber", async (req, res) => {
  const registeredUser = await userdb.findOne({
    registerNumber: req.params.registerNumber,
  });
  if (registeredUser != null) res.render("create", { registeredUser });
  else res.render("404Page");
});

// edit route
router.get("/edit/:slug/:blogNumber", async (req, res) => {
  const blogs = await blogdb.findOne({ blogNumber: req.params.blogNumber });
  if (blogs != null) res.render("edit", { blogs });
  else res.render("404Page");
});

// delete route
router.delete("/:id", async (req, res) => {
  const blog = await blogdb.findById(req.params.id);
  const profile = await userdb.findOne({ registerNumber: blog.registerNumber });
  await blogdb.findByIdAndDelete(req.params.id);
  res.redirect(`/${profile.slugName}/${blog.registerNumber}`);
});

module.exports = router;
