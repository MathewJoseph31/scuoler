const url = require("url");
const jwt = require("jsonwebtoken");

const constants = require("../Constants");
/*middleware method to verify JWT token*/
exports.verifyJwt = function (req, res, next) {
  let authHeader = req.headers["authorisation"];
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
        //console.log(decoded);
        req.email = decoded.email;
        req.role = decoded.role;
        next();
      }
    });
  }
};

exports.checkPageForPosts = function (req, res, next) {
  let currentPage = req.body.currentPage || 1;
  let authHeader = req.headers["authorisation"];

  let err;
  if (authHeader) {
    let token = authHeader.split(" ")[1];
    jwt.verify(token, constants.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        err = new Error("Access Token Invalid, (Re)Login Required");
      } else {
        //console.log(decoded);
        req.email = decoded.email;
        req.role = decoded.role;
      }
      if (currentPage <= 3) {
        next();
      } else if (!err && req.role.includes("ADMIN")) {
        next();
      } else if (!err && currentPage <= 10) {
        next();
      } else if (!err && currentPage > 10) {
        err = new Error(
          "Access Privileges need to be elevated, contact Scuoler Team"
        );
        next(err);
      } else if (err) {
        next(err);
      } else {
        err = new Error("Access Token Invalid, (Re)Login Required");
        next(err);
      }
    });
  } else if (currentPage <= 3) {
    next();
  } else {
    err = new Error("Access Token Invalid, (Re)Login Required");
    next(err);
  }
};

/*exports.checkPageForPostsOld = function (req, res, next) {
  let currentPage = req.body.currentPage || 1;

  if (currentPage <= 3) {
    next();
  } else {
    let authHeader = req.headers["authorisation"];
    if (!authHeader) {
      let err = new Error("Access Token Invalid, (Re)Login Required");
      next(err);
    } else {
      let token = authHeader.split(" ")[1];
      jwt.verify(token, constants.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          let err = new Error("Access Token Invalid, (Re)Login Required");
          next(err);
        } else {
          //console.log(decoded);
          req.email = decoded.email;
          req.role = decoded.role;
          if (currentPage <= 10) {
            next(req, res);
          } else if (req.role.includes("ADMIN")) {
            next();
          } else {
            let err = new Error(
              "Access Privileges need to be elevated, contact Scuoler Team"
            );
            next(err);
          }
        }
      });
    }
  }
};*/

exports.checkPageForGets = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let currentPage = queryObject.currentPage || 1;
  let authHeader = req.headers["authorisation"];

  let err;
  if (authHeader) {
    let token = authHeader.split(" ")[1];
    jwt.verify(token, constants.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        err = new Error("Access Token Invalid, (Re)Login Required");
      } else {
        //console.log(decoded);
        req.email = decoded.email;
        req.role = decoded.role;
      }
      if (currentPage <= 3) {
        next();
      } else if (!err && req.role.includes("ADMIN")) {
        next();
      } else if (!err && currentPage <= 10) {
        next();
      } else if (!err && currentPage > 10) {
        err = new Error(
          "Access Privileges need to be elevated, contact Scuoler Team"
        );
        next(err);
      } else if (err) {
        next(err);
      } else {
        err = new Error("Access Token Invalid, (Re)Login Required");
        next(err);
      }
    });
  } else if (currentPage <= 3) {
    next();
  } else {
    err = new Error("Access Token Invalid, (Re)Login Required");
    next(err);
  }
};
