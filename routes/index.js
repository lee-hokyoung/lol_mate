var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "동종업계 최강 롤메이트" });
});
router.get("/price", (req, res) => {
  res.render("price", { title: "가격표" });
});
router.get("/team", (req, res) => {
  res.render("team", { title: "팀소개" });
});
router.get("/qna", (req, res) => {
  res.render("qna", { title: "문의방법" });
});

module.exports = router;
