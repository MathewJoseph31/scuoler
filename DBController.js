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

const configuration=require('./Configuration');

//----PROBLEM----

/* function for handling  http requests to inserts to the problem table in database*/
exports.insertProblemToDB=function(req,res){
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

  var sql = "insert into Problem(id, description, solution, author_id) values($1,$2,$3,$4)";

  var problemId=getUniqueId(authorName);
  pool.query(sql, [problemId,problemDescription,ansDescription,authorName], function(err,result){
    if (err) throw err;
    console.log("1 record inserted");
    res.render('insertProblem', {message: 'Problem Inserted',userId:req.session.userId});
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

  var sql = "SELECT description, solution FROM Problem";

  pool.query(sql, function (err, result, fields){
    if (err) throw err;

    var str= '<!DOCTYPE html><head>'+
    '<meta charset="utf-8">'+
    '<title>Browse Problems</title>'+
    '<link rel="stylesheet" type="text/css" href="css/style.css">'+
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
      str=str+'<b>Question: </b><div class="Question">'+result.rows[i].description+'</div>'+
      '<input type="button" class="showAnswer" onclick="showAnswerHandler(this)" id="b'+i+'" value="view solution"/></br>' +
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
      str+='<tr><td><a href="showUser.ejs?id='+result.rows[i].id+'">'+result.rows[i].id+'</a></td>'+
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


//----COURSE----

/* function for return a Promise object that retrives the set of records in the
 Course names from course table in database*/
    exports.getCourseList=function(){
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
               courseList.push(result.rows[i].name);
             }
             resolve(courseList);
           }
        });
        });
      }


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
      str+='<tr><td><a href="showCourse.ejs?id='+result.rows[i].id+'">'+result.rows[i].name+'</a></td>'+
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

//---QUIZ---

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
    res.render('insertQuiz', {message: 'Quiz Inserted',userId:req.session.userId});
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
  var sql = "SELECT id, description, course_id, instructor_id FROM Quiz";

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
      str+='<tr><td><a href="showQuiz.ejs?id='+result.rows[i].id+'">'+result.rows[i].description+'</a></td>'+
      '<td>'+result.rows[i].course_id+'</td>'+
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
