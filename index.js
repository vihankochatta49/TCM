const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const a = require("./routes/models");
const app = express();
const port = 3000;

//ejs engine
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

//method override
app.use(methodOverride("_method"));

//getting routes/new.js
app.use("/", require(path.join(__dirname, "routes/new")));

//getting routes/nav.js
app.use("/", require(path.join(__dirname, "routes/nav")));

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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
