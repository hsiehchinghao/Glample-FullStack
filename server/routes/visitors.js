const router = require("express").Router();
const Post = require("../models").post;
const Instructor = require("../models").instructor;
const Product = require("../models").product;

router.use((req, res, next) => {
  console.log("正在接收與post content相關的請求");
  next();
});

//載入全類別最新的文章 (for Banner)
router.get("/loadPost/sortByLatest", async (req, res) => {
  try {
    let result = await Post.findTopLastest();
    return res.status(200).send({
      msg: "取得最新文章",
      result,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入最新文章失敗", e });
  }
});

//載入全類別最多likes文章
router.get("/loadPost/sortByTopLikes", async (req, res) => {
  try {
    let result = await Post.findTopLikes();
    // console.log(result);
    return res.status(200).send({
      msg: "成功載入最熱門文章10篇",
      result,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入熱門文章失敗", e });
  }
});

//載入最新product
router.get("/loadLatestProduct", async (req, res) => {
  try {
    let result = await Product.findLatestProducts();
    // console.log(result);
    return res.status(200).send({ msg: "success", result });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ msg: "失敗", e });
  }
});

//根據product id 載入文章
router.get("/loadProductById/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    let result = await Product.findOne({ _id });
    console.log(result);
    return res.status(200).send({ msg: "success", result });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ msg: "失敗嗚嗚", e });
  }
});

//根據每篇文章id載入內容
router.get("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let findPost = await Post.findOne({ _id });
    // console.log(findPost);
    if (findPost) {
      return res.status(200).send({
        msg: "取得文章內容",
        findPost,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ msg: "失敗" });
  }
});

//載入各類別文章
router.get("/loadPost/sort/:category", async (req, res) => {
  try {
    let { category } = req.params;
    let result = await Post.findPostByCategory(category);
    console.log(result);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入announce文章失敗", e });
  }
});

//載入各類別的 top likes
router.get("/loadPost/sortByLatest/:category", async (req, res) => {
  try {
    let { category } = req.params;
    let result = await Post.loadByCategoryAndSortByTopLikes(category);
    console.log(result);
    return res
      .status(200)
      .send({ msg: "成功依照類別載入top likes的文章" }, result);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入失敗", e });
  }
});

//載入各類別的 top latest
router.get("/loadPost/sortByTopLikes/:category", async (req, res) => {
  try {
    let { category } = req.params;
    let result = await Post.loadByCategoryAndSortByTopLikes(category);
    console.log(result);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入文章失敗", e });
  }
});

//search Post by title / editor 未完成
router.get("/loadPost/searchPost", async (req, res) => {
  try {
    console.log(req.query);
    if (req.query) {
      let { search } = req.query;
      console.log(search);
      let findResultByTitle = await Post.find({ $text: { $search: search } });
      let findResultByEditor = await Instructor.find({
        $text: { $search: search },
      });
      console.log(findResultByEditor, findResultByTitle);
      return res
        .status(200)
        .send({ msg: "成功搜尋文章", findResultByEditor, findResultByEditor });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入搜尋文章失敗", e });
  }
});

module.exports = router;
