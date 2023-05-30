var express = require("express");
var userModel = require("../models/User");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var router = express.Router();

router.get("/login", async (req, res, next) => {
  if (req.cookies.jwt !== null) {
    jwt.verify(req.cookies.jwt, "soumi", (err, decoded) => {
      if (err) {
        res.render("pages/login");
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

router.post("/login", async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (user) {
    var isLogin = await bcrypt.compare(req.body.password, user.password);
    if (isLogin) {
      const token = await jwt.sign({ id: user._id }, "soumi");
      res.cookie("jwt", token, { httpOnly: true });
      res.cookie("user", user.email);
      res.redirect("/");
    } else {
      res.send("wrong password!");
    }
  } else {
    res.send("email does not exist!");
  }
});

router.get("/signup", (req, res, next) => {
  if (req.cookies.jwt !== null) {
    jwt.verify(req.cookies.jwt, "soumi", (err, decoded) => {
      if (err) {
        res.render("pages/signup", { error: null });
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.render("pages/signup", { error: null });
  }
});

router.post("/signup", async (req, res, next) => {
  const user = new userModel({
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
  });
  try {
    await user.save();
    const token = await jwt.sign({ id: user._id }, "soumi");
    res.cookie("jwt", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.render("pages/signup", { error: error.message });
  }
});

router.get("/logout", (req, res, next) => {
  if (req.cookies.jwt !== null) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("user", "", { maxAge: 1 });
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
