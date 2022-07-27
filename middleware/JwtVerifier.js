const jwt = require("jsonwebtoken");

const constants = require("../Constants");
/*middleware method to verify JWT token*/
exports.verifyJwt = function (req, res, next) {
  let authHeader = req.headers["authorization"];
  if (!authHeader) {
    let err = new Error("Access Token Invalid");
    next(err);
  } else {
    let token = authHeader.split(" ")[1];
    jwt.verify(token, constants.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        let err = new Error("Access Token Invalid");
        next(err);
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
};
