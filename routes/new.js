const express = require("express");
const blogdb = require("./../routes/models");
const userdb = require("./../routes/registerModels");
const fs = require("fs");
const store = require("../config/multer");
const markdown = require("markdown").markdown;
const router = express.Router();
const app = express();

//register route
router.get("/register", (req, res) => {
  res.render("register");
});

//login route
router.get("/", (req, res) => {
  res.render("login");
});

// saving blog to database
router.post("/save/:registerNumber", store.single("images"), (req, res) => {
  //generating 9 digit blog number
  var blogNumber = Math.floor(Math.random() * 1000000000);

  const createDoc = async () => {
    try {
      const files = req.file;

      // convert images to base64 emcoding
      let img = fs.readFileSync(files.path);
      encode_image = img.toString("base64");

      //create object to store data in db
      let finalimg = {
        filename: files.originalname,
        contentType: files.mimetype,
        imageBase64: encode_image,
      };

      const registeredUser = await userdb.findOne({
        registerNumber: req.params.registerNumber,
      });

      const apprec = new blogdb({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        roomName: req.body.title,
        blogNumber: blogNumber,
        registerNumber: registeredUser.registerNumber,
        name: registeredUser.name,
        filename: finalimg.filename,
        contentType: finalimg.contentType,
        imageBase64: finalimg.imageBase64,
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
router.put("/:id", store.single("images"), async (req, res) => {
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
router.put("/like/:id", async (req, res) => {
  try {
    const art = blogdb.findById(req.params.id);
    await blogdb.updateMany(art, {
      $inc: { likes: 1 },
    });
    res.redirect("/feed");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
