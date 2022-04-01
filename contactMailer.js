var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ischools.elearning@gmail.com",
    pass: "ischools.elearning@123",
  },
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
    from: "ischools.elearning@gmail.com",
    // from: req.body.email,
    to: "ischools.elearning@gmail.com",
    subject: "Ref No:" + req.body.refnum,
    text: mailBody,
    replyTo: req.body.email,
  };

  transporter.sendMail(mailMessage, function (error, info) {
    if (error) {
      console.log(error);
      next(error);
    } else {
      console.log("Email sent: " + info.response);
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
    from: "ischools.elearning@gmail.com",
    to: req.body.email,
    subject: "Ref No:" + req.body.refnum,
    text: "Thank you for contacting iSchools.com. We have recieved your query and will get back to you at the earliest. \n\nThanking you,\nTeam iSchools.com\n\n\nNote:This is an auto-generated mail.Please do not reply.",
  };

  transporter.sendMail(mailMessage, function (error, info) {
    if (error) {
      console.log(error);
      next(error);
    } else {
      console.log("Email reply sent: " + info.response);
      res.json({ mailReplySentStatus: "ok" });
    }
  });
};
exports.sendWelcome = function (req, res, next) {
  // console.log("In sendWelcome");
  // console.log("req.body.name: ", req.body.name);
  // console.log("req.body.email: ", req.body.email);
  // console.log("req.body.password : ", req.body.password);

  var mailMessage = {
    from: "ischools.elearning@gmail.com",
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
      console.log(error);
      next(error);
    } else {
      console.log("Email reply sent: " + info.response);
      res.json({ mailReplySentStatus: "ok" });
    }
  });
};
