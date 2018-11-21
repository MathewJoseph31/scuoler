var express = require('express');
var router = express.Router();

const dbController=require('../DBController');

/* GET home page. */
router.get('/', function (req, res) {
/*if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }*/

  //req.session.userId="Guest";
	res.render('index',{userId:req.session.userId,errorMsg:null});
})

/*router.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})*/

router.get('/headerLogged',function(req,res){
res.render('headerLogged',{userId:req.session.userId});
})

router.post('/login',function(req, res){
  dbController.verifyUser(req,res);
})

router.get('/logout',function(req, res){
  req.session.destroy(null);
	res.render('index',{userId:null,errorMsg:null});
})

var result=[];

//PROBLEM
router.get('/insertProblem', function (req, res) {
  if(req.session.userId){
		var getResultPromise=dbController.getQuizList();
		getResultPromise.then(function(result){
			    res.render('insertProblem',{message:null,userId:req.session.userId,quizList:result});
		},function(err){
				res.render('insertProblem',{message:null,userId:req.session.userId,quizList:null});
		})
	}
  else{
   res.render('index',{userId:null,errorMsg:'Insert Problem: Please log In!'});
  }
})

router.post('/insertProblemAction', function(req,res){
  dbController.insertProblemToDB(req,res);
})

router.get('/browseProblem', function (req, res) {
  dbController.displayProblems(req,res);
})




//QUIZ
router.get('/insertQuiz',function (req, res) {
	result=[];
	if(req.session.userId){
		var getResultPromise=dbController.getCourseList();
		getResultPromise.then(function(result){
				  res.render('insertQuiz',{message:null,userId:req.session.userId,courseList:result});
		},function(err){
        res.render('insertQuiz',{message:null,userId:req.session.userId,courseList:null});
		})
	}
	else{
	  res.render('index',{userId:null,errorMsg:'Insert Quiz: User not logged In'});
	}
})

router.post('/insertQuizAction', function(req,res){
 dbController.insertQuizToDB(req,res);
//res.render('problem');
})

router.get('/browseQuiz', function(req,res){
 dbController.displayQuizes(req,res);
})

router.get('/showTheQuiz', function(req,res){
 dbController.showTheQuiz(req,res);
})


//Course
router.get('/insertCourse',function (req, res) {
	 if(req.session.userId)
    res.render('insertCourse',{message:null,userId:req.session.userId});
	 else
		res.render('index',{userId:null,errorMsg:'Insert Course: Please log In'});
})

router.post('/insertCourseAction', function(req,res){
 dbController.insertCourseToDB(req,res);
//res.render('problem');
})


router.get('/browseCourse', function(req,res){
 dbController.displayCourses(req,res);
})

router.get('/showTheCourse', function(req,res){
 dbController.showTheCourse(req,res);
})


//User
router.get('/insertUser',function (req, res) {
	 if(req.session.userId)
    res.render('insertUser',{message:null,userId:req.session.userId});
	 else
		res.render('index',{userId:null,errorMsg:'Insert User: Please log In'});
})

router.get('/registerUser',function (req, res) {
	 if(req.session.userId)
    res.render('index',{userId:req.session.userId,errorMsg:'Please logout from the current Session'});
	 else
		res.render('insertUser',{message:null,userId:null});
})

router.post('/insertUserAction', function(req,res){
 dbController.insertUserToDB(req,res);
//res.render('problem');
})


router.get('/browseUser', function(req,res){
 dbController.displayUsers(req,res);
})

router.get('/showTheUser', function(req,res){
 dbController.showTheUser(req,res);
})

//error handler that matches every other URL
router.get('*',function(req,res){
	res.send('404 error: Page Not Found');
})

module.exports = router;
