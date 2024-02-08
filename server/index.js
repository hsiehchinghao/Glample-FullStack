//基本設定
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const upload = require("./config/multer");
const passport = require("passport");
const authRoute = require("./routes").auth; //指定資料夾：自動指向資料夾內的index檔案
const postRoute = require("./routes").post;
const shopRoute = require("./routes").shop;
const accountSettingRoute = require("./routes/index").accountSetting;
const visitorsRoute = require("./routes").visitors;
const path = require("path");

mongoose
  .connect(
    // "mongodb://localhost:27017/GlampleDB"
    process.env.MONGODB_CONNECTION
  )
  .then(() => {
    console.log("connected to GlampleDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//本機測試使用cors
app.use(cors());

app.use(passport.initialize());
//import jwt / google strategy
require("./config/passport-jwt");
require("./config/passprt-google"); //object

//帳號註冊登入相關
app.use("/api/auth", authRoute);

//管理帳號功能
app.use(
  "/api/accountSetting",
  passport.authenticate("jwt", {
    session: false,
  }),
  accountSettingRoute
);

//需要jwt驗證相關post route
//passport.authenticate()=> 會去找passport strategy
app.use(
  "/api/post",
  passport.authenticate("jwt", {
    session: false,
  }),
  postRoute
);

//購物
app.use(
  "/api/shop",
  passport.authenticate("jwt", { session: false }),
  shopRoute
);

//一般遊客 不需jwt相關驗證
app.use("/api/visitors", visitorsRoute);

app.listen(8081, () => {
  console.log("server on 8081");
});
