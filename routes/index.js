var express = require('express');
var router = express.Router();


const dbControllerProblem=require('../DBcontrollerProblem');
const dbControllerQuiz=require('../DBcontrollerQuiz');
const dbControllerCourse=require('../DBcontrollerCourse');
const dbControllerUser=require('../DBControllerUser');

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


//PROBLEM
router.get('/insertProblem', function (req, res) {
  if(req.session.userId){
		var getResultPromise=dbControllerQuiz.getQuizList();
		getResultPromise.then(function(result){
			    res.render('insertProblem',{message:null,userId:req.session.userId,quizList:result});
		},function(err){
				res.render('insertProblem',{message:null,userId:req.session.userId,quizList:null});
		})
	}
  else{
   res.render('index',{userId:null,errorMsg:'Insert Problem: Please log In!'});
  }
});

router.get('/editProblem', function (req, res) {
  if(req.session.userId){
		var getResultPromise=dbControllerQuiz.getQuizList();
		getResultPromise.then(function(result){
			    res.render('editProblem',{message:null,userId:req.session.userId,quizList:result});
		},function(err){
				res.render('editProblem',{message:null,userId:req.session.userId,quizList:null});
		})
	}
  else{
   res.render('index',{userId:null,errorMsg:'Insert Problem: Please log In!'});
  }
})

router.post('/insertProblemAction', dbControllerProblem.insertProblemToDB);
router.get('/browseProblem', dbControllerProblem.displayProblems);



/* GET users listing. */
router.post('/login',function(req, res){
  dbControllerUser.verifyUser(req,res);
})

router.get('/logout',function(req, res){
  req.session.destroy(null);
	res.render('index',{userId:null,errorMsg:null});
})

var result=[];

//QUIZ
router.get('/insertQuiz',function (req, res) {
	if(req.session.userId){
		var getResultPromise=dbControllerCourse.getCourseList();
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

router.post('/insertQuizAction', dbControllerQuiz.insertQuizToDB);

router.get('/browseQuiz', dbControllerQuiz.displayQuizes);

router.get('/showTheQuiz',dbControllerQuiz.showTheQuiz);

router.get('/startTheQuiz',dbControllerQuiz.startTheQuiz);


//Course
router.get('/insertCourse',function (req, res) {
	 if(req.session.userId)
    res.render('insertCourse',{message:null,userId:req.session.userId});
	 else
		res.render('index',{userId:null,errorMsg:'Insert Course: Please log In'});
})

router.post('/insertCourseAction',  dbControllerCourse.insertCourseToDB);

router.get('/browseCourse', dbControllerCourse.displayCourses);

router.get('/showTheCourse', dbControllerCourse.showTheCourse)


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

router.post('/insertUserAction', dbControllerUser.insertUserToDB);
router.get('/browseUser',dbControllerUser.displayUsers);
router.get('/showTheUser', dbControllerUser.showTheUser);

//error handler that matches every other URL
router.get('*',function(req,res){
	res.send('404 error: Page Not Found');
})

module.exports = router;
