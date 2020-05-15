const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const connect = require("./model");
connect();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const reviewRouter = require("./routes/review");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public/assets"), { maxAge: "30d" }));
app.use("/images", express.static(path.join(__dirname, "public/images"), { maxAge: "30d" }));
app.use("/nm", express.static(path.join(__dirname, "node_modules"), { maxAge: "30d" }));
app.use("/public_js", express.static(path.join(__dirname, "public/javascripts"), { maxAge: "0" }));
app.use("/public_css", express.static(path.join(__dirname, "public/stylesheets"), { maxAge: "0" }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/review", reviewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// robots 검색 엔진 기능 추가
// app.use("/robots.txt", function(req, res) {
//   res.type("text/plain");
//   res.send("User-agent: *\n Allow: /");
// });

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
