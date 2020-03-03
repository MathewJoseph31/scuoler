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
const dbControllerQuiz=require('./DBcontrollerQuiz');
const dbControllerCourse=require('./DBcontrollerCourse');

//----PROBLEM----

exports.editProblemInDB=function(req,res){
  //var q = url.parse(req.url, true).query;
  let problemId=req.body.id;
  let description=req.body.description;
  let option1=req.body.option1;
  let option2=req.body.option2;
  let option3=req.body.option3;
  let option4=req.body.option4;
  let answerkey=req.body.answerkey;
  let quizId=req.body.quizId;
  var solution=req.body.solution;
  var authorId=req.body.authorId;

  if(answerkey==undefined||answerkey==''||answerkey=='null'){
    answerkey=null;
  }

  console.log(description+' '+solution);

  var sql="UPDATE PROBLEM SET  description=$1, option1=$2, option2=$3, option3=$4, "+
  "option4=$5, answerkey=$6, quiz_id=$7, solution=$8 where id=$9 ";

  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  pool.query(sql, [description, option1, option2, option3, option4, answerkey, quizId, solution, problemId], function (err, result, fields){
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


/* function for handling  http requests to inserts to the problem table in database*/
exports.insertProblemToDB=function(req,res){
  let quizId=req.body.quizId;
  let problemDescription=req.body.probDescription;
  let option1=req.body.option1;
  let option2=req.body.option2;
  let option3=req.body.option3;
  let option4=req.body.option4;
  let answerKey=req.body.answerKey;
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

  var sql = "insert into Problem(id, description, option1, option2, option3, option4, solution, answerkey, author_id, quiz_id) values($1,$2,$3,$4,$5, $6, $7, $8, $9, $10)";

  var problemId=dbControllerCourse.getUniqueId(authorName);
  pool.query(sql, [problemId,problemDescription, option1, option2, option3, option4, ansDescription, answerKey, authorName,quizId], function(err,result){
    if (err) throw err;
    console.log("1 record inserted");
    //
    var getResultPromise=dbControllerQuiz.getQuizList();
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

  var sql = "select distinct A.id, A.description, A.option1, A.option2, A.option3, A.option4, answerkey, "+
   "A.solution, A.type, A.author_id, A.quiz_id, B.description quiz_description from Problem A inner join Quiz B on A.quiz_id=B.id";

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
    '</div>\
    <div id="updateWindow" class="updateWindow">\
    <button id = "x" onclick="closeUpdateWindow()">\
              X\
    </button>\
    <div id="updateWindowHeader" class="updateWindowHeader"></div>\
    <fieldset>\
        <br>\
      Problem Id: <input type="text" id="problemId" readonly/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
      Quiz Id:';

      var quizList=dbControllerQuiz.getQuizListSync();
        str+='<select id="quizId" name="quizId" required="true">';
         for(var i=0;i<quizList.length;i++){
            var index=quizList[i].indexOf('$,');
            var valQuiz=quizList[i].substring(index+2);
            var textQuiz=quizList[i].substring(0,index);
            console.log(valQuiz+' , '+textQuiz);
            str+='<option value="'+valQuiz+'">'+textQuiz+'</option>';
           }
        str+='</select> <br>';

      str+='<!--<input id="courseId" name="courseId" type="text" cols="150" required="true"></input> <br>-->\
    Problem Description:<br>\
    <textarea id="probDescription" name="probDescription" type="text" rows="10" cols="150" required="true">\
    </textarea>\
    <br>\
    <br>\
    Option1: <input type="text" id="option1">&nbsp;&nbsp;\
    Option2: <input type="text" id="option2">&nbsp;&nbsp;\
    Option3: <input type="text" id="option3">&nbsp;&nbsp;\
    <br><br>\
    Option4: <input type="text" id="option4">&nbsp;&nbsp;\
    Answer Key: <input type="text" id="answerKey" >&nbsp;&nbsp;\
    <br><br>\
    Answer Description:<br>\
    <textarea id="ansDescription" name="ansDescription" type="text" rows="10" cols="150" required="true">\
    </textarea> <br>\
    <br>\
    Author:\
    <input id="authorName" name="authorName" type="text" cols="150" required="true" readonly>\
    </input> <br>\
    <br>\
    <input type="button" value="Save Updates" onclick="saveUpdateHandler()"/>\
    </div><!--end of update window div-->';
    var i=0;
    for(i=0;i<result.rows.length;i++){
      str+='<hr><div id="par$,'+result.rows[i].id+'" class="probParent">';
      /* replace quotes and double quotes with corresponding html sequences*/
      var desc=result.rows[i].description;
      desc=desc.replace(/\"/g,"&quot;");
      desc=desc.replace(/'/g,"&#39;");
      desc=desc.replace(/\r\n|\r|\n/g,"<br>")
      var sol=result.rows[i].solution;
      sol=sol.replace(/\"/g,"&quot;");
      sol=sol.replace(/'/g,"&#39;");
      sol=sol.replace(/\r\n|\r|\n/g,"<br>")
      if(req.session.userId){
        str+='<input type="button" class="EditButton" onclick="editProblemHandler(\''+
        result.rows[i].id+//'\', \''+desc+
        //'\', \''+
        /*result.rows[i].option1+'\', \''+
        result.rows[i].option2+'\',\''+result.rows[i].option3+'\',\''+result.rows[i].option4+'\','+*/
        //result.rows[i].answerkey+',\''+sol+ ',\''
        //+result.rows[i].author_id+'\',\''+
        //result.rows[i].quiz_id+
        '\')" id="e'+result.rows[i].id+'" value="Edit Problem"/>';
      }
      str=str+'<b>Quiz: </b><div id="quizDescription$,'+result.rows[i].id+'" class="Quiz">'+result.rows[i].quiz_description+'</div>';
      str+='<input type="hidden" id="quizId$,'+result.rows[i].id+'" value="'+result.rows[i].quiz_id+'">';
      str+=' </br><b>Author</b> : <label id="authorId$,'+result.rows[i].id+'">'+result.rows[i].author_id+'</label>';
      str=str+'</br> <b>Question: </b><div id="problemDescription$,'+result.rows[i].id+'" class="Question">'+result.rows[i].description+'</div>';
      str+='<b>Options:</b>';
      str+='</br> 1) <label id="option1$,'+result.rows[i].id+'">'+result.rows[i].option1+'</label>';
      str+='</br> 2) <label id="option2$,'+result.rows[i].id+'">'+result.rows[i].option2+'</label>';
      str+='</br> 3) <label id="option3$,'+result.rows[i].id+'">'+result.rows[i].option3+'</label>';
      str+='</br> 4) <label id="option4$,'+result.rows[i].id+'">'+result.rows[i].option4+'</label>';
      str=str+'</br></br><input type="button" class="showAnswer" onclick="showAnswerHandler(this)" id="b'+result.rows[i].id+'" value="view solution"/></br>' +
      '<div id="d'+result.rows[i].id+'" name="d'+result.rows[i].id+'" class="Answer"><b>Solution: </b>';
      str+='<label id="solution$,'+result.rows[i].id+'">'+result.rows[i].solution+'</label>'+'</br>';
      str+=' Ans Key: <label id="answerkey$,'+result.rows[i].id+'">'+result.rows[i].answerkey+'</label>'+
      '</div>';
      str+='</div><!--end of par div-->'
    }
    str=str+'<hr></body>'+
    '<script type="text/javascript" src="scripts/general.js">'+
    '</script>' +
    '<script type="text/javascript" src="scripts/problem.js">'+
    '</script>'
    ;

    res.send(str);
  });
}

exports.getProblems=function(req, res){
  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  var sql = "select distinct A.id, A.description, A.option1, A.option2, A.option3, A.option4, answerkey, "+
   "A.solution, A.type, A.author_id, A.quiz_id, B.description quiz_description from Problem A inner join Quiz B on A.quiz_id=B.id";

  pool.query(sql, function (err, result, fields){
    if (err) throw err;

    var resultArr=[];
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
