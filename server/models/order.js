const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../models/user");
const Instructor = require("../models/instructor");

const orderSchema = new Schema({
  MerchantOrderNo: { type: String, required: true },
  Amt: { type: Number, required: true },
  ItemDesc: { type: String },
  TimeStamp: { type: String },
  Email: { type: String },
  TradeSha: { type: String },
  TradeInfo: { type: String },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyerAccount: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: Number, required: true },
  orderList: { type: Array, required: true },
  isPay: { type: Boolean, dafault: false },
  date: { type: Date, default: Date.now },
});

//依照id找尋isPay為true的order並照先後順序
orderSchema.statics.loadLatestOrder = async function (_id) {
  try {
    let user =
      (await User.findOne({ _id })) || (await Instructor.findOne({ _id }));
    if (!user) {
      console.log("數據錯誤");
      return [];
    } else {
      return await this.find({
        MerchantOrderNo: { $in: user.orderNo },
        isPay: true,
      }).sort({
        date: -1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
