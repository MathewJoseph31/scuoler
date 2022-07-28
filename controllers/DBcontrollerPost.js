/* This file primarily contains code for interfacing with the Database (insert and retreival functions)
 */

//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const fs = require("fs");

//end of session code

const url = require("url");
const configuration = require("../Configuration");

const utils = require("../utils/Utils");
let { setCorsHeaders } = utils;

const util = require("../util");

/* function for handling  http requests to retrive list of posts for a course in database
in json format*/
exports.getPostsForSource = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 10;
  let currentPage = queryObject.currentPage || 1;
  let sourceId = queryObject.sourceId;
  let authorId = queryObject.authorId;

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
    " SELECT A.post_id id, A.payload, A.author_id, A.create_timestamp, " +
    " count(distinct B.*) likes, " +
    " case when exists(select 1 from user_like where id=A.post_id and user_id=$2 and deleted=false) then true else false end liked " +
    "  from post_association A  " +
    " left join user_like B on A.post_id=B.id and B.deleted=false " +
    " where  A.deleted=false and A.source_object_id=$1 " +
    " GROUP BY A.post_id, A.payload, A.author_id, A.create_timestamp " +
    " order by A.create_timestamp desc " +
    " offset $3 limit $4 ";
  pool.query(
    sql,
    [sourceId, authorId, offset, pageSize],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        setCorsHeaders(req, res);
        res.send(result.rows);
      }
    }
  );
};

/* Api verison of InsertEmployeeToDB in database*/
exports.insertPostToDbJson = function (req, res, next) {
  let payload = req.body.payload;
  let author_id = req.body.author_id;
  let sourceId = req.body.sourceId;
  let id = utils.getUniqueId(author_id);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "insert into Post_Association(source_object_id, post_id, payload, author_id) values($1,$2,$3,$4)";

  pool.query(sql, [sourceId, id, payload, author_id], (err, result) => {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({"insertstatus":"error "+err.toString()});
    } else {
      setCorsHeaders(req, res);
      res.json({ insertstatus: "ok", postId: id });
    }
  });
};

/*api method for (un)liking a post*/
exports.postLikeUnlike = function (req, res, next) {
  let post_id = req.body.post_id;
  let user_id = req.body.user_id;
  let like_flag = req.body.like_flag;

  var sql;

  if (like_flag === "true") {
    console.log(like_flag);
    sql = "select post_like_unlike(p_id:=$1, u_id:=$2, like_flag:=true) ";
  } else {
    sql = "select post_like_unlike(p_id:=$1, u_id:=$2, like_flag:=false) ";
  }

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [post_id, user_id], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ updatestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      console.log("post updated");
      setCorsHeaders(req, res);
      res.json({ updatestatus: "ok" });
    }
  });
};

/*api method for updating an course*/
exports.editPostInDbJson = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let payload = req.body.payload;

  var sql =
    "UPDATE POST_ASSOCIATION SET  payload=$1, modified_timestamp=now() where post_id=$2 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [payload, id], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({"updatestatus":"error"});
    } else {
      setCorsHeaders(req, res);
      res.json({ updatestatus: "ok" });
    }
  });
};

exports.deletePostInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;

  var sql =
    "UPDATE POST_ASSOCIATION SET  deleted=true, modified_timestamp=now() where post_id=$1 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [id], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      //next(err);
      res.json({ deletestatus: "error" });
    } else {
      console.log("post deleted");
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
};
