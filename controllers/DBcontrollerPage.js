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
exports.getPagesForCourse = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let sourceId = queryObject.sourceId;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    " select module.id module_id, " +
    " module.name module_name, " +
    " module.next_id next_module_id, " +
    " lesson.id lesson_id, " +
    " lesson.name lesson_name," +
    " lesson.next_id next_lesson_id, " +
    " page.id page_id, " +
    " page.name page_name, " +
    " page.next_id next_page_id " +
    " from " +
    " module " +
    " left join lesson on module.id=lesson.module_id and lesson.deleted=false" +
    " left join page on lesson.id=page.lesson_id and page.deleted=false " +
    " where module.source_object_id=$1 and module.deleted=false   ";

  pool.query(sql, [sourceId], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      //console.log(result.rows);
      setCorsHeaders(req, res);
      res.send(result.rows);
    }
  });
};

exports.insertPageToDbJson = function (req, res, next) {
  let courseId = req.body.courseId;
  let moduleId = req.body.moduleId;
  let moduleName = req.body.moduleName;
  let moduleNew = req.body.moduleNew;
  let lessonId = req.body.lessonId;
  let lessonName = req.body.lessonName;
  let lessonNew = req.body.lessonNew;
  let pageName = req.body.pageName;
  let pageContent = req.body.pageContent;
  let authorId = req.body.ownerId;

  //console.log(courseId, moduleId, moduleName, moduleNew);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    " select page_insert(p_course_id:=$1, p_module_id:=$2, p_module_name:=$3, " +
    " p_module_new:=$4, p_lesson_id:=$5, p_lesson_name:=$6,  p_lesson_new:=$7, " +
    " p_page_name:=$8, p_page_content:=$9, p_author_id:=$10); ";

  pool.query(
    sql,
    [
      courseId,
      moduleId,
      moduleName,
      moduleNew,
      lessonId,
      lessonName,
      lessonNew,
      pageName,
      pageContent,
      authorId,
    ],
    function (err, result) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({ insertstatus: "error" });
      } else {
        let resArr = result?.rows[0]?.page_insert?.split(",");
        setCorsHeaders(req, res);
        res.json({
          insertstatus: "ok",
          moduleId: resArr[1],
          lessonId: resArr[2],
          pageId: resArr[3],
        });
      }
    }
  );
};

exports.deleteModuleLessonPage = function (req, res, next) {
  let parentId = req.body.parentId;
  let sourceId = req.body.sourceId;
  let deleteType = req.body.type;
  console.log(parentId, sourceId, deleteType);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql = "";

  if (deleteType === "Module") {
    sql = "select course_module_delete(p_course_id:=$1, p_module_id:=$2)";
  } else if (deleteType === "Lesson") {
    sql = "select course_lesson_delete(p_module_id:=$1, p_lesson_id:=$2)";
  } else {
    sql = "select course_page_delete(p_lesson_id:=$1, p_page_id:=$2)";
  }

  pool.query(sql, [parentId, sourceId], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      //console.log(result.rows);
      setCorsHeaders(req, res);
      res.json({
        deletestatus: "ok",
      });
    }
  });
};

exports.moveModuleLessonPage = function (req, res, next) {
  let parentId = req.body.parentId;
  let afterBeforeFlag = req.body.afterBeforeFlag;
  let moveSourceId = req.body.moveSourceId;
  let moveReferenceObjectId = req.body.moveReferenceObjectId;
  let moveReferenceParentObjectId = req.body.moveReferenceObjectParentId;
  let moveType = req.body.moveType;
  /* console.log(
    afterBeforeFlag,
    moveSourceId,
    parentId,
    moveType,
    moveReferenceObjectId,
    moveReferenceParentObjectId
  );*/

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql = "";

  if (moveType === "Module") {
    sql =
      "select course_module_move(p_course_id:=$1, p_after:=$2, p_module_id:=$3, p_reference_module_id:=$4, p_reference_module_course_id:=$5)";
  } else if (moveType === "Lesson") {
    sql =
      "select course_lesson_move(p_module_id:=$1, p_after:=$2, p_lesson_id:=$3, p_reference_lesson_id:=$4, p_reference_lesson_module_id:=$5)";
  } else if (moveType === "Page") {
    sql =
      "select course_page_move(p_lesson_id:=$1, p_after:=$2, p_page_id:=$3, p_reference_page_id:=$4, p_reference_page_lesson_id:=$5);";
  }
  pool.query(
    sql,
    [
      parentId,
      afterBeforeFlag,
      moveSourceId,
      moveReferenceObjectId,
      moveReferenceParentObjectId,
    ],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        //console.log(result.rows);
        setCorsHeaders(req, res);
        res.json({
          updatestatus: "ok",
        });
      }
    }
  );
};
