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

const util = require("./util");
const utils = require("./utils/Utils");
let { setCorsHeaders } = utils;

//--Employee---

exports.mergeEmployee = function (req, res, next) {
  let employeeId = req.body.employeeId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let attachments = req.body.attachments;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "SELECT employee_merge(p_id:=$1, p_first_name:=$2, " +
    " p_last_name := $3, p_email := $4, p_attachments := $5)";

  pool.query(
    sql,
    [userId, firstName, lastName, email, attachments],
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

exports.searchEmployees = function (req, res, next) {
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
    " start_date, term_date " +
    " from Employee A, plainto_tsquery('english', $1) query " +
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

/* function for handling  http requests to retrive list of users in database
in json format*/
exports.getEmployees = function (req, res, next) {
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
    " email, birth_date, salary, attachments, start_date, term_date FROM Employee " +
    " where deleted=false offset $1 limit $2 ";
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

exports.getTheEmployee = function (req, res, next) {
  let employeeId = req.body.employeeId;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "select first_name, last_name, address1, address2, city, zip, phone, mobile, " +
    " email, birth_date, salary, attachments,  start_date, term_date from Employee where id = $1";

  pool.query(sql, [employeeId], function (err, result, fields) {
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
        resObj.birth_date = result.rows[0].birth_date;
        resObj.salary = result.rows[0].salary;
        resObj.attachments = result.rows[0].attachments;
        resObj.start_date = result.rows[0].start_date;
        resObj.term_date = result.rows[0].term_date;
      }
      setCorsHeaders(req, res);
      res.json(resObj);
    }
  });
};

/*api method for updating a course*/
exports.editEmployeeInDbJson = function (req, res, next) {
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
  let birth_date = req.body.birth_date;
  let salary = req.body.salary;
  let attachments = req.body.attachments;
  let start_date = req.body.start_date;
  let term_date = req.body.term_date;
  let attachments_for_delete = {};
  if (req.body.attachments_for_delete != undefined)
    attachments_for_delete = JSON.parse(req.body.attachments_for_delete);

  var sql =
    "UPDATE EMPLOYEE SET  first_name=$1, last_name=$2, address1=$3, address2=$4, city=$5, " +
    " zip=$6, phone=$7, mobile=$8, email=$9, birth_date=$10, salary=$11, modified_timestamp=now(), " +
    " attachments=$12, start_date=$13, term_date=$14 where id=$15 ";

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
      birth_date,
      salary,
      attachments,
      start_date,
      term_date,
      id,
    ],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({"updatestatus":"error"});
      } else {
        if (
          Object.keys(attachments_for_delete) !== undefined &&
          Object.keys(attachments_for_delete).length > 0
        )
          util.delete_images(attachments_for_delete);

        setCorsHeaders(req, res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

/* Api verison of InsertEmployeeToDB in database*/
exports.insertEmployeeToDbJson = function (req, res, next) {
  //let id=req.body.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let address1 = req.body.address1;
  let address2 = req.body.address2;
  let city = req.body.city;
  let zip = req.body.zip;
  let phone = req.body.phone;
  let cell = req.body.cell;
  let email = req.body.email;
  let birth_date = req.body.birth_date;
  let salary = req.body.salary;
  let attachments = req.body.attachments;
  let start_date = req.body.start_date;
  let term_date = req.body.term_date;
  if (attachments === "null") {
    attachments = null;
  }
  let attachments_for_delete = JSON.parse(req.body.attachments_for_delete);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "insert into Employee(id, first_name,last_name,address1,address2,city,zip,phone,mobile,email, birth_date, salary, attachments, start_date, term_date) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12, $13, $14, $15)";
  let id = utils.getUniqueId(firstName + lastName);

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
      cell,
      email,
      birth_date,
      salary,
      attachments,
      start_date,
      term_date,
    ],
    (err, result) => {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({"insertstatus":"error "+err.toString()});
      } else {
        if (
          Object.keys(attachments_for_delete) !== undefined &&
          Object.keys(attachments_for_delete).length > 0
        )
          util.delete_images(attachments_for_delete);

        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok" });
      }
    }
  );
};

exports.deleteEmployeeInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let employeeId = req.body.id;

  var sql =
    "UPDATE EMPLOYEE SET  deleted=true, modified_timestamp=now() where id=$1 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [employeeId], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      //next(err);
      res.json({ deletestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      console.log("employee deleted");
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
};

exports.attachmentUpload = function (req, res, next) {
  utils.uploadFilesToCloudinary(req, res, next, "employee");
};
