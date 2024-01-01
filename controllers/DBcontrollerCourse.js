//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

//end of session code

const url = require("url");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
const path = require("path");
const constants = require("../Constants");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

let { setCorsHeaders } = utils;

//----COURSE----

/* function for return a Promise object that retrives the set of records in the
 Course names from course table in database*/
function getCourseList() {
  var courseList = [];
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  var sql = "SELECT id,name FROM Course ORDER by name ASC";
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result, fields) => {
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

exports.getCourseList = getCourseList;

/* API version of insertCourseToDB inserts to the course table in database*/
exports.insertCourseToDbJson = async function (req, res, next) {
  let courseName = req.body.courseName;
  let courseDescription = req.body.courseDescription;
  let ownerId = req.body.ownerId;
  let thumbnail = req.body.thumbnail;
  let quizesArray = JSON.parse(req.body.quizesArray);
  let categoriesArray = [];

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  if (req.body.languagesArray)
    languagesArray = JSON.parse(req.body.languagesArray);

  let languagesId = [];

  Object.values(languagesArray).forEach((item, i) => {
    languagesId.push(item.id);
  });

  let quizesId = [];
  Object.values(quizesArray).forEach((item, i) => {
    quizesId.push(item.id);
  });

  console.log("in course inserting to db");

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
    "select course_insertDB(p_id:=$1, p_name:=$2, p_description:=$3, p_author_id:=$4, p_thumbnail:=$5, p_type:=$6, p_categories_id:=$7, p_languages_id:=$8, p_quizes_id:=$9)";

  var courseId = uuidv4();
  pool.query(
    sql,
    [
      courseId,
      courseName,
      courseDescription,
      ownerId,
      thumbnail,
      constants.COURSE_TYPE_CODE_NORMAL,
      categoriesId,
      languagesId,
      quizesId,
    ],
    function (err, result) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({ insertstatus: "error" });
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", courseId: courseId });
      }
    }
  );
};

/* API version of insertCourseToDB inserts to the course table in database*/
exports.insertScormCourse = async function (req, res, next) {
  let courseName = req.body.courseName;
  let courseId = req.body.courseId;
  let launchFile = req.body.launchFile;
  let scormApiCode = req.body.scormApiCode;
  let ownerId = req.body.ownerId;
  let thumbnail = req.body.thumbnail;
  let categoriesArray = [],
    languagesArray = [];

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  if (req.body.languagesArray)
    languagesArray = JSON.parse(req.body.languagesArray);

  let languagesId = [];

  Object.values(languagesArray).forEach((item, i) => {
    languagesId.push(item.id);
  });

  let scormDirPath = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
    courseId
  );

  let startFile = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
    courseId + ".html"
  );

  launchFile = path.join(courseId, launchFile);

  let startFileContents = utils.getScormIndexFileContent(
    launchFile,
    scormApiCode
  );

  fs.writeFile(startFile, startFileContents, (err) => {
    if (err) next(err);
    else {
      console.log("Index File written successfully\n");

      const sql =
        "select course_scorm_external_insertdb(p_id:=$1, p_name:=$2, p_description:=$3,  p_author_id:=$4, p_thumbnail:=$5, p_type:=$6, p_launch_file:=$7, p_categories_id:=$8, p_languages_id:=$9)";

      const pool = new pg.Pool({
        host: accountConfiguration.getHost(),
        user: accountConfiguration.getUserId(),
        password: accountConfiguration.getPassword(),
        database: accountConfiguration.getDatabase(),
        port: accountConfiguration.getPort(),
        ssl: { rejectUnauthorized: false },
      });

      console.log(
        courseId,
        courseName,
        ownerId,
        thumbnail,
        launchFile,
        categoriesId,
        languagesId
      );
      pool.query(
        sql,
        [
          courseId,
          courseName,
          courseName,
          ownerId,
          thumbnail,
          constants.COURSE_TYPE_CODE_SCORM,
          launchFile,
          categoriesId,
          languagesId,
        ],
        function (err, result) {
          pool.end(() => {});
          if (err) {
            next(err);
            //res.json({ insertstatus: "error" });
          } else {
            setCorsHeaders(req, res);
            res.json({ insertstatus: "ok", courseId: courseId });
          }
        }
      );
    }
  });
};

exports.insertExternalCourse = async function (req, res, next) {
  let courseName = req.body.courseName;
  let htmlUrl = req.body.htmlUrl;
  let ownerId = req.body.ownerId;
  let thumbnail = req.body.thumbnail;
  let categoriesArray = [],
    languagesArray = [];

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  if (req.body.languagesArray)
    languagesArray = JSON.parse(req.body.languagesArray);

  let languagesId = [];

  Object.values(languagesArray).forEach((item, i) => {
    languagesId.push(item.id);
  });

  let courseId = uuidv4();

  const sql =
    "select course_scorm_external_insertdb(p_id:=$1, p_name:=$2, p_description:=$3,  p_author_id:=$4, p_thumbnail:=$5, p_type:=$6, p_launch_file:=$7, p_categories_id:=$8, p_languages_id:=$9)";

  const pool = new pg.Pool({
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
      courseId,
      courseName,
      courseName,
      ownerId,
      thumbnail,
      constants.COURSE_TYPE_CODE_EXTERNAL,
      htmlUrl,
      categoriesId,
      languagesId,
    ],
    function (err, result) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({ insertstatus: "error" });
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", courseId: courseId });
      }
    }
  );
};

/*Global variable for shared select list between getQuizes and searchQuizesForPrefix*/
const sqlSubstringForGetAndSearch =
  " SELECT id, name, description, author_id, thumbnail, type, launch_file ";

/* function for handling http requests to retrive the records in the
 Course table in database in json format*/
exports.getCourses = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  let category = queryObject.category || "";
  let language = queryObject.language || "";
  let sort = queryObject.sort || ""; //not used at the moment

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
    sqlSubstringForGetAndSearch +
    " from course_get_all(p_category:=$1, p_language:=$2, p_offset:=$3, p_limit:=$4) ";
  //" FROM Course where deleted=false order by type, thumbnail, create_timestamp DESC offset $1 limit $2 ";
  var resultArr = [];

  pool.query(
    sql,
    [category, language, offset, pageSize],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        var i = 0;
        for (i = 0; i < result.rows.length; i++) {
          result.rows[i].relative_url =
            result.rows[i].type === constants.COURSE_TYPE_CODE_SCORM
              ? path.join(
                  constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
                  result.rows[i].id + ".html"
                )
              : "";

          resultArr.push(result.rows[i]);
        }

        setCorsHeaders(req, res);
        res.json(resultArr);
      }
    }
  );
};

exports.searchCoursesForPrefix = async function (req, res, next) {
  let searchKey = req.body.searchKey;
  searchKey += "%";

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
    sqlSubstringForGetAndSearch +
    " from Course  " +
    " where deleted=false and trim(name) ilike  $1";

  pool.query(sql, [`${searchKey}%`], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.searchCourses = async function (req, res, next) {
  let searchKey = req.body.searchKey;

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
    "select distinct A.id, ts_headline('english', A.description, query, 'HighlightAll=true') description, " +
    " ts_headline('english', A.name, query, 'HighlightAll=true') as name,  A.author_id,  ts_rank_cd(search_tsv, query, 32) rank  " +
    " from Course A, plainto_tsquery('english', $1) query " +
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

exports.getCourseName = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

  let courseId = queryObject.courseId;

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

  let sql =
    " select A.name, A.description, A.author_id " +
    " from course A " +
    " where A.id=$1 ";

  pool.query(sql, [courseId], function (err, result, fields) {
    if (err) {
      pool.end(() => {});
      next(err);
    } else {
      res.json(result.rows[0]);
    }
  });
};

exports.getTheCourse = async function (req, res, next) {
  let courseId = req.body.courseId;
  let authorName = req.body.authorName;

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

  let sql = "select * from course_get_one(p_id:=$1, p_author_id:=$2)";

  let sql1 =
    "SELECT Quiz.id, Quiz.description, Quiz.name, Quiz.author_id FROM Quiz " +
    " inner join Quiz_Course on Quiz.id=Quiz_Course.quiz_id where Quiz_Course.course_id=$1 " +
    " and Quiz_Course.deleted=false";

  let sql2 =
    "select B.ID, B.name  from category_association A " +
    " inner join category B on A.category_id=B.id and A.DELETED=false and B.deleted=false " +
    " where A.id=$1 ";

  let sql3 =
    "select B.ID, B.name  from language_association A " +
    " inner join language B on A.language_id=B.id and A.DELETED=false and B.deleted=false " +
    " where A.id=$1 ";

  pool.query(sql, [courseId, authorName], function (err, result, fields) {
    if (err) {
      pool.end(() => {});
      next(err);
    } else {
      let resObj = {};

      resObj.name = result.rows[0]?.name;
      resObj.description = result.rows[0]?.description;
      resObj.ownerId = result.rows[0]?.author_id;
      resObj.thumbnail = result.rows[0]?.thumbnail;
      resObj.rating = result.rows[0]?.rating;
      resObj.likes = result.rows[0]?.likes;
      resObj.liked = result.rows[0]?.liked;
      resObj.type = result.rows[0]?.type;
      resObj.launch_file = result.rows[0]?.launch_file;
      resObj.relative_url =
        resObj.type === constants.COURSE_TYPE_CODE_SCORM
          ? path.join(
              constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
              courseId + ".html"
            )
          : "";
      resObj.quizesArray = [];

      pool.query(sql1, [courseId], function (err, result1, fields) {
        if (err) {
          pool.end(() => {});
          next(err);
        } else {
          resObj.quizesArray = result1.rows;
          resObj.categoriesArray = [];

          pool.query(sql2, [courseId], function (err, result2, fields) {
            if (err) {
              pool.end(() => {});
              next(err);
            } else {
              resObj.categoriesArray = result2.rows;
              resObj.languagesArray = [];
              pool.query(sql3, [courseId], function (err, result3, fields) {
                pool.end(() => {});

                if (err) next(err);
                else {
                  resObj.languagesArray = result3.rows;
                  setCorsHeaders(req, res);
                  res.json(resObj);
                }
              });
            }
          });
        }
      });
    }
  });
};

/* function for returning a Promise object that retrives the set of records in the
 Quiz table in database, related to a selected course*/

exports.getQuizListForCourseJson = async function (req, res, next) {
  let courseId = req.body.courseId;
  var quizList = [];

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
    "SELECT Quiz.id, Quiz.description, Quiz.name, Quiz.author_id FROM Quiz " +
    " inner join Quiz_Course on Quiz.id=Quiz_Course.quiz_id where Quiz_Course.course_id=$1 " +
    " and Quiz_Course.deleted=false";
  pool.query(sql, [courseId], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      let resultArr = [];
      var i = 0;
      for (i = 0; i < result.rows.length; i++) {
        resultArr.push(result.rows[i]);
      }
      setCorsHeaders(req, res);
      res.json(resultArr);
    }
  });
};

/*api method for updating a course*/
exports.editCourseInDbJson = async function (req, res, next) {
  //var q = url.parse(req.url, true).query;

  let courseId = req.body.courseId;
  let description = req.body.description;
  let name = req.body.name;
  let thumbnail = req.body.thumbnail;
  let quizesArray = [],
    categoriesArray = [],
    languagesArray = [];
  if (req.body.quizesArray) quizesArray = JSON.parse(req.body.quizesArray);

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  if (req.body.languagesArray)
    languagesArray = JSON.parse(req.body.languagesArray);

  let quizesId = [];

  Object.values(quizesArray).forEach((item, i) => {
    quizesId.push(item.id);
  });

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  let languagesId = [];

  Object.values(languagesArray).forEach((item, i) => {
    languagesId.push(item.id);
  });

  /*var sql="UPDATE COURSE SET  name=$1, description=$2, p_quizes_id:=$3, modified_timestamp=now() "+
  " where id=$4 ";*/
  var sql =
    "select course_update(p_id:=$1, p_name:=$2, p_description:=$3, p_thumbnail:=$4,p_quizes_id:=$5, p_categories_id:=$6, p_languages_id:=$7)";

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
      courseId,
      name,
      description,
      thumbnail,
      quizesId,
      categoriesId,
      languagesId,
    ],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        console.log(err);
        next(err);
        //res.json({ updatestatus: "error" });
      } else {
        console.log("course updated");
        setCorsHeaders(req, res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

exports.deleteCourseInDB = async function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let courseId = req.body.id;

  var sql =
    "UPDATE COURSE SET  deleted=true, modified_timestamp=now() where id=$1 ";

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

  pool.query(sql, [courseId], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ deletestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      console.log("problem deleted");
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
};

/* function for returning a Promise object that retrives the 
set of categories related to a selected course*/

exports.getCategoryListForCourseJson = async function (req, res, next) {
  let courseId = req.body.courseId;

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
    "SELECT Category.id, Category.name FROM Category " +
    " inner join Course_Category on Category.id=Course_Category.category_id where Course_Category.course_id=$1 " +
    " and Course_Category.deleted=false";
  pool.query(sql, [courseId], function (err, result, fields) {
    pool.end(() => {});
    if (err) reject(err);
    else {
      let resultArr = [];
      var i = 0;
      for (i = 0; i < result.rows.length; i++) {
        resultArr.push(result.rows[i]);
      }
      setCorsHeaders(req, res);
      res.json(resultArr);
    }
  });
};

exports.getCategoryList = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

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
    "SELECT id,name FROM Category where deleted = false ORDER by name asc ";
  pool.query(sql, function (err, result, fields) {
    pool.end(() => {});
    if (err) reject(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.getLanguageList = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

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
    "SELECT id,name FROM Language where deleted = false ORDER by name asc ";
  pool.query(sql, function (err, result, fields) {
    pool.end(() => {});
    if (err) reject(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};
