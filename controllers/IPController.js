const constants = require("../Constants");
const utils = require("../utils/Utils");
const url = require("url");
let { setCorsHeaders } = utils;

exports.getIpDetails = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let ip = queryObject.ip;
  console.log("ip address", ip);
  let ipDetailsUrl = `http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`;

  let resObj = await fetch(ipDetailsUrl, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!resObj?.ok) {
    try {
      let jsonStr = await resObj.json();
      let err = new Error(jsonStr);
      err.jsonified = true;
      next(err);
    } catch (err) {
      if (err.jsonified) {
        next(err);
      } else {
        next(
          Error("Network or server fetch error", {
            cause: err,
          })
        );
      }
    }
  }
  let jsonObj = await resObj.json();

  setCorsHeaders(req, res);
  res.json(jsonObj);
};

exports.sendContactUsEmailReply = function (req, res, next) {
  let mailBody =
    "Name: " +
    req.body.name +
    " \n" +
    "E-mail: " +
    req.body.email +
    " \n" +
    "Phone: " +
    req.body.phone +
    " \n" +
    "Ref No:: " +
    req.body.refnum +
    " \n" +
    "Message: " +
    req.body.message +
    " \n";

  var mailMessage = {
    from: constants.SCUOLER_EMAIL_ID,
    to: req.body.email,
    subject: "Ref No:" + req.body.refnum,
    text: "Thank you for contacting scuoler.com. We have recieved your query and will get back to you at the earliest. \n\nThanking you,\nTeam Scuoler\n\n\nNote:This is an auto-generated mail.Please do not reply.",
  };

  transporter.sendMail(mailMessage, function (error, info) {
    if (error) {
      next(error);
    } else {
      console.log("Email reply sent: " + info.response);
      setCorsHeaders(req, res);
      res.json({ mailReplySentStatus: "ok" });
    }
  });
};

exports.sendRegistrationEmail = function (req, res, next) {
  let htmlBody = makeRegistrationEmailBody(req.body.name, req.body.password);

  sendEmailGeneric(
    constants.SCUOLER_ADMIN_EMAIL_ID,
    req.body.email,
    "Welcome to Scuoler",
    htmlBody,
    true,
    false
  )
    .then((output) => {
      setCorsHeaders(req, res);
      res.json({ mailReplySentStatus: "ok" });
    })
    .catch((err1) => {
      next(err1);
    });
};
