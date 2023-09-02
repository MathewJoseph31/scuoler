const pg = require("pg");

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

const whiteListedIps = ["73.209.26.15", "127.0.0.1", "150.136.243.153"];
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
        exports.setCorsHeaders(req, res);
        res.json(result);
      }
    );
  } else {
    cloudinary.uploader.upload(uploadFiles[0].path, function (err, result) {
      if (err) {
        next(err);
        //res.json({"updatestatus":"error"});
      }
      exports.setCorsHeaders(req, res);
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

exports.getConfiguration = function (account_id, configuration) {
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getConfigDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "select distinct A.server,  A.port, A.database, A.user_id, A.password " +
    " from account_connection A " +
    " where A.deleted=false and A.account_id=$1 ";

  return new Promise((resolve, reject) => {
    pool.query(sql, [account_id], (err, result, fields) => {
      pool.end(() => {});

      let configurationClone = null;
      if (err) resolve(configurationClone); //reject(err);
      else {
        if (result && result.rows && result.rows.length > 0) {
          configurationClone = { ...configuration };
          configurationClone.host = result.rows[0].server;
          configurationClone.port = result.rows[0].port;
          configurationClone.database = result.rows[0].database;
          configurationClone.userId = result.rows[0].user_id;
          configurationClone.password = result.rows[0].password;
        }
        resolve(configurationClone);
      }
    });
  });
};
