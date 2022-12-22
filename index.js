const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const app = express();
const http = require("http").createServer(app);
const port = process.env.PORT || 3000;

//passport config
require("./config/passport")(passport);

//ejs engine
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//method override
app.use(methodOverride("_method"));

// Connecting with database
mongoose
  .connect(process.env.mongodbURI || "mongodb://localhost:27017/blogs")
  .then(() => console.log("Connection successful..."))
  .catch((err) => console.log(err));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 1000000000000000,
    },
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//getting routes/workshopRoute.js
app.use("/", require("./routes/workshopRoute"));

//getting routes/register.js
app.use("/", require("./routes/register"));

//getting routes/events.js
app.use("/", require("./routes/events"));

//404 page
app.get("*", (req, res) => {
  res.render("404Page");
});

http.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
