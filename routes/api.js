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
const dbControllerLog = require("../controllers/DBcontrollerLog");

const dbControllerCodeSnippet = require("../controllers/DBcontrollerCodeSnippet");
const dbControllerStripe = require("../controllers/DBcontrollerStripe");
const controllerEmail = require("../controllers/EmailController");
const lambdaController = require("../controllers/LambdaController");
const ipController = require("../controllers/IPController");

const { securityController } = require("../controllers/SecurityController");
const jwtVerifier = require("../middleware/JwtVerifier");

router.all("/*", securityController);
//#####################################################################

//MEETING
router.post("/insertMeetingAction", dbControllerMeeting.insertMeetingToDbJson);
router.post("/updateMeeting", dbControllerMeeting.updateMeeting);
router.post("/getTheMeeting", dbControllerMeeting.getTheMeeting);
router.get(
  "/getMeetings",
  jwtVerifier.checkPageForGets,
  dbControllerMeeting.getMeetings
);
router.get(
  "/getMeetingsOfUser",
  jwtVerifier.checkPageForGets,
  dbControllerMeeting.getMeetingsOfUser
);
router.post(
  "/meetingRecordingUpload",
  dbControllerMeeting.meetingRecordingUpload
);
router.post(
  "/meetingRecordingsMerge",
  dbControllerMeeting.meetingRecordingsMerge
);

//PROBLEM
router.post("/updateProblem", dbControllerProblem.editProblemInDB);
router.post("/deleteProblem", dbControllerProblem.deleteProblemInDB);
router.post("/insertProblemAction", dbControllerProblem.insertProblemToDbJson);
router.post("/insertProblemBulk", dbControllerProblem.insertProblemBulk);
router.post("/getTheProblem", dbControllerProblem.getTheProblem);
router.post("/addProblemToQuiz", dbControllerProblem.addProblemToQuiz);
router.post(
  "/searchProblems",
  jwtVerifier.checkPageForPosts,
  dbControllerProblem.searchProblems
);
router.get(
  "/getProblems",
  jwtVerifier.checkPageForGets,
  dbControllerProblem.getProblems
);

//QUIZ
router.post("/insertQuizAction", dbControllerQuiz.insertQuizToDbJson);
router.get(
  "/getQuizes",
  jwtVerifier.checkPageForGets,
  dbControllerQuiz.getQuizes
);
router.post(
  "/searchQuizes",
  jwtVerifier.checkPageForPosts,
  dbControllerQuiz.searchQuizes
);
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
router.post("/quizStart", jwtVerifier.decodeToken, dbControllerQuiz.quizStart);
router.post("/quizGetInstances", dbControllerQuiz.quizGetInstances);
router.post(
  "/quizGetInstancesByCategories",
  dbControllerQuiz.quizGetInstancesByCategories
);
router.post(
  "/getQuizInstanceProblems",
  dbControllerQuiz.getQuizInstanceProblems
);
router.post(
  "/updateQuizInstanceAttributes",
  dbControllerQuiz.updateQuizInstanceAttributes
);
router.post("/quizGetScoresForUser", dbControllerQuiz.quizGetScoresForUser);
//categories
router.get("/getCategoryList", dbControllerCourse.getCategoryList);

//languages
router.get("/getLanguageList", dbControllerCourse.getLanguageList);

//code snippet languages
router.get(
  "/getCodeSnippetLanguageList",
  dbControllerCodeSnippet.getCodeSnippetLanguageList
);
//code snippets
router.post("/insertCodeSnippet", dbControllerCodeSnippet.insertCodeSnippet);
router.post("/getTheCodeSnippet", dbControllerCodeSnippet.getTheCodeSnippet);
router.get(
  "/getCodeSnippets",
  jwtVerifier.checkPageForGets,
  dbControllerCodeSnippet.getCodeSnippets
);
router.post("/updateCodeSnippet", dbControllerCodeSnippet.updateCodeSnippet);
router.post("/deleteCodeSnippet", dbControllerCodeSnippet.deleteCodeSnippet);
router.post(
  "/searchCodeSnippets",
  jwtVerifier.checkPageForPosts,
  dbControllerCodeSnippet.searchCodeSnippets
);

//Course
router.post("/insertCourseAction", dbControllerCourse.insertCourseToDbJson);
router.post("/insertScormCourse", dbControllerCourse.insertScormCourse);
router.post("/insertExternalCourse", dbControllerCourse.insertExternalCourse);
router.get(
  "/getCourses",
  jwtVerifier.checkPageForGets,
  dbControllerCourse.getCourses
);
router.get("/getCourseName", dbControllerCourse.getCourseName);
router.post(
  "/searchCourses",
  jwtVerifier.checkPageForPosts,
  dbControllerCourse.searchCourses
);
router.post(
  "/searchCoursesForPrefix",
  dbControllerCourse.searchCoursesForPrefix
);
router.post("/getTheCourse", dbControllerCourse.getTheCourse);
router.post(
  "/getQuizListForCourse",
  dbControllerCourse.getQuizListForCourseJson
);

router.post("/updateCourse", dbControllerCourse.editCourseInDbJson);
router.post("/deleteCourse", dbControllerCourse.deleteCourseInDB);

//User
router.post("/login", function (req, res) {
  dbControllerUser.verifyUserJson(req, res);
});
router.post("/insertUserAction", dbControllerUser.insertUserToDbJson);
router.post("/changeUserPassword", dbControllerUser.changeUserPassword);
router.get(
  "/getUsers",
  jwtVerifier.checkPageForGets,
  dbControllerUser.getUsers
);
router.post(
  "/searchUsers",
  jwtVerifier.checkPageForPosts,
  dbControllerUser.searchUsers
);
router.post("/getTheUser", dbControllerUser.getTheUser);
router.post("/updateUser", dbControllerUser.editUserInDbJson);
router.post("/profileImageUpload", dbControllerUser.profileImageUpload);
router.post("/mergeUser", dbControllerUser.mergeUser);
router.post("/mergeUserRating", dbControllerUser.mergeUserRating);
router.post("/userLikeUnlike", dbControllerUser.userLikeUnlike);
router.post("/encryptPass", dbControllerUser.encryptPass);
router.post("/emailUnsubscribe", dbControllerUser.emailUnsubscribe);

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
router.get(
  "/getEmployees",
  jwtVerifier.checkPageForGets,
  dbControllerEmployee.getEmployees
);
router.post(
  "/searchEmployees",
  jwtVerifier.checkPageForPosts,
  dbControllerEmployee.searchEmployees
);
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

//WebLogs
router.get("/getWebLogs", dbControllerLog.getWebLogs);
router.get("/getWebLogsForObject", dbControllerLog.getWebLogsForObject);

//IP Address
router.get("/getIpDetails", ipController.getIpDetails);

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
router.post("/fileUploadFromUrls", dbControllerFiles.fileUploadFromUrls);
router.post("/fileUploadDelete", dbControllerFiles.fileUploadDelete);
router.post("/fileUploadInsertToDB", dbControllerFiles.fileUploadInsertToDB);
router.post(
  "/fileUploadDeleteFromDB",
  dbControllerFiles.fileUploadDeleteFromDB
);
router.post(
  "/fileUploadToggleDownload",
  dbControllerFiles.fileUploadToggleDownload
);
router.post("/courseScormFileUpload", dbControllerFiles.courseScormFileUpload);
router.get(
  "/fileUploadGetRelativeUrl",
  dbControllerFiles.fileUploadGetRelativeUrl
);
//MAILER
router.post("/sendMail", controllerEmail.recieveContactUsEmail);
router.post("/sendReply", controllerEmail.sendContactUsEmailReply);
router.post("/sendWelcome", controllerEmail.sendRegistrationEmail);
router.post("/sendEmailGeneric", controllerEmail.sendEmailGenericHandler);

//Stripe
router.post("/stripeSessionCheckout", dbControllerStripe.stripeSessionCheckout);

//Lambda
router.post("/lambdaExecute", lambdaController.lambdaExecute);

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
