const pg = require("pg");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

/*Cloudinary cloud image server initialization*/
const cloudinary = require("cloudinary").v2;
const cloudinaryConfiguration = require("../CloudinaryConfigurationAlt");
const constants = require("../Constants");

function pad(num) {
  num = num < 10 ? "0".concat(num) : "".concat(num);
  return num;
}

function getUniqueId(userId) {
  var v = new Date();
  var day = v.getDate();
  day = pad(day);

  var mon = v.getMonth();
  mon += 1;
  mon = pad(mon);

  var year = v.getFullYear();
  year = pad(year);

  var hour = v.getHours();
  hour = pad(hour);

  var minute = v.getMinutes();
  minute = pad(minute);

  var second = v.getSeconds();
  second = pad(second);

  //console.log(day+'month:'+mon+'year:'+year);
  var str = userId
    .concat(mon)
    .concat(day)
    .concat(year)
    .concat(hour)
    .concat(minute)
    .concat(second);

  return str;
}

exports.getUniqueId = getUniqueId;

const whiteListedIps = [
  "111.92.69.150",
  "202.164.130.196", //asianet kochi
  "127.0.0.1",
  "150.136.243.153", //scuoler.com
  "129.213.81.150", //data.scuoler.com
];
exports.setCorsHeaders = function (req, res) {
  whiteListedIps.forEach((val) => {
    if (req.ip?.includes(val)) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", true);
      return;
    }
  });
};

exports.setCorsHeadersForAllIPs = function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  return;
};

exports.uploadFilesToCloudinary = function (req, res, next, dir_name) {
  cloudinary.config({
    cloud_name: cloudinaryConfiguration.getCloudName(),
    api_key: cloudinaryConfiguration.getApiKey(),
    api_secret: cloudinaryConfiguration.getApiSecret(),
  });
  uploadFiles = Object.values(req.files);

  if (dir_name) {
    cloudinary.uploader.upload(
      uploadFiles[0].path,
      { folder: dir_name },
      function (err, result) {
        if (err) {
          next(err);
          //res.json({"updatestatus":"error"});
        }
        exports.setCorsHeaders(req, res);
        res.json(result);
      }
    );
  } else {
    cloudinary.uploader.upload(uploadFiles[0].path, function (err, result) {
      if (err) {
        next(err);
        //res.json({"updatestatus":"error"});
      }
      exports.setCorsHeaders(req, res);
      res.json(result);
    });
  }
  /*  const promises = uploadFiles.map(uploadFile => cloudinary.uploader.upload(uploadFile.path));
    Promise
        .all(promises)
        .then(results => res.json(results))
        .catch((err) => res.status(400).json(err));*/
};

exports.delete_images = function (image_urls_for_delete) {
  cloudinary.config({
    cloud_name: cloudinaryConfiguration.getCloudName(),
    api_key: cloudinaryConfiguration.getApiKey(),
    api_secret: cloudinaryConfiguration.getApiSecret(),
  });

  const promises = Object.keys(image_urls_for_delete).map((key) => {
    cloudinary.uploader.destroy(image_urls_for_delete[key]);
  });

  promises.forEach(async (promise, i) => {
    await promise;
  });

  return "ok";
};

exports.delete_images_local = function (image_urls_for_delete) {
  const promises = Object.keys(image_urls_for_delete).map((key) => {
    let deletePath = path.join(
      __basedir,
      constants.PUBLIC_DIRECTORY,
      image_urls_for_delete[key]
    );
    return fs.promises.unlink(deletePath);
  });

  promises.forEach(async (promise, i) => {
    try {
      await promise;
    } catch (e) {
      console.log(e);
      if (e.code !== "ENOENT") {
        throw e;
      }
    }
  });

  return "ok";
};

exports.getConfiguration = function (account_id, configuration) {
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getConfigDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  var sql =
    "select distinct A.server,  A.port, A.database, A.user_id, A.password " +
    " from account_connection A " +
    " where A.deleted=false and A.account_id=$1 ";

  return new Promise((resolve, reject) => {
    pool.query(sql, [account_id], (err, result, fields) => {
      pool.end(() => {});

      let configurationClone = { ...configuration };
      if (err) resolve(configurationClone);
      else {
        if (result && result.rows && result.rows.length > 0) {
          configurationClone.host = result.rows[0].server;
          configurationClone.port = result.rows[0].port;
          configurationClone.database = result.rows[0].database;
          configurationClone.userId = result.rows[0].user_id;
          configurationClone.password = result.rows[0].password;
        }
        resolve(configurationClone);
      }
    });
  });
};

const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

exports.convertDateToString = (dt) => {
  return `${dt.getFullYear()}-${padL(dt.getMonth() + 1)}-${padL(
    dt.getDate()
  )}T${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`;
};

/*
offsets the input date object with the input hours and minutes,
1st param- Date object, 2nd parm: Number hours to add/subtract
2nd parm: Number minutes to add/subtract*/
exports.dateAddHoursMinutes = (d, hours, minutes) => {
  let dateTimeMillis = d.getTime();
  dateTimeMillis += hours * 60 * 60 * 1000;
  dateTimeMillis += minutes * 60 * 1000;
  return new Date(dateTimeMillis);
};

/*
offsets the input date object with the input hours,
1st param- Date object, 2nd parm: Number hours to add/subtract*/
exports.dateAddHours = (d, hours) => {
  let dateTimeMillis = d.getTime();
  dateTimeMillis += hours * 60 * 60 * 1000;
  return new Date(dateTimeMillis);
};

/*
offsets the input date object with the input minutes,
1st param- Date object, 2nd parm: Number minutes to add/subtract*/
exports.dateAddMinutes = (d, minutes) => {
  let dateTimeMillis = d.getTime();
  dateTimeMillis += minutes * 60 * 1000;
  return new Date(dateTimeMillis);
};

/*not used*/
const readdirSync = (p, a = []) => {
  if (fs.statSync(p).isDirectory())
    fs.readdirSync(p).map((f) =>
      readdirSync(a[a.push(path.join(p, f)) - 1], a)
    );
  return a;
};

const readdirRecursiveSync = (p, a = [], depth, maxDepth) => {
  if (fs.statSync(p).isDirectory() && depth < maxDepth)
    fs.readdirSync(p).map((f) =>
      readdirRecursiveSync(
        a[a.push(path.join(p, f)) - 1],
        a,
        depth + 1,
        maxDepth
      )
    );
  return a;
};

exports.readdirRecursiveSync = readdirRecursiveSync;

exports.parseBool = function (val) {
  return val === true || val === "true";
};

exports.getScormIndexFileContent = (indexFilePath, scormApiCode) => {
  if (!scormApiCode) {
    scormApiCode = constants.SCORM_API_CODE;
  }
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <script>
      ${scormApiCode}
      </script>
    </head>
    <body>
      <iframe
        id="courseFrame"
        style="
          height: 1000px;
          min-width: 1500px;
          width: 100%;
          overflow-y: scroll;
          overflow-x: scroll;
        "
        src="${indexFilePath}"
      ></iframe>
    </body>
  </html>
  `;
};

exports.formatLogLines = (logLines, log_file_name, filterBots) => {
  let formattedLines = logLines.map((line) => {
    let reg =
      /\[(\S+)\]\s+\[(\S+)\]\s+\[(\S+\s\S+)\]\s+\[(\S+\s\S+)\]\s+\[(\S+)\]\s+\[(\S+)\]\s+\[(\S+)\]\s+\[(.+)\]$/;
    let matchResult = line.match(reg);
    if (matchResult?.length && matchResult?.length > 0) {
      let source_ip = matchResult[1];
      let user_id = matchResult[2];
      let log_timestamp = matchResult[3];
      let request_method_url = matchResult[4].substring(0, 999);
      let response_status = matchResult[5];
      let response_length = matchResult[6];
      let referrer = matchResult[7];
      let user_agent = matchResult[8];
      let log_filename = log_file_name;
      if (
        filterBots &&
        (user_agent.toLowerCase().includes("bot") ||
          user_agent.toLowerCase().includes("googleother"))
      ) {
        return {};
      } else {
        return {
          source_ip,
          user_id,
          log_timestamp,
          request_method_url,
          response_status,
          response_length,
          referrer,
          user_agent,
          log_filename,
        };
      }
    } else {
      return {};
    }
  });
  formattedLines = formattedLines.filter((obj) => obj.source_ip);
  return formattedLines;
};

exports.parseMediaFile = (filePath) => {
  /*shell command for the logic embedded by this function
  ffmpeg -i 10.webm -f null test_out
  */
  return new Promise((resolve, reject) => {
    let ff = new ffmpeg();
    ff.on("start", function (commandLine) {
      // on start, you can verify the command line to be used
      console.log("The ffmpeg command line is: " + commandLine);
    })
      .on("progress", function (data) {})
      .on("end", function () {
        resolve(filePath);
      })
      .on("error", function (err) {
        // handle error conditions
        if (err) {
          reject(filePath);
        }
      })
      .addInput(filePath)
      .addOption("-f", "null")
      .output("test_out")
      .run();
  });
};

/**
 * moves the set of files (absolute paths) in sourcefilesArr arg
 * to target directory specified in targetDir
 *
 * @param {*} sourcefilesArr
 * @param {*} targetDir
 */
exports.moveFilesToDirectory = (sourcefilesArr, targetDir) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  for (let sourceFileName of sourcefilesArr) {
    let shortFileName = sourceFileName.substring(
      sourceFileName.lastIndexOf("/") + 1
    );
    let targetFileName = path.join(targetDir, shortFileName);
    fs.renameSync(sourceFileName, targetFileName);
    //console.log(sourceFileName, targetFileName);
  }
};

/**
 * writes the list of absolute file paths in arr to a target file, specified
 * by  concatFilePath
 * @param {*} concatFilePath
 * @param {*} arr
 */
exports.writeRecordingFileNamesToRecordingConcatFile = (
  concatFilePath,
  arr
) => {
  let outArr = arr.map((fileName) => `file '${fileName}'`);
  let str = outArr.join("\n");
  fs.writeFileSync(concatFilePath, str);
};

exports.convertToMp4 = (inFilePath, outFilePath) => {
  /*shell command for the logic embedded by
   * this function (convert to mp4)
   * ffmpeg -i 10.webm -y -qscale 0  10.mp4
   */
  return new Promise((resolve, reject) => {
    let ff = new ffmpeg();
    ff.on("start", function (commandLine) {
      // on start, you can verify the command line to be used
      console.log("The ffmpeg command line is: " + commandLine);
    })
      .on("progress", function (data) {
        // do something with progress data if you like
      })
      .on("end", function () {
        // do something when complete
        resolve(outFilePath);
      })
      .on("error", function (err) {
        // handle error conditions
        if (err) {
          console.log("Error transcoding file, Err: ", err);
          reject(outFilePath);
        }
      })
      .addInput(inFilePath)
      //.addInputOption("-safe 0")
      .addOutput(outFilePath)
      .outputOptions("-qscale 0")
      .run();
  });
};

/**
 * merge multiple recording files (format webm) specified in concat file (concatFilePath)
 * to a single file, specified in outFilePath param
 *
 * shell command for the logic embedded by
 * this function (convert to mp4)
 * cmd:  ffmpeg -f concat -v error -safe 0 -i concat.txt -y -c copy  outfile.m4
 *
 * @param {*} concatFilePath
 * @param {*} outFilePath
 * @returns
 */
exports.mergeRecordingFiles = (concatFilePath, outFilePath) => {
  return new Promise((resolve, reject) => {
    let ff = new ffmpeg();
    ff.on("start", function (commandLine) {
      // on start, you can verify the command line to be used
      console.log("The ffmpeg command line is: " + commandLine);
    })
      .on("progress", function (data) {
        // do something with progress data if you like
      })
      .on("end", function () {
        // do something when complete
        resolve(outFilePath);
      })
      .on("error", function (err) {
        // handle error conditions
        if (err) {
          console.log("Error transcoding file, Err: ", err);
          reject(outFilePath);
        }
      })
      .addInput(concatFilePath)
      .addInputOption("-f concat")
      .addInputOption("-v error")
      .addInputOption("-safe 0")
      .addOutput(outFilePath)
      .outputOptions("-c copy")
      .run();
  });
};
