const pg = require("pg");
const url = require("url");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const extract = require("extract-zip");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
const constants = require("../Constants");

let { setCorsHeaders } = utils;

/* function for handling  http requests to retrive list of uploads for a source in database
in json format*/
exports.getUploadsForSource = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 50;
  let currentPage = queryObject.currentPage || 1;
  let sourceId = queryObject.sourceId;

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

  let sql =
    " SELECT A.file_name, A.relative_url, A.file_type, A.author_id, A.create_timestamp  " +
    "  from Upload_Association A  " +
    " where  A.deleted=false and A.source_object_id=$1 " +
    " order by A.create_timestamp desc " +
    " offset $2 limit $3 ";

  pool.query(sql, [sourceId, offset, pageSize], function (err, result, fields) {
    pool.end(() => {});
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

exports.courseScormFileUpload = function (req, res, next) {
  let uploadFiles = Object.values(req.files);
  //console.log(uploadFiles);
  let fileName = uploadFiles[0].originalFilename;
  let oldPath = uploadFiles[0].path;
  let type = uploadFiles[0].type;
  if (type !== "application/zip") {
    const errObj = new Error("Invalid Zip File");
    next(errObj);
  } else if (!fileName.endsWith(".zip")) {
    const errObj = new Error("File name should end with .zip");
    next(errObj);
  } else {
    const dotIndex = fileName.lastIndexOf(".");
    const uniqueId = uuidv4();
    /* strip of the .zip to get the directory name */
    const newDirName = fileName.substring(0, dotIndex) + "_" + uniqueId;

    const newFileName =
      fileName.substring(0, dotIndex) +
      "_" +
      uniqueId +
      fileName.substring(dotIndex);

    let newPath = path.join(
      __basedir,
      constants.PUBLIC_DIRECTORY,
      constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
      newFileName
    );

    let newUnzipDirPath = path.join(
      __basedir,
      constants.PUBLIC_DIRECTORY,
      constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
      newDirName
    );
    let relativeUrl = path.join(
      constants.SCORM_COURSE_UPLOAD_FILES_DIRECTORY,
      newFileName
    );

    fs.rename(oldPath, newPath, async function (err) {
      if (err) next(err);
      else {
        try {
          await extract(newPath, { dir: newUnzipDirPath });

          let dirContents = [];
          //const dirContents = fs.readdirSync(newUnzipDirPath);
          utils.readdirRecursiveSync(newUnzipDirPath, dirContents, 0, 2);

          dirContents = dirContents.filter(
            (val) => val.endsWith(".html") || val.endsWith(".htm")
          );

          /* extract relative paths */
          dirContents = dirContents.map((val) => {
            return val.startsWith(newUnzipDirPath)
              ? val.substring(newUnzipDirPath.length + 1)
              : val;
          });
          setCorsHeaders(req, res);
          res.json({
            courseId: newDirName,
            relativeUrl,
            contents: dirContents,
          });
        } catch (ex) {
          console.log(ex.message);
          fs.unlink(newPath, (error) => {
            next(new Error("Error While Extracting Zip File"));
          });
          // handle any errors
        }
      }
    });
  }
};

exports.fileUploadDelete = function (req, res, next) {
  let relativeUrl = req.body.relativeUrl;
  let deletePath = path.join(
    __basedir,
    constants.PUBLIC_DIRECTORY,
    relativeUrl
  );
  fs.unlink(deletePath, (err) => {
    if (err) {
      next(err);
    } else {
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
    //file removed
  });
};

exports.fileUploadDeleteFromDB = async function (req, res, next) {
  let relativeUrl = req.body.relativeUrl;
  let sourceId = req.body.sourceId;

  let sql =
    "Update Upload_Association set deleted=true, modified_timestamp=now() where source_object_id=$1 and relative_url=$2";

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

  pool.query(sql, [sourceId, relativeUrl], (err, result) => {
    pool.end(() => {});
    if (err) {
      next(err);
    } else {
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
};

exports.fileUploadInsertToDB = async function (req, res, next) {
  let authorId = req.body.authorId;
  let sourceId = req.body.sourceId;
  let fileName = req.body.fileName;
  let relativeUrl = req.body.relativeUrl;
  let fileType = req.body.fileType;
  let timestamp = new Date();

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
    "insert into Upload_Association(source_object_id, file_name, relative_url, file_type, author_id, create_timestamp) values($1,$2,$3,$4, $5, $6)";

  pool.query(
    sql,
    [sourceId, fileName, relativeUrl, fileType, authorId, timestamp.toJSON()],
    (err, result) => {
      pool.end(() => {});
      if (err) {
        next(err);
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", insertTimestamp: timestamp.toJSON() });
      }
    }
  );
};
