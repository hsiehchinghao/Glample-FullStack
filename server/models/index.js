//製作index.js連線到各個model
module.exports = {
  instructor: require("./instructor"),
  user: require("./user"),
  post: require("./post"),
  comment: require("./comment"),
};
