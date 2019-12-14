var express = require('express');
var router = express.Router();
var passport = require("passport");
var userService = require("../services/userservice");
var request = require("request-promise");
var cheerio = require("cheerio");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/login');
    //res.json({ message: "index page" })
});

router.get('/login', (req, res, next) => {
    res.render("login");
});


router.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/home",
        failureRedirect: "/",
        failureFlash: true
    })
);

router.get("/register", (req, res, next) => {
    res.render('register');
})


router.post("/register", async (req, res, next) => {

    try {
        var message = await userService.addUser(req.body);
        console.log("message :" + message)
        if (message === "ok") return res.redirect("/");
        return res.json({ message: message });
    } catch (error) {
        next(error)
    }
});

router.get("/home", (req, res, next) => {
    res.render("home");
});

router.post("/home", async (req, res, next) => {
    console.log("post request to the flipkart");
    var item = req.body.item;
    var page = req.body.page;
    var search = encodeURIComponent(item).replace(/%20/g, "+");
    for (var index = 1; index <= page; index++) {
        var html = await request.get("https://www.flipkart.com/search?q=" + search + "&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off&page=" + index);
        var $ = cheerio.load(html);
        var itemAr = $("div._3liAhj").map((i, element) => {
            var itemName = $(element).find("a._2cLu-l").attr("title");
            var itemDesc = $(element).find("div._1rcHFq").text();
            var itemPrice = $(element).find("div._1vC4OE").text();
            var ratings = $(element).find("div.hGSR34").text();
            var offPrice = $(element).find("div.VGWI6T").text();
            var originalPrice = $(element).find("div._3auQ3N").text();
            return { itemName, itemDesc, itemPrice, ratings, offPrice, originalPrice };
        }).get();
        res.send(itemAr);
    }
});

module.exports = router;
