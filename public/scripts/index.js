/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function problemClick() {
    document.getElementById("problemMenu").classList.toggle("show");
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function quizClick() {
    document.getElementById("quizMenu").classList.toggle("show");
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function courseClick() {
    document.getElementById("courseMenu").classList.toggle("show");
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

function userClick() {
    document.getElementById("userMenu").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.problemMenuButton')) {
    var dropdowns = document.getElementsByClassName("problem-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
 if (!event.target.matches('.quizMenuButton')) {
    var dropdowns = document.getElementsByClassName("quiz-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
 if (!event.target.matches('.courseMenuButton')) {
    var dropdowns = document.getElementsByClassName("course-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
 if (!event.target.matches('.userMenuButton')) {
    var dropdowns = document.getElementsByClassName("user-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

}

function insertProblem(){
window.location = "insertProblem";
}

function browseProblem(){
window.location = "browseProblem";
}

function browseQuiz(){
window.location="browseQuiz";
}

function insertQuiz(){
window.location = "insertQuiz";
}

function browseCourse(){
window.location="browseCourse";
}

function insertCourse(){
window.location = "insertCourse";
}

function browseUser(){
window.location="browseUser";
}

function insertUser(){
window.location = "insertUser";
}
