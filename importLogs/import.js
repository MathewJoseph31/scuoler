const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const readline = require("readline");
const pg = require("pg");
const configuration = require("./Configuration");
//joining path of directory

var pool = new pg.Pool({
  host: configuration.getHost(),
  user: configuration.getUserId(),
  password: configuration.getPassword(),
  database: configuration.getDatabase(),
  port: configuration.getPort(),
  ssl: { rejectUnauthorized: false },
});

const directoryPath = path.join(__dirname, "..", "logs");
//passsing directoryPath and callback function

const processLogs = (direPath) => {
  const processSuccessFiles = [];
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const reg = /\d+-\d+-\d+-access.log$/;
    //listing all files using forEach
    files.forEach(function (fileName) {
      // Do whatever you want to do with the file
      //console.log(typeof fileName, fileName, reg.test(fileName));
      if (reg.test(fileName)) {
        processFile(directoryPath, fileName, processSuccessFiles);
      }
    });
  });
};

processLogs(directoryPath);

const processFile = (directoryPath, fileName, processedFiles) => {
  //console.log(directoryPath, fileName);
  //if (fileName !== "20220524-0000-01-access.log") return false;

  let filePath = `${directoryPath}/${fileName}`;
  const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: null,
    console: false,
  });

  readInterface.on("line", function (line) {
    processLine(line, fileName);
  });
  readInterface.on("close", function () {
    processedFiles.push(fileName);
    let newPath = `${directoryPath}/processed/${fileName}`;
    fs.rename(filePath, newPath, function (err) {
      if (err) throw err;

      console.log(`Successfully  ${fileName} moved!`);
    });
  });
};

const processLine = (line, fileName) => {
  //\s = white space character, \S - negation class
  //
  let insertQuery =
    "insert into web_logs( " +
    " source_ip, " +
    " user_id," +
    " log_timestamp, " +
    " request_method_url," +
    " response_status," +
    " response_length," +
    " referrer," +
    " user_agent) values ( $1, $2, $3, $4, $5, $6, $7, $8 )";
  let reg =
    /\[(\S+)\]\s+\[(\S+)\]\s+\[(\S+\s\S+)\]\s+\[(\S+\s\S+)\]\s+\[(\S+)\]\s+\[(\S+)\]\s+\[(\S+)\]\s+\[(.+)\]$/;
  let matchResult = line.match(reg);
  if (matchResult?.length > 0) {
    let remoteIp = matchResult[1];
    let remoteUser = matchResult[2];
    let dateTime = matchResult[3];
    let methodAndUrl = matchResult[4];
    let status = matchResult[5];
    let responseLength = matchResult[6];
    let referrer = matchResult[7];
    let userAgent = matchResult[8];
    /* console.log(
      remoteIp,
      remoteUser,
      dateTime,
      methodAndUrl,
      status,
      responseLength,
      referrer,
      userAgent
    );*/
    pool
      .query(insertQuery, [
        remoteIp,
        remoteUser,
        dateTime,
        methodAndUrl,
        status,
        responseLength,
        referrer,
        userAgent,
      ])
      .then()
      .catch((err) => {
        console.log(fileName, err);
      });
  } else {
    console.log("could not process", line);
  }
};
