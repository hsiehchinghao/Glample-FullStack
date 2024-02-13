//單純寫一個驗證function
const passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const Instructor = require("../models/instructor");
const User = require("../models/user");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PASSPORT_SECERET;
// opts.passReqToCallback = true;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // console.log(jwt_payload); //內容為_id/ email / iat時間戳記 : jwt.sign()的內容
      let foundUser = await Instructor.findOne({
        _id: jwt_payload._id,
      }).exec();
      if (!foundUser) {
        foundUser = await User.findOne({
          _id: jwt_payload._id,
        });
      }
      if (foundUser) {
        done(null, foundUser); //req.user => foundUser
      } else {
        done(null, false);
      }
    } catch (e) {
      console.log(e);
      done(e, false);
    }
  })
);
