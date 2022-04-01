//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const url = require("url");

const configuration = require("./Configuration");
const util = require("./util");
const utils = require("./utils/Utils");

let { setCorsHeaders } = utils;

//----PROBLEM----

exports.addProblemToQuiz = function (req, res, next) {
  let problemId = req.body.problemId;
  let quizId = req.body.quizId;

  //console.log(problemId+'-'+quizId);

  var sql = "select problem_addto_quiz(p_problem_id:=$1, p_quiz_id:=$2);";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [problemId, quizId], function (err, result, fields) {
    setCorsHeaders(res);
    if (err) {
      next(err);
      //res.json({ addstatus: "error" });
    }
    if (result.rows != undefined && result.rows.length > 0)
      res.json({ addstatus: result.rows[0].problem_addto_quiz });
    else res.json({ addstatus: "ok" });
  });
};

//----PROBLEM----

/* API version of insertproblemToDB table in database*/
exports.insertProblemToDbJson = function (req, res, next) {
  //let quizId=req.body.quizId;
  let quizesArray = JSON.parse(req.body.quizesArray);
  let problemDescription = req.body.probDescription;
  let options = JSON.parse(req.body.options);
  let problemType = req.body.problemType;
  let answerKey = req.body.answerKey;
  let ansDescription = req.body.ansDescription;
  let authorName = req.body.authorName;

  if (answerKey === "") {
    answerKey = -1;
  }

  let quizesId = [];
  Object.values(quizesArray).forEach((item, i) => {
    quizesId.push(item.id);
  });

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  //console.log("Dbcontroller insert problem "+quizId);
  /*var sql = "insert into Problem(id, description, option1, option2, option3, option4, solution, answerkey, author_id) values($1,$2,$3,$4,$5, $6, $7, $8, $9)";
  var sql1 = "insert into problem_quiz(problem_id, quiz_id) values($1, $2)";*/

  /*var sql =
    "select problem_insert(p_id :=$1, p_description:=$2, p_option1:=$3, p_option2:=$4," +
    " p_option3:=$5, p_option4:=$6, p_solution:=$7, p_answerkey:=$8, p_author_id:=$9, p_quizes_id:=$10, p_type:=$11);";*/

  var sql =
    "select problem_insert(p_id :=$1, p_description:=$2, p_options:=$3, " +
    "  p_solution:=$4, p_answerkey:=$5, p_author_id:=$6, p_quizes_id:=$7, p_type:=$8);";

  var problemId = utils.getUniqueId(authorName);

  pool.query(
    sql,
    [
      problemId,
      problemDescription,
      options,
      ansDescription,
      answerKey,
      authorName,
      quizesId,
      problemType,
    ],
    function (err, result) {
      if (err) {
        next(err);
        //res.json({ insertstatus: "error" });
      } else {
        setCorsHeaders(res);
        res.json({ insertstatus: "ok", problemId: problemId });
      }
    }
  );
};

exports.editProblemInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let problemId = req.body.id;
  let description = req.body.description;
  let type = req.body.type;
  let options = JSON.parse(req.body.options);
  /*let option1 = req.body.option1;
  let option2 = req.body.option2;
  let option3 = req.body.option3;
  let option4 = req.body.option4;*/
  let answerkey = req.body.answerkey;
  let quizId = req.body.quizId;
  let quizesArray = JSON.parse(req.body.quizesArray);
  var solution = req.body.solution;
  var authorId = req.body.authorId;

  if (answerkey == undefined || answerkey == "" || answerkey == "null") {
    answerkey = null;
  }

  let quizesId = [];

  Object.values(quizesArray).forEach((item, i) => {
    quizesId.push(item.id);
  });

  /*  var sql =
    "select problem_update(p_id:=$1,p_description:=$2,p_option1:=$3,p_option2:=$4, " +
    "p_option3:=$5, p_option4:=$6, p_solution:=$7, p_answerkey:=$8, p_quizes_id:=$9, p_type:=$10);";*/

  var sql =
    "select problem_update(p_id:=$1,p_description:=$2,p_options:=$3, " +
    " p_solution:=$4, p_answerkey:=$5, p_quizes_id:=$6, p_type:=$7);";

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
    [problemId, description, options, solution, answerkey, quizesId, type],
    function (err, result, fields) {
      if (err) {
        //console.log(err);
        next(err);
        //res.json({ updatestatus: "error" });
      } else {
        //console.log(result);
        setCorsHeaders(res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

exports.deleteProblemInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let problemId = req.body.id;

  //  console.log(problemId);

  /*var sql="UPDATE PROBLEM SET  deleted=true, modified_timestamp=now() where id=$1 ";
  var sql1="UPDATE PROBLEM_QUIZ SET  deleted=true, modified_timestamp=now() where problem_id=$1 ";*/
  var sql = "select problem_delete(p_id:=$1)";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [problemId], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({ deletestatus: "error" });
    } else {
      setCorsHeaders(res);
      console.log("problem deleted");
      res.json({ deletestatus: "ok" });
    }
  });
};

exports.getTheProblem = function (req, res, next) {
  let problemId = req.body.problemId;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "select distinct A.id, A.description, A.options, A.option1, A.option2, A.option3, A.option4, A.answerkey, " +
    "A.solution, A.type, A.author_id, A.source from Problem A " +
    " where A.deleted=false and A.id=$1";

  var sql1 =
    "SELECT Quiz.id, Quiz.description, Quiz.author_id, Quiz.duration_minutes " +
    " FROM Quiz inner join Problem_Quiz on Quiz.id=Problem_Quiz.quiz_id " +
    " where Quiz.deleted=false and Problem_Quiz.deleted=false and Problem_Quiz.problem_id=$1";

  let resObj = {};
  pool.query(sql, [problemId], function (err, result, fields) {
    if (err) next(err);

    if (result.rows !== undefined && result.rows.length > 0) {
      resObj.id = result.rows[0].id;
      resObj.description = result.rows[0].description;
      resObj.options = result.rows[0].options;
      if (!resObj.options) resObj.options = [];
      resObj.option1 = result.rows[0].option1;
      resObj.option2 = result.rows[0].option2;
      resObj.option3 = result.rows[0].option3;
      resObj.option4 = result.rows[0].option4;
      resObj.answerkey = result.rows[0].answerkey;
      resObj.solution = result.rows[0].solution;
      resObj.type = result.rows[0].type;
      resObj.author_id = result.rows[0].author_id;
      resObj.source = result.rows[0].source;
      resObj.quizesArray = [];
    }

    pool.query(sql1, [problemId], function (err, result, fields) {
      if (err) {
        next(err);
        //res.json(resObj);
      } else {
        resObj.quizesArray = result.rows;
        setCorsHeaders(res);
        res.json(resObj);
      }
    });
  });
};

exports.getProblems = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 30;
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
    "select distinct A.id, A.description, A.options, A.option1, A.option2, A.option3, A.option4, A.answerkey, " +
    " A.solution, A.type, A.author_id, A.source  from Problem A " +
    " where A.deleted=false offset $1 limit $2 ";

  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      var resultArr = [];
      var i = 0;
      for (i = 0; i < result.rows.length; i++) {
        resultArr.push(result.rows[i]);
      }
      const jsonStr = JSON.stringify(resultArr);
      const encStr = util.encrypt(jsonStr);
      setCorsHeaders(res);
      res.json(encStr);
      //res.json(resultArr);
    }
  });
};

exports.searchProblems = function (req, res, next) {
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
    " ts_headline('english', A.solution, query, 'HighlightAll=true') solution, A.options, A.option1, A.option2, A.option3, A.option4, " +
    " A.answerkey, A.type, A.author_id, A.source, ts_rank_cd(search_tsv, query, 32) rank  " +
    " from Problem A, plainto_tsquery('english', $1) query " +
    " where A.deleted=false and search_tsv@@query  order by rank desc ";

  pool.query(sql, [searchKey], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(res);
      res.json(result.rows);
    }
  });
};
