const path = require("path");
const fs = require("fs");
const constants = require("../Constants");
const utils = require("../utils/Utils");

let { setCorsHeadersForAllIPs } = utils;

exports.sendAbrbJsFile = function (req, res, next) {
  let jsFilePath = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    "abrb/js/main.js",
  );
  setCorsHeadersForAllIPs(req, res);
  //res.json(`status: ${jsFilePath}`);

  // Send the file as the response
  res.sendFile(jsFilePath, (err) => {
    if (err) {
      next(err);
    }
  });
};

exports.sendAbrbJsChunkFile = function (req, res, next) {
  let jsFilePath = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    "abrb/js/main.chunk.js",
  );
  setCorsHeadersForAllIPs(req, res);
  //res.json(`status: ${jsFilePath}`);

  // Send the file as the response
  res.sendFile(jsFilePath, (err) => {
    if (err) {
      next(err);
    }
  });
};

exports.sendAbrbCssFile = function (req, res, next) {
  let cssFilePath = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    "abrb/css/main.css",
  );
  setCorsHeadersForAllIPs(req, res);
  //res.json(`status: ${jsFilePath}`);

  // Send the file as the response
  res.sendFile(cssFilePath, (err) => {
    if (err) {
      next(err);
    }
  });
};
