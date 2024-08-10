const pg = require("pg");
const url = require("url");
const { v4: uuidv4 } = require("uuid");
const fsPromises = require("fs/promises");
const path = require("path");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
const { setCorsHeaders, convertDateToString, formatLogLines } = utils;

const constants = require("../Constants");

exports.getWebLogs = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let startDateTime = queryObject.startDate;
  let endDateTime = queryObject.endDate;

  let dt_startDateTime_utc = new Date(startDateTime);
  let dt_endDateTime_utc = new Date(endDateTime);

  let pageSize = queryObject.pageSize || 500;
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

  var sql = `
      select 
          source_ip,
          user_id,
          log_timestamp,
          request_method_url,
          response_status,
          response_length,
          referrer,
          user_agent,
          log_filename 
    from web_logs 
    where log_timestamp>= $1 and log_timestamp< $2
    order by log_timestamp
    limit $3 offset $4
      `;

  pool.query(
    sql,
    [dt_startDateTime_utc, dt_endDateTime_utc, pageSize, offset],
    async function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        let nowDateTime = new Date();
        let formattedLinesToday = [];
        if (
          dt_endDateTime_utc > nowDateTime &&
          result?.rows?.length < pageSize
        ) {
          let todaysLogFileName = "access.log";
          let logContents = await fsPromises.readFile(
            path.join(constants.LOG_DIRECTORY_PATH, todaysLogFileName),
            { encoding: "utf-8" }
          );
          if (logContents) {
            formattedLinesToday = formatLogLines(
              logContents.split("\n"),
              todaysLogFileName
            );
            //console.log(formattedLines);
          }
        }

        setCorsHeaders(req, res);
        res.json([...result.rows, ...formattedLinesToday]);
      }
    }
  );
};
