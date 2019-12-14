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


// async function scrape() {
//     try {
//         var item = "boat headphone";
//         var numberofPages = 1;
//         var search = encodeURIComponent(item).replace(/%20/g, "+");
//         var html = await request.get("https://www.flipkart.com/search?q=" + search + "&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off&page=1");
//         var a = cheerio.load(html);
//         var lastPage = a("div._2zg3yZ > span").text();
//         var arr = lastPage.split(" ");
//         if (numberofPages < arr[3]) {
//             for (var index = 1; index <= numberofPages; index++) {
//                 console.log(index);
//                 const htmlPage = await request.get("https://www.flipkart.com/search?q=" + search + "&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off&page=" + index);
//                 const $ = cheerio.load(htmlPage);
//                 var itemAr = $("div._3liAhj").map((i, element) => {
//                     var itemName = $(element).find("a._2cLu-l").attr("title");
//                     var itemDesc = $(element).find("div._1rcHFq").text();
//                     var itemPrice = $(element).find("div._1vC4OE").text();
//                     var ratings = $(element).find("div.hGSR34").text();
//                     var offPrice = $(element).find("div.VGWI6T").text();
//                     var originalPrice = $(element).find("div._3auQ3N").text();
//                     return { itemName, itemDesc, itemPrice, ratings, offPrice, originalPrice };
//                 }).get();
//                 console.log(itemAr);
//             }
//         } else {
//             console.log("result available till " + arr[3]);
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }

// scrape();

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