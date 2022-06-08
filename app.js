const express = require("express");
const app = express();

//const enforce = require('express-sslify');

const bodyParser = require("body-parser");

//session code
const cookieParser = require("cookie-parser");
const session = require("express-session");

const path = require("path");
//morgan logger
const morgan = require("morgan");

// Use enforce.HTTPS({ trustProtoHeader: true }) in case you are behind
// a load balancer (e.g. Heroku). See further comments below
//app.use(enforce.HTTPS({ trustProtoHeader: true}));

app.use(cookieParser());
app.use(
  session({
    secret: "secr3",
    resave: false,
    saveUninitialized: false,
    maxAge: 24 * 60 * 60 * 1000,
  })
);
//end of session code

app.use(bodyParser.urlencoded({ extended: true }));

//app.set("view engine", "ejs");
app.use(express.static("public"));
//app.use(express.static("views"));

//additional
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

if (process.env.NODE_ENV === "production") {
  const rfs = require("rotating-file-stream");
  // create a rotating write stream
  const accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "logs"),
  });

  app.use(
    morgan(
      "[:remote-addr]  [:remote-user] [:date[clf]] [:method :url] [:status] [:res[content-length]] [:referrer] [:user-agent]",
      {
        stream: accessLogStream,
        skip: (req, res) => {
          return req.url.startsWith("/static");
        },
      }
    )
  );
} else {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
const formData = require("express-form-data");
app.use(formData.parse());

global.__basedir = __dirname;

module.exports = app;
