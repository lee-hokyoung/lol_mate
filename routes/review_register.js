var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("review_list", { title: `${process.env.TITLE} - 후기게시판` });
});
router.get("/register", (req, res) => {
  res.render("review_register", { title: `${process.env.TITLE} - 후기게시판` });
});

module.exports = router;
