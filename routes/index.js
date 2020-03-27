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

router.post('/updateProblem', dbControllerProblem.editProblemInDB);
router.post('/api/deleteProblem', dbControllerProblem.deleteProblemInDB);
/*router.get('/editProblem', function (req, res) {
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
})*/

router.post('/insertProblemAction', dbControllerProblem.insertProblemToDB);
router.post('/api/insertProblemAction', dbControllerProblem.insertProblemToDbJson);
router.get('/browseProblem', dbControllerProblem.displayProblems);
router.get('/api/getProblems', dbControllerProblem.getProblems);


/* GET users listing. */
router.post('/login',function(req, res){
  dbControllerUser.verifyUser(req,res);
})

router.post('/api/login',function(req, res){
  dbControllerUser.verifyUserJson(req,res);
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
router.post('/api/insertQuizAction', dbControllerQuiz.insertQuizToDbJson);

router.get('/browseQuiz', dbControllerQuiz.displayQuizes);

router.get('/showTheQuiz',dbControllerQuiz.showTheQuiz);

router.post('/submitQuizAction',dbControllerQuiz.submitQuiz);

router.get('/api/getQuizes', dbControllerQuiz.getQuizes);
router.post('/api/getTheQuiz', dbControllerQuiz.getTheQuiz);
router.post('/api/getProblemListForQuiz',dbControllerQuiz.getProblemListForQuizJson);
router.post('/api/updateQuiz',dbControllerQuiz.editQuizInDbJson);
router.post('/api/deleteQuiz',dbControllerQuiz.deleteQuizInDB);
//router.get('/startTheQuiz',dbControllerQuiz.startTheQuiz);


//Course
router.get('/insertCourse',function (req, res) {
	 if(req.session.userId)
    res.render('insertCourse',{message:null,userId:req.session.userId});
	 else
		res.render('index',{userId:null,errorMsg:'Insert Course: Please log In'});
})

router.post('/insertCourseAction',  dbControllerCourse.insertCourseToDB);
router.post('/api/insertCourseAction',  dbControllerCourse.insertCourseToDbJson);

router.get('/browseCourse', dbControllerCourse.displayCourses);

router.get('/showTheCourse', dbControllerCourse.showTheCourse)
router.get('/api/getCourses', dbControllerCourse.getCourses);
router.post('/api/getTheCourse', dbControllerCourse.getTheCourse);
router.post('/api/getQuizListForCourse',dbControllerCourse.getQuizListForCourseJson);
router.post('/api/updateCourse',dbControllerCourse.editCourseInDbJson);
router.post('/api/deleteCourse',dbControllerCourse.deleteCourseInDB);

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
router.post('/api/insertUserAction', dbControllerUser.insertUserToDbJson);
router.get('/showTheUser', dbControllerUser.showTheUser);
router.get('/browseUser',dbControllerUser.displayUsers);
router.get('/api/getUsers', dbControllerUser.getUsers);
router.post('/api/getTheUser', dbControllerUser.getTheUser);
router.post('/api/getCourseListForUser',dbControllerUser.getCourseListForUserJson);
router.post('/api/updateUser',dbControllerUser.editUserInDbJson);

//error handler that matches every other URL
router.get('*',function(req,res){
	res.send('404 error: Page Not Found');
})

module.exports = router;
