const CryptoJs = require("crypto-js");
const cloudinary = require("cloudinary").v2;
const cloudinaryConfiguration = require("./CloudinaryConfiguration");

const symmetricKey = "secret key 123";

exports.encrypt = function (text) {
  return CryptoJs.AES.encrypt(text, symmetricKey).toString();
};

exports.decrypt = function (text) {
  var bytes = CryptoJs.AES.decrypt(text, symmetricKey);
  return bytes.toString(CryptoJs.enc.Utf8);
};
