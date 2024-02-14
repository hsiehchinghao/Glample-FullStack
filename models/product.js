const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  title: { type: String, required: true },
  image: {
    type: String,
    minLength: 5,
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  orderCount: { type: Number, default: 0 },
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  response: { type: String },
});

productSchema.statics.findLatestProducts = async function () {
  try {
    return await this.find({}).sort({ date: -1 });
  } catch (e) {
    console.log(e);
    return e;
  }
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
