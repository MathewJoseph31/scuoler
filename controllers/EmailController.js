const nodemailer = require("nodemailer");

const constants = require("../Constants");
const utils = require("../utils/Utils");
let { setCorsHeaders } = utils;

/*const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: constants.GOOGLE_MAIL_USER_ID,
    pass: constants.GOOGLE_MAIL_PASSWORD,
  },
});*/

const tlsObj = {
  ciphers: "SSLv3",
  secure: true,
  ignoreTLS: false,
  rejectUnauthorized: true,
};

const transporter = nodemailer.createTransport({
  host: constants.MAIL_JET_HOST,
  port: constants.MAIL_JET_PORT,
  secure: false,
  auth: {
    user: constants.MAIL_JET_USER_ID,
    pass: constants.MAIL_JET_PASSWORD,
  },
  tls: tlsObj,
});

const transporterAlt = nodemailer.createTransport({
  host: constants.MAIL_JET_HOST,
  port: constants.MAIL_JET_PORT,
  secure: false,
  auth: {
    user: constants.MAIL_JET_USER_ID_ALT,
    pass: constants.MAIL_JET_PASSWORD_ALT,
  },
  tls: tlsObj,
});

exports.sendMail = function (req, res, next) {
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
    "Ref No: " +
    req.body.refnum +
    " \n" +
    "Message: \n" +
    req.body.message +
    " \n";

  var mailMessage = {
    from: constants.SCUOLER_EMAIL_ID,
    // from: req.body.email,
    to: constants.GOOGLE_MAIL_USER_ID,
    subject: "Ref No:" + req.body.refnum,
    text: mailBody,
    replyTo: req.body.email,
  };

  transporter.sendMail(mailMessage, function (error, info) {
    if (error) {
      next(error);
    } else {
      console.log("Email sent: " + info.response);
      setCorsHeaders(req, res);
      res.json({ mailSentStatus: "ok" });
    }
  });
};
exports.sendReply = function (req, res, next) {
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
    text: "Thank you for contacting iSchools.com. We have recieved your query and will get back to you at the earliest. \n\nThanking you,\nTeam iSchools.com\n\n\nNote:This is an auto-generated mail.Please do not reply.",
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
exports.sendWelcome = function (req, res, next) {
  var mailMessage = {
    from: constants.SCUOLER_EMAIL_ID,
    to: req.body.email,
    subject: "Welcome to iSchools",
    text:
      "Dear " +
      req.body.name +
      ",\nThank you for registering at iSchools.com. We hope you have great time learning with us. \n\nThe password for your account is: " +
      req.body.password +
      ".\nFor any help/support please feel free to reach out to us through our contact us page.\n\nThanking you,\nTeam iSchools.com\n\n\nNote:This is an auto-generated mail.Please do not reply.",
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

exports.sendEmailGenericHandler = function (req, res, next) {
  let recipients = req.body.recipients;
  let subject = req.body.subject;
  let emailBody = req.body.emailBody;
  let isHtml = Boolean(req.body.isHtml);
  let accessTokenSecret = req.body.accessTokenSecret;
  if (constants.ACCESS_TOKEN_SECRET !== accessTokenSecret) {
    let err = new Error("Not Authorized: Access token incorrect");
    next(err);
  } else {
    //console.log(recipients, subject, emailBody, isHtml);
    sendEmailGeneric(
      "noreply@mail.scuoler.com",
      recipients,
      subject,
      emailBody,
      isHtml,
      true
    )
      .then((output) => {
        console.log(output);
        setCorsHeaders(req, res);
        res.json({ sendstatus: "ok" });
      })
      .catch((err1) => {
        console.log(err1);
        next(err1);
      });
  }
};

const sendEmailGeneric = (
  sender,
  recipients,
  subject,
  body,
  isHtml,
  useAlternateMailjet
) => {
  let mailMessage = isHtml
    ? {
        from: sender,
        to: recipients,
        subject: subject,
        html: body,
      }
    : {
        from: sender,
        to: recipients,
        subject: subject,
        text: body,
      };

  return new Promise((resolve, reject) => {
    let transp = useAlternateMailjet ? transporterAlt : transporter;
    transp.sendMail(mailMessage, function (error, info) {
      if (error) {
        reject(error);
      } else {
        console.log("Email reply sent: " + info.response);
        resolve({ emailSentStatus: "ok" });
      }
    });
  });
};

exports.sendEmailGeneric = sendEmailGeneric;
