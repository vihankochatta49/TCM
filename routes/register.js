const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const rM = require(".././routes/registerModel");
const a = require(".././routes/workshopModel");

// saving register data to db (post route)
router.post("/register", (req, res) => {
  const { name, password, password2 } = req.body;
  let errors = [];

  //check require fields
  if (!name || !password || !password2) {
    errors.push({ msg: "Please fill all fields" });
  }

  //password check
  if (password !== password2) errors.push({ msg: "Password do not match" });

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters long" });
  }

  //check for error
  if (errors.length > 0) {
    res.render("register", { errors, name, password, password2 });
  } else {
    rM.findOne({ name: name }).then((user) => {
      //User exists
      if (user) {
        errors.push({ msg: "Email is already registered" });
        res.render("register", { errors, name, password, password2 });
      } else {
        const createDoc = async function () {
          try {
            const userData = new rM({
              name: req.body.name,
              password: req.body.password,
              position: "Head",
            });

            // generating hashed password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            userData.password = hashedPassword;

            //saving to db
            const user = await rM.insertMany([userData]);

            req.flash(
              "success_msg",
              "You have successfully registered and can login in"
            );
            res.redirect("/login");
          } catch (err) {
            console.log(err);
          }
        };
        createDoc();
      }
    });
  }
});

//post route for login (passport authenticate)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get("/user/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
