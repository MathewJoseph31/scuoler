const pg = require("pg");

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const url = require("url");

const path = require("path");
const constants = require("../Constants");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const configuration = require("../Configuration");

const utils = require("../utils/Utils");

let { setCorsHeaders } = utils;

exports.getCodeSnippetLanguageList = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;

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
    "SELECT name FROM Code_Snippet_Language where deleted = false ORDER by name asc ";
  pool.query(sql, function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

exports.insertCodeSnippet = async function (req, res, next) {
  let payload = req.body.payload;
  let description = req.body.description;
  let authorId = req.body.authorId;
  let codeSnippetLanguage = req.body.codeSnippetLanguage;
  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  let snippetId = uuidv4();

  const sql = `insert into code_snippet(id, description, language_name, payload, author_id)
                values ($1, $2, $3, $4, $5) `;

  const pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(
    sql,
    [snippetId, description, codeSnippetLanguage, payload, authorId],
    function (err, result) {
      pool.end(() => {});
      if (err) {
        next(err);
        //res.json({ insertstatus: "error" });
      } else {
        setCorsHeaders(req, res);
        res.json({ insertstatus: "ok", snippetId });
      }
    }
  );
};

exports.updateCodeSnippet = async function (req, res, next) {
  let id = req.body.id;
  let payload = req.body.payload;
  let description = req.body.description;
  let authorId = req.body.authorId;
  let codeSnippetLanguage = req.body.codeSnippetLanguage;
  let accountId = req.body.accountId;
  let accountConfiguration = configuration;

  if (accountId) {
    accountConfiguration = await utils.getConfiguration(
      accountId,
      configuration
    );
  }

  var sql = `UPDATE CODE_SNIPPET SET  language_name=$1, description=$2, payload=$3, modified_timestamp=now() 
   where id=$4 `;

  var pool = new pg.Pool({
    host: accountConfiguration.getHost(),
    user: accountConfiguration.getUserId(),
    password: accountConfiguration.getPassword(),
    database: accountConfiguration.getDatabase(),
    port: accountConfiguration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  pool.query(
    sql,
    [codeSnippetLanguage, description, payload, id],
    function (err, result, fields) {
      pool.end(() => {});
      if (err) {
        console.log(err);
        next(err);
        //res.json({ updatestatus: "error" });
      } else {
        console.log("code snippet updated");
        setCorsHeaders(req, res);
        res.json({ updatestatus: "ok" });
      }
    }
  );
};

exports.deleteCodeSnippet = async function (req, res, next) {
  let codeSnippetId = req.body.id;

  var sql =
    "UPDATE Code_Snippet SET  deleted=true, modified_timestamp=now() where id=$1 ";

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

  pool.query(sql, [codeSnippetId], function (err, result, fields) {
    pool.end(() => {});
    if (err) {
      next(err);
      //res.json({ deletestatus: "error" });
    } else {
      //console.log(description+' '+solution);
      console.log("code snippet deleted");
      setCorsHeaders(req, res);
      res.json({ deletestatus: "ok" });
    }
  });
};

exports.getTheCodeSnippet = async function (req, res, next) {
  let codeSnippetId = req.body.codeSnippetId;
  let authorId = req.body.authorId;
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

  let sql = "select * from code_snippet_get_one(p_id:=$1, p_author_id:=$2)";

  pool.query(sql, [codeSnippetId, authorId], function (err, result, fields) {
    pool.end(() => {});

    if (err) next(err);
    else {
      let resObj = {};
      setCorsHeaders(req, res);
      if (result?.rows) {
        resObj = { ...result.rows[0] };
      }
      res.json(resObj);
    }
  });
};

exports.searchCodeSnippets = async function (req, res, next) {
  let searchKey = req.body.searchKey;

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
    "select distinct A.id, ts_headline('english', A.description, query, 'HighlightAll=true') description, " +
    " ts_headline('english', A.language_name, query, 'HighlightAll=true') language_name, " +
    " ts_headline('english', A.payload, query, 'HighlightAll=true') as payload,  A.author_id,  ts_rank_cd(search_tsv, query, 32) rank  " +
    " from Code_snippet A, plainto_tsquery('english', $1) query " +
    " where A.deleted=false and search_tsv@@query  order by rank desc ";

  pool.query(sql, [searchKey], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};

/* function for handling http requests to retrive the records in the
 Course table in database in json format*/
exports.getCodeSnippets = async function (req, res, next) {
  var queryObject = url.parse(req.url, true).query;
  let pageSize = queryObject.pageSize || 20;
  let currentPage = queryObject.currentPage || 1;
  let author = queryObject.author || "";
  let sort = queryObject.sort || ""; //not used at the moment

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
    " select id, description, language_name, payload, author_id " +
    " from code_snippet_get_all(p_author:=$1, p_offset:=$2, p_limit:=$3) ";

  var resultArr = [];

  pool.query(sql, [author, offset, pageSize], function (err, result, fields) {
    pool.end(() => {});
    if (err) next(err);
    else {
      setCorsHeaders(req, res);
      res.json(result.rows);
    }
  });
};
