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

exports.recieveContactUsEmail = function (req, res, next) {
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

const makeRegistrationEmailBody = (name, password) => {
  const html = `<html>
  <body>
  <section style="background-color: #edf2fb;box-shadow: 0px 10px 5px grey; border-radius: 10px;border: 1px solid rgb(196, 196, 196);padding: 10px 5px 0px 15px">
  <h2>Dear ${name}, </h2>
  <h2>Welcome to <a href="https://scuoler.com/">Scuoler</a>,</h2>
  <h3>The password for your account is ${password}</h3>
  <h3>We hope you have great time learning/educating/building with us.</h3> 
  <h3>Kindly remember to take the following steps, immediately:</h2> 
  <hr>
  <br/>
  <ol>
  <li>
  <p style="color:#332233;font-size: 17px;font-weight: bolder">Change Password:<p/>
  <span style="margin-left:18px; font-size: 18px; color: #223322; ">
  After signing in using your user id and password, you will automatically navigated to your home page.
  From there, click on the password icon to open change-password modal.
  </span> <br/>
  </li>
  <li>
  <p style="color:#332233;font-size: 17px;font-weight: bolder">Want to be an Instructor/Mentor?<p/>
  <span style="margin-left:18px; font-size: 18px; color: #223322; ">
  After signing in, from the home page, click on the profile icon. 
  Click the checkbox labelled 'Are you interested in being an Instructor/Mentor'. 
  Provide your educational qualifications, industrial experiences, and competencies 
  around which you want to instruct/mentor. We will match you to students/mentees. 
  Hurray, you can start making revenue. 
  </span> <br/>
  </li>
  <li>
  <p style="color:#332233;font-size: 17px;font-weight: bolder">Want to be a Course Creator?<p/>
  <span style="margin-left:18px; font-size: 18px; color: #223322; ">
  If you have deep knowledge about a topic. Why not create a course on Scuoler platform on that topic.
  We can help you publish and popularize your content on Google, Bing, and other search engines, 
  on social networks such as Facebook and LinkedIn. This will help people in discovering your content faster
  and establish yourself as an instructional designer. You can turn on the Ads option 
  and make revenue based on number of views. If this interests you, then click on
  <a href="https://scuoler.com/courseInsert">https://scuoler.com/courseInsert</a>
  <span><br/>
  </li>
  </ol>
  <br/>
  <hr>
  <h4>Thank You from <a href="https://scuoler.com">Scuoler</a> team<br/></h4>
  <a href="https://scuoler.com">https://scuoler.com</a>
  </section>
  </body>
  </html>
 `;
  return html;
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
      constants.SCUOLER_NOREPLY_EMAIL_ID_ALT,
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
