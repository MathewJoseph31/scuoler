//const mysql = require('mysql');
const pg = require("pg");
//const mysql = new pg.Client(connectionString);
//mysql.connect();

const url = require("url");
const { v4: uuidv4 } = require("uuid");

const configuration = require("../Configuration");
const util = require("../util");
const utils = require("../utils/Utils");

let { setCorsHeaders } = utils;

//----PROBLEM----

exports.addProblemToQuiz = async function (req, res, next) {
  let problemId = req.body.problemId;
  let quizId = req.body.quizId;

  //console.log(problemId+'-'+quizId);

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

  var sql = "select problem_addto_quiz(p_problem_id:=$1, p_quiz_id:=$2);";

  pool.query(sql, [problemId, quizId], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ addstatus: "error" });
    } else {
      setCorsHeaders(req, res);
      if (result.rows != undefined && result.rows.length > 0)
        res.json({ addstatus: result.rows[0].problem_addto_quiz });
      else res.json({ addstatus: "ok" });
    }
  });
};

//----PROBLEM----

/* API version of insertproblemToDB table in database*/
exports.insertProblemBulk = async function (req, res, next) {
  let problemsArray = JSON.parse(req.body.problemsArray);
  let authorId = req.body.authorId;

  let idPrefix = utils.getUniqueId(authorId);
  problemsArray = problemsArray.map((problem, index) => {
    return {
      ...problem,
      author_id: authorId,
      id: idPrefix + index,
      //id: uuidv4(),
      answerkey: !problem.answerkey ? -1 : problem.answerkey,
    };
  });

  console.log(problemsArray);

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

  let sql = "select problem_insert_bulk(p_problems :=$1::json[]);";

  pool.query(sql, [problemsArray], function (err, result) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ insertstatus: "error" });
    } else {
      setCorsHeaders(req, res);
      res.json({ insertstatus: "ok", problemsArray });
    }
  });
};

/* API version of insertproblemToDB table in database*/
exports.insertProblemToDbJson = async function (req, res, next) {
  //let quizId=req.body.quizId;
  let quizesArray = JSON.parse(req.body.quizesArray);
  let problemDescription = req.body.probDescription;
  let options = JSON.parse(req.body.options);
  let problemType = req.body.problemType;
  let solutionOpen = req.body.solutionOpen;
  let problemOpen = req.body.problemOpen;
  let answerKey = req.body.answerKey;
  let ansDescription = req.body.ansDescription;
  let authorName = req.body.authorName;
  let maximumMarks = req.body.maximumMarks;
  let negativeMarks = req.body.negativeMarks;

  if (answerKey === "") {
    answerKey = -1;
  }

  let categoriesArray = [];

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  let quizesId = [];
  Object.values(quizesArray).forEach((item, i) => {
    quizesId.push(item.id);
  });

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
    "select problem_insert(p_id :=$1, p_description:=$2, p_options:=$3, " +
    "  p_solution:=$4, p_answerkey:=$5, p_author_id:=$6, p_quizes_id:=$7, " +
    ` p_categories_id:=$8, p_type:=$9, p_problem_open:=$10, p_solution_open:=$11, 
    p_maxmarks:=$12, p_negative_marks:=$13);`;

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
      categoriesId,
      problemType,
      problemOpen,
      solutionOpen,
      maximumMarks,
      negativeMarks,
    ],
    function (err, result) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({ insertstatus: "error" });
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", problemId: problemId });
      }
    }
  );
};

exports.editProblemInDB = async function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let problemId = req.body.id;
  let description = req.body.description;
  let type = req.body.type;
  let problemOpen = req.body.problemOpen;
  let solutionOpen = req.body.solutionOpen;

  let options = JSON.parse(req.body.options);
  let answerkey = req.body.answerkey;
  let quizId = req.body.quizId;
  let quizesArray = JSON.parse(req.body.quizesArray);
  let solution = req.body.solution;
  let authorId = req.body.authorId;

  let maximumMarks = req.body.maximumMarks;
  let negativeMarks = req.body.negativeMarks;

  let categoriesArray = [];

  if (req.body.categoriesArray)
    categoriesArray = JSON.parse(req.body.categoriesArray);

  let categoriesId = [];

  Object.values(categoriesArray).forEach((item, i) => {
    categoriesId.push(item.id);
  });

  if (answerkey == undefined || answerkey == "" || answerkey == "null") {
    answerkey = null;
  }

  let quizesId = [];

  Object.values(quizesArray).forEach((item, i) => {
    quizesId.push(item.id);
  });

  var sql = `select problem_update(p_id:=$1,p_description:=$2,p_options:=$3, 
     p_solution:=$4, p_answerkey:=$5, p_quizes_id:=$6, p_categories_id:=$7, p_type:=$8, 
     p_problem_open:=$9, p_solution_open:=$10, p_maxmarks:=$11, p_negative_marks:=$12);`;

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
      problemId,
      description,
      options,
      solution,
      answerkey,
      quizesId,
      categoriesId,
      type,
      problemOpen,
      solutionOpen,
      maximumMarks,
      negativeMarks,
    ],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        //console.log(err);
        next(err);
        //res.json({ updatestatus: "error" });
      } else {
        //console.log(result);
        setCorsHeaders(req, res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

exports.deleteProblemInDB = async function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let problemId = req.body.id;

  //  console.log(problemId);

  var sql = "select problem_delete(p_id:=$1)";

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

  pool.query(sql, [problemId], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ deletestatus: "error" });
    } else {
      setCorsHeaders(req, res);
      console.log("problem deleted");
      res.json({ deletestatus: "ok" });
    }
  });
};

exports.getTheProblem = async function (req, res, next) {
  let problemId = req.body.problemId;
  let authorId = req.body.authorId;

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

  var sql = "select * from problem_get_one(p_id:=$1, p_author_id:=$2)";

  var sql1 =
    "SELECT Quiz.id, Quiz.description, Quiz.name, Quiz.author_id, Quiz.duration_minutes " +
    " FROM Quiz inner join Problem_Quiz on Quiz.id=Problem_Quiz.quiz_id " +
    " where Quiz.deleted=false and Problem_Quiz.deleted=false and Problem_Quiz.problem_id=$1";

  let sql2 =
    "select B.ID, B.name  from category_association A " +
    " inner join category B on A.category_id=B.id and A.DELETED=false and B.deleted=false " +
    " where A.id=$1 ";

  let resObj = {};
  pool.query(sql, [problemId, authorId], function (err, result, fields) {
    if (err) {
      pool.end(() => {});
      next(err);
    } else {
      if (result.rows !== undefined && result.rows.length > 0) {
        resObj.id = result.rows[0].id;
        resObj.description = result.rows[0].description;
        resObj.options = result.rows[0].options;
        if (!resObj.options) resObj.options = [];
        resObj.answerkey = result.rows[0].answerkey;
        resObj.solution = result.rows[0].solution;
        resObj.type = result.rows[0].type;
        resObj.author_id = result.rows[0].author_id;
        resObj.author_name = result.rows[0].author_name;
        resObj.question_for_problem = result.rows[0].question_for_problem;
        resObj.option_sequence_alphabetical =
          result.rows[0].option_sequence_alphabetical;
        resObj.ads = result.rows[0].ads;
        resObj.source = result.rows[0].source;
        resObj.problem_open = result.rows[0].problem_open;
        resObj.solution_open = result.rows[0].solution_open;
        resObj.maxmarks = result.rows[0].maxmarks;
        resObj.negative_marks = result.rows[0].negative_marks;
        resObj.view_count = result.rows[0].view_count;
        resObj.rating = result.rows[0].rating;
        resObj.likes = result.rows[0].likes;
        resObj.liked = result.rows[0].liked;
        resObj.quizesArray = [];
      }

      pool.query(sql1, [problemId], function (err, result1, fields) {
        if (err) {
          pool.end(() => {});
          next(err);
          //res.json(resObj);
        } else {
          resObj.quizesArray = result1.rows;
          resObj.categoriesArray = [];

          pool.query(sql2, [problemId], function (err, result2, fields) {
            pool.end(() => {});
            if (err) next(err);
            else {
              resObj.categoriesArray = result2.rows;
              setCorsHeaders(req, res);
              res.json(resObj);
            }
          });
        }
      });
    }
  });
};

exports.getProblems = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 30;
  let currentPage = queryObject.currentPage || 1;
  let category = queryObject.category || "";
  let language = queryObject.language || "";
  let sort = queryObject.sort || "";
  let author = queryObject.author || "";
  let authorFilter = utils.parseBool(queryObject.authorFilter);
  //console.log(queryObject);

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

  var sql = `select A.id,  A.description, A.options,  A.answerkey, 
     A.solution, A.type, A.problem_open, A.solution_open, A.maxmarks, 
     A.negative_marks, A.author_id, A.source, A.author_name, A.view_count  
     from problem_get_all(p_category:=$1, p_language:=$2, p_sort:=$3, p_author:=$4, p_author_filter:=$5, p_offset:=$6, p_limit:=$7) A `;

  pool.query(
    sql,
    [
      category,
      language,
      sort,
      author ? author : req.role === "ADMIN" ? "*" : "",
      authorFilter,
      offset,
      pageSize,
    ],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        var resultArr = [];
        var i = 0;
        for (i = 0; i < result.rows.length; i++) {
          resultArr.push(result.rows[i]);
        }
        const jsonStr = JSON.stringify(resultArr);
        const encStr = util.encrypt(jsonStr);
        setCorsHeaders(req, res);
        res.json(encStr);
        //res.json(resultArr);
      }
    }
  );
};

exports.searchProblems = async function (req, res, next) {
  let searchKey = req.body.searchKey;
  let authorId = req.body.authorId;
  let pageSize = req.body.pageSize || 20;
  let currentPage = req.body.currentPage || 1;
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

  var sql = `select id, description, solution, options,  
     answerkey, type, solution_open, maxmarks, negative_marks, author_id, source, rank, author_name, view_count  
     from problem_search(p_search_key:= $1, p_author_id:=$2, p_offset:=$3, p_limit:=$4) `;

  pool.query(
    sql,
    [searchKey, req.role === "ADMIN" ? "*" : authorId, offset, pageSize],
    function (err, result, fields) {
      pool.end(() => {});

      if (err) next(err);
      else {
        //setCorsHeaders(req, res);
        //res.json(result.rows);
        const jsonStr = JSON.stringify(result.rows);
        const encStr = util.encrypt(jsonStr);
        setCorsHeaders(req, res);
        res.json(encStr);
      }
    }
  );
};
