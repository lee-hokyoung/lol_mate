exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.session.passport.user.admin) {
      next();
    } else {
      res.send('<script>alert("권한이 없습니다."); location.href = "/admin/login";</script>');
    }
  } else {
    res.redirect("/admin/login");
  }
};
