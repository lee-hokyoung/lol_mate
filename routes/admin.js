const express = require("express");
const router = express.Router();
const middle = require("../routes/middleware");
const Anonymous = require("../model/anonymous");

const fs = require("fs");
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
    console.log("admin req : ", req.isAuthenticated());
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

//  게시판 조회
router.get(["/", "/review"], middle.isAdmin, async (req, res) => {
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
  res.render("admin_review", {
    title: "동종업계 최강 롤메이트 - 후기게시판",
    list: list,
    isAdmin: true,
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
    console.log("doc : ", doc);
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
      console.log("urls : ", urls);
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
module.exports = router;
