const pg = require("pg");
const url = require("url");
const { v4: uuidv4 } = require("uuid");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
const { setCorsHeaders, convertDateToString } = utils;

const constants = require("../Constants");

const { sendEmailGeneric } = require("./EmailController");

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

exports.getMeetingsOfUser = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let userId = queryObject.userId;

  let pageSize = queryObject.pageSize || 30;
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
    select id, description, participant_email_ids,
    timezone, timezone_description, start_time,
    end_time, organiser_id, notify_before_minutes 
    from meetings_of_user_get(p_user_id:=$1, p_offset:=$2, p_limit:=$3)
    order by start_time desc;
    `;

  pool.query(sql, [userId, offset, pageSize], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      let rowsAdapted = result.rows.map((obj) => {
        return {
          ...obj,
          participant_email_ids: obj.participant_email_ids.join(","),
        };
      });
      res.json(rowsAdapted);
    }
  });
};

const makeMeetingInviteBody = (
  recipients,
  description,
  timezoneDescription,
  startDateTime,
  endDateTime,
  meetingUrl
) => {
  const html = `<html>
  <body>
  <section style="background-color: #edf2fb;box-shadow: 0px 10px 5px grey; border-radius: 10px;border: 1px solid rgb(196, 196, 196);padding: 10px 5px 0px 15px">
  <h2>Hello from <a href="https://scuoler.com/scheduler">Scuoler Event Scheduler</a>,</h2>
  <h2>You have been added as a participant in the following event.</h2> 
  <hr>
  <br/>
  <p style="color:#332233;font-size: 17px;font-weight: bolder">Event:<p/> 
  <span style="margin-left:20px; background-color: #1a759f; color: white; font-size: 17px; border-radius:5px; padding: 10px">${description}</span> <br/><br/>
  <span style="color:#332233;font-size: 17px;font-weight: bolder">Participants</span>: <ul style="list-style:none">${recipients
    .split(",")
    .map((val) => {
      return `<li style="color: #1a759f; font-size: 16px;">${val.trim()}</li>`;
    })}</ul> <br/>
  <p style="color:#332233;font-size: 18px;font-weight: bolder">Timezone:</p> <span style="margin-left:18px; font-size: 18px; color: #223322"; background-color:#c7cdd2;>${timezoneDescription}</span> <br/><br/>
  <span style="font-size:18px;font-weight: bolder; width: 100px">From:</span> <span style="color:#3322ff;font-size: 18px; background-color:#c7cdd2; padding: 3px; border-radius: 2px;">${startDateTime}</span> <br/><br/>
  <span style="font-size:18px;font-weight: bolder; width: 100px">To:</span> <span style="color:#3322ff;font-size: 18px; background-color:#c7cdd2; padding: 3px; border-radius: 2px;">${endDateTime}</span> <br/><br/>
  <p style="font-size:20px;font-weight: bolder">Where:</p> <span style="margin-left:20px; font-size: 18px;"><a  href="${meetingUrl}">${meetingUrl}</a><span>
  <br/>
  <hr>
  <h4>Thank You from <a href="https://scuoler.com">Scuoler</a> team<br/></h4>
  <a href="https://scuoler.com">https://scuoler.com</a>
  <br/>
  <h4>Thank you for using the free <a href="https://scuoler.com/scheduler">Scuoler Event Scheduler</a>.</h4>
  <a href="https://scuoler.com/scheduler">https://scuoler.com/scheduler</a>
  <h4>Please help us popularize it by letting your friends know about it.</h4>
  </section>
  </body>
  </html>
 `;
  return html;
};

/* Api verison of InsertMeetingToDB in database*/
exports.insertMeetingToDbJson = async function (req, res, next) {
  let description = req.body.meetingDescription;
  let organiserId = req.body.organiserId;
  let recipients = req.body.recipients;
  let timezone = Number(req.body.timezone);
  let timezoneDescription = req.body.timezoneDescription;
  let startDateTime = req.body.startDateTime;
  let endDateTime = req.body.endDateTime;
  let notifyMinutes = req.body.notifyMinutes;
  let meetingId = uuidv4();
  //utils.getUniqueId(organiserId);

  let meetingUrl = `https://scuoler.com/chat/${meetingId}`;

  let accountId = req.body.accountId;
  let ignoreConflicts = false;
  if (req.body.ignoreConflicts === "true") {
    ignoreConflicts = true;
  }

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

  let arrRecipients = recipients.split(",").map((val) => val.trim());
  let dt_startDateTime_utc = new Date(startDateTime);
  let dt_endDateTime_utc = new Date(endDateTime);

  // console.log(
  //   description,
  //   organiserId,
  //   recipients,
  //   timezone,
  //   timezoneDescription,
  //   meetingId,
  //   startDateTime,
  //   endDateTime,
  //   notifyMinutes,
  //   dt_startDateTime_utc,
  //   dt_endDateTime_utc
  // );

  //let offsetHours = timezone * -1;
  //console.log("offset", offsetHours);

  /* The timezone offset needs to be taken to account for  
  date time conversion to selected timezone format  for sending email */
  let dt_startDateTime = utils.dateAddHours(dt_startDateTime_utc, timezone);
  let dt_endDateTime = utils.dateAddHours(dt_endDateTime_utc, timezone);

  let startDateTime_str = dt_startDateTime.toISOString();
  /* Remove ".000z" and replace T with ' ' */
  startDateTime_str = startDateTime_str
    .substring(0, startDateTime_str.length - 5)
    .replace("T", " ");

  let endDateTime_str = dt_endDateTime.toISOString();
  /* Remove ".000z" and replace T with ' ' */
  endDateTime_str = endDateTime_str
    .substring(0, endDateTime_str.length - 5)
    .replace("T", " ");

  //  console.log("here", startDateTime_str, " sep ", endDateTime_str);
  let sql = `select meeting_insert(p_id:=$1, p_description:=$2, p_participant_email_ids:=$3,
          p_timezone:=$4, p_timezone_description:=$5, p_start_time:=$6,
          p_end_time:=$7, p_organiser_id:=$8, p_notify_before_minutes:=$9,
          p_ignore_conflicts:=$10 );`;

  pool.query(
    sql,
    [
      meetingId,
      description,
      arrRecipients,
      timezone,
      timezoneDescription,
      dt_startDateTime_utc,
      dt_endDateTime_utc,
      organiserId,
      notifyMinutes,
      ignoreConflicts,
    ],
    (err, result) => {
      pool.end(() => {});
      if (err) {
        next(err);
      } else {
        let resObj = result.rows[0].meeting_insert;
        console.log(resObj);

        if (resObj.insertstatus === "ok") {
          let htmlBody = makeMeetingInviteBody(
            recipients,
            description,
            timezoneDescription,
            startDateTime_str,
            endDateTime_str,
            meetingUrl
          );
          let emailSubject = `Meeting Invite:  + ${description.substring(
            0,
            100
          )} ...`;

          sendEmailGeneric(
            constants.SCUOLER_NOREPLY_EMAIL_ID,
            recipients,
            emailSubject,
            htmlBody,
            true,
            false
          )
            .then((output) => {
              setCorsHeaders(req, res);
              res.json({ insertstatus: "ok", meetingId: meetingId });
            })
            .catch((err1) => {
              next(err1);
            });
        } else {
          setCorsHeaders(req, res);
          res.json({
            insertstatus: "error",
            starttime: resObj.start_time,
            endtime: resObj.end_time,
          });
        }
      }
    }
  );
};

const makeMeetingUpdateBody = (
  recipients,
  description,
  timezoneDescription,
  startDateTime,
  endDateTime,
  meetingUrl
) => {
  const html = `<html>
  <body>
  <section style="background-color: #edf2fb;box-shadow: 0px 10px 5px grey; border-radius: 10px;border: 1px solid rgb(196, 196, 196);padding: 10px 5px 0px 15px">
  <h2>Hello from <a href="https://scuoler.com/scheduler">Scuoler Event Scheduler</a>,</h2>
  <h2>An event in which you are a participant has been updated.</h2> 
  <hr>
  <br/>
  <p style="color:#332233;font-size: 17px;font-weight: bolder">Event:<p/> 
  <span style="margin-left:20px; background-color: #1a759f; color: white; font-size: 17px; border-radius:5px; padding: 10px">${description}</span> <br/><br/>
  <span style="color:#332233;font-size: 17px;font-weight: bolder">Participants</span>: <ul style="list-style:none">${recipients
    .split(",")
    .map((val) => {
      return `<li style="color: #1a759f; font-size: 16px;">${val.trim()}</li>`;
    })}</ul> <br/>
  <p style="color:#332233;font-size: 18px;font-weight: bolder">Timezone:</p> <span style="margin-left:18px; font-size: 18px; color: #223322"; background-color:#c7cdd2;>${timezoneDescription}</span> <br/><br/>
  <span style="font-size:18px;font-weight: bolder; width: 100px">From:</span> <span style="color:#3322ff;font-size: 18px; background-color:#c7cdd2; padding: 3px; border-radius: 2px;">${startDateTime}</span> <br/><br/>
  <span style="font-size:18px;font-weight: bolder; width: 100px">To:</span> <span style="color:#3322ff;font-size: 18px; background-color:#c7cdd2; padding: 3px; border-radius: 2px;">${endDateTime}</span> <br/><br/>
  <p style="font-size:20px;font-weight: bolder">Where:</p> <span style="margin-left:20px; font-size: 18px;"><a  href="${meetingUrl}">${meetingUrl}</a><span>
  <br/>
  <hr>
  <h4>Thank You from <a href="https://scuoler.com">Scuoler</a> team<br/></h4>
  <a href="https://scuoler.com">https://scuoler.com</a>
  <br/>
  <h4>Thank you for using the free <a href="https://scuoler.com/scheduler">Scuoler Event Scheduler</a>.</h4>
  <a href="https://scuoler.com/scheduler">https://scuoler.com/scheduler</a>
  <h4>Please help us popularize it by letting your friends know about it.</h4>
  </section>
  </body>
  </html>
 `;
  return html;
};

/* Api verison of InsertMeetingToDB in database*/
exports.updateMeeting = async function (req, res, next) {
  let id = req.body.id;
  let description = req.body.meetingDescription;
  let organiserId = req.body.organiserId;
  let recipients = req.body.recipients;
  let timezone = Number(req.body.timezone);
  let timezoneDescription = req.body.timezoneDescription;
  let startDateTime = req.body.startDateTime;
  let endDateTime = req.body.endDateTime;
  let notifyMinutes = req.body.notifyMinutes;
  let meetingId = id;
  //utils.getUniqueId(organiserId);

  let meetingUrl = `https://scuoler.com/chat/${meetingId}`;

  let accountId = req.body.accountId;
  let ignoreConflicts = false;
  if (req.body.ignoreConflicts === "true") {
    ignoreConflicts = true;
  }
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

  let arrRecipients = recipients.split(",").map((val) => val.trim());
  let dt_startDateTime_utc = new Date(startDateTime);
  let dt_endDateTime_utc = new Date(endDateTime);

  console.log(
    id,
    description,
    organiserId,
    recipients,
    timezone,
    timezoneDescription,
    meetingId,
    startDateTime,
    endDateTime,
    notifyMinutes,
    dt_startDateTime_utc,
    dt_endDateTime_utc
  );

  //let offsetHours = timezone * -1;
  //console.log("offset", offsetHours);

  /* The timezone offset needs to be taken to account for  
  date time conversion to selected timezone format  for sending email */
  let dt_startDateTime = utils.dateAddHours(dt_startDateTime_utc, timezone);
  let dt_endDateTime = utils.dateAddHours(dt_endDateTime_utc, timezone);

  let startDateTime_str = dt_startDateTime.toISOString();
  /* Remove ".000z" and replace T with ' ' */
  startDateTime_str = startDateTime_str
    .substring(0, startDateTime_str.length - 5)
    .replace("T", " ");

  let endDateTime_str = dt_endDateTime.toISOString();
  /* Remove ".000z" and replace T with ' ' */
  endDateTime_str = endDateTime_str
    .substring(0, endDateTime_str.length - 5)
    .replace("T", " ");

  let sql = `select meeting_update(p_id:=$1, p_description:=$2, p_participant_email_ids:=$3,
          p_timezone:=$4, p_timezone_description:=$5, p_start_time:=$6,
          p_end_time:=$7, p_organiser_id:=$8, p_notify_before_minutes:=$9,
          p_ignore_conflicts:=$10 );`;

  pool.query(
    sql,
    [
      meetingId,
      description,
      arrRecipients,
      timezone,
      timezoneDescription,
      dt_startDateTime_utc,
      dt_endDateTime_utc,
      organiserId,
      notifyMinutes,
      ignoreConflicts,
    ],
    (err, result) => {
      pool.end(() => {});
      if (err) {
        next(err);
      } else {
        let resObj = result.rows[0].meeting_update;
        console.log(resObj);

        if (resObj.updatestatus === "ok") {
          let htmlBody = makeMeetingUpdateBody(
            recipients,
            description,
            timezoneDescription,
            startDateTime_str,
            endDateTime_str,
            meetingUrl
          );
          let emailSubject = `Meeting Update:  + ${description.substring(
            0,
            100
          )} ...`;

          sendEmailGeneric(
            constants.SCUOLER_NOREPLY_EMAIL_ID,
            recipients,
            emailSubject,
            htmlBody,
            true,
            false
          )
            .then((output) => {
              setCorsHeaders(req, res);
              res.json({ updatestatus: "ok", meetingId: meetingId });
            })
            .catch((err1) => {
              next(err1);
            });
        } else {
          setCorsHeaders(req, res);
          res.json({
            updatestatus: "error",
            starttime: resObj.start_time,
            endtime: resObj.end_time,
          });
        }
      }
    }
  );
};
