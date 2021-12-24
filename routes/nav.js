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
  });
  const blogs = await blogdb
    .find({
      registerNumber: req.params.registerNumber,
    })
    .sort({ date: -1 });
  res.render("dashboard", { blogs, profile });
});

//other-profile route
router.get(
  "/other-profile/:name/:registerNumber",
  ensureAuthenticated,
  async (req, res) => {
    const profile = await userdb.findOne({
      registerNumber: req.params.registerNumber,
    });
    const blogs = await blogdb.find({
      registerNumber: req.params.registerNumber,
    });
    res.render("otherProfile", { blogs, profile });
  }
);

//read more route
router.get("/readMore/:slug/:blogNumber", async (req, res) => {
  const blogs = await blogdb.findOne({ blogNumber: req.params.blogNumber });
  if (blogs != null) res.render("show", { blogs });
  else res.redirect("/");
});

//comment route
router.get("/comment/:slug/:blogNumber/:registerNumber", async (req, res) => {
  const profile = await userdb.findOne({
    registerNumber: req.params.registerNumber,
  });
  const blogs = await blogdb.findOne({ blogNumber: req.params.blogNumber });
  if (blogs != null) res.render("comment", { blogs, profile });
  else res.redirect("/");
});

//creating new blog route
router.get("/new-article/create/:registerNumber", async (req, res) => {
  const registeredUser = await userdb.findOne({
    registerNumber: req.params.registerNumber,
  });
  res.render("create", { registeredUser });
});

// edit route
router.get("/edit/:slug/:blogNumber", async (req, res) => {
  const blogs = await blogdb.findOne({ blogNumber: req.params.blogNumber });
  if (blogs == null) res.redirect("/");
  else res.render("edit", { blogs });
});

// delete route
router.delete("/:id", async (req, res) => {
  const blogdb = await blogdb.findById(req.params.id);
  const profile = await userdb.findOne({ registerNumber: blog.registerNumber });
  await blogdb.findByIdAndDelete(req.params.id);
  res.redirect(`/${profile.slugName}/${blog.registerNumber}`);
});

module.exports = router;
