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
const dbControllerCourse=require('./DBcontrollerCourse');

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

const Client=require('pg-native');

  //---QUIZ---
  /* function for returning a Promise object that retrives the set of records in the
   quiz descriptions from quiz table in database*/
  function getQuizListSync(){
        var quizList=['General$,defaultUser'];
        var client = Client();
        var connStr='postgresql://'+configuration.getUserId()+':'+
        configuration.getPassword()+'@'+configuration.getHost()+':'+
        configuration.getPort()+'/'+configuration.getDatabase();
        client.connectSync(connStr);
        var sql = "SELECT id,description FROM Quiz";
        var rows=client.querySync(sql);
        var i=0;
        for(i=0;i<rows.length;i++){
            quizList.push(rows[i].description+'$,'+rows[i].id);
        }
        return quizList;
  }

exports.getQuizListSync=getQuizListSync;

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
    var getResultPromise=dbControllerCourse.getCourseList();
    getResultPromise.then(function(result){
          res.render('insertQuiz',{message:'Quiz Inserted',userId:req.session.userId,courseList:result});
    },function(err){
        res.render('insertQuiz',{message:'Quiz Inserted',userId:req.session.userId,courseList:null});
    })

    //res.render('insertQuiz', {message: 'Quiz Inserted',userId:req.session.userId});
  });
}

/* Api version of insertQuizToDB*/
exports.insertQuizToDbJson=function(req,res){
  let quizDescription=req.body.quizDescription;
  let courseId=req.body.courseId;
  let authorName=req.body.authorName;

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "insert into quiz(id, description, course_id, instructor_id) values($1,$2,$3,$4)";

  var quizId=getUniqueId(authorName);
  pool.query(sql, [quizId,quizDescription,courseId,authorName], function(err,result){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    if (err){
      throw err;
      res.json({"insertstatus":"error"});
    }
    else{
      console.log('in quiz inserting to db and return json');
      res.json({"insertstatus":"ok", "quizId":quizId});
    }
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

exports.getQuizes=function(req, res){
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


/*exports.startTheQuiz=function(req,res){

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
    str=str+'</body>';
    str+='<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    res.send(str);
  });
}*/

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
  '<link rel="stylesheet" media="screen and (max-width: 1000px)" type="text/css" href="css/styleMob.css">'+
  '<link rel="stylesheet" media="screen and (min-width: 1000px)" type="text/css" href="css/style.css">'+
  '</head>'+
  '<body>';
  if(req.session.userId)
  str+='<div w3-include-html="headerLogged"></div>';
  else
  str+='<div w3-include-html="header.ejs"></div>';

  var quizDescription=result.rows[0].description;

  str=str+'<a class="HomeLink" href="/">back to home</a>'+
  '<div class="h1">'+
  'Quiz Description: '+quizDescription+
  '</div>';

  str+='<p> Course: '+result.rows[0].name+'</b><br/>'+
  '<b> Instructor:'+result.rows[0].instructor_id+'</b>';
  str+='<input type="button" class="quizButton" onclick="startQuizHandler(this)" id="btnStartQuiz'+quizId+'" name="btnStartQuiz'+quizId+'" value="Start Quiz"/>';

  //
  var getResultPromise=getProblemListForQuiz(quizId, quizDescription);

  getResultPromise.then(function(resultHtmlStr){
        str+=resultHtmlStr;
        str=str+'</body>';
        str+='<script type="text/javascript" src="scripts/general.js">'+
        '</script>';
        str+='<script type="text/javascript" src="scripts/startQuiz.js">'+
        '</script>';
        res.send(str);
  },function(err){
    str=str+'</body>';
    str+='<script type="text/javascript" src="scripts/general.js">'+
    '</script>';
    str+='<script type="text/javascript" src="scripts/startQuiz.js">'+
    '</script>';
    res.send(str);
   })
 });//end of query
}

/*Api version of showTheQuiz*/
exports.getTheQuiz=function(req,res){
    let quizId=req.body.quizId;
    var pool = new pg.Pool({
      host: configuration.getHost(),
      user: configuration.getUserId(),
      password: configuration.getPassword(),
      database: configuration.getDatabase(),
      port:configuration.getPort(),
      ssl:true
    });

    var sql =" SELECT Quiz.description, Course.name, Quiz.instructor_id FROM Quiz INNER JOIN Course "+
              "ON Quiz.course_id=Course.id where Quiz.id='"+quizId+"'";

    let resObj={};

    pool.query(sql, function (err, result, fields){
      if (err) throw err;

      resObj.description=result.rows[0].description;
      resObj.name=result.rows[0].name;
      resObj.instructorId=result.rows[0].instructor_id;

      res.setHeader('Access-Control-Allow-Origin','*');
      res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers','Content-Type');
      res.setHeader('Access-Control-Allow-Credentials',true);
      res.json(resObj);
    });

}


/* function for return a Promise object that retrives the set of records in the
 Course names from course table in database*/
function getProblemListForQuiz(quizId, quizDescription){
      var htmlStr='<div id="ProblemList" class="ProblemList"><form method="post" action="submitQuizAction">\
                   <input type="hidden" id="quizId" name="quizId" value="'+quizId+'">\
                   <input type="hidden" id="quizDescription" name="quizDescription" value="'+quizDescription+'">\
                  <h2>'+
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
        var sql = "SELECT id, description, option1, option2, option3, option4, solution FROM Problem where quiz_id=$1";
        return new Promise(function(resolve,reject){
          pool.query(sql, [quizId], function (err, result, fields){
            if (err)
                  reject(err);
            else{
             var i=0;
             for(i=0;i<result.rows.length;i++){
               htmlStr+='<hr><b>Question: </b><div class="Question">'+result.rows[i].description+'</div><b>Options</b></br>';
               htmlStr+='<input type="radio" id="'+result.rows[i].id+'$option1" name="'+result.rows[i].id+'$'+'" value="1" required="true">'+result.rows[i].option1+'</br>';
               htmlStr+='<input type="radio" id="'+result.rows[i].id+'$option2" name="'+result.rows[i].id+'$'+'" value="2">'+result.rows[i].option2+'</br>';
               htmlStr+='<input type="radio" id="'+result.rows[i].id+'$option3" name="'+result.rows[i].id+'$'+'" value="3">'+result.rows[i].option3+'</br>';
               htmlStr+='<input type="radio" id="'+result.rows[i].id+'$option4" name="'+result.rows[i].id+'$'+'" value="4">'+result.rows[i].option4+'</br>';
               //'<input type="button" class="showAnswer" onclick="showAnswerHandler(this)" id="b'+i+'" value="view solution"/></br>' +
               //'<div id="d'+i+'" class="Answer"><b>Solution: </b>'+result.rows[i].solution+'</div><hr>';
             }
             htmlStr+='<hr></br></br><input type="submit" value="submit quiz"/>';
             htmlStr+='</form></div>'
             resolve(htmlStr);
           }
        });
        });
      }
exports.getProblemListForQuiz=getProblemListForQuiz;

exports.getProblemListForQuizJson=function(req,res){
  let quizId=req.body.quizId;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT id, description, option1, option2, option3, option4, solution FROM Problem where quiz_id=$1";
  pool.query(sql, [quizId], function (err, result, fields){
      if (err) throw err;

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

/* function for handling  http form submits by a user who submits a quiz answers*/
exports.submitQuiz=function(req, res){
  let quizId=req.body.quizId;
  let quizDescription=req.body.quizDescription;
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });
  var sql = "SELECT id,  description, option1, option2, option3, option4, solution, answerkey, maxmarks FROM Problem where quiz_id=$1";
  pool.query(sql, [quizId], function (err, result, fields){
    if (err) throw err;



   var str= '<!DOCTYPE html><head>'+
  '<meta charset="utf-8">'+
  '<title>Quiz Results</title>'+
  '<link rel="stylesheet" media="screen and (max-width: 1000px)" type="text/css" href="css/styleMob.css">'+
  '<link rel="stylesheet" media="screen and (min-width: 1000px)" type="text/css" href="css/style.css">'+
  '</head>'+
  '<body>';

  if(req.session.userId)
   str+='<div w3-include-html="headerLogged"></div>';
  else
   str+='<div w3-include-html="header.ejs"></div>';

  str=str+'<a class="HomeLink" href="/">back to home</a>'+
  '<div class="h1">'+
  quizDescription+': Quiz Results'+
  '</div>';

  var resStr='<div id="AnswerList" class="AnswerList">';
  var i=0, maxMarks=0, marksObtained=0;
  for(i=0;i<result.rows.length;i++){
    var marks=result.rows[i].maxmarks;
    maxMarks+=parseInt(marks);
    var problemId=result.rows[i].id+'$';
    var answerKey=result.rows[i].answerkey;
    var userEnteredKey=req.body[problemId];
    var colorStyle;
    if(answerKey==userEnteredKey){
        console.log('matched');
        marksObtained+=parseInt(marks);
    }

    resStr+='<hr><b>Question: </b><div class="Question">'+result.rows[i].description+'</div><b>Options</b></br>';
    if(userEnteredKey==1 && answerKey==1)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option1" name="'+result.rows[i].id+'$'+'" value="1" checked><span style="color:green">'+result.rows[i].option1+'</span></br>';
    else if(userEnteredKey!=1 && answerKey==1)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option1" name="'+result.rows[i].id+'$'+'" value="1" ><span style="color:green">'+result.rows[i].option1+'</span></br>';
    else if(userEnteredKey==1 && answerKey!=1)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option1" name="'+result.rows[i].id+'$'+'" value="1" checked><span style="color:red">'+result.rows[i].option1+'</span></br>';
    else
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option1" name="'+result.rows[i].id+'$'+'" value="1"><span>'+result.rows[i].option1+'</span></br>';

    if(userEnteredKey==2 && answerKey==2)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option2" name="'+result.rows[i].id+'$'+'" value="2" checked><span style="color:green">'+result.rows[i].option2+'</span></br>';
    else if(userEnteredKey!=2 && answerKey==2)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option2" name="'+result.rows[i].id+'$'+'" value="2"><span style="color:green">'+result.rows[i].option2+'</span></br>';
    else if(userEnteredKey==2 && answerKey!=2)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option2" name="'+result.rows[i].id+'$'+'" value="2" checked><span style="color:red">'+result.rows[i].option2+'</span></br>';
    else
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option2" name="'+result.rows[i].id+'$'+'" value="2"><span>'+result.rows[i].option2+'</span></br>';

    if(userEnteredKey==3 && answerKey==3)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option3" name="'+result.rows[i].id+'$'+'" value="3" checked><span style="color:green">'+result.rows[i].option3+'</span></br>';
    else if(userEnteredKey!=3 && answerKey==3)
        resStr+='<input type="radio" id="'+result.rows[i].id+'$option3" name="'+result.rows[i].id+'$'+'" value="3"><span style="color:green">'+result.rows[i].option3+'</span></br>';
    else if(userEnteredKey==3 && answerKey!=3)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option3" name="'+result.rows[i].id+'$'+'" value="3" checked><span style="color:red">'+result.rows[i].option3+'</span></br>';
    else
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option3" name="'+result.rows[i].id+'$'+'" value="3"><span>'+result.rows[i].option3+'</span></br>';

    if(userEnteredKey==4 && answerKey==4)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option4" name="'+result.rows[i].id+'$'+'" value="4" checked><span style="color:green">'+result.rows[i].option4+'</span></br>';
    else if(userEnteredKey!=4 && answerKey==4)
          resStr+='<input type="radio" id="'+result.rows[i].id+'$option4" name="'+result.rows[i].id+'$'+'" value="4"><span style="color:green">'+result.rows[i].option4+'</span></br>';
    else if(userEnteredKey==4 && answerKey!=4)
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option4" name="'+result.rows[i].id+'$'+'" value="4" checked><span style="color:red">'+result.rows[i].option4+'</span></br>';
    else
      resStr+='<input type="radio" id="'+result.rows[i].id+'$option4" name="'+result.rows[i].id+'$'+'" value="4"><span>'+result.rows[i].option4+'</span></br>';

  }
  resStr+="</div>";
    str+='</br><b>Your Total Score: '+marksObtained+'/'+maxMarks+'</b>';
    str+='<input type="button" class="quizButton" onclick="showQuizResultHandler(this)" value="Show Result Details"/></br></br>';
    str+=resStr;
    str=str+'</body>';
    str+='<script type="text/javascript" src="scripts/submitQuiz.js">'+
    '</script>';
    str+='<script type="text/javascript" src="scripts/general.js">'+
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

exports.getUniqueId=getUniqueId;
