const pg = require("pg");
const url = require("url");
const { v4: uuidv4 } = require("uuid");
const fsPromises = require("fs/promises");
const path = require("path");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
const { setCorsHeaders, convertDateToString, formatLogLines } = utils;

const ipUtils = require("../utils/ipUtils");
let { getIpDetailsForIpArray } = ipUtils;

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

exports.getWebLogsForObject = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let objectType = queryObject.objectType;
  let objectId = queryObject.objectId;

  let pageSize = queryObject.pageSize || 100;
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
      log_timestamp,
      request_method_url, 
      response_status,
      response_length,
      referrer,
      user_agent,
      create_timestamp,
      log_filename
    from web_logs_object_get(p_object_id:=$1, p_object_type:=$2) 
    order by log_timestamp desc
    limit $3 offset $4
      `;

  pool.query(
    sql,
    [objectId, objectType, pageSize, offset],
    async function (err, result, fields) {
      pool.end(() => {});
      if (err) next(err);
      else {
        let ipMap = {};
        let resArray = result.rows.map((obj) => {
          const formattedIp = obj.source_ip.replace(/::ffff:/, "");
          ipMap[formattedIp] = true;
          return { ...obj, source_ip: formattedIp };
        });
        let ipArray = Object.keys(ipMap);

        //note: Max length of ipArray param should be 100
        getIpDetailsForIpArray(ipArray)
          .then((ipResArray) => {
            resArray = resArray.map((obj) => {
              let ipFiltered = ipResArray.filter((ipObj) => {
                return ipObj.query === obj.source_ip;
              });
              if (ipFiltered?.length > 0) {
                return { ...obj, ...ipFiltered[0] };
              } else {
                return obj;
              }
            });
            setCorsHeaders(req, res);
            res.json(resArray);
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      }
    }
  );
};
