const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// FAQ 스키마
const anonySchema = new Schema({
  title: String,
  writer: String,
  content: String,
  pw: String,
  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Anonymous", anonySchema, "anonymous");
