const express = require("express");
const Article = require("./../routes/models");
const router = express.Router();
const app = express();

//for creating new blog
router.get("/create", (req, res) => {
  res.render("create");
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
router.post("/save", (req, res) => {
  const createDoc = async () => {
    try {
      const apprec = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        roomName: req.body.title,
        blogNumber: blogNumber,
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
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
