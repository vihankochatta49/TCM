const express = require("express");
const blogdb = require("./../routes/models");
const userdb = require("./../routes/registerModels");
const fs = require("fs");
const markdown = require("markdown").markdown;
const router = express.Router();
const app = express();

//register route
router.get("/register", (req, res) => {
  res.render("register");
});

//login route
router.get("/login", (req, res) => {
  res.render("login");
});

// saving blog to database
router.post("/save/:name", (req, res) => {
  //generating 9 digit blog number
  var blogNumber = Math.floor(Math.random() * 1000000000);

  const createDoc = async () => {
    try {
      const registeredUser = await userdb.findOne({
        slugName: req.params.name,
      });

      const apprec = new blogdb({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        roomName: req.body.title,
        blogNumber: blogNumber,
        registerNumber: registeredUser.registerNumber,
        name: registeredUser.name,
      });

      const blog = await blogdb.insertMany([apprec]);
      res.redirect(`/readMore/${apprec.slug}/${apprec.blogNumber}`);
    } catch (err) {
      console.log(err);
    }
  };
  createDoc();
});

//updating blog
router.put("/:id", async (req, res) => {
  try {
    const art = blogdb.findById(req.params.id);

    await blogdb.updateMany(art, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        sanitizedHtml: markdown.toHTML(req.body.markdown),
      },
    });
    res.redirect("/feed");
  } catch (err) {
    console.log(err);
  }
});

//counting likes
router.put("/like/post/:id", (req, res) => {
  blogdb
    .findByIdAndUpdate(
      req.params.id,
      {
        $inc: { likes: 1 },
      },
      { new: true }
    )
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
