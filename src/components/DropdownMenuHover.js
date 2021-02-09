import React from 'react';
import { Redirect } from 'react-router-dom'
import '../css/DropdownMenu.css';
import {setErrorMessage} from '../stores/appStoreActions.js';


class DropdownMenuHover extends React.Component{
  constructor(props){
    super(props);
  }

  problemInsert=()=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    if(globalState.loggedInUser===''){
      setErrorMessage('Error: User not Logged In!', dispatch);
    }
    else
      window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/problemInsert");
  }

  problemsBrowse=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/problemsBrowse");
  }

  problemsSearch=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/problemsSearch");
  }


  quizInsert=()=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    if(globalState.loggedInUser===''){
      setErrorMessage('Error: User not Logged In!', dispatch);
    }
    else
      window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizInsert");
  }

  quizesBrowse=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizesBrowse");
  }

  quizesSearch=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizesSearch");
  }


  courseInsert=()=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    if(globalState.loggedInUser===''){
      setErrorMessage('Error: User not Logged In!', dispatch);
    }
    else
      window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/courseInsert");
  }

  coursesBrowse=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/coursesBrowse");
  }

  coursesSearch=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/coursesSearch");
  }

  userInsert=()=>{
    let globalState=this.props.state;
    if(globalState.loggedInUser!==''){
      alert('Error: User already registered and logged In !');
    }
    else
      window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/userInsert");
  }

  userShowProfile=()=>{
    let globalState=this.props.state;
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+
    "/userShowSelected/"+globalState.loggedInUser);
  }

  usersBrowse=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/usersBrowse");
  }

  usersSearch=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/usersSearch");
  }

  userQuizResults=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/userQuizInstances");
  }

  meetingInsert=()=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    if(globalState.loggedInUser===''){
      setErrorMessage('Error: User not Logged In!', dispatch);
    }
    else
      window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/meetingInsert");
  }

  meetingsBrowse=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/meetingsBrowse");
  }

  meetingsSearch=()=>{
    window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/meetingsSearch");
  }

  render(){
        let globalState=this.props.state;
        return (
           <div>
            <fieldset className="fieldSet">
              <div className="dropdown dropdownProblem">
                <button className="problemMenuButton menuButton">Problem</button>
                <div id="problemMenu" className="problem-dropdown-content dropdown-content">
                  <a onClick={()=>this.problemInsert()}>Insert</a>
                  <a onClick={()=>this.problemsBrowse()}>Browse</a>
                  <a onClick={()=>this.problemsSearch()}>Search</a>
                </div>
              </div>

              <div className="dropdown dropdownQuiz">
                <button className="quizMenuButton  menuButton">Quiz</button>
                <div id="quizMenu" className="quiz-dropdown-content dropdown-content">
                  <a onClick={()=>this.quizInsert()}>Insert</a>
                  <a onClick={()=>this.quizesBrowse()}>Browse</a>
                  <a onClick={()=>this.quizesSearch()}>Search</a>
                </div>
              </div>

              <div className="dropdown dropdownCourse">
                <button className="courseMenuButton menuButton">Course</button>
                <div id="courseMenu" className="course-dropdown-content dropdown-content">
                  <a onClick={()=>this.courseInsert()}>Insert</a>
                  <a onClick={()=>this.coursesBrowse()}>Browse</a>
                  <a onClick={()=>this.coursesSearch()}>Search</a>
                </div>
              </div>

              <div className="dropdown dropdownUser">
                <button className="userMenuButton menuButton">User</button>
                <div id="userMenu" className="user-dropdown-content dropdown-content">
                  <a onClick={()=>this.userInsert()}>Register</a>
                  <a onClick={()=>this.usersBrowse()}>Browse</a>
                  <a onClick={()=>this.usersSearch()}>Search</a>
                  <a onClick={()=>this.userQuizResults()}>Quiz results</a>
                  {globalState.loggedInUser!==''?<a onClick={()=>this.userShowProfile()}>Profile</a>:null}
                </div>
              </div>

              <div className="dropdown dropdownMeeting">
                <button className="meetingMenuButton  menuButton">Meeting</button>
                <div id="quizMenu" className="meeting-dropdown-content dropdown-content">
                  <a onClick={()=>this.meetingInsert()}>Insert</a>
                  <a onClick={()=>this.meetingsBrowse()}>Browse</a>
                  <a onClick={()=>this.meetingsSearch()}>Search</a>
                </div>
              </div>
            </fieldset>
            </div>
        )
  }
}

export default DropdownMenuHover;
