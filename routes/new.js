const express = require("express");
const Article = require("./../routes/models");
const userData = require("./../routes/registerModels");
const router = express.Router();
const app = express();

//for creating new blog
router.get("/create/:registerNumber", async (req, res) => {
  const registeredUser = await userData.findOne({
    registerNumber: req.params.registerNumber,
  });
  res.render("create", { registeredUser });
});

//register route
router.get("/register", (req, res) => {
  res.render("register");
});

//login route
router.get("/login", (req, res) => {
  res.render("login");
});

//generating 9 digit blog number
var blogNumber = Math.floor(Math.random() * 1000000000);

// saving blog to database
router.post("/save/:registerNumber", (req, res) => {
  const createDoc = async () => {
    try {
      const registeredUser = await userData.findOne({
        registerNumber: req.params.registerNumber,
      });
      const apprec = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        roomName: req.body.title,
        blogNumber: blogNumber,
        registerNumber: registeredUser.registerNumber,
        name: registeredUser.name,
      });
      const blog = await Article.insertMany([apprec]);
      res.redirect(`/${apprec.slug}/${apprec.blogNumber}`);
    } catch (err) {
      console.log(err);
    }
  };
  createDoc();
});

//updating blog
router.put("/:id", async (req, res) => {
  try {
    const art = Article.findById(req.params.id);
    await Article.updateMany(art, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
      },
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//counting likes
router.put("/like/:id", async (req, res) => {
  try {
    const art = Article.findById(req.params.id);
    await Article.updateMany(art, {
      $inc: { likes: 1 },
    });
    res.redirect("/feed");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
