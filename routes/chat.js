const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const path = require("path");

router.get("/", (req, res) => {
  res.redirect(`/chat/${uuidv4()}`);
});

router.get("/:room", (req, res) => {
  //console.log(req.params.room);
  //res.render("videoChat", { roomId: req.params.room });
  res.sendFile(path.join(__basedir, "views/videoChat.html"));
  // res.status(200).send("hello");
});

module.exports = router;
