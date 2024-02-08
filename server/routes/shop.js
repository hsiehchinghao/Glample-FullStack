const router = require("express").Router();
const upload = require("../config/multer");
const User = require("../models/user");
const Instructor = require("../models").instructor;
const Post = require("../models").post;
const Product = require("../models").product;
const Order = require("../models").order;
const API_URL = "http://localhost:8081";
const NewebPay = require("../config/newebPay");
const RespondType = "JSON";
const axios = require("axios");
const {
  MerchantID,
  HASHKEY,
  HASHIV,
  Version,
  PayGateWay,
  NotifyUrl,
  ReturnUrl,
} = process.env;

router.post("/createOrder", async (req, res) => {
  //_id, account, email, realName, phone, orderList, price
  const data = req.body;
  console.log(data);
  // 使用 Unix Timestamp 作為訂單編號（金流也需要加入時間戳記）
  const TimeStamp = Math.round(new Date().getTime() / 1000);
  const order = {
    ...data,
    TimeStamp,
    MerchantOrderNo: TimeStamp,
  };
  // 進行訂單加密
  // 加密第一段字串，此段主要是提供交易內容給予藍新金流
  const aesEncrypt = NewebPay.createSesEncrypt(order);
  console.log("aesEncrypt:", aesEncrypt);

  // 使用 HASH 再次 SHA 加密字串，作為驗證使用
  const shaEncrypt = NewebPay.createShaEncrypt(aesEncrypt);
  console.log("shaEncrypt:", shaEncrypt);
  order.aesEncrypt = aesEncrypt;
  order.shaEncrypt = shaEncrypt;

  let newOrder = await new Order({
    MerchantOrderNo: TimeStamp,
    Amt: order.Amt,
    ItemDesc: order.ItemDesc,
    TimeStamp: TimeStamp,
    Email: order.Email,
    TradeSha: shaEncrypt,
    TradeInfo: aesEncrypt,
    buyerId: order._id,
    buyerAccount: order.account,
    buyerlName: order.realName,
    buyerPhone: order.phone,
    orderList: order.orderList,
  }).save();
  // console.log(newData);
  return res.send(newOrder);
  res.redirect(`${API_URL}/api/shop/check/${newOrder._id}`);
});

router.get("/check/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const order = await Order.findOne({ _id });
  return res.send({
    msg: "成功",
    order,
    PayGateWay,
    Version,
    MerchantID,
    NotifyUrl,
    ReturnUrl,
  });
});

// router.post("/newebpay_return", (req, res) => {
//   console.log(req.body);
//   return res.send("success");
// });

module.exports = router;
