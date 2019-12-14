const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require('morgan');
const session = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const localStrategy = require("passport-local");
const mongoose = require("mongoose");
var indexRouter = require('./routes/index');

var cheerio = require("cheerio");
const request = require("request-promise");

const app = express();
mongoose.connect(
    "mongodb://localhost/flip",
    { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true },
    err => { if (!err) console.log("connection successfull"); }
);

const auth = require("./middleware/authentication");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const keys = ["Ron", "Swanson"];
const expiryDate = new Date(5 * Date.now() + 60 * 60 * 1000); // 5 hours
// console.log(expiryDate);
app.use(
  session({
    secret: "mustache",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
      expires: expiryDate
    },
    keys: keys
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use('/', indexRouter);
require("./config/passport")(passport);


app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;