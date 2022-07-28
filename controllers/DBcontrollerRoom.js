const pg = require("pg");
const configuration = require("../Configuration");
const url = require("url");
const utils = require("../utils/Utils");
let { setCorsHeaders } = utils;

exports.getRooms = function (req, res, next) {
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
    " SELECT A.id, A.name, A.author_id " +
    "  from room A  " +
    " where deleted=false  " +
    " offset $1 limit $2 ";

  pool.query(sql, [offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

/* Api verison of InsertEmployeeToDB in database*/
exports.insertRoomToDbJson = function (req, res, next) {
  let name = req.body.name;
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

  var sql = "insert into Room(id, name, author_id) values($1,$2,$3)";

  pool.query(sql, [id, name, author_id], (err, result) => {
    if (err) {
      next(err);
      //res.json({"insertstatus":"error "+err.toString()});
    } else {
      if (customer_ids) {
        sql =
          "select room_customer_update(p_room_id:=$1, p_customer_ids:=$2, p_delete_flag:=false) ";
        pool.query(sql, [id, customer_ids], function (err, result, fields) {
          if (err) {
            next(err);
            //res.json({"insertstatus":"error "+err.toString()});
          }
        });
      }
      setCorsHeaders(req, res);
      res.json({ insertstatus: "ok", room_id: id });
    }
  });
};

exports.addCustomersToRoom = function (req, res, next) {
  let room_id = req.body.room_id;
  let customer_ids = req.body.customer_ids;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  //if (room_id && customer_ids) {
  sql =
    "select room_customer_update(p_room_id:=$1, p_customer_ids:=$2, p_delete_flag:=false) ";

  pool.query(sql, [room_id, customer_ids], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({"insertstatus":"error "+err.toString()});
    } else {
      setCorsHeaders(req, res);
      res.json({ insertstatus: "ok" });
    }
  });
  //}
};

exports.deleteCustomersFromRoom = function (req, res, next) {
  let room_id = req.body.room_id;
  let customer_ids = req.body.customer_ids;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });
  //if (room_id && customer_ids) {
  sql =
    "select room_customer_update(p_room_id:=$1, p_customer_ids:=$2, p_delete_flag:=true) ";
  pool.query(sql, [room_id, customer_ids], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({"insertstatus":"error "+err.toString()});
    } else {
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
  //}
};

/*api method for updating an course*/
exports.editRoomInDbJson = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;
  let name = req.body.name;
  let author_id = req.body.author_id;

  var sql =
    "UPDATE ROOM SET  name=$1, author_id=$2, modified_timestamp=now() where id=$3 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(sql, [name, author_id, id], function (err, result, fields) {
    if (err) {
      next(err);
      //res.json({"updatestatus":"error"});
    } else {
      setCorsHeaders(req, res);
      res.json({ updatestatus: "ok" });
    }
  });
};

exports.deleteRoomInDB = function (req, res, next) {
  //var q = url.parse(req.url, true).query;
  let id = req.body.id;

  var sql =
    "UPDATE ROOM SET  deleted=true, modified_timestamp=now() where id=$1 ";

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
      next(err);
      //res.json({ deletestatus: "error" });
    } else {
      //console.log("room deleted");
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
};
