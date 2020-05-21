const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
require("dotenv").config();

const passport = require("passport");
const passportConfig = require("./passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const reviewRouter = require("./routes/review");
const uploadRouter = require("./routes/upload");
const adminRouter = require("./routes/admin");

const app = express();
passportConfig(passport);
const connect = require("./model");
connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public/assets"), { maxAge: "30d" }));
app.use("/images", express.static(path.join(__dirname, "public/images"), { maxAge: "30d" }));
app.use("/nm", express.static(path.join(__dirname, "node_modules"), { maxAge: "30d" }));
app.use("/media", express.static(path.join(__dirname, "media"), { maxAge: "30d" }));
app.use("/status_imgs", express.static(path.join(__dirname, "status_imgs"), { maxAge: "30d" }));
app.use("/public_js", express.static(path.join(__dirname, "public/javascripts"), { maxAge: "0" }));
app.use("/public_css", express.static(path.join(__dirname, "public/stylesheets"), { maxAge: "0" }));
app.use("/temps", express.static(path.join(__dirname, "temps")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "skfmgheh",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/review", reviewRouter);
app.use("/upload", uploadRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
