const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  MerchantOrderNo: { type: String },
  Amt: { type: Number, required: true },
  ItemDesc: { type: String },
  TimeStamp: { type: String },
  Email: { type: String },
  TradeSha: { type: String },
  TradeInfo: { type: String },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyerAccount: { type: String, required: true },
  buyerlName: { type: String, required: true },
  buyerPhone: { type: Number, required: true },
  orderList: { type: Array, required: true },
  isPay: { type: Boolean, dafault: false },
});

// MerchantID_: confirmOrder.MerchantID,
// PostData_: confirmOrder.order.shaEncrypt,

// RespondType:"JSON",
// TimeStamp:,
// Version,
// MerOrderNo,
// ProdDesc,
// PeriodAmt,
// PeriodType,
// PeriodPoint,
// PeriodStartType,
// PeriodTimes,
// PayerEmail

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
