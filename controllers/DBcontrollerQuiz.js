//const mysql = require('mysql');
const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const url = require("url");

const configuration = require("../Configuration");
const dbControllerCourse = require("./DBcontrollerCourse");

const utils = require("../utils/Utils");

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
      pool.end(() => {});
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
exports.insertQuizToDbJson = async function (req, res, next) {
  let quizDescription = req.body.quizDescription;
  let quizName = req.body.quizName;
  let duration_minutes = req.body.duration_minutes;
  let quizType = req.body.quizType;
  let authorName = req.body.authorName;
  let thumbnail = req.body.thumbnail;

  let resultsOpen = req.body.resultsOpen === "true";
  let practiceAllowed = req.body.practiceAllowed === "true";
  let repeatsAllowed = req.body.repeatsAllowed === "true";
  let attemptsAllowedAtAllTimes = req.body.attemptsAllowedAtAllTimes === "true";
  let attemptsAllowedStartTimestamp = req.body.attemptsAllowedStartTimestamp;
  let attemptsAllowedEndTimestamp = req.body.attemptsAllowedEndTimestamp;
  let quizTakersAccessAll = req.body.quizTakersAccessAll === "true";
  let takersArray = JSON.parse(req.body.takersArray);

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
    "select quiz_insert(p_id:=$1, p_description:=$2, p_name:=$3, p_duration_minutes:=$4," +
    " p_type:=$5, p_author_id:=$6, p_courses_id:=$7, p_problems_id:=$8,   " +
    ` p_categories_id:=$9, p_thumbnail :=$10, p_results_open:=$11, p_practice_allowed:=$12, 
     p_repeats_allowed:=$13, p_attempts_allowed_at_all_times:=$14, 
     p_attempts_allowed_start_timestamp:=$15, p_attempts_allowed_end_timestamp:=$16, 
     p_attempt_access_to_all_users:=$17, p_role_name_quiz_taker:=$18, p_takers_id:=$19)`;

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
      resultsOpen,
      practiceAllowed,
      repeatsAllowed,
      attemptsAllowedAtAllTimes,
      attemptsAllowedStartTimestamp,
      attemptsAllowedEndTimestamp,
      quizTakersAccessAll,
      constants.ROLE_NAME_QUIZ_TAKER,
      takersArray,
    ],
    function (err, result) {
      pool.end(() => {});
      if (err) {
        console.log(err);
        //res.json({ insertstatus: "error" });
        next(err);
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", quizId: quizId });
      }
    }
  );
};

/*Api method to be invoked before starting a quiz at front end*/
exports.quizStart = async function (req, res, next) {
  let quizId = req.body.quizId;
  let startTime = req.body.startTime;
  let userId = req.userId || req.body.userId;
  let userEmail = req.email;
  let repeatsAllowed = req.body.repeatsAllowed === "true";
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

  let sql = `select ((select repeats_allowed from quiz where deleted=false and id=$1) or count(*)=0) as start_quiz from quiz_instance where quiz_id=$1 and user_id=$2 and deleted=false and create_timestamp>(now()-interval '365 days');`;
  pool.query(sql, [quizId, userId], function (err, result) {
    if (err) {
      next(err);
    } else if (result.rows[0]?.start_quiz === false) {
      setCorsHeaders(req, res);
      res.json({
        insertstatus: "error",
        message: "Repeat Attempts Not Allowed For This Quiz",
      });
    } else {
      let quizInstanceId = utils.getUniqueId(quizId);
      let sql1 =
        "insert into quiz_instance(quiz_instance_id, quiz_id,  user_id) values($1,$2,$3)";
      pool.query(
        sql1,
        [quizInstanceId, quizId, userId],
        function (err, result) {
          pool.end(() => {});
          if (err) {
            next(err);
            //res.json({ insertstatus: "error" });
          } else {
            setCorsHeaders(req, res);
            res.json({ insertstatus: "ok", quizInstanceId: quizInstanceId });
          }
        }
      );
    }
  });

  /**/
};

/*Api method to be invoked to submit answers of a quiz */
exports.quizAnwersSubmit = async function (req, res, next) {
  let quizId = req.body.quizId;
  let quizType = req.body.quizType;
  let quizInstanceId = req.body.quizInstanceId;
  let answersObject = JSON.parse(req.body.answersObject);
  //console.log(quizType);
  //console.log(JSON.stringify(answersObject));

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
      pool.end(() => {});
      next(err);
      //res.json({ insertstatus: "error" });
    } else {
      if (answersObject == null || Object.keys(answersObject).length == 0) {
        pool.end(() => {});
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok" });
      } else {
        pool.query(sql1, answersArr, function (err, result) {
          pool.end(() => {});
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

exports.updateQuizMarksAwarded = async function (req, res, next) {
  let quizInstanceId = req.body.quizInstanceId;
  let marksAwardedString = req.body.marksAwardedArray;
  let marksAwardedArray = JSON.parse(marksAwardedString);
  //console.log(Array.isArray(marksAwardedArray));

  let sql = "select quiz_marks_awarded_update($1, $2)";

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
    [quizInstanceId, marksAwardedArray],
    function (err, result, fields) {
      pool.end(() => {});

      if (err) next(err);
      else {
        setCorsHeaders(req, res);
        //console.log(result);
        res.json('{"updatestatus":"ok"}');
      }
    }
  );
};

const constants = require("../Constants");

exports.getQuizInstanceProblems = async function (req, res, next) {
  let quizInstanceId = req.body.quizInstanceId;

  let sql = "select * from quiz_instance_problems_get(p_quizInstanceId:=$1);";

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

  pool.query(sql, [quizInstanceId], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
    } else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.quizGetInstances = async function (req, res, next) {
  let quizId = req.body.quizId;

  let sql = "select * from quiz_instances_get(p_quizId:=$1)";

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

  pool.query(sql, [quizId], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.quizGetScoresForUser = async function (req, res, next) {
  let userId = req.body.userId;

  let sql = "select * from quiz_user_scores_get(p_userId:=$1)";

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

  pool.query(sql, [userId], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.getQuizes = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  let category = queryObject.category || "";
  let language = queryObject.language || "";
  let sort = queryObject.sort || "";
  let author = queryObject.author || "";
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
    " SELECT id, description, name,  author_id, duration_minutes, type, thumbnail, author_name, view_count " +
    " from quiz_get_all(p_category:=$1, p_language:=$2, p_sort:=$3, p_author:=$4, p_offset:=$5, p_limit:=$6)  ";
  //" FROM Quiz where Quiz.deleted=false order by ctid  offset $1 limit $2 ";

  pool.query(
    sql,
    [category, language, sort, author, offset, pageSize],
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

exports.searchQuizesForPrefix = async function (req, res, next) {
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
    " SELECT id, description, name,  author_id, duration_minutes, type, thumbnail " +
    " from Quiz  " +
    " where deleted=false and trim(name) ilike  $1 ";

  pool.query(sql, [`${searchKey}%`], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.searchQuizes = async function (req, res, next) {
  let searchKey = req.body.searchKey;
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

  var sql = `select id, name, description, type, author_id, author_name, duration_minutes, view_count, rank  
    from quiz_search(p_search_key:=$1, p_offset:=$2, p_limit:=$3) 
`;

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

exports.deleteQuizInDB = async function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let quizId = req.body.id;

  var sql = "select quiz_delete($1)";

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

  pool.query(sql, [quizId], function (err, result, fields) {
    pool.end(() => {});
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

exports.addQuizToCourse = async function (req, res, next) {
  let quizId = req.body.quizId;
  let courseId = req.body.courseId;

  //console.log(quizId+'-'+courseId);

  var sql = "select quiz_addto_course(p_quiz_id:=$1, p_course_id:=$2);";

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

  pool.query(sql, [quizId, courseId], function (err, result, fields) {
    pool.end(() => {});
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
exports.editQuizInDbJson = async function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let type = req.body.type;
  let description = req.body.description;
  let name = req.body.name;
  let thumbnail = req.body.thumbnail;
  let resultsOpen = req.body.resultsOpen === "true";
  let practiceAllowed = req.body.practiceAllowed === "true";
  let repeatsAllowed = req.body.repeatsAllowed === "true";
  let attemptsAllowedAtAllTimes = req.body.attemptsAllowedAtAllTimes === "true";
  let attemptsAllowedStartTimestamp = req.body.attemptsAllowedStartTimestamp;
  let attemptsAllowedEndTimestamp = req.body.attemptsAllowedEndTimestamp;
  let quizTakersAccessAll = req.body.quizTakersAccessAll === "true";

  let takersArray = [];

  if (req.body.takersArray) takersArray = JSON.parse(req.body.takersArray);

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

  let sql =
    "select quiz_update(p_id:=$1, p_description:=$2, p_name:=$3, " +
    " p_duration_minutes:=$4, p_type:=$5, p_courses_id:=$6, p_problems_id:=$7, " +
    ` p_categories_id:=$8, p_thumbnail:=$9, p_results_open:=$10, p_practice_allowed:=$11, 
    p_repeats_allowed:=$12, p_attempts_allowed_at_all_times:=$13,
    p_attempts_allowed_start_timestamp:=$14, p_attempts_allowed_end_timestamp:=$15, 
    p_attempt_access_to_all_users:=$16, p_role_name_quiz_taker:=$17, p_takers_id:=$18 )
    `;

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
      description,
      name,
      duration_minutes,
      type,
      coursesId,
      problemsId,
      categoriesId,
      thumbnail,
      resultsOpen,
      practiceAllowed,
      repeatsAllowed,
      attemptsAllowedAtAllTimes,
      attemptsAllowedStartTimestamp,
      attemptsAllowedEndTimestamp,
      quizTakersAccessAll,
      constants.ROLE_NAME_QUIZ_TAKER,
      takersArray,
    ],
    function (err, result, fields) {
      pool.end(() => {});
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
exports.getTheQuiz = async function (req, res, next) {
  let quizId = req.body.quizId;
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

  var sql = "select * from quiz_get_one(p_id:=$1, p_author_id:=$2)";

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

  let sql4 = `select B.ID, coalesce(B.first_name,'') first_name, coalesce(B.last_name, '') last_name, 
     coalesce(B.address1,'') address1, coalesce(B.address2, '') address2, 
     coalesce(B.city, '') city, coalesce(B.zip, '') zip, 
      coalesce(B.phone, '') phone, coalesce(B.mobile, '') mobile, 
      coalesce(B.email, '') email, B.sex_male, B.profile_image_url
     from role_membership A 
     inner join customer B on A.user_id=B.id and A.DELETED=false and B.deleted=false 
     where A.source_object_id=$1 and A.role_name=$2 `;

  let resObj = {};

  pool.query(sql, [quizId, authorName], function (err, result, fields) {
    if (err) {
      pool.end(() => {});
      next(err);
    } else {
      resObj.description = result.rows[0]?.description;
      resObj.name = result.rows[0]?.name;
      resObj.author_id = result.rows[0]?.author_id;
      resObj.author_name = result.rows[0]?.author_name;
      resObj.question_for_problem = result.rows[0]?.question_for_problem;
      resObj.option_sequence_alphabetical =
        result.rows[0]?.option_sequence_alphabetical;
      resObj.duration_minutes = result?.rows[0]?.duration_minutes;
      resObj.thumbnail = result?.rows[0]?.thumbnail;
      resObj.type = result?.rows[0]?.type;
      resObj.results_open = result?.rows[0]?.results_open;
      resObj.practice_allowed = result?.rows[0]?.practice_allowed;
      resObj.repeats_allowed = result?.rows[0]?.repeats_allowed;
      resObj.attempts_allowed_at_all_times =
        result?.rows[0]?.attempts_allowed_at_all_times;
      resObj.attempts_allowed_start_timestamp =
        result?.rows[0]?.attempts_allowed_start_timestamp;
      resObj.attempts_allowed_end_timestamp =
        result?.rows[0]?.attempts_allowed_end_timestamp;
      resObj.attempt_access_to_all_users =
        result?.rows[0]?.attempt_access_to_all_users;
      resObj.view_count = result?.rows[0]?.view_count;
      resObj.rating = result?.rows[0]?.rating;
      resObj.likes = result?.rows[0]?.likes;
      resObj.liked = result?.rows[0]?.liked;
      resObj.taker_ids = result?.rows[0]?.taker_ids;
      resObj.coursesArray = [];

      pool.query(sql1, [quizId], function (err, result1, fields) {
        if (err) {
          pool.end(() => {});
          next(err);
          //res.json(resObj);
        } else {
          resObj.coursesArray = result1.rows;
          resObj.problemsArray = [];
          pool.query(sql2, [quizId], function (err, result2, fields) {
            if (err) {
              pool.end(() => {});
              next(err);
            } else {
              resObj.problemsArray = result2?.rows;
              resObj.categoriesArray = [];
              pool.query(sql3, [quizId], function (err, result3, fields) {
                if (err) {
                  pool.end(() => {});
                  next(err);
                } else {
                  resObj.categoriesArray = result3.rows;
                  pool.query(
                    sql4,
                    [quizId, constants.ROLE_NAME_QUIZ_TAKER],
                    function (err, result4, fields) {
                      pool.end(() => {});
                      if (err) {
                        next(err);
                      }
                      resObj.takersArray = result4.rows;
                      setCorsHeaders(req, res);
                      res.json(resObj);
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.getProblemListForQuizJson = async function (req, res, next) {
  let quizId = req.body.quizId;
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
    "SELECT id, description, options, solution, author_id, type " +
    " FROM Problem " +
    " INNER JOIN Problem_Quiz on Problem.id=Problem_Quiz.problem_id " +
    " where Problem_Quiz.quiz_id=$1 and Problem.deleted=false and Problem_Quiz.deleted=false";
  pool.query(sql, [quizId], function (err, result, fields) {
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

/* function for returning a Promise object that retrives the 
set of categories related to a selected quiz*/
exports.getCategoryListForQuizJson = async function (req, res, next) {
  let quizId = req.body.quizId;
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
    " inner join Quiz_Category on Category.id=Quiz_Category.category_id where Quiz_Category.quiz_id=$1 " +
    " and Quiz_Category.deleted=false";
  pool.query(sql, [quizId], function (err, result, fields) {
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
