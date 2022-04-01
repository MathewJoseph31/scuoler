const pg = require("pg");
const configuration = require("./Configuration");
const url = require("url");
const utils = require("./utils/Utils");
let { setCorsHeaders } = utils;

exports.getChats = function (req, res, next) {
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
    " SELECT A.id, A.payload, A.author_id, A.room_id, B.name room_name " +
    "  from room B  inner join chat A on A.room_id=B.id" +
    " where A.deleted=false  " +
    " offset $1 limit $2 ";

  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    if (err) next(err);

    utils.setCorsHeaders(res);
    res.json(result.rows);
  });
};

/* Api verison of InsertEmployeeToDB in database*/
exports.insertChatToDbJson = function (req, res, next) {
  let room_id = req.body.room_id;
  let payload = req.body.payload;
  let author_id = req.body.author_id;
  let customer_ids = req.body.customer_ids;
  let id = utils.getUniqueId(author_id);

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql = "";
  let paramsArray = [id, payload, author_id];
  if (room_id) {
    sql =
      "insert into Chat(id, payload, author_id, room_id) values($1,$2,$3, $4)";
    paramsArray.push(room_id);
  } else {
    sql =
      "select chat_insert_without_room(p_id:=$1, p_payload:=$2, p_author_id:=$3, p_customer_ids:=$4);";
    paramsArray.push(customer_ids);
  }

  pool.query(sql, paramsArray, (err, result) => {
    if (err) {
      next(err);
      //res.json({"insertstatus":"error "+err.toString()});
    } else {
      setCorsHeaders(res);
      res.json({ insertstatus: "ok", chat_id: id });
    }
  });
};

/*api method for updating a chat message*/
exports.editChatInDbJson = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let author_id = req.body.author_id;
  let payload = req.body.payload;

  console.log("payload" + payload);

  var sql = "UPDATE CHAT SET  payload=$1, author_id=$2 where id=$3 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [payload, author_id, id], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({"updatestatus":"error"});
    } else {
      setCorsHeaders(res);
      res.json({ updatestatus: "ok" });
    }
  });
};

exports.deleteChatInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;

  var sql =
    "UPDATE CHAT SET  deleted=true, modified_timestamp=now() where id=$1 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [id], function (err, result, fields) {
    if (err) {
      //next(err);
      res.json({ deletestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      setCorsHeaders(res);
      res.json({ deletestatus: "ok" });
    }
  });
};
