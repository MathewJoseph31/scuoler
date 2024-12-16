/* This file primarily contains code for interfacing with the Database (insert and retreival functions)
 */
//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//end of session code

const url = require("url");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const configuration = require("../Configuration");

const utils = require("../utils/Utils");

let { setCorsHeaders } = utils;

const util = require("../util");

const constants = require("../Constants");

const { sendEmailGeneric } = require("./EmailController");

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

exports.emailUnsubscribe = async function (req, res, next) {
  //let userId = req.body.userId;
  let token = req.body.token;
  console.log(token);
  jwt.verify(token, constants.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      let err = new Error("Access Token Invalid");
      next(err);
    } else {
      //console.log(decoded);
      let email = decoded.email;

      let accountId = req.body.accountId;
      let accountConfiguration = configuration;

      if (accountId) {
        accountConfiguration = await utils.getConfiguration(
          accountId,
          configuration
        );
      }
      var pool = new pg.Pool({
        host: accountConfiguration.getHost(),
        user: accountConfiguration.getUserId(),
        password: accountConfiguration.getPassword(),
        database: accountConfiguration.getDatabase(),
        port: accountConfiguration.getPort(),
        ssl: { rejectUnauthorized: false },
      });

      var sql = `Update customer set marketing_email_send=false, modified_timestamp=now() 
        where email=$1 and deleted=false
        `;

      pool.query(sql, [email], async function (err, result, fields) {
        pool.end(() => {});
        if (err) {
          next(err);
        } else {
          setCorsHeaders(req, res);
          res.json({ status: "ok" });
        }
      });
    }
  });
};

/*Api Json version of verify user*/
exports.verifyUserJson = async function (req, res, next) {
  //let userId = req.body.userId;
  let email = req.body.email;
  let password = req.body.password;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql = `SELECT  count(*) as count, max(case when admin=true then 1 else 0 end) as admin, trim(max(first_name)||' '||max(last_name)) as full_name,  max(password) as password,
    max(id) as id, max(question_for_problem::varchar) as question_for_problem,
    max(option_sequence_alphabetical::varchar) as option_sequence_alphabetical
    FROM Customer 
    where deleted=false and coalesce(password,'')<>'' and email=$1 
    `;

  pool.query(sql, [email], async function (err, result, fields) {
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
          let userId = result.rows[0].id;
          let admin = result.rows[0].admin;
          let accessToken = jwt.sign(
            { userId, email, role: admin ? "ADMIN" : "EXTERNAL_READER" },
            constants.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "9999d",
            }
          );
          resObj = {
            login: "ok",
            admin: result.rows[0].admin,
            full_name: result.rows[0].full_name,
            userId: result.rows[0].id,
            question_for_problem: result.rows[0].question_for_problem,
            option_sequence_alphabetical:
              result.rows[0].option_sequence_alphabetical,
            ads: result.rows[0].ads,
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

exports.mergeUserRating = async function (req, res, next) {
  let userId = req.body.userId;
  let quizOrCourseId = req.body.id;
  let rating = req.body.rating;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
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
exports.userLikeUnlike = async function (req, res, next) {
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

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
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

exports.mergeUser = async function (req, res, next) {
  let userId = req.body.userId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let pictureUrl = req.body.pictureUrl;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
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
        let accessToken = jwt.sign(
          { userId, email, role: "EXTERNAL_READER" },
          constants.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "9999d",
          }
        );

        setCorsHeaders(req, res);
        res.json({ mergestatus: "ok", accessToken });
      }
    }
  );
};

/* function for handling  http requests to retrive list of users in database
in json format*/
exports.getUsers = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  let instructor = queryObject.instructor == "true";
  //console.log(pageSize+', currPage '+currentPage);
  const offset = pageSize * (currentPage - 1);

  let accountId = queryObject.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    " SELECT id, first_name, last_name, address1, address2, city, state , zip, phone, mobile, email, sex_male, profile_image_url, outline " +
    " from customer_get_all(p_instructor:=$1, p_offset:=$2, p_limit:=$3) ";
  //" FROM Customer  where deleted=false offset $1 limit $2 ";

  pool.query(
    sql,
    [instructor, offset, pageSize],
    function (err, result, fields) {
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
    }
  );
};

exports.searchUsers = async function (req, res, next) {
  let searchKey = req.body.searchKey;

  let pageSize = req.body.pageSize || 20;
  let currentPage = req.body.currentPage || 1;
  //console.log(pageSize+', currPage '+currentPage);
  const offset = pageSize * (currentPage - 1);

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
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
    " where A.deleted=false and search_tsv@@query  order by rank desc offset $2 limit $3";

  pool.query(
    sql,
    [searchKey, offset, pageSize],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        setCorsHeaders(req, res);
        res.json(result.rows);
      }
    }
  );
};

exports.getTheUser = async function (req, res, next) {
  let userId = req.body.userId;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql =
    "select first_name, last_name, address1, address2, city, zip, phone, mobile, email, sex_male, profile_image_url, instructor, outline, about_description, educational_qualifications, professional_experiences from customer where id = $1";

  let sql1 =
    "select B.ID, B.name  from category_association A " +
    " inner join category B on A.category_id=B.id and A.DELETED=false and B.deleted=false " +
    " where A.id=$1 ";

  pool.query(sql, [userId], function (err, result, fields) {
    if (err) {
      pool.end(() => {});
      next(err);
    } else {
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
        resObj.instructorFlag = result.rows[0].instructor;
        resObj.outline = result.rows[0].outline;
        resObj.about_description = result.rows[0].about_description;
        resObj.educational_qualifications =
          result.rows[0].educational_qualifications;
        resObj.professional_experiences =
          result.rows[0].professional_experiences;
        resObj.categoriesArray = [];
        pool.query(sql1, [userId], function (err, result1, fields) {
          pool.end(() => {});
          if (err) {
            next(err);
          } else {
            resObj.categoriesArray = result1.rows;
            setCorsHeaders(req, res);
            res.json(resObj);
          }
        });
      }
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

/* Api verison of InsertUserToDB in database*/
exports.insertUserToDbJson = async function (req, res, next) {
  //let userId = req.body.userId;
  let userId = uuidv4();
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
  let instructorFlag = req.body.instructorFlag;

  let categoriesArray = [];
  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  let outline = req.body.outline;
  console.log(outline);

  let educationalQualifications = req.body.educationalQualifications;
  let professionalExperiences = req.body.professionalExperiences;
  let aboutDescription = req.body.aboutDescription;

  let profile_image_url = req.body.profile_image_url;
  if (profile_image_url === "null") {
    profile_image_url = null;
  }
  let image_urls_for_delete = JSON.parse(req.body.image_urls_for_delete);

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql = "select count(*) as count from Customer where email=$1";

  pool.query(sql, [email], (err, result) => {
    if (err) {
      pool.end(() => {});
      next(err);
    }
    if (result.rows[0].count !== "0") {
      err = new Error(
        "Duplicate User, A user has already registered with the given email"
      );
      pool.end(() => {});
      next(err);
    } else {
      let sql1 = ` select customer_insertdb(p_id:=$1, p_password:=$2, p_first_name:=$3, p_last_name:=$4,
          p_address1:=$5, p_address2:=$6, p_city:=$7, p_zip:=$8, p_phone:=$9, p_mobile:=$10,
          p_email:=$11, p_sex_male:=$12, p_profile_image_url:=$13, p_instructor:=$14, p_outline:=$15, 
          p_about_description:=$16, p_educational_qualifications:=$17, p_professional_experiences:=$18, 
          p_categories_id:=$19)
         `;
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
          instructorFlag,
          outline,
          aboutDescription,
          educationalQualifications,
          professionalExperiences,
          categoriesId,
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
              utils.delete_images_local(image_urls_for_delete);
            setCorsHeaders(req, res);
            res.json({ insertstatus: "ok", userId });
          }
        }
      );
    }
  });
};

/*api method for updating a course*/
exports.editUserInDbJson = async function (req, res, next) {
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
  let instructorFlag = req.body.instructorFlag;
  let outline = req.body.outline;
  let aboutDescription = req.body.aboutDescription;
  let educationalQualifications = req.body.educationalQualifications;
  let professionalExperiences = req.body.professionalExperiences;

  let categoriesArray = [];
  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  let profile_image_url = req.body.profile_image_url;
  let image_urls_for_delete = {};
  if (req.body.image_urls_for_delete != undefined)
    image_urls_for_delete = JSON.parse(req.body.image_urls_for_delete);

  var sql = ` SELECT customer_update(p_id:=$1, p_first_name:=$2, p_last_name:=$3, p_address1:=$4, 
    p_address2:=$5, p_city:=$6, p_zip:=$7, p_phone:=$8, p_mobile:=$9, p_email:=$10, 
    p_sex_male:=$11, p_profile_image_url:=$12, p_instructor:=$13, p_outline:=$14, p_about_description:=$15,
    p_educational_qualifications:=$16, p_professional_experiences:=$17,  p_categories_id:=$18)  `;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(
    sql,
    [
      id,
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
      instructorFlag,
      outline,
      aboutDescription,
      educationalQualifications,
      professionalExperiences,
      categoriesId,
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
        ) {
          utils.delete_images_local(image_urls_for_delete);
        }

        setCorsHeaders(req, res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

/* change user password in database*/
exports.changeUserPassword = async function (req, res, next) {
  let userId = req.body.userId;
  let oldpassword = req.body.oldpassword;
  let newpassword = req.body.newpassword;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
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
