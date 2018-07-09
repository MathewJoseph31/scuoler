var express = require('express');
var router = express.Router();

const problemsDB=require('../ProblemsDB');

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
  problemsDB.verifyUser(req,res);
})

router.get('/logout',function(req, res){
  req.session.destroy(null);
	res.render('index',{userId:null,errorMsg:null});
})


//PROBLEM
router.get('/insertProblem', function (req, res) {
  if(req.session.userId)
			res.render('insertProblem',{message:null,userId:req.session.userId});
  else
   res.render('index',{userId:null,errorMsg:'Insert Problem: Please log In!'});
})

router.post('/insertProblemAction', function(req,res){
  problemsDB.insertProblemToDB(req,res);
})

router.get('/browseProblem', function (req, res) {
  problemsDB.displayProblems(req,res);
})


//QUIZ
router.get('/insertQuiz',function (req, res) {
	if(req.session.userId)
	  res.render('insertQuiz',{message:null,userId:req.session.userId});
	else
	  res.render('index',{userId:null,errorMsg:'Insert Quiz: User not logged In'});
})

router.post('/insertQuizAction', function(req,res){
 problemsDB.insertQuizToDB(req,res);
//res.render('problem');
})

router.get('/browseQuiz', function(req,res){
 problemsDB.displayQuizes(req,res);
})

//Course
router.get('/insertCourse',function (req, res) {
	 if(req.session.userId)
    res.render('insertCourse',{message:null,userId:req.session.userId});
	 else
		res.render('index',{userId:null,errorMsg:'Insert Course: Please log In'});
})

router.post('/insertCourseAction', function(req,res){
 problemsDB.insertCourseToDB(req,res);
//res.render('problem');
})


router.get('/browseCourse', function(req,res){
 problemsDB.displayCourses(req,res);
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
 problemsDB.insertUserToDB(req,res);
//res.render('problem');
})


router.get('/browseUser', function(req,res){
 problemsDB.displayUsers(req,res);
})

//error handler that matches every other URL
router.get('*',function(req,res){
	res.send('404 error: Page Not Found');
})

module.exports = router;
