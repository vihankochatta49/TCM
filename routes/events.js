const express = require("express");
const blogdb = require("./../routes/workshopModel");
const userdb = require("./../routes/registerModel");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();

//Login page
router.get("/", (req, res) => {
  res.render("login");
});

//home page route
router.get("/feed", ensureAuthenticated, (req, res) => {
  const profile = req.user;
  const blogs = [
    {name: "Workshops"},
    {name: "Competitions"},
  ];
  res.render("feed", { profile, blogs });
});

//competitions route
router.get("/:event",ensureAuthenticated,(req,res)=> {
  const profile = req.user;
  var comp=[];
  var event = req.params.event;
  if(req.params.event == "Competitions") {
    comp = [
      {name: "Technology"},
      {name: "Entrepreneurial"},
      {name: "Miscellanous"},
    ];
  }else if(req.params.event == "Technology") {
    comp = [
      {name: "ROBOGAMES"},
      {name: "SOFTWARE CORNER"},
      {name: "TAKE OFF"},
      {name: "TECHNOVATION"},
      {name: "ECDC"},
    ];
  }else if(req.params.event == "Entrepreneurial") {
    comp = [
      {name: "FINTECH"},
      {name: "Entrepreneurial Events"},
      {name: "BUSINESS Events"},
    ];
  }else if(req.params.event == "Miscellanous") {
    comp = [
      {name: "DESIGN EVENTS"},
      {name: "MANDAKINI"},
      {name: "MODEL UNITED NATIONS"},
    ];
  }
  res.render("Competitions",{profile,comp,event});
})

//different events route
router.get("/:event/:name", async (req, res) => {
  const profile = await userdb.findOne({
    slugName: req.params.name,
  });
  const blogs = await blogdb
    .find({
      slugName: req.params.name,
    })
    .sort({ date: -1 });
  if (profile.position == req.params.event) {
    res.render("Workshops",{profile,blogs});
  } else res.render("404Page");
});

//creating new blog route
router.get("/new-article/create/:name", async (req, res) => {
  const registeredUser = await userdb.findOne({
    slugName: req.params.name,
  });
  if (registeredUser != null) res.render("dashboard", { registeredUser });
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
  res.redirect(`/feed`);
});

module.exports = router;
