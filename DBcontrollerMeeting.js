const pg = require("pg");
const url = require("url");

const configuration = require("./Configuration");
const utils = require("./utils/Utils");
let { setCorsHeaders } = utils;

/*Global variable for shared select list between getQuizes and searchQuizesForPrefix*/
const sqlSubstringForGetAndSearch =
  " SELECT Meeting.id, Meeting.description,  Meeting.organiser_id ";

exports.getMeetingsListAsync = async function () {
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
    " FROM Meeting " +
    " where Meeting.deleted=false order by ctid  ";

  let result = await pool.query(sql);
  return result.rows;
};

exports.getMeetings = function (req, res, next) {
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
    " FROM Meeting " +
    " where Meeting.deleted=false order by ctid  offset $1 limit $2 ";

  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(res);
      res.json(result.rows);
    }
  });
};

/* Api verison of InsertMeetingToDB in database*/
exports.insertMeetingToDbJson = function (req, res, next) {
  let description = req.body.meetingDescription;
  let organiserId = req.body.organiserId;
  let meetingId = utils.getUniqueId(organiserId);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql = "insert into Meeting(id,description,organiser_id) values($1,$2,$3)";

  pool.query(sql, [meetingId, description, organiserId], (err, result) => {
    if (err) {
      next(err);
      //res.json({"insertstatus":"error"});
    } else {
      setCorsHeaders(res);
      res.json({ insertstatus: "ok", meetingId: meetingId });
    }
  });
};
