const pg = require("pg");
const url = require("url");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
let { setCorsHeaders } = utils;

/*Global variable for shared select list between getQuizes and searchQuizesForPrefix*/
const sqlSubstringForGetAndSearch =
  " SELECT Meeting.id, Meeting.description,  Meeting.organiser_id ";

exports.getMeetingsListAsync = async function () {
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
    " FROM Meeting " +
    " where Meeting.deleted=false order by ctid  ";

  let result = await pool.query(sql);
  pool.end(() => {});
  return result.rows;
};

exports.getMeetings = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
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
    sqlSubstringForGetAndSearch +
    " FROM Meeting " +
    " where Meeting.deleted=false order by ctid  offset $1 limit $2 ";

  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

/* Api verison of InsertMeetingToDB in database*/
exports.insertMeetingToDbJson = async function (req, res, next) {
  let description = req.body.meetingDescription;
  let organiserId = req.body.organiserId;
  let meetingId = utils.getUniqueId(organiserId);

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

  var sql = "insert into Meeting(id,description,organiser_id) values($1,$2,$3)";

  pool.query(sql, [meetingId, description, organiserId], (err, result) => {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({"insertstatus":"error"});
    } else {
      setCorsHeaders(req, res);
      res.json({ insertstatus: "ok", meetingId: meetingId });
    }
  });
};
