const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const Post = require("./post");

const userSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 50 },
  email: { type: String, required: true, minLength: 8, maxLength: 50 },
  password: { type: String, minLength: 5, maxLength: 20 },
  role: { type: String, default: "user" },
  date: { type: Date, default: Date.now },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  fromGoogle: { type: Boolean, default: false },
  order: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

//設定比較密碼，設定執行完bcrypt.compare後，執行cb()
userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    //password: 一般參數/this.password: 指向呼叫的密碼
    result = await bcrypt.compare(password, this.password); //獲得boolean
    return cb(null, result); //回傳：執行callback function 並帶入兩個參數
  } catch (e) {
    return cb(e, result); //回傳：執行callback function 並帶入兩個參數
  }
};
//設定中介軟體，密碼hash值:先確認 是否來自google
userSchema.pre("save", async function (next) {
  try {
    if (!this.fromGoogle) {
      if (this.isNew || this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
      }
      next();
    } else {
      this.fromGoogle = true;
      next();
    }
  } catch (e) {
    console.log(e);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
