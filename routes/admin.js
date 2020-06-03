const express = require("express");
const router = express.Router();
const middle = require("../routes/middleware");
const Anonymous = require("../model/anonymous");
const Price = require("../model/price");
const Status = require("../model/status");

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const passport = require("passport");
const mongoose = require("mongoose");

//  관리자 로그인 화면
router.get("/login", middle.isNotLoggedIn, (req, res) => {
  res.render("admin_login", {
    title: "롤메이트 관리자 - 로그인",
  });
});
//  관리자 로그인
router.post("/login", middle.isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (info) {
      return res.json({ code: 0, message: info.message });
    }
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.json({ code: 0, message: "로그인 실패. 아이디 혹은 비밀번호가 다릅니다." });
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      res.json({ code: 1, message: "정상적으로 로그인 되었습니다" });
    });
  })(req, res, next);
});
//  관리자 로그아웃
router.get("/logout", middle.isAdmin, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/admin/login");
});

//  관리자 화면 전체
router.get("/", middle.isAdmin, async (req, res) => {
  let page = req.body.page || 1;
  let limit = 20;
  let skip = limit * (page - 1);
  let list = await Anonymous.aggregate([
    { $match: {} },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page: page, limit: limit } }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);
  //  가격 정보
  let perGameInfo = await Price.findOne({ perGame: { $exists: true } });
  let winGameInfo = await Price.findOne({ winGame: { $exists: true } });
  let rankGameInfo = await Price.findOne({ rankGame: { $exists: true } });
  let tutorGameInfo = await Price.findOne({ tutorGame: { $exists: true } });
  //  작업현황 정보
  let status_imgs = await Status.findOne({});
  res.render("admin_dashboard", {
    title: "롤메이트 - 관리자 화면",
    list: list,
    isAdmin: true,
    perGameInfo: perGameInfo,
    winGameInfo: winGameInfo,
    rankGameInfo: rankGameInfo,
    tutorGameInfo: tutorGameInfo,
    status_imgs: status_imgs,
  });
});

//  리뷰 게시물 삭제
router.delete("/review/:id", middle.isAdmin, async (req, res) => {
  try {
    //  콘텐츠 내에 이미지가 있는지 확인 후 있으면 이미지 파일도 삭제한다.focus
    let doc = await Anonymous.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
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
    }
    let result = await Anonymous.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
    res.json({ code: 1, message: "삭제되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});

// 가격표 수정
router.patch("/price/:gameName", middle.isAdmin, async (req, res) => {
  try {
    let query = {};
    query[req.params.gameName] = { $exists: true };
    let result = await Price.updateOne(query, { $set: req.body });
    res.json({ code: 1, message: "저장했습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});

//  작업현황 추가(temps 폴더에 임시 저장하는 것)
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./temps/status");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});
router.post("/status", middle.isAdmin, upload.array("status[]"), async (req, res) => {
  try {
    res.json({ code: 1, message: "등록 성공", filename: req.files });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});

// 작업현황 등록(temps -> status_imgs)
router.post("/upload/status", middle.isAdmin, async (req, res) => {
  try {
    //  파일 이동
    let urls = req.body.path.split(","),
      arr = [];
    for (let i = 0; i < urls.length; i++) {
      let new_path = "/status_imgs/" + urls[i].split(path.sep)[2];
      fs.rename("./" + urls[i], "." + new_path, (err) => {
        if (err) console.error("err : ", err);
      });
      arr.push(new_path);
    }
    console.log("arr : ", arr);
    //  모델 업데이트
    let result = await Status.updateOne({}, { $push: { img_url: arr } });
    res.json({ code: 1, message: "정상적으로 등록되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});

//  작업현황 삭제
router.delete("/status", middle.isAdmin, async (req, res) => {
  try {
    let filepath = req.body.path;
    //  파일 삭제
    if (fs.existsSync("." + filepath)) {
      fs.unlinkSync("." + filepath);
    }
    //  모델 업데이트
    let result = await Status.updateOne({}, { $pull: { img_url: filepath } });
    res.json({ code: 1, message: "삭제되었습니다.", result: result });
  } catch (err) {
    res.json({ code: 0, message: err.message });
  }
});
module.exports = router;
