const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const a = require("./routes/models");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use("/", require(path.join(__dirname, "routes/new")));

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

//for comment section
app.get("/comment/:slug", async (req, res) => {
  const art = await a.findOne({ slug: req.params.slug });
  if (art != null) res.render("comment", { art: art });
  else res.redirect("/");
});

//for home page
app.get("/", async (req, res) => {
  const article = await a.find().sort({ date: -1 });
  res.render("index", { article: article });
});

//for read more
app.get("/:slug", async (req, res) => {
  const article = await a.findOne({ slug: req.params.slug });
  if (article != null) res.render("show", { article: article });
  else res.redirect("/");
});

//for edit
app.get("/edit/:slug", async (req, res) => {
  const article = await a.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  else res.render("edit", { article: article });
});

//for delete
app.delete("/:id", async (req, res) => {
  await a.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
