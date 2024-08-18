const constants = require("../Constants");
const utils = require("../utils/Utils");
let { setCorsHeaders } = utils;
const ipUtils = require("../utils/ipUtils");
let { getIpDetailsForIp } = ipUtils;
const url = require("url");

exports.getIpDetails = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let ip = queryObject.ip;
  //console.log("ip address", ip);

  getIpDetailsForIp(ip)
    .then((jsonObj) => {
      setCorsHeaders(req, res);
      res.json(jsonObj);
    })
    .catch((err) => {
      next(err);
    });
};
