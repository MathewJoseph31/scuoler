const pg = require("pg");
const url = require("url");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const configuration = require("./Configuration");
const utils = require("./utils/Utils");
const constants = require("./Constants");

let { setCorsHeaders } = utils;

/* function for handling  http requests to retrive list of uploads for a source in database
in json format*/
exports.getUploadsForSource = function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 50;
  let currentPage = queryObject.currentPage || 1;
  let sourceId = queryObject.sourceId;

  const offset = pageSize * (currentPage - 1);

  const pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql =
    " SELECT A.file_name, A.relative_url, A.file_type, A.author_id, A.create_timestamp  " +
    "  from Upload_Association A  " +
    " where  A.deleted=false and A.source_object_id=$1 " +
    " order by A.create_timestamp desc " +
    " offset $2 limit $3 ";

  pool.query(sql, [sourceId, offset, pageSize], function (err, result, fields) {
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.fileUpload = function (req, res, next) {
  let uploadFiles = Object.values(req.files);
  //console.log(uploadFiles);
  let fileName = uploadFiles[0].originalFilename;
  let oldPath = uploadFiles[0].path;
  let type = uploadFiles[0].type;
  let newName;
  if (fileName.includes(".")) {
    const dotIndex = fileName.lastIndexOf(".");
    newName =
      fileName.substring(0, dotIndex) +
      "_" +
      uuidv4() +
      fileName.substring(dotIndex);
  } else {
    newName = fileName + "_" + uuidv4();
  }
  let newPath = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    constants.UPLOAD_FILES_DIRECTORY,
    newName
  );
  let relativeUrl = path.join(constants.UPLOAD_FILES_DIRECTORY, newName);
  fs.rename(oldPath, newPath, function (err) {
    if (err) next(err);

    //    console.log(`Successfully  ${fileName} moved!`);
    setCorsHeaders(req, res);
    res.json({ relativeUrl, fileName, type });
  });
};

exports.fileUploadInsertToDB = function (req, res, next) {
  let authorId = req.body.authorId;
  let sourceId = req.body.sourceId;
  let fileName = req.body.fileName;
  let relativeUrl = req.body.relativeUrl;
  let fileType = req.body.fileType;
  let timestamp = new Date();

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let sql =
    "insert into Upload_Association(source_object_id, file_name, relative_url, file_type, author_id, create_timestamp) values($1,$2,$3,$4, $5, $6)";

  pool.query(
    sql,
    [sourceId, fileName, relativeUrl, fileType, authorId, timestamp.toJSON()],
    (err, result) => {
      if (err) {
        next(err);
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", insertTimestamp: timestamp.toJSON() });
      }
    }
  );
};
