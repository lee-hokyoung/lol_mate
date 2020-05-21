var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("review_list", { title: "동종업계 최강 롤메이트 - 후기게시판" });
});
router.get("/register", (req, res) => {
  res.render("review_register", { title: "동종업계 최강 롤메이트 - 후기게시판" });
});

module.exports = router;
