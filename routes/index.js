var express = require("express");
var router = express.Router();

const dbControllerProblem = require("../DBcontrollerProblem");
const dbControllerQuiz = require("../DBcontrollerQuiz");
const dbControllerCourse = require("../DBcontrollerCourse");
const dbControllerUser = require("../DBControllerUser");
const dbControllerMeeting = require("../DBcontrollerMeeting");
const dbControllerEmployee = require("../DBcontrollerEmployee");
const dbControllerPost = require("../DBcontrollerPost");
const dbControllerRoom = require("../DBcontrollerRoom");
const dbControllerChat = require("../DBcontrollerChat");
const contactMailer = require("../contactMailer");
const ipRequests = {};
const suspiciousIPs = [];
const checkWindow = 60 * 1000; //duration in secs converted to milliseconds
const requestLimit = 40; //Max requests that can be made in the checkWindow duration
const resetTime = 24 * 60 * 60 * 1000; //duration to clear the suscpicious IPs list in milliseconds

//################################### DOS ATTACK MEASURES ###########################################

router.all("/*", function (req, res, next) {
  if (!suspiciousIPs.includes(req.ip))
    if (ipRequests.hasOwnProperty(req.ip)) {
      // Check if the incoming IP exists in ipRequests Object
      //If it already exists,Check if the end time is greater than current time
      if (ipRequests[req.ip].endTime < Date.now()) {
        delete ipRequests[req.ip]; //If yes, remove from the ipRequests Object
        // console.log("Timer over!Deleting...");

        //and add fresh entry to ipRequests
        ipRequests[req.ip] = {
          startTime: Date.now(),
          endTime: Date.now() + checkWindow,
          count: 1,
        };
        // console.log("ipRequests: ", ipRequests);
        next();
      }
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ELSE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      else {
        //Check if the count is more the max permissible limit
        if (ipRequests[req.ip].count > requestLimit) {
          console.log(
            "Count is" + ipRequests[req.ip].count + ". Count Exceeded!"
          );
          suspiciousIPs.push(req.ip); //log suspicious IPs
          console.log(
            "You have exceeded the max requests in a give time period! Please try after sometime" //Send suitable response
          );
          // next();
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ELSE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        else {
          ipRequests[req.ip].count = ipRequests[req.ip].count + 1; //if no,then increment the count
          // console.log("ipRequests: ", ipRequests);
          next();
        }
      }
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ELSE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    else {
      ipRequests[req.ip] = {
        //if the incoming IP does not exist in ipRequests Object, add it
        startTime: Date.now(),
        endTime: Date.now() + checkWindow,
        count: 1,
      };
      // console.log("ipRequests: ", ipRequests);
      next();
    }
});
//#####################################################################

function checkEndTime() {
  // console.log("Checking End Time");
  let currentTime = Date.now();
  Object.keys(ipRequests).map(function (key, index) {
    if (ipRequests[key].endTime < currentTime) {
      console.log("Timer over for" + key + "!Deleting...");
      delete ipRequests[key];
      // console.log("ipRequests: ", ipRequests);
    }
  });
}
setInterval(checkEndTime, checkWindow);

//#####################################################################
function clearSuspiciousIPs() {
  console.log("Clearing Suspicious IPs arrays");
  suspiciousIPs = [];
}
setInterval(clearSuspiciousIPs, resetTime);
//###########################################################################################################

//MEETING
router.post(
  "/api/insertMeetingAction",
  dbControllerMeeting.insertMeetingToDbJson
);
router.get("/api/getMeetings", dbControllerMeeting.getMeetings);

//PROBLEM
router.post("/api/updateProblem", dbControllerProblem.editProblemInDB);
router.post("/api/deleteProblem", dbControllerProblem.deleteProblemInDB);
router.post(
  "/api/insertProblemAction",
  dbControllerProblem.insertProblemToDbJson
);
router.post("/api/getTheProblem", dbControllerProblem.getTheProblem);
router.post("/api/addProblemToQuiz", dbControllerProblem.addProblemToQuiz);
router.post("/api/searchProblems", dbControllerProblem.searchProblems);
router.get("/api/getProblems", dbControllerProblem.getProblems);

//QUIZ
router.post("/api/insertQuizAction", dbControllerQuiz.insertQuizToDbJson);
router.get("/api/getQuizes", dbControllerQuiz.getQuizes);
router.post("/api/searchQuizes", dbControllerQuiz.searchQuizes);
router.post(
  "/api/searchQuizesForPrefix",
  dbControllerQuiz.searchQuizesForPrefix
);
router.post("/api/getTheQuiz", dbControllerQuiz.getTheQuiz);
router.post(
  "/api/getProblemListForQuiz",
  dbControllerQuiz.getProblemListForQuizJson
);
router.post(
  "/api/getCategoryListForQuiz",
  dbControllerQuiz.getCategoryListForQuizJson
);
router.post("/api/updateQuiz", dbControllerQuiz.editQuizInDbJson);
router.post("/api/addQuizToCourse", dbControllerQuiz.addQuizToCourse);
router.post("/api/deleteQuiz", dbControllerQuiz.deleteQuizInDB);
router.post("/api/quizAnwersSubmit", dbControllerQuiz.quizAnwersSubmit);
router.post("/api/quizStart", dbControllerQuiz.quizStart);
router.post("/api/quizGetScores", dbControllerQuiz.quizGetScores);
router.post(
  "/api/getQuizInstanceProblems",
  dbControllerQuiz.getQuizInstanceProblems
);
router.post(
  "/api/updateQuizMarksAwarded",
  dbControllerQuiz.updateQuizMarksAwarded
);
router.post("/api/quizGetScoresForUser", dbControllerQuiz.quizGetScoresForUser);
//categories
router.get("/api/getCategoryList", dbControllerCourse.getCategoryList);

//Course
router.post("/api/insertCourseAction", dbControllerCourse.insertCourseToDbJson);
router.get("/api/getCourses", dbControllerCourse.getCourses);
router.post("/api/searchCourses", dbControllerCourse.searchCourses);
router.post(
  "/api/searchCoursesForPrefix",
  dbControllerCourse.searchCoursesForPrefix
);
router.post("/api/getTheCourse", dbControllerCourse.getTheCourse);
router.post(
  "/api/getQuizListForCourse",
  dbControllerCourse.getQuizListForCourseJson
);
router.post(
  "/api/getCategoryListForCourse",
  dbControllerCourse.getCategoryListForCourseJson
);

router.post("/api/updateCourse", dbControllerCourse.editCourseInDbJson);
router.post("/api/deleteCourse", dbControllerCourse.deleteCourseInDB);

//User
router.post("/api/login", function (req, res) {
  dbControllerUser.verifyUserJson(req, res);
});
router.post("/api/insertUserAction", dbControllerUser.insertUserToDbJson);
router.get("/api/getUsers", dbControllerUser.getUsers);
router.post("/api/searchUsers", dbControllerUser.searchUsers);
router.post("/api/getTheUser", dbControllerUser.getTheUser);
router.post(
  "/api/getCourseListForUser",
  dbControllerUser.getCourseListForUserJson
);
router.post("/api/updateUser", dbControllerUser.editUserInDbJson);
router.post("/api/profileImageUpload", dbControllerUser.profileImageUpload);
router.post("/api/mergeUser", dbControllerUser.mergeUser);
router.post("/api/mergeUserRating", dbControllerUser.mergeUserRating);
router.post("/api/encryptPass", dbControllerUser.encryptPass);

//error handler that matches every other URL
//router.get('*',function(req,res){
//	res.send('404 error: Page Not Found');
//})

//Employee
router.post(
  "/api/insertEmployeeAction",
  dbControllerEmployee.insertEmployeeToDbJson
);
router.get("/api/getEmployees", dbControllerEmployee.getEmployees);
router.post("/api/searchEmployees", dbControllerEmployee.searchEmployees);
router.post("/api/getTheEmployee", dbControllerEmployee.getTheEmployee);
router.post("/api/updateEmployee", dbControllerEmployee.editEmployeeInDbJson);
router.post("/api/mergeEmployee", dbControllerEmployee.mergeEmployee);
router.post("/api/deleteEmployee", dbControllerEmployee.deleteEmployeeInDB);
router.post("/api/attachmentUpload", dbControllerEmployee.attachmentUpload);

//User Posts
router.get("/api/getPostsForCourse", dbControllerPost.getPostsForCourse);
router.get("/api/getCommentsForPost", dbControllerPost.getCommentsForPost);
router.post("/api/insertPostAction", dbControllerPost.insertPostToDbJson);
router.post("/api/deletePost", dbControllerPost.deletePostInDB);
router.post("/api/updatePost", dbControllerPost.editPostInDbJson);
router.post("/api/likeUnlikePost", dbControllerPost.postLikeUnlike);

//ROOM
router.get("/api/getRooms", dbControllerRoom.getRooms);
router.post("/api/insertRoomAction", dbControllerRoom.insertRoomToDbJson);
router.post("/api/deleteRoom", dbControllerRoom.deleteRoomInDB);
router.post("/api/updateRoom", dbControllerRoom.editRoomInDbJson);
router.post("/api/addCustomersToRoom", dbControllerRoom.addCustomersToRoom);
router.post(
  "/api/deleteCustomersFromRoom",
  dbControllerRoom.deleteCustomersFromRoom
);

//CHAT
router.get("/api/getChats", dbControllerChat.getChats);
router.post("/api/insertChatAction", dbControllerChat.insertChatToDbJson);
router.post("/api/updateChat", dbControllerChat.editChatInDbJson);
router.post("/api/deleteChat", dbControllerChat.deleteChatInDB);
//MAILER
router.post("/api/sendMail", contactMailer.sendMail);
router.post("/api/sendReply", contactMailer.sendReply);
router.post("/api/sendWelcome", contactMailer.sendWelcome);

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
router.get("/api/test", (req, res) => {
  res.send(JSON.safeStringify(req));
});
module.exports = router;
