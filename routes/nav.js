const express = require("express");
const blogdb = require("./../routes/models");
const userdb = require("./../routes/registerModels");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

//home page
router.get("/", async (req, res) => {
  res.render("login");
});

//maintance error page
router.get("/oops/maintance", (req, res) => {
  res.render("maintance");
});

//home page route
router.get("/feed", ensureAuthenticated, async (req, res) => {
  const profile = req.user;
  const blogs = [
    { name: "Web" },
    { name: "Marketing" },
    { name: "Events" },
    { name: "Security" },
    { name: "Finace" },
  ];
  res.render("feed", { profile, blogs });
});

//profile route
router.get("/:name", ensureAuthenticated, async (req, res) => {
  const profile = await userdb.findOne({
    slugName: req.params.name,
  });
  const blogs = await blogdb
    .find({
      slugName: req.params.name,
    })
    .sort({ date: -1 });
  if (profile != null) res.render("dashboard", { profile, blogs });
  else res.render("404Page");
});

//other-profile route
router.get("/users/profile/:name", async (req, res) => {
  const profile = await userdb.findOne({
    slugName: req.params.name,
  });
  const blogs = await blogdb.find({
    slugName: req.params.name,
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

//creating new blog route
router.get("/new-article/create/:name", async (req, res) => {
  const registeredUser = await userdb.findOne({
    slugName: req.params.name,
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
  res.redirect(`/${profile.slugName}`);
});

module.exports = router;
