const express = require("express");
const blogdb = require("./../routes/workshopModel");
const userdb = require("./../routes/registerModel");
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

// saving workshop to database
router.post("/save/:name", (req, res) => {
  //generating 9 digit blog number
  var blogNumber = Math.floor(Math.random() * 1000000000);

  const createDoc = async () => {
    try {
      const registeredUser = await userdb.findOne({
        slugName: req.params.name,
      });

      const apprec = new blogdb({
        event: req.body.event,
        title: req.body.title,
        markdown: req.body.markdown,
        price: req.body.price,
        name: registeredUser.name,
        blogNumber: blogNumber,
      });

      const blog = await blogdb.insertMany([apprec]);
      res.redirect("/feed");
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
        event: req.body.event,
        title: req.body.title,
        price: req.body.price,
        markdown: req.body.markdown,
        sanitizedHtml: markdown.toHTML(req.body.markdown),
      },
    });
    res.redirect("/feed");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
