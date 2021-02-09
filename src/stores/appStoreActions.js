import {getPageArray} from '../utils/utils';
import {SHOW_OPEN_SPINNER, HIDE_SPINNER,
        USER_ID_CHANGE, PASSWORD_CHANGE, SET_ERROR_MESSAGE, ON_LOGIN, ON_LOGOUT,
        LOAD_PROBLEMS, SET_PROBLEMS, SET_PROBLEMS_PAGE, NEXT_PROBLEMS_PAGE, PREVIOUS_PROBLEMS_PAGE,
        LOAD_QUIZES, SET_QUIZES, SET_STARTED_QUIZ, SET_STARTED_QUIZ_ANSWERS, SUBMIT_STARTED_QUIZ,
        SET_QUIZES_PAGE, NEXT_QUIZES_PAGE, PREVIOUS_QUIZES_PAGE,
        LOAD_COURSES, SET_COURSES, SET_COURSES_PAGE, NEXT_COURSES_PAGE, PREVIOUS_COURSES_PAGE,
        LOAD_USERS, SET_USERS, SET_USERS_PAGE, NEXT_USERS_PAGE, PREVIOUS_USERS_PAGE,
        LOAD_MEETINGS, SET_MEETINGS, SET_MEETINGS_PAGE, NEXT_MEETINGS_PAGE, PREVIOUS_MEETINGS_PAGE}
        from './appStoreConstants';

export const showSpinner=(dispatch)=>{
    dispatch({type:SHOW_OPEN_SPINNER});
};

export const hideSpinner=(dispatch)=>{
    dispatch({type:HIDE_SPINNER});
};

export const userIdChange=(e, dispatch)=>{
  const newUserId=e.target.value;
  dispatch({type: USER_ID_CHANGE, payload: newUserId});
};

export const passwordChange=(e, dispatch)=>{
  const newPassword=e.target.value;
  dispatch({type: PASSWORD_CHANGE, payload: newPassword});
};

export const setErrorMessage=(errorMsg, dispatch)=>{
  dispatch({type: SET_ERROR_MESSAGE, payload: errorMsg})
};

export const onLogin=(payload, dispatch)=>{
  dispatch({type: ON_LOGIN, payload: payload});
};

export const onLogout=(payload, dispatch)=>{
  dispatch({type: ON_LOGOUT, payload: payload});
};

export const loadProblems=(dispatch)=>{
    dispatch({type:SHOW_OPEN_SPINNER});
    dispatch({type: LOAD_PROBLEMS});
};

export const setProblems=(arr, dispatch)=>{
  dispatch({type: SET_PROBLEMS, payload:arr});
  //this.setState({problemsArray:arr});
}

export const  setProblemsPage=(page, dispatch)=>{
    dispatch({type: SET_PROBLEMS_PAGE, payload:page});
    loadProblems(dispatch);
}

export const prevProblemsPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentProblemsPage, state.problemsArray===undefined||state.problemsArray.length<state.pageSize);
  if(pageArray.includes(state.currentProblemsPage-1)){
    dispatch({type:PREVIOUS_PROBLEMS_PAGE});
    loadProblems(dispatch);
  }
};

export const nextProblemsPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentProblemsPage, state.problemsArray===undefined||state.problemsArray.length<state.pageSize);
  if(pageArray.includes(state.currentProblemsPage+1)){
       dispatch({type:NEXT_PROBLEMS_PAGE});
       loadProblems(dispatch);
  }
}

export const loadQuizes=(dispatch)=>{
  dispatch({type:SHOW_OPEN_SPINNER});
  dispatch({type: LOAD_QUIZES});
};

export const setQuizes=(arr, dispatch)=>{
  dispatch({type: SET_QUIZES, payload:arr});
}

export const setStartedQuiz=(quizObj, dispatch)=>{
  dispatch({type: SET_STARTED_QUIZ, payload:quizObj});
}

export const setStartedQuizAnswers=(answersObj, dispatch)=>{
  dispatch({type: SET_STARTED_QUIZ_ANSWERS, payload:answersObj});
}

export const submitStartedQuiz=(dispatch)=>{
  dispatch({type: SUBMIT_STARTED_QUIZ});
}

export const submitQuiz=(globalState, dispatch)=>{
  //console.log(this.state.startedQuizAnswers);
  //console.log(this.state.startedQuiz);
  var reqBody="quizId="+encodeURIComponent(globalState.startedQuiz.id);
      reqBody+="&quizType="+encodeURIComponent(globalState.startedQuiz.type);
      reqBody+='&quizInstanceId='+encodeURIComponent(globalState.startedQuiz.quizInstanceId);
      reqBody+='&answersObject='+encodeURIComponent(JSON.stringify(globalState.startedQuizAnswers));

      fetch(`/api/quizAnwersSubmit`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>res.json())
      .then(
        data=>{
          //console.log(data);
          if(data.insertstatus=== "ok"){
            //localStorage.removeItem('startedQuiz');
            //localStorage.removeItem('startedQuizAnswers');
            //this.setState({startedQuiz:null, startedQuizAnswers:null});
            submitStartedQuiz(dispatch)
            alert('Quiz Submitted');
          }
        }
      );
};

export const setQuizesPage=(page, dispatch)=>{
    dispatch({type: SET_QUIZES_PAGE, payload:page});
    loadQuizes(dispatch);
}

export const prevQuizesPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentQuizesPage, state.QuizesArray===undefined||state.quizesArray.length<state.pageSize);
  if(pageArray.includes(state.currentQuizesPage-1)){
    dispatch({type:PREVIOUS_QUIZES_PAGE});
    loadQuizes(dispatch);
  }
};

export const nextQuizesPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentQuizesPage, state.quizesArray===undefined||state.quizesArray.length<state.pageSize);
  if(pageArray.includes(state.currentQuizesPage+1)){
       dispatch({type:NEXT_QUIZES_PAGE});
       loadQuizes(dispatch);
  }
}

export const loadCourses=(dispatch)=>{
  dispatch({type:SHOW_OPEN_SPINNER});
  dispatch({type: LOAD_COURSES});
};

export const setCourses=(arr, dispatch)=>{
  dispatch({type: SET_COURSES, payload:arr});
}

export const setCoursesPage=(page, dispatch)=>{
    dispatch({type: SET_COURSES_PAGE, payload:page});
    loadCourses(dispatch);
}

export const prevCoursesPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentCoursesPage, state.coursesArray===undefined||state.coursesArray.length<state.pageSize);
  if(pageArray.includes(state.currentCoursesPage-1)){
    dispatch({type:PREVIOUS_COURSES_PAGE});
    loadCourses(dispatch);
  }
};

export const nextCoursesPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentCoursesPage, state.coursesArray===undefined||state.coursesArray.length<state.pageSize);
  if(pageArray.includes(state.currentCoursesPage+1)){
       dispatch({type:NEXT_COURSES_PAGE});
       loadCourses(dispatch);
  }
}

export const loadUsers=(dispatch)=>{
  dispatch({type:SHOW_OPEN_SPINNER});
  dispatch({type: LOAD_USERS});
};

export const setUsers=(arr, dispatch)=>{
  dispatch({type: SET_USERS, payload:arr});
}

export const setUsersPage=(page, dispatch)=>{
    dispatch({type: SET_USERS_PAGE, payload:page});
    loadUsers(dispatch);
}

export const prevUsersPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentUsersPage, state.usersArray===undefined||state.usersArray.length<state.pageSize);
  if(pageArray.includes(state.currentUsersPage-1)){
    dispatch({type:PREVIOUS_USERS_PAGE});
    loadUsers(dispatch);
  }
};

export const nextUsersPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentUsersPage, state.usersArray===undefined||state.usersArray.length<state.pageSize);
  if(pageArray.includes(state.currentUsersPage+1)){
       dispatch({type:NEXT_USERS_PAGE});
       loadUsers(dispatch);
  }
}

export const loadMeetings=(dispatch)=>{
  dispatch({type:SHOW_OPEN_SPINNER});
  dispatch({type: LOAD_MEETINGS});
};

export const setMeetings=(arr, dispatch)=>{
  dispatch({type: SET_MEETINGS, payload:arr});
};

export const setMeetingsPage=(page, dispatch)=>{
    dispatch({type: SET_MEETINGS_PAGE, payload:page});
    loadMeetings(dispatch);
};

export const prevMeetingsPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentMeetingsPage, state.meetingsArray===undefined||state.meetingsArray.length<state.pageSize);
  if(pageArray.includes(state.currentMeetingsPage-1)){
    dispatch({type:PREVIOUS_MEETINGS_PAGE});
    loadMeetings(dispatch);
  }
};

export const nextMeetingsPageClick=(e, state, dispatch)=>{
  let pageArray=getPageArray(state.currentMeetingsPage, state.meetingsArray===undefined||state.meetingsArray.length<state.pageSize);
  if(pageArray.includes(state.currentMeetingsPage+1)){
       dispatch({type:NEXT_MEETINGS_PAGE});
       loadMeetings(dispatch);
  }
}
