const express = require('express');

//const mysql = require('mysql');
const pg=require('pg');

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//session code
const cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser());
app.use(session({secret:'secr3',resave:false,saveUninitialized:false, maxAge: 24 * 60 * 60 * 1000}));

//end of session code

const url = require('url');

const configuration=require('./Configuration');

//----PROBLEM----

/* function for handling  http requests to inserts to the problem table in database*/
exports.insertProblemToDB=function(req,res){
  let quizId=req.body.quizId;
  let problemDescription=req.body.probDescription;
  let ansDescription=req.body.ansDescription;
  let authorName=req.body.authorName;

  console.log('in problem inserting to db');
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort()
    ,ssl:true
  });

  var sql = "insert into Problem(id, description, solution, author_id, quiz_id) values($1,$2,$3,$4,$5)";

  var problemId=getUniqueId(authorName);
  pool.query(sql, [problemId,problemDescription,ansDescription,authorName,quizId], function(err,result){
    if (err) throw err;
    console.log("1 record inserted");
    //
    var getResultPromise=getQuizList();
    getResultPromise.then(function(result){
          res.render('insertProblem',{message:'Problem Inserted',userId:req.session.userId,quizList:result});
    },function(err){
        res.render('insertProblem',{message:'Problem Inserted',userId:req.session.userId,quizList:null});
    })
    //res.render('insertProblem', {message: 'Problem Inserted',userId:req.session.userId});
  });

}

/* function for handling  http requests to retrive and display the records in the
 problem table in database*/
exports.displayProblems=function(req,res){
  console.log('reading quizes from db');
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  var sql = "select distinct A.description, A.solution, B.description quiz_description from Problem A inner join Quiz B on A.quiz_id=B.id";

  pool.query(sql, function (err, result, fields){
    if (err) throw err;

    var str= '<!DOCTYPE html><head>'+
    '<meta charset="utf-8">'+
    '<title>Browse Problems</title>'+
    '<link rel="stylesheet" media="screen and (max-width: 1000px)" type="text/css" href="css/styleMob.css">'+
    '<link rel="stylesheet" media="screen and (min-width: 1000px)" type="text/css" href="css/style.css">'+
    '</head>'+
    '<body>';
    if(req.session.userId)
    str+='<div w3-include-html="headerLogged"></div>';
    else
    str+='<div w3-include-html="header.ejs"></div>';

    str+='<a class="HomeLink" href="/">back to home</a>'+
    '<div class="h1">'+
    'View Problems'+
    '</div>';

    var i=0;
    for(i=0;i<result.rows.length;i++){
      str=str+'<b>Quiz: </b><div class="Quiz">'+result.rows[i].quiz_description+'</div></br></br>';
      str=str+'<b>Question: </b><div class="Question">'+result.rows[i].description+'</div>'+
      '<input type="button" class="showAnswer" onclick="showAnswerHandler(this)" id="b'+i+'$" value="view solution"/></br>' +
      '<div id="d'+i+'" class="Answer"><b>Solution: </b>'+result.rows[i].solution+'</div><hr>';
    }
    str=str+'</body>'+
    '<script type="text/javascript" src="scripts/general.js">'+
    '</script>' +
    '<script type="text/javascript" src="scripts/problem.js">'+
    '</script>'
    ;

    res.send(str);
  });
}
