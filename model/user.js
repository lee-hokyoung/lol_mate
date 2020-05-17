const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 회원 스키마
const userSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  user_pw: { type: String, required: true },
  admin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userSchema, "user");
