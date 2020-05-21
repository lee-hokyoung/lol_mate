const express = require("express");
const router = express.Router();
const passport = require("passport");
const middle = require("./middlewares");
const User = require("../model/user");

router.get("/login", middle.isNotLoggedIn, (req, res) => {
  res.render("login");
});
router.post("/login", middle.isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, obj, info) => {
    let user = obj.user;
    if (info) {
      return res.send(
        '<script>alert("' + info.message + '"); location.href = "/auth/login";</script>'
      );
    }
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect("/auth/login");
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      if (user.status !== 1) {
        req.logout();
        // req.session.destroy();
        return res.send(
          '<script>alert("로그인 권한이 없는 ID 입니다."); location.href = "/auth/login";</script>'
        );
      }
      let agent = req.headers["user-agent"];
      let ua = userAgent.parse(agent);
      let browser = ua.browser;
      let ip_address = requestIp.getClientIp(req);
      let user_id = req.session.passport.user;
      /*
       *   중복 로그인 체크 알고리즘
       *   1. 로그인 한 유저 정보 중 최근에 접속한 정보(login_info) 를 읽어온다.
       *   2. 중복 로그인 체크
       *     1) 세션 정보 확인
       *       1-1) 세션 정보가 같을 경우 -> 중복 로그인 아님
       *       1-2) 세션 정보가 다를 경우 -> 중복 로그인 체크 -> 2) 으로 넘어감.
       *       1-3) 세션 정보가 없을 경우 -> 신규 로그인 혹은 다른 브라우저에서 로그아웃 된 상태임.
       *     2) ip 와 browser 가 같을 경우 -> 중복 로그인 아님
       *     3) ip 는 같은데 browser 가 다르면 중복 로그인.
       *     4) ip 가 다르면 중복 로그인.
       */
      // 관리자의 경우 중복체크 하지 않음.
      let isDuplicated = false;
      let doc = await userModel.findOne(
        { user_id: user_id },
        { login_info: 1, lv: 1, sessionID: 1 }
      );
      if (doc.lv !== 9) {
        let login_info = doc.login_info;
        console.log("login info : ", login_info);
        console.log("has : ", login_info.hasOwnProperty("ip"));
        if (login_info.hasOwnProperty("ip")) {
          // 세션 정보 확인
          if (doc.sessionID !== "") {
            // 세션 정보가 있을 경우에만 IP, 브라우저를 통한 중복 로그인 확인
            if (login_info.sessionID !== req.session.id) {
              if (login_info.ip !== ip_address) {
                // console.log('ip 정보가 다름');
                isDuplicated = true;
              } else if (login_info.ip === ip_address && login_info.browser !== browser) {
                // console.log('브라우저 정보가 다름');
                isDuplicated = true;
              }
            }
          }
        }
      }
      console.log("duplicated : ", isDuplicated);
      // 중복 로그인인 경우, 중복로그인 확인 메세지 창 띄우기
      if (isDuplicated) {
        res.redirect("/session/confirm");
      } else {
        // 기존 로그인 정보를 최신 로그인 정보로 업데이트
        await userModel.updateOne(
          { user_id: user_id },
          {
            $set: {
              login_info: { ip: ip_address, browser: browser },
              sessionID: req.session.id,
            },
          }
        );
        res.redirect("/");
      }
    });
  })(req, res, next);
});
router.get("/logout", async (req, res, next) => {
  await sessionModel.deleteOne({ _id: req.session.id });
  await userModel.updateOne({ sessionID: req.session.id }, { $set: { sessionID: "" } });
  req.logout();
  // req.session.destroy();
  res.render("login");
});
module.exports = router;
