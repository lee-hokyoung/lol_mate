const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// FAQ 스키마
const anonySchema = new Schema({
  title: String,
  writer: String,
  email: String,
  content: String,
  password: String,
  hitCount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Anonymous", anonySchema, "anonymous");
