const path = require("path");
const constants = require("../Constants");

exports.seedRedirect = function (req, res, next) {
  if (req.headers["host"] === constants.SEED_DOMAIN_NAME) {
    let servedFile = "";
    if (req.url === "/") {
      servedFile = "index.html";
    } else {
      servedFile = decodeURI(req.url).substring(1);
    }
    res.sendFile(path.join(__basedir, "public", "seed", servedFile));
  } else {
    next();
  }
};
