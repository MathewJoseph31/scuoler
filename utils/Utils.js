/*Cloudinary cloud image server initialization*/
const cloudinary = require("cloudinary").v2;
const cloudinaryConfiguration = require("../CloudinaryConfigurationAlt");

function pad(num) {
  num = num < 10 ? "0".concat(num) : "".concat(num);
  return num;
}

function getUniqueId(userId) {
  var v = new Date();
  var day = v.getDate();
  day = pad(day);

  var mon = v.getMonth();
  mon += 1;
  mon = pad(mon);

  var year = v.getFullYear();
  year = pad(year);

  var hour = v.getHours();
  hour = pad(hour);

  var minute = v.getMinutes();
  minute = pad(minute);

  var second = v.getSeconds();
  second = pad(second);

  //console.log(day+'month:'+mon+'year:'+year);
  var str = userId
    .concat(mon)
    .concat(day)
    .concat(year)
    .concat(hour)
    .concat(minute)
    .concat(second);

  return str;
}

exports.getUniqueId = getUniqueId;

const whiteListedIps = ["72.230.86.18", "127.0.0.1", "150.136.243.153"];

exports.setCorsHeaders = function (req, res) {
  whiteListedIps.forEach((val) => {
    if (req.ip.includes(val)) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", true);
      return;
    }
  });
};

exports.uploadFilesToCloudinary = function (req, res, next, dir_name) {
  cloudinary.config({
    cloud_name: cloudinaryConfiguration.getCloudName(),
    api_key: cloudinaryConfiguration.getApiKey(),
    api_secret: cloudinaryConfiguration.getApiSecret(),
  });
  uploadFiles = Object.values(req.files);

  if (dir_name) {
    cloudinary.uploader.upload(
      uploadFiles[0].path,
      { folder: dir_name },
      function (err, result) {
        if (err) {
          next(err);
          //res.json({"updatestatus":"error"});
        }
        setCorsHeaders(req, res);
        res.json(result);
      }
    );
  } else {
    cloudinary.uploader.upload(uploadFiles[0].path, function (err, result) {
      if (err) {
        next(err);
        //res.json({"updatestatus":"error"});
      }
      setCorsHeaders(req, res);
      res.json(result);
    });
  }
  /*  const promises = uploadFiles.map(uploadFile => cloudinary.uploader.upload(uploadFile.path));
    Promise
        .all(promises)
        .then(results => res.json(results))
        .catch((err) => res.status(400).json(err));*/
};

exports.delete_images = function (image_urls_for_delete) {
  cloudinary.config({
    cloud_name: cloudinaryConfiguration.getCloudName(),
    api_key: cloudinaryConfiguration.getApiKey(),
    api_secret: cloudinaryConfiguration.getApiSecret(),
  });

  const promises = Object.keys(image_urls_for_delete).map((key) => {
    cloudinary.uploader.destroy(image_urls_for_delete[key]);
  });

  promises.forEach(async (promise, i) => {
    await promise;
  });

  return "ok";
};
