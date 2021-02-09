import React from 'react';
import { Provider, Consumer } from 'react-quickstore';
import {SHOW_OPEN_SPINNER, HIDE_SPINNER,
        USER_ID_CHANGE, PASSWORD_CHANGE, SET_ERROR_MESSAGE, ON_LOGIN, ON_LOGOUT,
        LOAD_PROBLEMS, SET_PROBLEMS, NEXT_PROBLEMS_PAGE, PREVIOUS_PROBLEMS_PAGE, SET_PROBLEMS_PAGE,
        LOAD_COURSES, SET_COURSES, NEXT_COURSES_PAGE, PREVIOUS_COURSES_PAGE, SET_COURSES_PAGE,
        LOAD_QUIZES, SET_QUIZES, SET_STARTED_QUIZ, SET_STARTED_QUIZ_ANSWERS, SUBMIT_STARTED_QUIZ,
        NEXT_QUIZES_PAGE, PREVIOUS_QUIZES_PAGE, SET_QUIZES_PAGE,
        LOAD_USERS, SET_USERS, NEXT_USERS_PAGE, PREVIOUS_USERS_PAGE, SET_USERS_PAGE,
        LOAD_MEETINGS, NEXT_MEETINGS_PAGE, PREVIOUS_MEETINGS_PAGE, SET_MEETINGS, SET_MEETINGS_PAGE}
        from './appStoreConstants';
import {retrieveProblems, retrieveQuizes, retrieveCourses,
        retrieveUsers, retrieveMeetings} from '../utils/appUtils';

const initialState={
    spinner:false,
    userId:null,
    password:null,
    loggedInUser:localStorage.getItem('loggedInUser') || '',
    loggedInUserFullName: localStorage.getItem('loggedInUserFullName')||'',
    admin:localStorage.getItem('admin')||"0",
    errorMessage:null,
    coursesArray:[],
    problemsArray:[],
    meetingsArray:[],
    currentProblemsPage:1,
    currentQuizesPage:1,
    currentCoursesPage:1,
    currentUsersPage:1,
    currentMeetingsPage:1,
    pageSize:30,
    quizesArray:[],
    usersArray:[],
    startedQuiz:localStorage.getItem('startedQuiz')?JSON.parse(localStorage.getItem('startedQuiz')):null,
    startedQuizAnswers:localStorage.getItem('startedQuizAnswers')?JSON.parse(localStorage.getItem('startedQuizAnswers')):null
};

const reducer = (state, action)=>{
  switch (action.type) {
    case SHOW_OPEN_SPINNER:
      return {spinner: true};
    case HIDE_SPINNER:
      return {spinner: false};
    case USER_ID_CHANGE:
      return {userId: action.payload};
    case PASSWORD_CHANGE:
      return {password: action.payload};
    case SET_ERROR_MESSAGE:
      return {errorMessage: action.payload};
    case ON_LOGIN:
      localStorage.setItem('loggedInUser', action.payload.loggedInUser);
      localStorage.setItem('loggedInUserFullName', action.payload.loggedInUserFullName);
      localStorage.setItem('admin', action.payload.admin);
      return action.payload;
    case ON_LOGOUT:
      localStorage.setItem('loggedInUser', '');
      localStorage.setItem('loggedInUserFullName','');
      localStorage.setItem('admin', "0");
      localStorage.removeItem('startedQuiz');
      localStorage.removeItem('startedQuizAnswers');
      return action.payload;
    case LOAD_PROBLEMS:
      return {problemsArray: action.payload, spinner: false};
    case SET_PROBLEMS:
      return {problemsArray: action.payload};
    case NEXT_PROBLEMS_PAGE:
        return {currentProblemsPage: state.currentProblemsPage+1};
    case PREVIOUS_PROBLEMS_PAGE:
        return {currentProblemsPage: state.currentProblemsPage-1};
    case SET_PROBLEMS_PAGE:
        return {currentProblemsPage: action.payload};
    case LOAD_QUIZES:
      return {quizesArray: action.payload, spinner: false};
    case SET_QUIZES:
      return {quizesArray: action.payload};
    case SET_STARTED_QUIZ:
      localStorage.setItem('startedQuiz', JSON.stringify(action.payload));
      return {startedQuiz: action.payload};
    case SET_STARTED_QUIZ_ANSWERS:
      localStorage.setItem('startedQuizAnswers', JSON.stringify(action.payload));
      return {startedQuizAnswers: action.payload};
    case SUBMIT_STARTED_QUIZ:
      localStorage.removeItem('startedQuiz');
      localStorage.removeItem('startedQuizAnswers');
      return {startedQuiz:null, startedQuizAnswers:null};
    case NEXT_QUIZES_PAGE:
        return {currentQuizesPage: state.currentQuizesPage+1};
    case PREVIOUS_QUIZES_PAGE:
        return {currentQuizesPage: state.currentQuizesPage-1};
    case SET_QUIZES_PAGE:
        return {currentQuizesPage: action.payload};
    case LOAD_COURSES:
      return {coursesArray: action.payload, spinner: false};
    case SET_COURSES:
      return {coursesArray: action.payload};
    case NEXT_COURSES_PAGE:
        return {currentCoursesPage: state.currentCoursesPage+1};
    case PREVIOUS_COURSES_PAGE:
        return {currentCoursesPage: state.currentCoursesPage-1};
    case SET_COURSES_PAGE:
        return {currentCoursesPage: action.payload};
    case LOAD_USERS:
        return {usersArray: action.payload, spinner: false};
    case SET_USERS:
        return {usersArray: action.payload};
    case NEXT_USERS_PAGE:
        return {currentUsersPage: state.currentUsersPage+1};
    case PREVIOUS_USERS_PAGE:
        return {currentUsersPage: state.currentUsersPage-1};
    case SET_USERS_PAGE:
        return {currentUsersPage: action.payload};
    case LOAD_MEETINGS:
      return {meetingsArray: action.payload, spinner: false};
    case SET_MEETINGS:
        return {meetingsArray: action.payload};
    case NEXT_MEETINGS_PAGE:
        return {currentMeetingsPage: state.currentMeetingsPage+1};
    case PREVIOUS_MEETINGS_PAGE:
        return {currentMeetingsPage: state.currentMeetingsPage-1};
    case SET_MEETINGS_PAGE:
        return {currentMeetingsPage: action.payload};
    default:
      return action;
  }
};

const asyncReducer=async (state, action) => {
  let jsonArray;
  switch(action.type){
    case LOAD_PROBLEMS:
      jsonArray=await retrieveProblems(state);
      return {type: LOAD_PROBLEMS, payload: jsonArray};
    case LOAD_QUIZES:
      jsonArray=await retrieveQuizes(state);
      return {type: LOAD_QUIZES, payload: jsonArray};
    case LOAD_COURSES:
      jsonArray=await retrieveCourses(state);
      return {type: LOAD_COURSES, payload: jsonArray};
    case LOAD_USERS:
      jsonArray=await retrieveUsers(state);
      return {type: LOAD_USERS, payload: jsonArray}
    case LOAD_MEETINGS:
      jsonArray=await retrieveMeetings(state);
      return {type: LOAD_MEETINGS, payload: jsonArray}
    default:
      return action;
  }
};

const initFromServer = async({state, dispatch}) => {
  /*dispatch({
    type: SHOW_OPEN_SPINNER
  })*/
};

export const AppStoreProvider=({children}) => (
  <Provider initialState={initialState} asyncReducer={asyncReducer} reducer={reducer} didMount={initFromServer}>
    {children}
  </Provider>
);

export const AppStoreConsumer=Consumer;
