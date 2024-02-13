const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const Post = require("./post");

const instructorSchema = new Schema({
  username: { type: String, minLength: 3, reqiured: true },
  email: { type: String, minLength: 5, required: true },
  password: { type: String, minLength: 5, maxLength: 20 },
  date: { type: Date, default: Date.now },
  post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  like: [{ type: mongoose.Schema.Types.ObjectId }],
  authenticateCode: { type: String, required: true },
  role: { type: String, default: "instructor" },
  orderNo: [{ type: String }],
});

instructorSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    cb(null, result);
  } catch (e) {
    console.log(e);
    cb(e, result);
  }
};

instructorSchema.pre("save", async function (next) {
  if (this.authenticateCode == process.env.INSTRUCTOR_AUTHENTICATE_CODE) {
    if (this.isNew || this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
      next();
    }
  } else {
    const error = new Error(
      "Authentication failed. Unable to save the instructor."
    );
    next(error);
  }
});

instructorSchema.pre("remove", async function (next) {
  next();
});

const Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = Instructor;
