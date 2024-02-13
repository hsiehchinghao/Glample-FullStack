const crypto = require("crypto");
const RespondType = "JSON";
const {
  MerchantID,
  HASHKEY,
  HASHIV,
  Version,
  PayGateWay,
  NotifyUrl,
  ReturnUrl,
} = process.env;

// 字串組合
function genDataChain(order) {
  return `MerchantID=${MerchantID}&TimeStamp=${
    order.TimeStamp
  }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${
    order.MerchantOrderNo
  }&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(
    NotifyUrl
  )}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(
    order.ItemDesc
  )}&Email=${encodeURIComponent(order.Email)}`;
}

// 字串組合
class NewebPay {
  // 對應文件 P17：使用 aes 加密
  // $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
  createSesEncrypt(TradeInfo) {
    const encrypt = crypto.createCipheriv("aes-256-cbc", HASHKEY, HASHIV);
    const enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
    return enc + encrypt.final("hex");
  }

  // 對應文件 P18：使用 sha256 加密
  // $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
  createShaEncrypt(aesEncrypt) {
    const sha = crypto.createHash("sha256");
    const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;
    return sha.update(plainText).digest("hex").toUpperCase();
  }

  // 對應文件 21, 22 頁：將 aes 解密
  createSesDecrypt(TradeInfo) {
    const decrypt = crypto.createDecipheriv("aes256", HASHKEY, HASHIV);
    decrypt.setAutoPadding(false);
    const text = decrypt.update(TradeInfo, "hex", "utf8");
    const plainText = text + decrypt.final("utf8");
    const result = plainText.replace(/[\x00-\x20]+/g, "");
    return JSON.parse(result);
  }
}

module.exports = new NewebPay();
