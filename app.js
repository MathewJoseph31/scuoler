const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//session code
const cookieParser = require('cookie-parser');
const session = require('express-session');

//additional
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');

app.use(cookieParser());
app.use(session({secret:'secr3',resave:false,saveUninitialized:false, maxAge: 24 * 60 * 60 * 1000}));
//end of session code

app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('views'));

//additional
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));



var indexRouter = require('./routes/index');

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
