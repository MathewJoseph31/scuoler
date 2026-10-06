const path = require("path");
const constants = require("../Constants");

exports.abrbRedirect = function (req, res, next) {
  let servedFile = "";
  if (req.url === "/abrb") {
    servedFile = "index.html";
  } else {
    servedFile = decodeURI(req.url).substring(1);
  }
  res.sendFile(path.join(__basedir, "public", "abrb", servedFile));
};
