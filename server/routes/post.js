const router = require("express").Router();
const upload = require("../config/multer");
const User = require("../models/user");
const Instructor = require("../models").instructor;
const Post = require("../models").post;
const Product = require("../models").product;
const Order = require("../models").order;
const postValidation = require("../validation").postValidation;
const productValidation = require("../validation").productValidation;
const orderValidation = require("../validation").orderValidation;
const API_URL = "http://localhost:8081";

//按照instrctor id取得文章資料(populate: title / date / image)
router.get("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let userdata = await Instructor.findOne({ _id }).populate({
      path: "post",
      select: "title date image",
    });
    let post_id = userdata.post.reverse(); //array

    return res.status(200).send({
      msg: "獲得回傳資料",
      post_id,
    });
  } catch (e) {
    console.log(e);
  }
});

//根據使用者id載入like的文章
router.get("/loadLikePost/:_id", async (req, res) => {
  let { _id } = req.params;
  let currentUser =
    (await User.findOne({ _id })) || (await Instructor.findOne({ _id }));
  if (currentUser) {
    //使用者like陣列裡面連接到文章id
    let allLikePostsId = currentUser.like;
    let likePostData = [];
    //map 因為內部是callback一定會排至第二輪 改用for回圈等待async/await
    for (data of allLikePostsId) {
      let perPost = await Post.findOne({ _id: data });
      likePostData.push(perPost);
    }
    // console.log(likePostData);//確定有將資料push進返回陣列
    return res
      .status(200)
      .send({ msg: "成功載入使用這like文章", likePost: likePostData });
  }
});

//新增文章包含上傳封面圖片到public/images
router.post("/addPost", upload.single("file"), async (req, res) => {
  let { title, category, content } = req.body;
  let authorname = req.user.username;
  let instructor_id = req.user._id;
  let imagePath = req.file ? API_URL + `images/${req.file.filename}` : null;

  let { error } = postValidation.validate(req.body);
  if (error) {
    let message = error.details[0].message;
    return res.status(404).send(message);
  }
  console.log(req.file);
  if (req.user.role != "instructor") {
    return res.status(401).send("無權限進入");
  }
  try {
    let newPost = await new Post({
      title: title,
      content: content,
      authorname: authorname,
      category: category,
      instructor_id: instructor_id,
      image: imagePath,
    }).save();
    await Instructor.findByIdAndUpdate(instructor_id, {
      $push: { post: newPost._id },
    });
    return res.status(200).send({
      msg: "成功新增",
      newPost,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send("新增文章失敗");
  }
});

//編輯文章 post (載入原文_id的)
router.patch("/editPost/:_id", upload.single("file"), async (req, res) => {
  try {
    let { _id } = req.params;
    console.log(req.body);
    console.log(req.file);
    if (req.file) {
      let imgPath = API_URL + `images/${req.file.filename}`;
      let updatePost = await Post.findOneAndUpdate(
        { _id },
        {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: imgPath,
          date: Date.now(),
        },
        { new: true }
      );
      return res.status(200).send({ msg: "成功", updatePost });
    } else {
      let updatePost = await Post.findOneAndUpdate(
        { _id },
        {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          date: Date.now(),
        },
        { new: true }
      );
      return res.status(200).send({ msg: "成功", updatePost });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "失敗", error: e });
  }
});

//刪除文章 post(原文_id) 同步刪除使用者或編輯的post/like
router.delete("/deletePost/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let deletePost = await Post.deleteOne({ _id });
    let pullPostFromInstructor = await Instructor.updateMany(
      { $or: [{ like: _id }, { post: _id }] },
      { $pull: { post: _id, like: _id } }
    );
    let pullPostFromUser = await User.updateMany(
      { like: _id },
      { $pull: { like: _id } }
    );
    return res.status(200).send({
      msg: "成功刪除",
      deletePost,
      pullPostFromInstructor,
      pullPostFromUser,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "失敗", error: e });
  }
});

//收藏文章 post 修改user.like[]/post.like[]
router.patch("/likePost/:_id", async (req, res) => {
  try {
    // console.log(req.body); //確認有內容
    let user_id = req.params._id;
    let post_id = req.body.postId;
    // console.log(post_id);
    let post = await Post.findOne({ _id: post_id });

    let user =
      (await User.findOne({ _id: user_id })) ||
      (await Instructor.findOne({ _id: user_id }));
    if (post.like.includes(user._id)) {
      console.log("already liked");
      if (user.role == "user") {
        await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { like: post._id } },
          { new: true }
        );
      } else {
        await Instructor.findOneAndUpdate(
          { _id: user._id },
          { $pull: { like: post._id } },
          { new: true }
        );
      }
      await Post.findByIdAndUpdate(post._id, {
        $pull: { like: user._id },
        $inc: { likeCount: -1 },
      });
      return res.status(200).send({ msg: "取消按讚" });
    } else {
      if (user.role == "user") {
        await User.findOneAndUpdate(
          { _id: user._id },
          { $push: { like: post._id } },
          { new: true }
        );
      } else {
        await Instructor.findOneAndUpdate(
          { _id: user._id },
          { $push: { like: post._id } },
          { new: true }
        );
      }

      await Post.findOneAndUpdate(
        { _id: post._id },
        { $push: { like: user._id }, $inc: { likeCount: 1 } },
        { new: true }
      );
      // console.log(result, result2);
      return res.status(200).send({ msg: "成功按讚" });
    }
  } catch (e) {
    console.log(e);
  }
});

//新增留言 post (根據使用者id)
router.post("/addComment/:_id", async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "留言新增失敗", e });
  }
});

//留言按讚 post

//新增商品 (僅限 instructor)
router.post("/addProduct", upload.single("file"), async (req, res) => {
  try {
    console.log(req.body);
    let { error } = productValidation.validate(req.body);
    if (error) {
      let message = error.details[0].message;
      return res.status(404).send(message);
    }
    if (req.user.role != "instructor") {
      return res.status(400).send({ msg: "權限不足" });
    } else {
      let { title, price, stock, description } = req.body;
      let imagePath = req.file ? API_URL + `images/${req.file.filename}` : null;
      let result = await new Product({
        title,
        price,
        stock,
        description,
        image: imagePath,
      }).save();
      if (result) {
        console.log("nice");
        return res.status(200).send({ msg: "成功新增商品", result });
      } else {
        return res.status(400).send({ msg: "新增失敗" });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ msg: "新增商品失敗", e });
  }
});

router.post("", async (req, res) => {});

//修改商品
// router.patch();

//刪除商品
// router.delete();

//新增訂單 /建立order訂單/product stock調整/user order資料陣列 push
// router.post("/addOrder/:_id", async (req, res) => {
//   let { error } = productValidation.validate(req.body);
//   if (error) {
//     let message = error.details[0].message;
//     return res.status(404).send(message);
//   }

//   const { _id } = req.params;
//   const {} = req.body;
// });

module.exports = router;
