const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  buyer: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, required: true },
  isPay: { type: Boolean, dafault: false },
  date: { type: Date, default: Date.now },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
