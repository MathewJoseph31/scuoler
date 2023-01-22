var express = require("express");
var router = express.Router();

const dbControllerProblem = require("../controllers/DBcontrollerProblem");
const dbControllerQuiz = require("../controllers/DBcontrollerQuiz");
const dbControllerCourse = require("../controllers/DBcontrollerCourse");
const dbControllerUser = require("../controllers/DBControllerUser");
const dbControllerMeeting = require("../controllers/DBcontrollerMeeting");
const dbControllerEmployee = require("../controllers/DBcontrollerEmployee");
const dbControllerPost = require("../controllers/DBcontrollerPost");
const dbControllerRoom = require("../controllers/DBcontrollerRoom");
const dbControllerChat = require("../controllers/DBcontrollerChat");
const dbControllerFiles = require("../controllers/DBcontrollerFiles");
const dbControllerPage = require("../controllers/DBcontrollerPage");
const contactMailer = require("../controllers/EmailController");

const { securityController } = require("../controllers/SecurityController");
const jwtVerifier = require("../middleware/JwtVerifier");

router.all("/*", securityController);
//#####################################################################

//MEETING
router.post("/insertMeetingAction", dbControllerMeeting.insertMeetingToDbJson);
router.get("/getMeetings", dbControllerMeeting.getMeetings);

//PROBLEM
router.post("/updateProblem", dbControllerProblem.editProblemInDB);
router.post("/deleteProblem", dbControllerProblem.deleteProblemInDB);
router.post("/insertProblemAction", dbControllerProblem.insertProblemToDbJson);
router.post("/getTheProblem", dbControllerProblem.getTheProblem);
router.post("/addProblemToQuiz", dbControllerProblem.addProblemToQuiz);
router.post("/searchProblems", dbControllerProblem.searchProblems);
router.get("/getProblems", dbControllerProblem.getProblems);

//QUIZ
router.post("/insertQuizAction", dbControllerQuiz.insertQuizToDbJson);
router.get("/getQuizes", dbControllerQuiz.getQuizes);
router.post("/searchQuizes", dbControllerQuiz.searchQuizes);
router.post("/searchQuizesForPrefix", dbControllerQuiz.searchQuizesForPrefix);
router.post("/getTheQuiz", dbControllerQuiz.getTheQuiz);
router.post(
  "/getProblemListForQuiz",
  dbControllerQuiz.getProblemListForQuizJson
);
router.post(
  "/getCategoryListForQuiz",
  dbControllerQuiz.getCategoryListForQuizJson
);
router.post("/updateQuiz", dbControllerQuiz.editQuizInDbJson);
router.post("/addQuizToCourse", dbControllerQuiz.addQuizToCourse);
router.post("/deleteQuiz", dbControllerQuiz.deleteQuizInDB);
router.post("/quizAnwersSubmit", dbControllerQuiz.quizAnwersSubmit);
router.post("/quizStart", dbControllerQuiz.quizStart);
router.post("/quizGetInstances", dbControllerQuiz.quizGetInstances);
router.post(
  "/getQuizInstanceProblems",
  dbControllerQuiz.getQuizInstanceProblems
);
router.post("/updateQuizMarksAwarded", dbControllerQuiz.updateQuizMarksAwarded);
router.post("/quizGetScoresForUser", dbControllerQuiz.quizGetScoresForUser);
//categories
router.get("/getCategoryList", dbControllerCourse.getCategoryList);

//Course
router.post("/insertCourseAction", dbControllerCourse.insertCourseToDbJson);
router.get("/getCourses", dbControllerCourse.getCourses);
router.get("/getCourseName", dbControllerCourse.getCourseName);
router.post("/searchCourses", dbControllerCourse.searchCourses);
router.post(
  "/searchCoursesForPrefix",
  dbControllerCourse.searchCoursesForPrefix
);
router.post("/getTheCourse", dbControllerCourse.getTheCourse);
router.post(
  "/getQuizListForCourse",
  dbControllerCourse.getQuizListForCourseJson
);
router.post(
  "/getCategoryListForCourse",
  dbControllerCourse.getCategoryListForCourseJson
);

router.post("/updateCourse", dbControllerCourse.editCourseInDbJson);
router.post("/deleteCourse", dbControllerCourse.deleteCourseInDB);

//User
router.post("/login", function (req, res) {
  dbControllerUser.verifyUserJson(req, res);
});
router.post("/insertUserAction", dbControllerUser.insertUserToDbJson);
router.post("/changeUserPassword", dbControllerUser.changeUserPassword);
router.get("/getUsers", dbControllerUser.getUsers);
router.post("/searchUsers", dbControllerUser.searchUsers);
router.post("/getTheUser", dbControllerUser.getTheUser);
router.post("/getCourseListForUser", dbControllerUser.getCourseListForUserJson);
router.post("/updateUser", dbControllerUser.editUserInDbJson);
router.post("/profileImageUpload", dbControllerUser.profileImageUpload);
router.post("/mergeUser", dbControllerUser.mergeUser);
router.post("/mergeUserRating", dbControllerUser.mergeUserRating);
router.post("/userLikeUnlike", dbControllerUser.userLikeUnlike);
router.post("/encryptPass", dbControllerUser.encryptPass);

//error handler that matches every other URL
//router.get('*',function(req,res){
//	res.send('404 error: Page Not Found');
//})

//Employee
router.post(
  "/insertEmployeeAction",
  jwtVerifier.verifyJwt,
  dbControllerEmployee.insertEmployeeToDbJson
);
router.get("/getEmployees", dbControllerEmployee.getEmployees);
router.post("/searchEmployees", dbControllerEmployee.searchEmployees);
router.post("/getTheEmployee", dbControllerEmployee.getTheEmployee);
router.post("/updateEmployee", dbControllerEmployee.editEmployeeInDbJson);
router.post("/mergeEmployee", dbControllerEmployee.mergeEmployee);
router.post("/deleteEmployee", dbControllerEmployee.deleteEmployeeInDB);
router.post("/attachmentUpload", dbControllerEmployee.attachmentUpload);

//User Posts
router.get("/getPostsForSource", dbControllerPost.getPostsForSource);
router.post("/insertPostAction", dbControllerPost.insertPostToDbJson);
router.post("/deletePost", dbControllerPost.deletePostInDB);
router.post("/updatePost", dbControllerPost.editPostInDbJson);

//Pages
router.get("/getPagesForCourse", dbControllerPage.getPagesForCourse);
router.post("/insertPageAction", dbControllerPage.insertPageToDbJson);
router.post("/getThePage", dbControllerPage.getThePage);
router.post("/getTheLesson", dbControllerPage.getTheLesson);
router.post("/getTheModule", dbControllerPage.getTheModule);
router.post("/moveModuleLessonPage", dbControllerPage.moveModuleLessonPage);
router.post("/editModuleLessonPage", dbControllerPage.editModuleLessonPage);
router.post("/deleteModuleLessonPage", dbControllerPage.deleteModuleLessonPage);

//ROOM
router.get("/getRooms", dbControllerRoom.getRooms);
router.post("/insertRoomAction", dbControllerRoom.insertRoomToDbJson);
router.post("/deleteRoom", dbControllerRoom.deleteRoomInDB);
router.post("/updateRoom", dbControllerRoom.editRoomInDbJson);
router.post("/addCustomersToRoom", dbControllerRoom.addCustomersToRoom);
router.post(
  "/deleteCustomersFromRoom",
  dbControllerRoom.deleteCustomersFromRoom
);

//CHAT
router.get("/getChats", dbControllerChat.getChats);
router.post("/insertChatAction", dbControllerChat.insertChatToDbJson);
router.post("/updateChat", dbControllerChat.editChatInDbJson);
router.post("/deleteChat", dbControllerChat.deleteChatInDB);
//Files
router.get("/getUploadsForSource", dbControllerFiles.getUploadsForSource);
router.post("/fileUpload", dbControllerFiles.fileUpload);
router.post("/fileUploadDelete", dbControllerFiles.fileUploadDelete);
router.post("/fileUploadInsertToDB", dbControllerFiles.fileUploadInsertToDB);
router.post(
  "/fileUploadDeleteFromDB",
  dbControllerFiles.fileUploadDeleteFromDB
);
//MAILER
router.post("/sendMail", contactMailer.sendMail);
router.post("/sendReply", contactMailer.sendReply);
router.post("/sendWelcome", contactMailer.sendWelcome);

JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};

//Test
router.get("/test", (req, res) => {
  res.send(JSON.safeStringify(req));
});
module.exports = router;
