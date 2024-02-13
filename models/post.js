const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");
const Instructor = require("./instructor");

const postSchema = new Schema({
  title: { type: String, required: true, minLength: 3 },
  content: { type: String, required: true, minLength: 3 },
  image: {
    type: String,
    minLength: 5,
  },
  imgOrientation: {
    type: String,
    enum: ["portrait", "landscape", "square"],
    default: "square",
  },
  date: { type: Date, default: Date.now },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
  },
  authorname: { type: String, index: true },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  category: {
    type: String,
    enum: ["FASHION", "MUSIC", "MOVIE", "ANNOUNCEMENT"],
    required: true,
  },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: ["User", "Instructor"] }],
  likeCount: { type: Number, default: 0 },
});

//添加靜態方法

//找全類別like(高到低)
postSchema.statics.findTopLikes = async function (page, limit) {
  try {
    console.log("do the statics method");
    return await this.find()
      .sort({ likeCount: -1 })
      .select("_id title image date like category authorname likeCount");
  } catch (e) {
    console.log(e);
  }
};

//找全類別latest前5 (for banner)
postSchema.statics.findTopLastest = async function () {
  try {
    console.log("do the statics methods");
    return await this.find()
      .sort({ date: -1 })
      .select("_id title image date like category authorname likeCount");
  } catch (e) {
    console.log(e);
  }
};

//載入特定category文章
postSchema.statics.findPostByCategory = async function (category, page, limit) {
  try {
    return await this.find({ category })
      .sort({ date: -1 })
      .select("_id title image date like category authorname likeCount");
  } catch (e) {
    console.log(e);
  }
};

//載入特定category 依照latest分類
postSchema.statics.loadByCategoryAndSortByTopLatest = async function (
  category,
  page,
  limit
) {
  try {
    return await this.find({ category })
      .sort({ date: -1 })
      .select("_id title image date like category authorname likeCount");
  } catch (e) {
    console.log(e);
    return e;
  }
};

//載入特定category 依照TopLikes分類
postSchema.statics.loadByCategoryAndSortByTopLikes = async function (
  category,
  page,
  limit
) {
  try {
    return await this.find({ category })
      .sort({ likeCount: -1 })
      .select("_id title image date like category authorname likeCount");
  } catch (e) {
    console.log(e);
    return e;
  }
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
