const router = require("express").Router();
const upload = require("../config/multer");
const passport = require("passport");
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

//提交訂單
router.post(
  "/createOrder",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const data = req.body;
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
      // console.log("aesEncrypt:", aesEncrypt);

      // 使用 HASH 再次 SHA 加密字串，作為驗證使用
      const shaEncrypt = NewebPay.createShaEncrypt(aesEncrypt);
      // console.log("shaEncrypt:", shaEncrypt);
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
        buyerName: order.realName,
        buyerPhone: order.phone,
        orderList: order.orderList,
        isPay: false,
      }).save();

      //判斷使用者id身份
      let user =
        (await User.findOne({ _id: order._id })) ||
        (await Instructor.findOne({ _id: order._id }));
      if (user.role == "user") {
        let updateOrderToUser = await User.updateOne(
          { _id: user._id },
          { $push: { orderNo: TimeStamp } },
          { new: true }
        );
        console.log("update:" + updateOrderToUser);
      } else {
        let updateOrderToUser = await Instructor.updateOne(
          { _id: user._id },
          { $push: { orderNo: TimeStamp } },
          { new: true }
        );
        console.log("update:" + updateOrderToUser);
      }

      return res.redirect(`${API_URL}/api/shop/check/${newOrder._id}`);
    } catch (e) {
      console.log(e);
      return res.status(400).send({ msg: "失敗", e });
    }
  }
);
//訂單加密後跳轉
router.get("/check/:_id", async (req, res, next) => {
  const { _id } = req.params;
  const order = await Order.findOne({ _id });
  return res.status(200).send({
    msg: "成功",
    order,
    PayGateWay,
    Version,
    MerchantID,
    NotifyUrl,
    ReturnUrl,
  });
});

//藍新跳轉頁面/profile
router.post("/newebpay_return", async (req, res) => {
  return res.redirect("http://localhost:3000/profile/");
});

//藍新處理通知
router.post("/newebpay_notify", async (req, res) => {
  const response = req.body;
  console.log("notify");
  // 解密交易內容
  const data = NewebPay.createSesDecrypt(response.TradeInfo);
  // console.log("data:", data);

  let confirmOrder = await Order.findOneAndUpdate(
    { MerchantOrderNo: data.Result.MerchantOrderNo },
    { $set: { isPay: true } },
    { new: true }
  );
  console.log("confirmOrder : " + confirmOrder);
  return res.status(200).send(confirmOrder);
});

//依照id載入最新訂單
router.get(
  "/loadLatestOrder/:_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { _id } = req.params;
      let orderNo = req.query.orderNo;

      let user =
        (await User.findOne({ _id })) || (await Instructor.findOne({ _id }));
      console.log("user : " + user);

      // 使用者id中 isPay為true的訂單
      let result = await Order.loadLatestOrder(_id);
      //將訂單編號存入
      const paidOrder = [];
      result.map((data) => {
        return paidOrder.push(data.MerchantOrderNo);
      });
      console.log("paidOrder :" + paidOrder);
      //確認訂單是否 跟當前localStorage 內的訂單相同
      //if(true)則代表已經通過付款 else 則尚未付款完成、付款失敗，則localStorage內資料保留
      let orderFound = paidOrder.some((order) => {
        return order == orderNo;
      });

      return res.status(200).send({ msg: "成功", result, orderFound });
    } catch (e) {
      console.log(e);
      res.status(400).send({ msg: "失敗" }, e);
    }
  }
);

module.exports = router;
