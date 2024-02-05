//更加靈活的身份驗證，且以更容易讓使用者理解的訊息回應。
const Joi = require("joi");

//設定註冊驗證規則：後台使用者
const instructorRegisterValidation = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(5).max(50).email().required(),
  password: Joi.string().min(5).max(20).required(),
  authenticateCode: Joi.string().optional().allow(null),
});
//一般使用者本地註冊
const userRegisterValidation = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(5).max(50).email().required(),
  password: Joi.string().min(5).max(20).required(),
  authenticateCode: Joi.string().optional().allow(null).allow(""),
});
//設定登入規則:本地登入才需要
const loginValidation = Joi.object({
  email: Joi.string().min(5).max(50).email().required(),
  password: Joi.string().max(20).min(5).required(),
});
//設定po文規則
const postValidation = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(3).required(),
  category: Joi.string()
    .valid("ANNOUNCEMENT", "FASHION", "MUSIC", "MOVIE")
    .required(),
  authorname: Joi.string(),
  instructor_id: Joi.string(),
  comment: Joi.allow(null),
});
//設定留言規則
const commentValidation = Joi.object({
  content: Joi.string().min(3).required(),
});

//設定新增商品規則
const productValidation = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  description: Joi.string().required(),
});

module.exports = {
  instructorRegisterValidation,
  userRegisterValidation,
  loginValidation,
  postValidation,
  commentValidation,
  productValidation,
};
