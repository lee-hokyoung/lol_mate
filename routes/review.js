const express = require("express");
const Anonymous = require("../model/anonymous");
const mongoose = require("mongoose");
const router = express.Router();

//  게시판 조회
router.get("/read/:doc_id", async (req, res) => {
  //  조회수 + 1
  await Anonymous.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.doc_id) },
    { $inc: { hitCount: 1 } }
  );
  let doc = await Anonymous.findOne({ _id: mongoose.Types.ObjectId(req.params.doc_id) });
  res.render("review_read", { title: "동종업계 최강 롤메이트 - 후기게시판", doc: doc });
});
//  게시판 리스트 조회
router.all("/list", async (req, res) => {
  let page = req.body.page || 1;
  let limit = 10;
  let skip = limit * (page - 1);

  let searchText = req.body.searchText;
  let match_query = {};
  if (searchText) {
    match_query = { title: { $regex: ".*" + searchText + ".*" } };
  }
  let list = await Anonymous.aggregate([
    { $match: match_query },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: page, limit: limit } }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);
  res.render("review_list", {
    title: "동종업계 최강 롤메이트 - 후기게시판",
    list: list,
    searchText: searchText,
  });
});
//  글쓰기 등록 화면
router.get("/register", (req, res) => {
  res.render("review_register", { title: "동종업계 최강 롤메이트 - 후기게시판" });
});
//  글쓰기 등록
router.post("/register", async (req, res) => {
  try {
    let result = await Anonymous.create(req.body);
    if (result) {
      res.json({ code: 1, message: "등록성공" });
    } else {
      res.json({ code: 0, message: "등록 실패, 관리자에게 문의해 주세요" });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    let result = await Anonymous.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
  } catch (err) {}
});
module.exports = router;
