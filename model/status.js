const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 작업현황 스키마
const statusSchema = new Schema({
  img_url: Array,
});
module.exports = mongoose.model("Status", statusSchema, "status");
