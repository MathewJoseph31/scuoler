const pg = require("pg");
const url = require("url");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const extract = require("extract-zip");

const configuration = require("../Configuration");
const utils = require("../utils/Utils");
const constants = require("../Constants");
const stream = require("stream");

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
    " SELECT A.file_name,  A.file_type, A.author_id, " +
    " CASE WHEN A.id_no_download is not null THEN A.id_no_download ELSE A.relative_url END relative_url, " +
    " CASE WHEN A.id_no_download is not null THEN TRUE ELSE FALSE END as no_download,  A.create_timestamp  " +
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

exports.fileUploadFromUrls = async function (req, res, next) {
  let uploadDir = req.body.uploadDir;
  let urls = req.body.urls;
  let authorId = req.body.authorId;

  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  let arrUrls = [];
  if (urls.includes(",")) {
    arrUrls = urls.split(",").map((url) => url.trim());
  } else {
    arrUrls.push(urls.trim());
  }
  arrUrls = arrUrls.filter((url) => url.startsWith("http"));

  let sql = ` select source_object_id, file_name, relative_url, file_type from upload_association 
    where source_object_id = ANY($1::varchar[])
  `;

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  let resultMap = {};

  try {
    let queryResult = await pool.query(sql, [arrUrls]);
    resultMap = Object.fromEntries(
      queryResult.rows.map((obj) => {
        return [obj.source_object_id, obj.relative_url];
      })
    );
  } catch (err) {
    /* This is error is ignored since for files that exist
    in the database (have been downloaded earlier), downloading
    then again does not harm */
  }

  /* filter out already downloaded files */
  arrUrls = arrUrls.filter((url) => !Object.keys(resultMap).includes(url));

  /* 
  if all urls where already downloaded ones then we could send the 
  responsee right away*/

  if (arrUrls.length <= 0) {
    pool.end(() => {});
    setCorsHeaders(req, res);
    res.json({
      uploadstatus: "ok",
      resultMap: JSON.stringify(resultMap),
    });
  } else {
    let dirPathRel = constants.UPLOAD_FILES_DIRECTORY;
    let dirPathAbs = path.join(
      __basedir,
      constants.PUBLIC_DIRECTORY,
      constants.UPLOAD_FILES_DIRECTORY
    );

    if (uploadDir) {
      dirPathRel = path.join(constants.UPLOAD_FILES_DIRECTORY, uploadDir);
      dirPathAbs = path.join(__basedir, constants.PUBLIC_DIRECTORY, dirPathRel);
      if (!fs.existsSync(dirPathAbs)) {
        fs.mkdirSync(dirPathAbs, {
          recursive: true,
        });
      }
    }

    let arrPromises = arrUrls.map((url) => {
      return new Promise(async (resolve, reject) => {
        try {
          let suffixName = url.substring(url.lastIndexOf("/") + 1);
          /* grabbing first 6 digits of random, otherwise the name 
          becomes too large */
          if (suffixName.includes(".")) {
            const dotIndex = suffixName.lastIndexOf(".");
            suffixName =
              suffixName.substring(0, dotIndex) +
              "_" +
              uuidv4().substring(0, 6) +
              suffixName.substring(dotIndex);
          } else {
            suffixName = suffixName + "_" + uuidv4().substring(0, 6);
          }

          const newPath = path.join(dirPathAbs, suffixName);
          const relativeUrl = path.join(dirPathRel, suffixName);
          let resp = await fetch(url, {
            mode: "no-cors",
          });
          let writer = fs.createWriteStream(newPath);
          stream.Readable.fromWeb(resp.body).pipe(writer);
          resolve({
            source_object_id: url,
            relative_url: relativeUrl,
            file_type: resp.headers.get("content-type"),
            file_name: suffixName,
            author_id: authorId,
          });
        } catch (err) {
          console.log(`failed for ${url}, Error:${err} `);
          reject(err);
        }
      });
    });

    Promise.allSettled(arrPromises)
      .then((jsons) => {
        // console.log(jsons);

        jsons = jsons.filter((json) => json.status === "fulfilled");

        let uploadRecords = jsons.map((json) => json.value);

        if (uploadRecords.length > 0) {
          uploadRecords.map((obj) => {
            resultMap[obj.source_object_id] = obj.relative_url;
          });

          sql = `select upload_association_insert(p_uploads:=$1) `;
          pool.query(sql, [uploadRecords], (err, result) => {
            pool.end(() => {});

            if (err) {
              console.log(err);
              /* it is ok to ignore this error since at this point
              files have already been downloaded, not recording this
              in DB does not harm except for speed 
              */
            }

            setCorsHeaders(req, res);
            res.json({
              uploadstatus: "ok",
              resultMap: JSON.stringify(resultMap),
            });
          });
        } else {
          pool.end(() => {});
          setCorsHeaders(req, res);
          res.json({
            uploadstatus: "ok",
            resultMap: JSON.stringify(resultMap),
          });
        }
      })
      .catch((err) => {
        console.log("promise all errror", err);
        pool.end(() => {});
        setCorsHeaders(req, res);
        res.json({ uploadstatus: "error", message: err });
      });
  }
};

exports.fileUpload = function (req, res, next) {
  let uploadFiles = Object.values(req.files);
  let uploadDir = req.body.uploadDir;
  //console.log(uploadDir, uploadFiles);
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

  if (uploadDir) {
    let dirPath = path.join(
      __basedir,
      constants.PUBLIC_DIRECTORY,
      constants.UPLOAD_FILES_DIRECTORY,
      uploadDir
    );
    newPath = path.join(dirPath, newName);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    relativeUrl = path.join(
      constants.UPLOAD_FILES_DIRECTORY,
      uploadDir,
      newName
    );
  }

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

exports.fileUploadGetRelativeUrl = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

  let idNoDownload = queryObject.idNoDownload;
  let courseId = queryObject.courseId;

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

  let sql = `select file_name, file_type, relative_url 
             from upload_association 
             where upload_association.source_object_id=$1
             AND upload_association.id_no_download=$2
             limit 1;
  `;
  pool.query(sql, [courseId, idNoDownload], function (err, result, fields) {
    if (err) {
      pool.end(() => {});
      next(err);
    } else {
      setCorsHeaders(req, res);
      res.json(result.rows[0]);
    }
  });
};

exports.fileUploadToggleDownload = async function (req, res, next) {
  let noDownload = req.body.noDownload === "true";
  let accountId = req.body.accountId;
  let accountConfiguration = configuration;
  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  if (noDownload === true) {
    let relativeUrl = req.body.relativeUrl;
    let sourceId = req.body.sourceId;
    let idNoDownload = uuidv4();
    let sql = `Update Upload_Association set id_no_download=$1, modified_timestamp=now() where source_object_id=$2 and relative_url=$3`;

    var pool = new pg.Pool({
      host: accountConfiguration.getHost(),
      user: accountConfiguration.getUserId(),
      password: accountConfiguration.getPassword(),
      database: accountConfiguration.getDatabase(),
      port: accountConfiguration.getPort(),
      ssl: { rejectUnauthorized: false },
    });

    pool.query(sql, [idNoDownload, sourceId, relativeUrl], (err, result) => {
      pool.end(() => {});
      if (err) {
        next(err);
      } else {
        setCorsHeaders(req, res);
        res.json({ togglestatus: "ok", idNoDownload });
      }
    });
  } else {
    let sourceId = req.body.sourceId;
    let idNoDownload = req.body.idNoDownload;
    let pool = new pg.Pool({
      host: accountConfiguration.getHost(),
      user: accountConfiguration.getUserId(),
      password: accountConfiguration.getPassword(),
      database: accountConfiguration.getDatabase(),
      port: accountConfiguration.getPort(),
      ssl: { rejectUnauthorized: false },
    });
    let sql = `select upload_files_enable_download(p_source_object_id:=$1, p_id_no_download:=$2)`;

    pool.query(sql, [sourceId, idNoDownload], (err, result) => {
      pool.end(() => {});
      if (err) {
        next(err);
      } else {
        //console.log(result);
        let resObj = result.rows[0].upload_files_enable_download;
        setCorsHeaders(req, res);
        res.json({ togglestatus: "ok", relativeUrl: resObj.relative_url });
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
