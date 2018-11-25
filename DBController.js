/* This file primarily contains code for interfacing with the Database (insert and retreival functions)
*/
const express = require('express');

//const mysql = require('mysql');
const pg=require('pg');

//const mysql = new pg.Client(connectionString);
//mysql.connect();

const fs = require('fs');

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
    '<script type="text/javascript" src="scripts/problem.js">'+
    '</script>'+
    '<script type="text/javascript" src="scripts/general.js">'+
    '</script>';

    res.send(str);
  });
}


//--USER/Costumer---

/* function for handling  http authentication requests
to the portal, the credentials are store in Customer table */
exports.verifyUser=function(req,res){
  let userId=req.body.userId;
  let password=req.body.password;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  var sql = "SELECT count(*) as count FROM Customer where id=$1 and password=$2";

  pool.query(sql, [userId,password], function (err, result, fields){
    if(result.rows[0].count=="0"){
      res.render('index.ejs', {userId: undefined,errorMsg:"User Id/password error"});
    }
    else{
      req.session.userId=userId;
      ///console.log(req.session);
      res.render('index.ejs', {userId: req.session.userId,errorMsg:null});
    }
  });
}


/* function for handling  http requests to insert a record to the
 Customer table in database*/
exports.insertUserToDB=function(req,res){
  let userId=req.body.userId;
  let password=req.body.password;
  let firstName=req.body.firstName;
  let lastName=req.body.lastName;
  let address1=req.body.address1;
  let address2=req.body.address2;
  let city=req.body.city;
  let zip=req.body.zip;
  let phone=req.body.phone;
  let cell=req.body.cell;
  let email=req.body.email;

  console.log('in inserting user to db');
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  var sql = "insert into Customer(id,password,first_name,last_name,address1,address2,city,zip,phone,mobile,email) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";

  pool.query(sql, [userId,password,firstName,lastName,address1,address2,city, zip, phone,cell,email], (err,result)=>
  {
    if (err) throw err;
    console.log("1 record inserted");
    res.render('insertUser', {message: 'User Inserted',userId:req.session.userId});
  });
}

/* function for handling  http requests to retrive and display the records in the
 Customer table in database*/
exports.displayUsers=function(req,res){
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT id,first_name,last_name,address1,address2,city,zip,phone,mobile,email FROM Customer";
  pool.query(sql, function (err, result, fields){
    if (err) throw err;

    var str= '<!DOCTYPE html><head>'+
    '<meta charset="utf-8">'+
    '<title>Browse Users</title>'+
    '<link rel="stylesheet" type="text/css" href="css/style.css">'+
    '</head>'+
    '<body>';
    if(req.session.userId)
    str+='<div w3-include-html="headerLogged"></div>';
    else
    str+='<div w3-include-html="header.ejs"></div>';
    str+='<a class="HomeLink" href="/">back to home</a>'+
    '<div class="h1">'+
    'Browse Users'+
    '</div>'+
    '<table style="width:100%">'+
    '<tr>'+
    '<th>id</th><th>full name</th><th>address</th><th>city</th><th>zip</th><th>phone</th><th>mobile</th><th>email</th>'+
    '</tr>';
    var i=0;
    for(i=0;i<result.rows.length;i++){
      str+='<tr><td><a href="./showTheUser?id='+result.rows[i].id+'">'+result.rows[i].id+'</a></td>'+
      '<td>'+result.rows[i].first_name+' '+result.rows[i].last_name+'</td>'+
      '<td>'+result.rows[i].address1+' '+result.rows[i].address2+'</td>'+
      '<td>'+result.rows[i].city+'</td>'+'<td>'+result.rows[i].zip+'</td>'+
      '<td>'+result.rows[i].phone+'</td>'+'<td>'+result.rows[i].mobile+'</td>'+
      '<td>'+result.rows[i].email+'</td>'+
      '</tr>';
    }
    str+='</table>'+
    '</body>' +
    '<script type="text/javascript" src="scripts/problem.js">'+
    '</script>'+
    '<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
  });
}

/* function for handling  http requests to show details about a selected User*/
exports.showTheUser=function(req,res){

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

var q = url.parse(req.url, true).query;
let userId=q.id;

var sql = "select first_name, last_name, city, phone, mobile, email from customer where id = '"+userId+"'";
console.log(' param '+q.id);
pool.query(sql, function(err,result,fields){

  var str= '<!DOCTYPE html><head>'+
  '<meta charset="utf-8">'+
  '<title>Show Individual User</title>'+
  '<link rel="stylesheet" type="text/css" href="css/style.css">'+
  '</head>'+
  '<body>';
  if(req.session.userId)
  str+='<div w3-include-html="headerLogged"></div>';
  else
  str+='<div w3-include-html="header.ejs"></div>';

  str=str+'<a class="HomeLink" href="/">back to home</a>'+
  '<div class="h1">'+
  'Name: '+result.rows[0].first_name+' '+result.rows[0].last_name+
  '</div>';

  str+='<p> City: '+result.rows[0].city+'</b><br/>'+
  '<b> Phone:'+result.rows[0].phone+' Mob: '+result.rows[0].mobile+'</b>';
  str+='<br/>Email: '+result.rows[0].email;
  str+='</body>';
  str+='<script type="text/javascript" src="scripts/general.js">'+
  '</script>';

  res.send(str);
  });
}



//----COURSE----

/* function for return a Promise object that retrives the set of records in the
 Course names from course table in database*/
function getCourseList(){
      var courseList=[];
        var pool = new pg.Pool({
          host: configuration.getHost(),
          user: configuration.getUserId(),
          password: configuration.getPassword(),
          database: configuration.getDatabase(),
          port:configuration.getPort(),
          ssl:true
        });
        var sql = "SELECT id,name FROM Course";
        return new Promise(function(resolve,reject){
          pool.query(sql, function (err, result, fields){
            if (err)
                  reject(err);
            else{
             var i=0;
             for(i=0;i<result.rows.length;i++){
               courseList.push(result.rows[i].name+'$,'+result.rows[i].id);
             }
             resolve(courseList);
           }
        });
        });
      }

exports.getCourseList=getCourseList;

/* function for handling  http requests to inserts to the course table in database*/
exports.insertCourseToDB=function(req,res){

  let courseName=req.body.courseName;
  let courseDescription=req.body.courseDescription;
  let ownerId=req.body.ownerId;
  console.log('in course inserting to db');
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "insert into Course(id, name, description, owner_id) values($1,$2,$3,$4)";

  var courseId=getUniqueId(ownerId);
  pool.query(sql, [courseId,courseName,courseDescription,ownerId], function(err,result){
    if (err) throw err;
    console.log("1 record inserted");

    res.render('insertCourse', {message: 'Course Inserted',userId:req.session.userId});
  });
}


/* function for handling  http requests to retrive and display the records in the
 Course table in database*/
exports.displayCourses=function(req,res){
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT id,name, description, owner_id FROM Course";

  pool.query(sql, function (err, result, fields){
    if (err) throw err;

    var str= '<!DOCTYPE html><head>'+
    '<meta charset="utf-8">'+
    '<title>Browse Courses</title>'+
    '<link rel="stylesheet" type="text/css" href="css/style.css">'+
    '</head>'+
    '<body>';
    if(req.session.userId)
    str+='<div w3-include-html="headerLogged"></div>';
    else
    str+='<div w3-include-html="header.ejs"></div>';

    str=str+'<a class="HomeLink" href="/">back to home</a>'+
    '<div class="h1">'+
    'Browse Courses'+
    '</div>'+
    '<table style="width:100%">'+
    '<tr>'+
    '<th>Course name</th><th>Description</th><th>Owner</th>'+
    '</tr>';
    var i=0;
    for(i=0;i<result.rows.length;i++){
      str+='<tr><td><a href="./showTheCourse?id='+result.rows[i].id+'">'+result.rows[i].name+'</a></td>'+
      '<td>'+result.rows[i].description+'</td>'+
      '<td>'+result.rows[i].owner_id+'</td>'+
      '</tr>';
    }
    str+='</table>'+
    '</body>';
    str+=
    '<script type="text/javascript" src="scripts/problem.js">'+
    '</script>'+
    '<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
  });
}

/* function for handling  http requests to show details about a selected Course*/
exports.showTheCourse=function(req,res){

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

var q = url.parse(req.url, true).query;
let courseId=q.id;

var sql = "select name, description, owner_id from course where id='"+courseId+"'";

console.log(' param '+q.id);

pool.query(sql, function(err,result,fields){
  if (err) throw err;
  console.log("1 record inserted");


  var str= '<!DOCTYPE html><head>'+
  '<meta charset="utf-8">'+
  '<title>Show Individual Course</title>'+
  '<link rel="stylesheet" type="text/css" href="css/style.css">'+
  '</head>'+
  '<body>';
  if(req.session.userId)
  str+='<div w3-include-html="headerLogged"></div>';
  else
  str+='<div w3-include-html="header.ejs"></div>';

  str=str+'<a class="HomeLink" href="/">back to home</a>'+
  '<div class="h1">'+
  'Course Name:'+result.rows[0].name+
  '</div>';

  str+='<p> Description: '+result.rows[0].description+'</b><br/>'+
  '<b> Creator:'+result.rows[0].owner_id+'</b>';

  str+='</body>';
  str+='<script type="text/javascript" src="scripts/general.js">'+
  '</script>';

  res.send(str);
});
}

//---QUIZ---
/* function for returning a Promise object that retrives the set of records in the
 quiz descriptions from quiz table in database*/
function getQuizList(){
      var quizList=['General$,defaultUser'];
        var pool = new pg.Pool({
          host: configuration.getHost(),
          user: configuration.getUserId(),
          password: configuration.getPassword(),
          database: configuration.getDatabase(),
          port:configuration.getPort(),
          ssl:true
        });
        var sql = "SELECT id,description FROM Quiz";
        return new Promise(function(resolve,reject){
          pool.query(sql, function (err, result, fields){
            if (err)
                  reject(err);
            else{
             var i=0;
             for(i=0;i<result.rows.length;i++){
               quizList.push(result.rows[i].description+'$,'+result.rows[i].id);
             }
             resolve(quizList);
           }
        });
        });
      }

exports.getQuizList=getQuizList;

/* function for handling  http requests to insert to the quiz table in database*/
exports.insertQuizToDB=function(req,res){
  let quizDescription=req.body.quizDescription;
  let courseId=req.body.courseId;
  let authorName=req.body.authorName;

  console.log('in quiz inserting to db');
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "insert into Quiz(id, description, course_id, instructor_id) values($1,$2,$3,$4)";

  var quizId=getUniqueId(authorName);
  pool.query(sql, [quizId,quizDescription,courseId,authorName], function(err,result){
    if (err) throw err;
    console.log("1 record inserted");

    //
    var getResultPromise=getCourseList();
    getResultPromise.then(function(result){
          res.render('insertQuiz',{message:'Quiz Inserted',userId:req.session.userId,courseList:result});
    },function(err){
        res.render('insertQuiz',{message:'Quiz Inserted',userId:req.session.userId,courseList:null});
    })

    //res.render('insertQuiz', {message: 'Quiz Inserted',userId:req.session.userId});
  });
}


/* function for handling  http requests to retrive and display the records in the
 Quiz table in database*/
exports.displayQuizes=function(req,res){
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT Quiz.id, Quiz.description, Course.name, instructor_id FROM Quiz INNER JOIN Course "+
            "ON Quiz.course_id=Course.id";

  pool.query(sql, function (err, result, fields){
    if (err) throw err;

    var str= '<!DOCTYPE html><head>'+
    '<meta charset="utf-8">'+
    '<title>Browse Quizes</title>'+
    '<link rel="stylesheet" type="text/css" href="/css/style.css">'+
    '</head>'+
    '<body>';
    if(req.session.userId)
    str+='<div w3-include-html="headerLogged"></div>';
    else
    str+='<div w3-include-html="header.ejs"></div>';
    str+='<a class="HomeLink" href="/">back to home</a>'+
    '<div class="h1">'+
    'Browse Quizes'+
    '</div>'+
    '<table style="width:100%">'+
    '<tr>'+
    '<th>Quiz</th><th>Course</th><th>Instructor</th>'+
    '</tr>';
    var i=0;
    for(i=0;i<result.rows.length;i++){
      str+='<tr><td><a href="./showTheQuiz?id='+result.rows[i].id+'">'+result.rows[i].description+'</a></td>'+
      '<td>'+result.rows[i].name+'</td>'+
      '<td>'+result.rows[i].instructor_id+'<td>'+
      '</tr>';
    }
    str+='</table>'+
    '</body>';
    str+='<script type="text/javascript" src="scripts/problem.js">'+
    '</script>'+
    '<script type="text/javascript" src="scripts/general.js">'+
    '</script>';

    res.send(str);
  });
}

/* function for handling  http requests to show details about a selected Course*/
exports.showTheQuiz=function(req,res){

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  var q = url.parse(req.url, true).query;
  let quizId=q.id;

  var sql =" SELECT Quiz.description, Course.name, Quiz.instructor_id FROM Quiz INNER JOIN Course "+
            "ON Quiz.course_id=Course.id where Quiz.id='"+quizId+"'";

  "select description, course_id, instructor_id from quiz where id='"+quizId+"'";
  console.log(' param '+q.id);

  pool.query(sql, function (err, result, fields){
    if (err) throw err;

   var str= '<!DOCTYPE html><head>'+
  '<meta charset="utf-8">'+
  '<title>Show Individual Quiz</title>'+
  '<link rel="stylesheet" type="text/css" href="css/style.css">'+
  '</head>'+
  '<body>';
  if(req.session.userId)
  str+='<div w3-include-html="headerLogged"></div>';
  else
  str+='<div w3-include-html="header.ejs"></div>';

  str=str+'<a class="HomeLink" href="/">back to home</a>'+
  '<div class="h1">'+
  'Quiz Description: '+result.rows[0].description+
  '</div>';

  str+='<p> Course: '+result.rows[0].name+'</b><br/>'+
  '<b> Instructor:'+result.rows[0].instructor_id+'</b>';

  //
  var getResultPromise=getProblemListForQuiz(quizId);

  getResultPromise.then(function(resultHtmlStr){
        str+=resultHtmlStr;
        str=str+'</body>';
        str+='<script type="text/javascript" src="scripts/problem.js">'+
        '</script>';
        str+='<script type="text/javascript" src="scripts/general.js">'+
        '</script>';
        res.send(str);
  },function(err){
    str=str+'</body>';
    str+='<script type="text/javascript" src="scripts/problem.js">'+
    '</script>';
    str+='<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
   })
 });//end of query
}

/* function for return a Promise object that retrives the set of records in the
 Course names from course table in database*/
function getProblemListForQuiz(quizId){
      var htmlStr='<h2>'+
                  'Problems:'+
                  '</h2>';
        var pool = new pg.Pool({
          host: configuration.getHost(),
          user: configuration.getUserId(),
          password: configuration.getPassword(),
          database: configuration.getDatabase(),
          port:configuration.getPort(),
          ssl:true
        });
        var sql = "SELECT description, solution FROM Problem where quiz_id=$1";
        return new Promise(function(resolve,reject){
          pool.query(sql, [quizId], function (err, result, fields){
            if (err)
                  reject(err);
            else{
             var i=0;
             for(i=0;i<result.rows.length;i++){
               htmlStr=htmlStr+'<b>Question: </b><div class="Question">'+result.rows[i].description+'</div>'+
               '<input type="button" class="showAnswer" onclick="showAnswerHandler(this)" id="b'+i+'" value="view solution"/></br>' +
               '<div id="d'+i+'" class="Answer"><b>Solution: </b>'+result.rows[i].solution+'</div><hr>';
             }
             resolve(htmlStr);
           }
        });
        });
      }
exports.getProblemListForQuiz=getProblemListForQuiz;


function pad(num){
  num=num<10?'0'.concat(num):''.concat(num);
  return num;
}

function getUniqueId(userId){
  var v= new Date();
  var day=v.getDate();
  day=pad(day)

  var mon= v.getMonth();
  mon+=1;
  mon=pad(mon);

  var year= v.getFullYear();
  year=pad(year);

  var hour=v.getHours();
  hour=pad(hour);

  var minute=v.getMinutes();
  minute=pad(minute);

  var second=v.getSeconds();
  second=pad(second);

  //console.log(day+'month:'+mon+'year:'+year);
  var str=userId.concat(mon).concat(day).concat(year).concat(hour).concat(minute).concat(second)

  return str;
}
