import React from 'react';
import { Redirect } from 'react-router-dom'
import '../css/DropdownMenu.css';

class DropdownMenu extends React.Component{
  constructor(props){
    super(props);
  }

  problemClick=()=>{
        document.getElementById("problemMenu").classList.toggle("show");
  }

  insertProblem=()=>{
    window.location = "insertProblem";
  }

  browseProblem=()=>{
    window.location.assign("http://"+window.location.hostname+':'+window.location.port+"/browseProblem");
  }

  quizClick=()=>{
        document.getElementById("quizMenu").classList.toggle("show");
  }

  insertQuiz=()=>{
    window.location = "insertQuiz";
  }

  browseQuiz=()=>{
    window.location.assign("http://"+window.location.hostname+':'+window.location.port+"/browseQuiz");
  }

  courseClick=()=>{
    document.getElementById("courseMenu").classList.toggle("show");
  }

  insertCourse=()=>{
    window.location = "insertCourse";
  }

  browseCourse=()=>{
    window.location.assign("http://"+window.location.hostname+':'+window.location.port+"/browseCourse");
  }

  userClick=()=>{
    document.getElementById("userMenu").classList.toggle("show");
  }

  insertUser=()=>{
    window.location = "insertUser";
  }

  browseUser=()=>{
    window.location.assign("http://"+window.location.hostname+':'+window.location.port+"/browseUser");
  }

  render(){
        return (
           <div>
            <fieldset className="fieldSet">
              <div className="dropdown">
                <button className="problemMenuButton menuButton" onClick={()=>this.problemClick()}>Problem</button>
                <div id="problemMenu" className="problem-dropdown-content dropdown-content">
                  <a onClick={()=>this.insertProblem()}>Insert</a>
                  <a onClick={()=>this.browseProblem()}>Browse</a>
                </div>
              </div>

              <div className="dropdown">
                <button className="quizMenuButton  menuButton" onClick={()=>this.quizClick()}>Quiz</button>
                <div id="quizMenu" className="quiz-dropdown-content dropdown-content">
                  <a onClick={()=>this.insertQuiz()}>Insert</a>
                  <a onClick={()=>this.browseQuiz()}>Browse</a>
                </div>
              </div>

              <div className="dropdown">
                <button className="courseMenuButton menuButton" onClick={()=>this.courseClick()}>Course</button>
                <div id="courseMenu" className="course-dropdown-content dropdown-content">
                  <a onClick={()=>this.insertCourse()}>Insert</a>
                  <a onClick={()=>this.browseCourse()}>Browse</a>
                </div>
              </div>

              <div className="dropdown">
                <button className="userMenuButton menuButton" onClick={()=>this.userClick()}>User</button>
                <div id="userMenu" className="user-dropdown-content dropdown-content">
                  <a onClick={()=>this.insertUser()}>Insert</a>
                  <a onClick={()=>this.browseUser()}>Browse</a>
                </div>
              </div>
            </fieldset>
            </div>
        )
  }
}

export default DropdownMenu;
