const express = require("express");
const Anonymous = require("../model/anonymous");
const mongoose = require("mongoose");
const fs = require("fs");
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
    //  img파일이 있을 경우 temps 폴더에서 upload 폴더로 이동시켜준다.
    let img_urls = req.body.img_urls;
    if (img_urls) {
      let token = img_urls[0].split("\\")[2];
      for (var i = 0; i < img_urls.length; i++) {
        let isExist = fs.existsSync("./uploads/" + token);
        console.log("is exist : ", isExist);

        if (!isExist) {
          fs.mkdirSync("./uploads/" + token);
        }
        fs.rename("./" + img_urls[i], "./" + img_urls[i].replace("temps", "uploads"), (err) => {
          if (err) {
            console.error("err : ", err);
          }
          console.log("i : ", i);
        });
      }
    }
    //  content 에서 temps를 upload로 바꿔준다
    let new_content = req.body.content
      .split("\n")
      .map((v) => {
        if (v.indexOf("<img") > -1) {
          return v.replace("temps", "uploads");
        } else return v;
      })
      .join("\n");
    req.body.content = new_content;
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
//  글 삭제
router.delete("/:id", async (req, res) => {
  try {
    let doc = await Anonymous.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      password: req.body.password,
    });
    //  content 내에서 url 추출
    if (doc) {
      let urls = doc.content
        .split("\n")
        .filter((v) => {
          if (v.indexOf("<img ") > -1) return v;
        })
        .map((v) => {
          return v
            .split(" ")
            .filter((w) => {
              if (w.indexOf("src") > -1) return w;
            })[0]
            .replace("src=", "")
            .replace(/"/g, "");
        });
      //  url이 있을 경우 삭제 unlink
      if (urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
          fs.unlink("." + urls[i], (err) => {
            if (err) console.error(err);
          });
        }
      }
      let result = await Anonymous.deleteOne({
        _id: mongoose.Types.ObjectId(req.params.id),
        password: req.body.password,
      });
      if (result.ok === 1) res.json({ code: 1, message: "삭제되었습니다.", result: result });
      else res.json({ code: 0, message: "삭제실패! 관리자에게 문의해주세요" });
    } else {
      res.json({ code: 0, message: "비밀번호가 틀렸습니다." });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  글 수정(비밀번호 확인 후 해당 글로 리다이렉트)
router.post("/update", async (req, res) => {
  try {
    let doc = await Anonymous.findOne({
      _id: mongoose.Types.ObjectId(req.body.id),
      password: req.body.password,
    });
    if (doc) {
      res.json({ code: 1, message: "" });
    } else {
      res.json({ code: 0, message: "비밀번호가 틀렸습니다." });
    }
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
//  글 수정 화면
router.get("/update/:id", async (req, res) => {
  let doc = await Anonymous.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  });
  res.render("review_update", {
    doc: doc,
  });
});
module.exports = router;
