const express = require("express");
const app = express();
//const enforce = require('express-sslify');

const bodyParser = require("body-parser");

//session code
const cookieParser = require("cookie-parser");
const session = require("express-session");

//additional
var createError = require("http-errors");
var path = require("path");
//morgan logger
var morgan = require("morgan");

const utils = require("./utils/Utils");
let { setCorsHeaders } = utils;

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
//app.use(express.static("public"));
//app.use(express.static("views"));

//additional
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

if (process.env.NODE_ENV === "production") {
  var rfs = require("rotating-file-stream");
  // create a rotating write stream
  var accessLogStream = rfs.createStream("access.log", {
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

var apiRouter = require("./routes/api");

app.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  next(createError(404, err.toString()));
});

const dbControllerError = require("./DBcontrollerError");

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  dbControllerError.insertErrorToDb(err, req).then();
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (req.xhr) {
    res.send({ error: "Something failed!" + err.toString() });
  } else {
    //res.render('error',{message:err.toString(),error:err});
    setCorsHeaders(req, res);
    res.json("Description: " + err.toString());
  }
});

module.exports = app;
