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

/* API version of insertCourseToDB inserts to the course table in database*/
exports.insertCourseToDbJson=function(req,res){

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
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    if (err){
      throw err;
      res.json({"insertstatus":"error"});
    }
    else{
      res.json({"insertstatus":"ok", "courseId":courseId});
    }
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
    str+= '<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
  });
}

/* function for handling http requests to retrive the records in the
 Course table in database in json format*/
exports.getCourses=function(req,res){

    var pool = new pg.Pool({
      host: configuration.getHost(),
      user: configuration.getUserId(),
      password: configuration.getPassword(),
      database: configuration.getDatabase(),
      port:configuration.getPort(),
      ssl:true
    });

    var sql = "SELECT id,name, description, owner_id FROM Course where deleted=false ";
    var resultArr=[];

    pool.query(sql, function (err, result, fields){
      if (err) throw err;
      var i=0;
      for(i=0;i<result.rows.length;i++){
        resultArr.push(result.rows[i]);
      }

      res.setHeader('Access-Control-Allow-Origin','*');
      res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers','Content-Type');
      res.setHeader('Access-Control-Allow-Credentials',true);
      res.json(resultArr);
    });
}

exports.getTheCourse=function(req,res){
  let courseId=req.body.courseId;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "select name, description, owner_id from course where id='"+courseId+"'";

  pool.query(sql, function(err,result,fields){
    if (err) throw err;

    let resObj={};

    resObj.name=result.rows[0].name;
    resObj.description=result.rows[0].description;
    resObj.ownerId=result.rows[0].owner_id;

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    res.json(resObj);
  })
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

  str+='<p style="text-align:left"> Description: '+result.rows[0].description+'</b><br/>'+
  '<b> Creator:'+result.rows[0].owner_id+'</b></p>';
str+='<div class="row">';
str+='<div class="LeftWindow"></br><b>List of Quizes:</b></br></br>';
var getResultPromise=getQuizListForCourse(courseId);
getResultPromise.then(function(quizList){
  for(var i=0;i<quizList.length;i++){
    var index=quizList[i].indexOf('$,');
    var valQuiz=quizList[i].substring(index+2);
    var textQuiz=quizList[i].substring(0,index);
    str+='<a href="./showTheQuiz?id='+valQuiz+'\">'+textQuiz+"</a>";
    if(i<quizList.length-1)
       str+="</br>";
    console.log(valQuiz+' , '+textQuiz);
  }
  str+='</div>';//end of left window
  str+='</div>';//end of row
    str+='</body>';
    str+='<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
},function(err){
  str+='</div>';//end of left window
  str+='</div>';//end of row
    str+='</body>';
    str+='<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
});
});
}

/*api method for updating a course*/
exports.editCourseInDbJson=function(req,res){
  //var q = url.parse(req.url, true).query;
  let courseId=req.body.courseId;
  let description=req.body.description;
  let name=req.body.name;


  var sql="UPDATE COURSE SET  name=$1, description=$2, modified_timestamp=now() "+
  " where id=$3 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  pool.query(sql, [name, description, courseId], function (err, result, fields){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    if (err) {
      throw err;
      res.json({"updatestatus":"error"});
    }
    else{
      //console.log(description+' '+solution);
      console.log("problem updated");
      res.json({"updatestatus":"ok"});
    }
  });

}

exports.deleteCourseInDB=function(req,res){
  //var q = url.parse(req.url, true).query;
  let courseId=req.body.id;

  var sql="UPDATE COURSE SET  deleted=true, modified_timestamp=now() where id=$1 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  pool.query(sql, [courseId], function (err, result, fields){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    if (err) {
      throw err;
      res.json({"deletestatus":"error"});
    }
    else{
      //console.log(description+' '+solution);
      console.log("problem deleted");
      res.json({"deletestatus":"ok"});
    }
  });

}


/* function for returning a Promise object that retrives the set of records in the
 Quiz table in database, related to a selected course*/
function getQuizListForCourse(courseId){
  var quizList=[];
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT id,description FROM Quiz where course_id=$1";
  return new Promise(function(resolve,reject){
    pool.query(sql, [courseId], function (err, result, fields){
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
exports.getQuizListForCourse=getQuizListForCourse;

exports.getQuizListForCourseJson=function(req,res){
  let courseId=req.body.courseId;
  var quizList=[];
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT id,description FROM Quiz where course_id=$1";
  pool.query(sql, [courseId], function (err, result, fields){
    if (err) reject(err);
    let resultArr=[];
    var i=0;
    for(i=0;i<result.rows.length;i++){
      resultArr.push(result.rows[i]);
    }
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    res.json(resultArr);
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

exports.getUniqueId=getUniqueId;
