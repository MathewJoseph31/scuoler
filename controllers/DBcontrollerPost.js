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
    "select * from posts_for_source_get(p_sourceId:=$1, p_authorId:=$2, p_offset:=$3, p_pageSize:=$4)";

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
