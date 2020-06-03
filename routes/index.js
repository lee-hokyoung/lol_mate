const express = require("express");
const router = express.Router();
const Price = require("../model/price");
const Status = require("../model/status");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: `${process.env.TITLE}` });
});
router.get("/price", async (req, res) => {
  let perGameInfo = await Price.findOne({ perGame: { $exists: true } });
  let winGameInfo = await Price.findOne({ winGame: { $exists: true } });
  let rankGameInfo = await Price.findOne({ rankGame: { $exists: true } });
  let tutorGameInfo = await Price.findOne({ tutorGame: { $exists: true } });
  res.render("price", {
    title: `${process.env.TITLE} - 가격표`,
    perGameInfo: perGameInfo,
    winGameInfo: winGameInfo,
    rankGameInfo: rankGameInfo,
    tutorGameInfo: tutorGameInfo,
  });
});
router.get("/team", (req, res) => {
  res.render("team", { title: `${process.env.TITLE} - 팀소개` });
});
router.get("/qna", (req, res) => {
  res.render("qna", { title: `${process.env.TITLE} - 문의방법` });
});
router.get("/status", async (req, res) => {
  let list = await Status.findOne({});
  console.log("list : ", list);
  res.render("status", { title: `${process.env.TITLE} - 작업현황`, list: list });
});

module.exports = router;
