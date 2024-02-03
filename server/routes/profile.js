const router = require("express").Router();

router.use((req, res, next) => {
  console.log("進入profile route");
  next();
});

router.get("/", (req, res) => {});
