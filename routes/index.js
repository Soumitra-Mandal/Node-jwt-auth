var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("pages/home", { jwt: req.cookies.jwt, user: req.cookies.user });
});

module.exports = router;
