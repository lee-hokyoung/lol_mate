const express = require("express");
const Anonymous = require("../model/anonymous");
const router = express.Router();

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      let token = req.cookies.ckCsrfToken;
      let isExist = fs.existsSync("./temps/" + token);
      if (!isExist) {
        fs.mkdirSync("./temps/" + token);
      }
      cb(null, "./temps/" + token);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});
router.post("/anonymous", upload.single("upload"), (req, res) => {
  let file = req.file;
  res.json({ uploaded: 1, filename: file.originalname, url: path.join("/", file.path) });
});

module.exports = router;
