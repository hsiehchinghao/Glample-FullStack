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

//根據搜尋內容顯示文章
router.get("/search", async (req, res) => {
  try {
    console.log(req.query.search);
    let { search } = req.query;
    let findResultByTitle = await Post.find({
      $or: [
        { $text: { $search: search } }, // 通过文本索引搜索（假设你有一个包含标题的文本索引）
        { authorname: { $regex: search, $options: "i" } }, // 使用regex按作者名进行大小写不敏感的匹配搜索
      ],
    });
    let findProductResultByTitle = await Product.find({
      $text: { $search: search },
    });
    // console.log( findResultByTitle);
    if (findResultByTitle.length || findProductResultByTitle.length) {
      return res.status(200).send({
        msg: "搜尋成功",
        findResultByTitle,
        findProductResultByTitle,
      });
    } else {
      return res.status(200).send({ msg: "noResult" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "搜尋失敗", e });
  }
});

//載入各類別的 top likes
router.get("/loadPost/sortByTopLikes/:category", async (req, res) => {
  try {
    let { category } = req.params;
    console.log(category);
    let result = await Post.loadByCategoryAndSortByTopLikes(category);
    console.log(result);
    return res
      .status(200)
      .send({ msg: "成功依照類別載入top likes的文章", result });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入失敗", e });
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

//依類別的 top latest
router.get("/loadPost/sortByTopLatest/:category", async (req, res) => {
  try {
    let { category } = req.params;
    console.log(category);
    let result = await Post.loadByCategoryAndSortByTopLatest(category);
    console.log(result);
    return res.status(200).send({ msg: "成功載入分類最新", result });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ msg: "載入文章失敗", e });
  }
});

//依類別的 top pop
router.get("/loadPost/sortByTopPop/:category", async (req, res) => {
  try {
    let { category } = req.params;
    console.log(category);
    let result = await Post.loadByCategoryAndSortByTopLikes(category);
    // console.log(result);
    return res.status(200).send({ msg: "成功", result });
  } catch (e) {
    console.log(e);
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

module.exports = router;
