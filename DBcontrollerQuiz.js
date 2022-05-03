//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const url = require("url");

const configuration = require("./Configuration");
const dbControllerCourse = require("./DBcontrollerCourse");

const utils = require("./utils/Utils");

let { setCorsHeaders } = utils;

//---QUIZ---
/* function for returning a Promise object that retrives the set of recordes in the
 quiz descriptions from quiz table in database*/
function getQuizList() {
  var quizList = ["General$,defaultUser"];
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  var sql = "SELECT id,description FROM Quiz";
  return new Promise(function (resolve, reject) {
    pool.query(sql, function (err, result, fields) {
      if (err) reject(err);
      else {
        var i = 0;
        for (i = 0; i < result.rows.length; i++) {
          quizList.push(result.rows[i].description + "$," + result.rows[i].id);
        }
        resolve(quizList);
      }
    });
  });
}

exports.getQuizList = getQuizList;

const Client = require("pg-native");

//---QUIZ---
/* function for returning a Promise object that retrives the set of records in the
   quiz descriptions from quiz table in database*/
function getQuizListSync() {
  var quizList = ["General$,defaultUser"];
  var client = Client();
  var connStr =
    "postgresql://" +
    configuration.getUserId() +
    ":" +
    configuration.getPassword() +
    "@" +
    configuration.getHost() +
    ":" +
    configuration.getPort() +
    "/" +
    configuration.getDatabase() +
    "?rejectUnauthorized=false";

  client.connectSync(connStr);
  var sql = "SELECT id,description FROM Quiz";
  var rows = client.querySync(sql);
  var i = 0;
  for (i = 0; i < rows.length; i++) {
    quizList.push(rows[i].description + "$," + rows[i].id);
  }
  return quizList;
}

exports.getQuizListSync = getQuizListSync;

/* Api version of insertQuizToDB*/
exports.insertQuizToDbJson = function (req, res, next) {
  let quizDescription = req.body.quizDescription;
  let quizName = req.body.quizName;
  let duration_minutes = req.body.duration_minutes;
  let quizType = req.body.quizType;
  let authorName = req.body.authorName;
  let thumbnail = req.body.thumbnail;

  let coursesArray = JSON.parse(req.body.coursesArray);
  let problemsArray = JSON.parse(req.body.problemsArray);

  let categoriesArray = [];

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  let coursesId = [];
  Object.values(coursesArray).forEach((item, i) => {
    coursesId.push(item.id);
  });

  let problemsId = [];
  Object.values(problemsArray).forEach((item, i) => {
    problemsId.push(item.id);
  });

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql =
    "select quiz_insert(p_id:=$1, p_description:=$2, p_name:=$3, p_duration_minutes:=$4," +
    " p_type:=$5, p_author_id:=$6, p_courses_id:=$7, p_problems_id:=$8,   " +
    " p_categories_id:=$9, p_thumbnail :=$10)";

  //console.log("Dbcontroller insert Quiz "+courseId);

  var quizId = utils.getUniqueId(authorName);

  pool.query(
    sql,
    [
      quizId,
      quizDescription,
      quizName,
      duration_minutes,
      quizType,
      authorName,
      coursesId,
      problemsId,
      categoriesId,
      thumbnail,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        //res.json({ insertstatus: "error" });
        next(err);
      } else {
        setCorsHeaders(req, res);
        console.log("in quiz inserting to db and return json");
        res.json({ insertstatus: "ok", quizId: quizId });
      }
    }
  );
};

/*Api method to be invoked before starting a quiz at front end*/
exports.quizStart = function (req, res, next) {
  let quizId = req.body.quizId;
  let startTime = req.body.startTime;
  let userId = req.body.userId;
  let sql =
    "insert into quiz_instance(quiz_instance_id, quiz_id,  user_id) values($1,$2,$3)";
  let quizInstanceId = utils.getUniqueId(quizId);
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  pool.query(sql, [quizInstanceId, quizId, userId], function (err, result) {
    if (err) {
      next(err);
      //res.json({ insertstatus: "error" });
    } else {
      setCorsHeaders(req, res);
      console.log("in inserting quizInstance to db and return json");
      res.json({ insertstatus: "ok", quizInstanceId: quizInstanceId });
    }
  });
};

/*Api method to be invoked to submit answers of a quiz */
exports.quizAnwersSubmit = function (req, res, next) {
  let quizId = req.body.quizId;
  let quizType = req.body.quizType;
  let quizInstanceId = req.body.quizInstanceId;
  let answersObject = JSON.parse(req.body.answersObject);
  //console.log(quizType);
  //console.log(JSON.stringify(answersObject));

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  let sql =
    "update quiz_instance set end_timestamp=now() where quiz_instance_id=$1";

  let answersArr = [];

  let sql1 =
    "insert into quiz_instance_answers(quiz_instance_id, problem_id, solution) values ";

  if (answersObject !== null && Object.keys(answersObject).length > 0) {
    Object.keys(answersObject).forEach((val, index) => {
      answersArr.push(quizInstanceId, val, answersObject[val]);

      if (index === 0)
        sql1 += `($${3 * index + 1}, $${3 * index + 2}, $${3 * index + 3})`;
      else sql1 += `,($${3 * index + 1}, $${3 * index + 2}, $${3 * index + 3})`;
    });
  }

  pool.query(sql, [quizInstanceId], function (err, result) {
    if (err) {
      next(err);
      //res.json({ insertstatus: "error" });
    } else {
      if (answersObject == null || Object.keys(answersObject).length == 0) {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok" });
      } else {
        pool.query(sql1, answersArr, function (err, result) {
          if (err) {
            next(err);
            //res.json({ insertstatus: "error" });
          } else {
            setCorsHeaders(req, res);
            res.json({ insertstatus: "ok" });
          }
        });
      }
    }
  });
};

exports.updateQuizMarksAwarded = function (req, res, next) {
  let quizInstanceId = req.body.quizInstanceId;
  let marksAwardedString = req.body.marksAwardedArray;
  let marksAwardedArray = JSON.parse(marksAwardedString);
  //console.log(Array.isArray(marksAwardedArray));

  let sql = "select quiz_marks_awarded_update($1, $2)";

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
    [quizInstanceId, marksAwardedArray],
    function (err, result, fields) {
      if (err) next(err);
      else {
        setCorsHeaders(req, res);
        console.log(result);
        res.json('{"updatestatus":"ok"}');
      }
    }
  );
};

exports.getQuizInstanceProblems = function (req, res, next) {
  let quizInstanceId = req.body.quizInstanceId;

  let sql =
    " select quiz_instance.quiz_instance_id, quiz.description as quiz_description, quiz.name quiz_name, quiz_instance.quiz_id, quiz.duration_minutes, quiz.author_id,  quiz_instance.user_id, " +
    " quiz_instance.create_timestamp start_timestamp, " +
    " coalesce(quiz_instance.end_timestamp, quiz_instance.create_timestamp+quiz.duration_minutes* INTERVAL '1 minutes') as end_timestamp, " +
    " problem_quiz.problem_id, problem.answerkey, problem.type, " +
    " problem.description as problem_description, problem.solution as problem_solution, " +
    " problem.option1, problem.option2, problem.option3, problem.option4, problem.options, " +
    " problem.maxmarks,  quiz_instance_answers.create_timestamp, " +
    " quiz_instance_answers.solution as user_solution, " +
    " coalesce(quiz_instance_answers.marks_awarded,0) marks_awarded, " +
    " case when problem.type='m' and problem.answerkey = CAST(quiz_instance_answers.solution as integer) then problem.maxmarks when problem.type='d' then coalesce(quiz_instance_answers.marks_awarded,0)  else 0 end marks_scored " +
    " from quiz " +
    " inner join problem_quiz on problem_quiz.quiz_id=quiz.id and problem_quiz.deleted=false " +
    " inner join problem on problem_quiz.problem_id=problem.id " +
    " inner join quiz_instance on quiz_instance.quiz_id=quiz.id " +
    " left join quiz_instance_answers on quiz_instance.quiz_instance_id=quiz_instance_answers.quiz_instance_id and problem.id=quiz_instance_answers.problem_id " +
    " where quiz_instance.quiz_instance_id=$1 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [quizInstanceId], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.quizGetInstances = function (req, res, next) {
  let quizId = req.body.quizId;

  let sql =
    " select quiz_instance.quiz_instance_id, quiz.description, quiz.name, quiz_instance.quiz_id, quiz.duration_minutes, quiz.author_id,  quiz_instance.user_id, " +
    " quiz.type as quiz_type, quiz_instance.create_timestamp start_timestamp, " +
    " coalesce(quiz_instance.end_timestamp, quiz_instance.create_timestamp+quiz.duration_minutes* INTERVAL '1 minutes') as end_timestamp, " +
    //'--problem_quiz.problem_id, problem.answerkey, problem.type'+
    //'--, quiz_instance_answers.create_timestamp, '+
    " SUM(problem.maxmarks) maxmarks,  " +
    " SUM(case when problem.type='m' and problem.answerkey = CAST(quiz_instance_answers.solution as integer) then problem.maxmarks when problem.type='d' then coalesce(quiz_instance_answers.marks_awarded,0)  else 0 end) marks_scored " +
    " from quiz " +
    " inner join problem_quiz on problem_quiz.quiz_id=quiz.id " +
    " inner join problem on problem_quiz.problem_id=problem.id " +
    " inner join quiz_instance on quiz_instance.quiz_id=quiz.id " +
    " left join quiz_instance_answers on quiz_instance.quiz_instance_id=quiz_instance_answers.quiz_instance_id and problem.id=quiz_instance_answers.problem_id " +
    " where quiz.id=$1 " +
    " group by " +
    " quiz_instance.quiz_instance_id, quiz.description, quiz.name, quiz_instance.quiz_id, quiz.duration_minutes, quiz.author_id,  quiz_instance.user_id, " +
    " quiz.type, quiz_instance.create_timestamp, quiz_instance.end_timestamp " +
    " order by  quiz_instance.create_timestamp desc, quiz_instance.quiz_instance_id, quiz_instance.quiz_id  ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [quizId], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.quizGetScoresForUser = function (req, res, next) {
  let userId = req.body.userId;

  let sql =
    " select quiz_instance.quiz_instance_id, quiz.name, quiz.description, quiz_instance.quiz_id, quiz.duration_minutes, quiz.author_id,  quiz_instance.user_id, " +
    " quiz.type as quiz_type, quiz_instance.create_timestamp start_timestamp, " +
    " coalesce(quiz_instance.end_timestamp, quiz_instance.create_timestamp+quiz.duration_minutes* INTERVAL '1 minutes') as end_timestamp, " +
    //'--problem_quiz.problem_id, problem.answerkey, problem.type'+
    //'--, quiz_instance_answers.create_timestamp, '+
    " SUM(problem.maxmarks) maxmarks,  " +
    " SUM(case when problem.type='m' and problem.answerkey = CAST(quiz_instance_answers.solution as integer) then problem.maxmarks when problem.type='d' then coalesce(quiz_instance_answers.marks_awarded,0)  else 0 end) marks_scored " +
    " from quiz " +
    " inner join problem_quiz on problem_quiz.quiz_id=quiz.id " +
    " inner join problem on problem_quiz.problem_id=problem.id " +
    " inner join quiz_instance on quiz_instance.quiz_id=quiz.id " +
    " left join quiz_instance_answers on quiz_instance.quiz_instance_id=quiz_instance_answers.quiz_instance_id and problem.id=quiz_instance_answers.problem_id " +
    " where quiz_instance.user_id=$1 " +
    " group by " +
    " quiz_instance.quiz_instance_id, quiz.description, quiz.name, quiz_instance.quiz_id, quiz.duration_minutes, quiz.author_id,  quiz_instance.user_id, " +
    " quiz.type, quiz_instance.create_timestamp, quiz_instance.end_timestamp " +
    " order by  quiz_instance.create_timestamp desc, quiz_instance.quiz_instance_id, quiz_instance.quiz_id  ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [userId], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

/*Global variable for shared select list between getQuizes and searchQuizesForPrefix*/
const sqlSubstringForGetAndSearch =
  " SELECT Quiz.id, Quiz.description, Quiz.name,  Quiz.author_id, Quiz.duration_minutes, Quiz.type, Quiz.thumbnail ";

exports.getQuizes = function (req, res, next) {
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
    sqlSubstringForGetAndSearch +
    " FROM Quiz " +
    " where Quiz.deleted=false order by ctid  offset $1 limit $2 ";

  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.searchQuizesForPrefix = function (req, res, next) {
  let searchKey = req.body.searchKey;
  searchKey += "%";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    sqlSubstringForGetAndSearch +
    " from Quiz  " +
    " where deleted=false and name ilike  $1";

  pool.query(sql, [searchKey], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.searchQuizes = function (req, res, next) {
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
    "select distinct A.id, ts_headline('english', A.description, query, 'HighlightAll=true') description, " +
    " ts_headline('english', A.name, query, 'HighlightAll=true') as name, " +
    "  A.type, A.author_id, A.duration_minutes, ts_rank_cd(search_tsv, query, 32) rank  " +
    " from Quiz A, plainto_tsquery('english', $1) query " +
    " where A.deleted=false and search_tsv@@query  order by rank desc ";

  pool.query(sql, [searchKey], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.deleteQuizInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let quizId = req.body.id;

  /*var sql="UPDATE QUIZ SET  deleted=true, modified_timestamp=now() where id=$1 ";
  var sql1="UPDATE Quiz_Course SET  deleted=true, modified_timestamp=now() where quiz_id=$1 ";*/
  var sql = "select quiz_delete($1)";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [quizId], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({ deletestatus: "error" });
    } else {
      setCorsHeaders(req, res);
      console.log("quiz deleted");
      res.json({ deletestatus: "ok" });
    }
  });
};

exports.addQuizToCourse = function (req, res, next) {
  let quizId = req.body.quizId;
  let courseId = req.body.courseId;

  //console.log(quizId+'-'+courseId);

  var sql = "select quiz_addto_course(p_quiz_id:=$1, p_course_id:=$2);";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [quizId, courseId], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({ addstatus: "error" });
    } else {
      setCorsHeaders(req, res);
      if (result.rows != undefined && result.rows.length > 0)
        res.json({ addstatus: result.rows[0].quiz_addto_course });
      else res.json({ addstatus: "ok" });
    }
  });
};

/*api method for updating a quiz*/
exports.editQuizInDbJson = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let type = req.body.type;
  let description = req.body.description;
  let name = req.body.name;
  let thumbnail = req.body.thumbnail;
  let coursesArray = [];
  if (req.body.coursesArray) coursesArray = JSON.parse(req.body.coursesArray);
  let problemsArray = [];
  if (req.body.problemsArray)
    problemsArray = JSON.parse(req.body.problemsArray);
  let categoriesArray = [];
  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let duration_minutes = req.body.duration_minutes;

  let coursesId = [];

  Object.values(coursesArray).forEach((item, i) => {
    coursesId.push(item.id);
  });

  let problemsId = [];

  Object.values(problemsArray).forEach((item, i) => {
    problemsId.push(item.id);
  });

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  console.log("quizid " + id);
  console.log("ProblemsArray\n" + JSON.stringify(problemsArray));
  /*  console.log('CoursesId\n'+coursesId);

  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Credentials',true);
  res.json({"updatestatus":"ok"});*/

  let sql =
    "select quiz_update(p_id:=$1, p_description:=$2, p_name:=$3, " +
    " p_duration_minutes:=$4, p_type:=$5, p_courses_id:=$6, p_problems_id:=$7, " +
    " p_categories_id:=$8, p_thumbnail:=$9)";

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
      id,
      description,
      name,
      duration_minutes,
      type,
      coursesId,
      problemsId,
      categoriesId,
      thumbnail,
    ],
    function (err, result, fields) {
      if (err) {
        next(err);
        //res.json({ updatestatus: "error" });
      } else {
        setCorsHeaders(req, res);
        console.log("quiz updated");
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

/*Api version of showTheQuiz*/
exports.getTheQuiz = function (req, res, next) {
  let quizId = req.body.quizId;
  let authorName = req.body.authorName;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    " SELECT A.description, A.name, " +
    " A.author_id, A.duration_minutes, A.type, A.thumbnail,  " +
    " avg(B.rating) rating, count(distinct C.*) likes,  " +
    " case when exists(select 1 from user_like where id=$1 and user_id=$2 and deleted=false) then true else false end liked " +
    " FROM Quiz A " +
    " left join user_rating B on A.id=B.id  " +
    " left join user_like C on A.id=C.id and C.deleted=false " +
    " where A.id=$1 " +
    " GROUP BY A.description, A.name, A.author_id, A.duration_minutes, A.type, A.thumbnail ";

  var sql1 =
    "SELECT id,name, description, author_id FROM Course " +
    " inner join Quiz_Course on Course.id=Quiz_Course.course_id " +
    " where Course.deleted=false and Quiz_Course.deleted=false and Quiz_Course.Quiz_id=$1";

  let sql2 =
    "SELECT id, description, options, solution, author_id, type " +
    " FROM Problem " +
    " INNER JOIN Problem_Quiz on Problem.id=Problem_Quiz.problem_id " +
    " where Problem_Quiz.quiz_id=$1 and Problem.deleted=false and Problem_Quiz.deleted=false";

  let sql3 =
    "select B.ID, B.name  from category_association A " +
    " inner join category B on A.category_id=B.id and A.DELETED=false and B.deleted=false " +
    " where A.id=$1 ";

  let resObj = {};

  pool.query(sql, [quizId, authorName], function (err, result, fields) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      resObj.description = result.rows[0]?.description;
      resObj.name = result.rows[0]?.name;
      resObj.author_id = result.rows[0]?.author_id;
      resObj.duration_minutes = result?.rows[0]?.duration_minutes;
      resObj.thumbnail = result?.rows[0]?.thumbnail;
      resObj.type = result?.rows[0]?.type;
      resObj.rating = result?.rows[0]?.rating;
      resObj.likes = result?.rows[0]?.likes;
      resObj.liked = result?.rows[0]?.liked;
      resObj.coursesArray = [];

      pool.query(sql1, [quizId], function (err, result1, fields) {
        if (err) {
          next(err);
          //res.json(resObj);
        } else {
          resObj.coursesArray = result1.rows;
          resObj.problemsArray = [];
          pool.query(sql2, [quizId], function (err, result2, fields) {
            if (err) next(err);
            else {
              resObj.problemsArray = result2?.rows;
              resObj.categoriesArray = [];
              pool.query(sql3, [quizId], function (err, result3, fields) {
                if (err) next(err);
                else {
                  resObj.categoriesArray = result3.rows;
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

exports.getProblemListForQuizJson = function (req, res, next) {
  let quizId = req.body.quizId;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  var sql =
    "SELECT id, description, options, solution, author_id, type " +
    " FROM Problem " +
    " INNER JOIN Problem_Quiz on Problem.id=Problem_Quiz.problem_id " +
    " where Problem_Quiz.quiz_id=$1 and Problem.deleted=false and Problem_Quiz.deleted=false";
  pool.query(sql, [quizId], function (err, result, fields) {
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

/* function for returning a Promise object that retrives the 
set of categories related to a selected quiz*/
exports.getCategoryListForQuizJson = function (req, res, next) {
  let quizId = req.body.quizId;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  var sql =
    "SELECT Category.id, Category.name FROM Category " +
    " inner join Quiz_Category on Category.id=Quiz_Category.category_id where Quiz_Category.quiz_id=$1 " +
    " and Quiz_Category.deleted=false";
  pool.query(sql, [quizId], function (err, result, fields) {
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
