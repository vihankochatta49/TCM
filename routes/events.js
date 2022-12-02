const express = require("express");
const blogdb = require("./../routes/models");
const userdb = require("./../routes/registerModels");
const router = express.Router();

router.get("/:event/:name", async (req, res) => {
  const data = await userdb.findOne({
    slugName: req.params.name,
  });
  if (data.position == req.params.event) {
    res.render(`${req.params.event}`);
  } else res.render("404Page");
});

module.exports = router;
