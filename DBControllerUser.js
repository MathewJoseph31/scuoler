/* This file primarily contains code for interfacing with the Database (insert and retreival functions)
 */
//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const fs = require("fs");

//end of session code

const url = require("url");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const configuration = require("./Configuration");

const utils = require("./utils/Utils");

let { setCorsHeaders } = utils;

const util = require("./util");

const constants = require("./Constants");

//--USER/Costumer---

/* function for handling  http authentication requests
to the portal, the credentials are store in Customer table */
exports.encryptPass = function (req, res, next) {
  let text = req.body.userId;
  let result = util.encrypt(text);
  result = result.slice(0, 10);

  setCorsHeaders(req, res);
  // console.log("result_encrypt: ", result);
  res.json(result);
};

/*Api Json version of verify user*/
exports.verifyUserJson = function (req, res, next) {
  let userId = req.body.userId;
  let password = req.body.password;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "SELECT  count(*) as count, max(case when admin=true then 1 else 0 end) as admin, trim(max(first_name)||' '||max(last_name)) as full_name,  max(password) as password  FROM Customer where id=$1 ";

  pool.query(sql, [userId], async function (err, result, fields) {
    pool.end(() => {});

    if (err) {
      next(err);
    } else {
      let resObj = {};
      if (result.rows[0].count === "0") {
        resObj = { login: "failure" };
      } else {
        let dbPassword = result.rows[0].password;
        let match = await bcrypt.compare(password, dbPassword);
        if (match || dbPassword === password) {
          let accessToken = jwt.sign(
            { userId },
            constants.ACCESS_TOKEN_SECRET,
            { expiresIn: "9999d" }
          );
          resObj = {
            login: "ok",
            admin: result.rows[0].admin,
            full_name: result.rows[0].full_name,
            accessToken,
          };
        } else {
          resObj = { login: "failure" };
        }
      }
      setCorsHeaders(req, res);
      res.json(resObj);
    }
  });
};

exports.mergeUserRating = function (req, res, next) {
  let userId = req.body.userId;
  let quizOrCourseId = req.body.id;
  let rating = req.body.rating;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql = "select User_Rating_Merge(p_id:=$1, p_user_id:=$2, p_rating:=$3)";

  pool.query(
    sql,
    [quizOrCourseId, userId, rating],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({"mergestatus":"error"});
      } else {
        setCorsHeaders(req, res);
        res.json({ mergestatus: "ok" });
      }
    }
  );
};

/*api method for (un)liking a post*/
exports.userLikeUnlike = function (req, res, next) {
  let id = req.body.id;
  let user_id = req.body.user_id;
  let like_flag = req.body.like_flag;

  var sql;

  if (like_flag === "true") {
    //console.log(like_flag);
    sql = "select user_like_unlike(p_id:=$1, u_id:=$2, like_flag:=true) ";
  } else {
    sql = "select user_like_unlike(p_id:=$1, u_id:=$2, like_flag:=false) ";
  }

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [id, user_id], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ updatestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      //console.log("post updated");
      setCorsHeaders(req, res);
      res.json({ updatestatus: "ok" });
    }
  });
};

exports.mergeUser = function (req, res, next) {
  let userId = req.body.userId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let pictureUrl = req.body.pictureUrl;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "SELECT customer_merge(p_id:=$1, p_first_name:=$2, " +
    " p_last_name := $3, p_email := $4, p_profile_image_url := $5)";

  pool.query(
    sql,
    [userId, firstName, lastName, email, pictureUrl],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({"mergestatus":"error"});
      } else {
        let accessToken = jwt.sign({ userId }, constants.ACCESS_TOKEN_SECRET, {
          expiresIn: "9999d",
        });
        setCorsHeaders(req, res);
        res.json({ mergestatus: "ok", accessToken });
      }
    }
  );
};

/* function for handling  http requests to retrive list of users in database
in json format*/
exports.getUsers = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  //console.log(pageSize+', currPage '+currentPage);
  const offset = pageSize * (currentPage - 1);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  var sql =
    "SELECT id, first_name, last_name, address1, address2, city, zip, phone, mobile, " +
    " email, sex_male, profile_image_url FROM Customer  where deleted=false offset $1 limit $2 ";
  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      var arrResult = [];

      var i = 0;
      for (i = 0; i < result.rows.length; i++) {
        arrResult.push(result.rows[i]);
      }

      setCorsHeaders(req, res);
      res.send(arrResult);
    }
  });
};

exports.searchUsers = function (req, res, next) {
  let searchKey = req.body.searchKey;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "select distinct A.id, ts_headline('english', A.first_name, query, 'HighlightAll=true') first_name, " +
    " ts_headline('english', A.last_name, query, 'HighlightAll=true') last_name, " +
    " ts_headline('english', A.address1, query, 'HighlightAll=true') address1, " +
    " ts_headline('english', A.address2,  query, 'HighlightAll=true') address2, " +
    " ts_headline('english', A.city, query, 'HighlightAll=true') city, " +
    " ts_headline('english', A.zip, query, 'HighlightAll=true') zip, " +
    " ts_headline('english', A.phone,  query, 'HighlightAll=true') phone, " +
    " ts_headline('english', A.mobile, query, 'HighlightAll=true') mobile, " +
    " ts_headline('english', A.email, query, 'HighlightAll=true') email, " +
    " ts_rank_cd(search_tsv, query, 32) rank,  " +
    " sex_male " +
    " from Customer A, plainto_tsquery('english', $1) query " +
    " where A.deleted=false and search_tsv@@query  order by rank desc ";

  pool.query(sql, [searchKey], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.getTheUser = function (req, res, next) {
  let userId = req.body.userId;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "select first_name, last_name, address1, address2, city, zip, phone, mobile, email, sex_male, profile_image_url from customer where id = $1";

  pool.query(sql, [userId], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      console.log(JSON.stringify(result.rows));
      let resObj = {};

      if (result != undefined && result.rows.length > 0) {
        resObj.firstName = result.rows[0].first_name;
        resObj.lastName = result.rows[0].last_name;
        resObj.address1 = result.rows[0].address1;
        resObj.address2 = result.rows[0].address2;
        resObj.city = result.rows[0].city;
        resObj.zip = result.rows[0].zip;
        resObj.phone = result.rows[0].phone;
        resObj.mobile = result.rows[0].mobile;
        resObj.email = result.rows[0].email;
        resObj.sex_male = result.rows[0].sex_male;
        resObj.profile_image_url = result.rows[0].profile_image_url;
      }
      setCorsHeaders(req, res);
      res.json(resObj);
    }
  });
};

exports.profileImageUpload = function (req, res, next) {
  utils.uploadFilesToCloudinary(req, res, next, "user");
  /*cloudinary.config({
    cloud_name: cloudinaryConfiguration.getCloudName(),
    api_key: cloudinaryConfiguration.getApiKey(),
    api_secret: cloudinaryConfiguration.getApiSecret()
  });
  uploadFiles=Object.values(req.files);

  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Credentials',true);

  cloudinary.uploader.upload(uploadFiles[0].path, function (err, result){
    if(err){
      next(err);
      res.json({"updatestatus":"error"});
    }
    res.json(result);
  });*/
  /*  const promises = uploadFiles.map(uploadFile => cloudinary.uploader.upload(uploadFile.path));
    Promise
        .all(promises)
        .then(results => res.json(results))
        .catch((err) => res.status(400).json(err));*/
};

/*api method for updating a course*/
exports.editUserInDbJson = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let address1 = req.body.address1;
  let address2 = req.body.address2;
  let city = req.body.city;
  let zip = req.body.zip;
  let phone = req.body.phone;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let sex_male = req.body.sex_male;
  let profile_image_url = req.body.profile_image_url;
  let image_urls_for_delete = {};
  if (req.body.image_urls_for_delete != undefined)
    image_urls_for_delete = JSON.parse(req.body.image_urls_for_delete);

  var sql =
    "UPDATE CUSTOMER SET  first_name=$1, last_name=$2, address1=$3, address2=$4, city=$5, " +
    " zip=$6, phone=$7, mobile=$8, email=$9, sex_male=$10, modified_timestamp=now(), " +
    " profile_image_url=$11 where id=$12 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(
    sql,
    [
      firstName,
      lastName,
      address1,
      address2,
      city,
      zip,
      phone,
      mobile,
      email,
      sex_male,
      profile_image_url,
      id,
    ],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({ updatestatus: "error" });
      } else {
        if (
          Object.keys(image_urls_for_delete) !== undefined &&
          Object.keys(image_urls_for_delete).length > 0
        )
          utils.delete_images(image_urls_for_delete);

        setCorsHeaders(req, res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

/* change user password in database*/
exports.changeUserPassword = function (req, res, next) {
  let userId = req.body.userId;
  let oldpassword = req.body.oldpassword;
  let newpassword = req.body.newpassword;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql =
    "select count(*) as count, max(password) as password from Customer where id=$1 ";
  pool.query(sql, [userId], async (err, result) => {
    if (err) {
      pool.end(() => {});
      next(err);
    }
    if (result.rows[0].count === "0") {
      err = new Error("User Id, Old Password combination is wrong");
      pool.end(() => {});
      next(err);
    } else {
      let newpasswordHash = await bcrypt.hash(
        newpassword,
        constants.BCRYPT_SALT_ROUNDS
      );
      let dbPassword = result.rows[0].password;
      let match = await bcrypt.compare(oldpassword, dbPassword);
      if (match || dbPassword === oldpassword) {
        let sql1 = "Update Customer set password=$1 where id=$2 ";

        pool.query(sql1, [newpasswordHash, userId], (err, result) => {
          pool.end(() => {});
          if (err) {
            next(err);
            //res.json({"insertstatus":"error"});
          } else {
            setCorsHeaders(req, res);
            res.json({ updatestatus: "ok" });
          }
        });
      } else {
        err = new Error("User Id, Old Password combination is wrong");
        next(err);
      }
    }
  });
};

/* Api verison of InsertUserToDB in database*/
exports.insertUserToDbJson = async function (req, res, next) {
  let userId = req.body.userId;
  let password = req.body.password;
  let passwordHash = await bcrypt.hash(password, constants.BCRYPT_SALT_ROUNDS);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let address1 = req.body.address1;
  let address2 = req.body.address2;
  let city = req.body.city;
  let zip = req.body.zip;
  let phone = req.body.phone;
  let cell = req.body.cell;
  let email = req.body.email;
  let sex_male = req.body.sex_male;
  let profile_image_url = req.body.profile_image_url;
  if (profile_image_url === "null") {
    profile_image_url = null;
  }
  let image_urls_for_delete = JSON.parse(req.body.image_urls_for_delete);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql = "select count(*) as count from Customer where id=$1";

  pool.query(sql, [userId], (err, result) => {
    if (err) {
      pool.end(() => {});
      next(err);
    }
    if (result.rows[0].count !== "0") {
      err = new Error("Duplicate User Id");
      pool.end(() => {});
      next(err);
    } else {
      let sql1 =
        "insert into Customer(id,password,first_name,last_name,address1,address2,city,zip,phone,mobile,email, sex_male, profile_image_url) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12, $13)";

      pool.query(
        sql1,
        [
          userId,
          passwordHash,
          firstName,
          lastName,
          address1,
          address2,
          city,
          zip,
          phone,
          cell,
          email,
          sex_male,
          profile_image_url,
        ],
        (err, result) => {
          pool.end(() => {});
          if (err) {
            next(err);
            //res.json({"insertstatus":"error"});
          } else {
            if (
              Object.keys(image_urls_for_delete) !== undefined &&
              Object.keys(image_urls_for_delete).length > 0
            )
              utils.delete_images(image_urls_for_delete);
            setCorsHeaders(req, res);
            res.json({ insertstatus: "ok" });
          }
        }
      );
    }
  });
};

exports.getCourseListForUserJson = function (req, res, next) {
  let userId = req.body.userId;
  var getResultPromise = getCourseListForUser(userId);
  var resArr = [];
  getResultPromise.then(
    function (courseList) {
      for (var i = 0; i < courseList.length; i++) {
        var index = courseList[i].indexOf("$,");
        var valCourse = courseList[i].substring(index + 2);
        var textCourse = courseList[i].substring(0, index);
        obj = {
          id: valCourse,
          name: textCourse,
        };
        resArr.push(obj);
      }
      setCorsHeaders(req, res);
      res.json(resArr);
    },
    function (err) {
      setCorsHeaders(req, res);
      res.send(resArr);
    }
  );
};

/* function for return a Promise object that retrives the set of records in the
 Course table in database related to a selected user */
function getCourseListForUser(userId) {
  var courseList = [];
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  var sql = "SELECT id,name FROM Course where author_id=$1  and deleted=false ";
  return new Promise(function (resolve, reject) {
    pool.query(sql, [userId], function (err, result, fields) {
      pool.end(() => {});
      if (err) reject(err);
      else {
        var i = 0;
        for (i = 0; i < result.rows.length; i++) {
          courseList.push(result.rows[i].name + "$," + result.rows[i].id);
        }
        resolve(courseList);
      }
    });
  });
}
exports.getCourseListForUser = getCourseListForUser;
