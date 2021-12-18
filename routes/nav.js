const express = require("express");
const a = require("./../routes/models");
const userData = require("./../routes/registerModels");
const router = express.Router();

//for home page
router.get("/feed", async (req, res) => {
  console.log(req.user);
  const profile = req.user;
  const article = await a.find();
  res.render("feed", { profile, article });
});

//for creating new blog
router.get("/create/:registerNumber", async (req, res) => {
  const registeredUser = await userData.findOne({
    registerNumber: req.params.registerNumber,
  });
  res.render("create", { registeredUser });
});

//for read more
router.get("/readMore/:slug/:blogNumber", async (req, res) => {
  const article = await a.findOne({ blogNumber: req.params.blogNumber });
  if (article != null) res.render("show", { article: article });
  else res.redirect("/");
});

//for edit
router.get("/edit/:slug/:blogNumber", async (req, res) => {
  const article = await a.findOne({ blogNumber: req.params.blogNumber });
  if (article == null) res.redirect("/");
  else res.render("edit", { article: article });
});

//for comment section
router.get("/comment/:slug/:blogNumber", async (req, res) => {
  const art = await a.findOne({ blogNumber: req.params.blogNumber });
  if (art != null) res.render("comment", { art: art });
  else res.redirect("/");
});

//for delete
router.delete("/:id", async (req, res) => {
  await a.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
