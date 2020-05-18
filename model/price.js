const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 가격 스키마
const priceSchema = new Schema({
  perGame: {
    iron: String,
    bronze: String,
    silver: String,
    gold: Array,
    platinum: Array,
    diamond: Array,
  },
  winGame: {
    iron: String,
    bronze: String,
    silver: String,
    gold: String,
    platinum: Array,
    diamond: String,
  },
  rankGame: {
    unranked: String,
    iron: String,
    bronze: String,
    silver: String,
    gold: String,
    platinum: String,
    diamond: String,
  },
  tutorGame: {
    IBS: String,
    platinum: String,
    diamond: String,
    unrankToGold: String,
    unrankToPlat: String,
    unrankToDia: String,
  },
});
module.exports = mongoose.model("Price", priceSchema, "price");
