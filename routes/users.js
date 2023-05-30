var express = require("express");
var router = express.Router();
var userModel = require("../models/User");

/* GET home page. */
router.get("/", async (req, res, next) => {
  if (req.cookies.myCookie) {
    const resp = await userModel.find({});
    res.send(resp);
  } else {
    res.send("null");
  }
});

router.post("/", async (req, res, next) => {
  const user = new userModel(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
