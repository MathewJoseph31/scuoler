/* This file primarily contains code for interfacing with the Database (insert and retreival functions)
 */

//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const fs = require("fs");

//end of session code

const url = require("url");
const configuration = require("./Configuration");

const utils = require("./utils/Utils");
let { setCorsHeaders } = utils;

const util = require("./util");

/* function for handling  http requests to retrive list of posts for a course in database
in json format*/
exports.getPostsForCourse = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  let courseId = queryObject.courseId;

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
    " SELECT A.id, payload, author_id, post_timestamp, attachments, " +
    " (select count(1) from post_like where deleted=false and post_id=A.id)  like_count, " +
    " case when exists (select 1 from post where parent_post_id=A.id) then true else false end  has_comments " +
    "  from post A  " +
    " where parent_post_id is null and deleted=false and course_id=$1 " +
    " order by post_timestamp desc " +
    " offset $2 limit $3 ";
  pool.query(sql, [courseId, offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      var arrResult = [];

      var i = 0;
      for (i = 0; i < result.rows.length; i++) {
        arrResult.push(result.rows[i]);
      }
      setCorsHeaders(res);
      res.send(arrResult);
    }
  });
};

/* function for handling  http requests to retrive list of comments for a post in database
in json format*/
exports.getCommentsForPost = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  let postId = queryObject.postId;

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
    " SELECT A.id, payload, author_id, post_timestamp, attachments, " +
    " (select count(1) from post_like where deleted=false and post_id=A.id) like_count " +
    "  from post A  " +
    " where parent_post_id = $1 and deleted=false  " +
    " order by post_timestamp desc " +
    " offset $2 limit $3 ";
  pool.query(sql, [postId, offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      var arrResult = [];

      var i = 0;
      for (i = 0; i < result.rows.length; i++) {
        arrResult.push(result.rows[i]);
      }

      setCorsHeaders(res);
      res.send(arrResult);
    }
  });
};

/* Api verison of InsertEmployeeToDB in database*/
exports.insertPostToDbJson = function (req, res, next) {
  let payload = req.body.payload;
  let author_id = req.body.author_id;
  let attachments = req.body.attachments;
  let course_id = req.body.course_id;
  let parent_post_id = req.body.parent_post_id;
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
    "insert into Post(id, payload, author_id, course_id, attachments, parent_post_id) values($1,$2,$3,$4,$5,$6)";

  pool.query(
    sql,
    [id, payload, author_id, course_id, attachments, parent_post_id],
    (err, result) => {
      if (err) {
        next(err);
        //res.json({"insertstatus":"error "+err.toString()});
      } else {
        setCorsHeaders(res);
        res.json({ insertstatus: "ok" });
      }
    }
  );
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
    if (err) {
      next(err);
      //res.json({ updatestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      console.log("post updated");
      setCorsHeaders(res);
      res.json({ updatestatus: "ok" });
    }
  });
};

/*api method for updating an course*/
exports.editPostInDbJson = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let payload = req.body.payload;
  let author_id = req.body.author_id;
  let attachments = req.body.attachments;
  let course_id = req.body.course_id;
  let attachments_for_delete = {};
  if (req.body.attachments_for_delete != undefined)
    attachments_for_delete = JSON.parse(req.body.attachments_for_delete);

  var sql =
    "UPDATE POST SET  payload=$1, author_id=$2, course_id=$3, attachments=$4 where id=$5 ";

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
    [payload, author_id, course_id, attachments, id],
    function (err, result, fields) {
      if (err) {
        next(err);
        //res.json({"updatestatus":"error"});
      } else {
        if (
          Object.keys(attachments_for_delete) !== undefined &&
          Object.keys(attachments_for_delete).length > 0
        )
          util.delete_images(attachments_for_delete);
        setCorsHeaders(res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

exports.deletePostInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;

  var sql =
    "UPDATE POST SET  deleted=true, modified_timestamp=now() where id=$1 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [id], function (err, result, fields) {
    if (err) {
      //next(err);
      res.json({ deletestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      console.log("post deleted");
      setCorsHeaders(res);
      res.json({ deletestatus: "ok" });
    }
  });
};
