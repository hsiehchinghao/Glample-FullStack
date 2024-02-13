const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models").user;

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://glample-mern-9b575194526d.herokuapp.com/api/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile);
        // console.log(profile.displayName);
        // console.log(profile.emails[0].value);
        console.log("進入google 策略");
        let email = profile.emails[0].value;
        let username = profile.displayName;
        //確認用戶是否存在
        let findUser = await User.findOne({ email: email });
        if (findUser) {
          // console.log(findUser);
          return done(null, findUser);
        } else {
          let newUser = await new User({
            username: username,
            email: email,
            fromGoogle: true,
          });
          let saveUser = await newUser.save();
          // console.log(saveUser);
          return done(null, saveUser);
        }
      } catch (e) {
        console.log(e);
      }
    }
  )
);
