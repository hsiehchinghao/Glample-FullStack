const mongoose = require("mongoose");
const { Schema } = mongoose;

let commentSchema = new Schema({
  content: { type: String, require: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorname: { type: String },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  date: { type: Date, default: Date.now },
  like: { type: Number, default: 0 },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
