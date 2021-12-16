const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const a = require("./routes/models");
const app = express();
const port = 3000;

//ejs engine
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//method override
app.use(methodOverride("_method"));

// Connecting with database
mongoose
  .connect("mongodb://localhost:27017/blogs")
  .then(() => console.log("Connection successful..."))
  .catch((err) => console.log(err));

// Socket connection for comments
const io = require("socket.io")(4202, { cors: { origin: "*" } });
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (room, name) => {
    socket.join(room);
    users[socket.id] = name;
    socket.to(room).emit("user-joined", name);
  });

  socket.on("send", (room, message) => {
    socket.to(room).emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => delete users[socket.id]);
});

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  // res.locals variables can only be used in views render
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//getting routes/new.js
app.use("/", require(path.join(__dirname, "routes/new")));

//getting routes/nav.js
app.use("/", require("./routes/nav"));

//getting routes/register.js
app.use("/", require("./routes/register"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
