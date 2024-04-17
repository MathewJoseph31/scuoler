const { spawn } = require("node:child_process");
const { LAMBDA_TIMOUT_MILLISECONDS } = require("../Constants");
const utils = require("../utils/Utils");
let { setCorsHeaders } = utils;

/* function for handling http requests to retrive the records in the
 Course table in database in json format*/
exports.lambdaExecute = async function (req, res, next) {
  let type = req.body.type;
  let script = req.body.script;

  console.log(type, script);
  let result = "";
  /*setCorsHeaders(req, res);
  res.json({ executestatus: "ok", result: "hi" });*/
  let proc;
  if (type === "javascript") {
    proc = spawn("node", ["-e", script]);
  } else if (type === "python") {
    proc = spawn("python3", ["-c", script]);
  } else if (type === "csharp") {
    proc = spawn(
      "/home/mathew/dotNet/csharpLambdaExecuter/bin/Debug/net8.0/csharpLambdaExecuter",
      [script]
    );
  } else {
    result =
      "Runtime/Language not supported (language should be C#, Python, or Javascript) ";
    res.json({ executestatus: "error", result });
  }

  let timeout = setTimeout(() => {
    proc.kill(); //kills the program that is taking too long
    result = "Time Limit Exceeded, Please Optimise Your Code";
    /*
    const errObject = new Error(result);
    next(errObject);
    */
    res.json({ executestatus: "error", result });
  }, LAMBDA_TIMOUT_MILLISECONDS);

  proc.stdout.on("data", (data) => {
    clearTimeout(timeout); //preventing the timeout from calling since it didn't take too long
    result += data;
  });

  proc.stdout.on("end", () => {
    result = result.toString();
    console.log(result);
    res.json({ executestatus: "ok", result });
  });

  proc.stderr.on("data", (data) => {
    result = data.toString();
    /*const errObject = new Error(result);
    next(errObject);*/
    clearTimeout(timeout); //preventing the timeout from calling since it didn't take too long
    res.json({ executestatus: "error", result });
  });

  proc.on("error", (error) => {
    result = error.message;
    /*const errObject = new Error(result);
    next(errObject);*/
    clearTimeout(timeout);
    res.json({ executestatus: "error", result });
  });
};
