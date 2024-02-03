//設定跟錄入相關的route
const router = require("express").Router();
//引入joi設定的 validation
const userRegisterValidation = require("../validation").userRegisterValidation;
const instructorRegisterValidation =
  require("../validation").instructorRegisterValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const Instructor = require("../models").instructor;
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.use((req, res, next) => {
  console.log("正在接收與auth相關的請求");
  next();
});

//本地註冊(user/instructor)
router.post("/register", async (req, res) => {
  console.log("註冊使用者中");
  let { username, email, password, authenticateCode } = req.body;
  console.log(req.body);

  let emailExistInUser = await User.findOne({ email });
  let emailExistInInstructor = await Instructor.findOne({ email });
  if (emailExistInUser || emailExistInInstructor) {
    return res.status(400).send({ msg: "email已經使用過" });
  }
  //確認username是否重複
  let usernameExistInUser = await User.findOne({ username });
  let usernameExistInInstructor = await Instructor.findOne({ username });
  if (usernameExistInUser || usernameExistInInstructor) {
    return res.status(400).send({ msg: "username已經使用過" });
  }

  //製作新資料到資料庫內
  //new User({}) => 新增資料
  //如果有key後台驗證碼但錯誤 => 報錯
  //如果沒key後台驗證碼 => 當做一般使用者
  //有填驗證碼
  if (authenticateCode != "") {
    if (authenticateCode == process.env.INSTRUCTOR_AUTHENTICATE_CODE) {
      //返回三個屬性：value / error / details (如果都成功只會返回value物件)
      //確認註冊是否符合規範
      let { error } = instructorRegisterValidation.validate(req.body);
      console.log(error);
      if (error) {
        let message = error.details[0].message;
        return res.status(404).send({ msg: message });
      }
      let newInstructor = await new Instructor({
        email,
        username,
        password,
        authenticateCode,
      }).save();
      return res
        .status(200)
        .send({ newInstructor: newInstructor, msg: "註冊成功" });
    } else {
      return res.status(400).send({ msg: "後台驗證碼錯誤" });
    }
  }
  // 沒填驗證碼
  if (!authenticateCode) {
    //返回三個屬性：value / error / details (如果都成功只會返回value物件)
    //確認註冊是否符合規範
    let { error } = userRegisterValidation.validate(req.body);
    console.log(error);
    if (error) {
      let message = error.details[0].message;
      return res.status(404).send({ msg: message });
    }
    let newUser = await new User({ email, username, password }).save();
    if (newUser) {
      return res.status(200).send({ newUser: newUser, msg: "註冊成功" });
    } else {
      return res.status(400).send({ msg: "註冊失敗" });
    }
  }
});

//本地登入(user/instructor)
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  console.log("進入登入route");
  //joi提供錯誤訊息
  let { error } = loginValidation.validate(req.body);
  if (error) {
    let message = error.details[0].message;
    return res.status(404).send(message);
  }

  const foundUser = await User.findOne({ email });
  const foundInstructor = await Instructor.findOne({ email });
  if (!foundUser && !foundInstructor) {
    return res.status(400).send("Please comfirm email again");
  }

  if (foundUser) {
    // console.log(foundUser);
    //核對password
    foundUser.comparePassword(password, (err, isMatch) => {
      //第二個參數為result
      if (err) {
        console.log(err);
        return res.status(500).send("Password wrong");
      }
      if (isMatch) {
        // 製作jwt
        const tokenObject = { _id: foundUser._id, email: foundUser.email };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECERET, {
          expiresIn: "7d",
        });
        // console.log("bearer " + token);
        return res.send({
          message: "成功登入",
          token: "bearer " + token,
          user: foundUser,
        });
      } else {
        return res.status(401).send("password  wrong");
      }
    });
  }

  if (foundInstructor) {
    // console.log(foundInstructor);
    foundInstructor.comparePassword(password, (err, isMatch) => {
      //第二個參數為result
      if (err) {
        console.log(err);
        return res.status(500).send("密碼錯誤");
      }
      if (isMatch) {
        // 製作jwt
        const tokenObject = {
          _id: foundInstructor._id,
          email: foundInstructor.email,
        };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECERET, {
          expiresIn: "7d",
        });

        return res.send({
          message: "成功登入",
          token: "bearer " + token,
          user: foundInstructor,
        });
      } else {
        return res.status(401).send("password  wrong");
      }
    });
  }
});

//google登入的route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);
//提供google redirect
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/",
    session: false,
  }),
  async (req, res) => {
    if (req.user) {
      console.log("google redirect progress");
      const tokenObject = { _id: req.user._id, email: req.user.email };
      let token = jwt.sign(tokenObject, process.env.PASSPORT_SECERET, {
        expiresIn: "7d",
      });
      token = "bearer " + token;
      console.log(req.user);
      console.log(token);
      res.cookie("user", JSON.stringify(req.user)); //cookie存文字
      res.cookie("token", JSON.stringify(token));
      return res.status(200).redirect("http://localhost:3000/profile");
    } else {
      return res.status(400).send("try again....");
    }
  }
);

//忘記密碼

module.exports = router;
