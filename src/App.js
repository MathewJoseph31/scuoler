import React from 'react';
import './css/App.css';
import Header from './components/Header';
import ImageSlider from './components/ImageSlider';
import Middle from './components/Middle';
import DropdownMenuHover from './components/DropdownMenuHover';
import ProblemsBrowse from './components/ProblemsBrowse';
import ProblemsSearch from './components/ProblemsSearch';
import ProblemInsert from './components/ProblemInsert';
import ProblemShowSelected from './components/ProblemShowSelected';
import QuizesBrowse from './components/QuizesBrowse';
import QuizesSearch from './components/QuizesSearch';
import QuizInsert from './components/QuizInsert';
import QuizShowSelected from './components/QuizShowSelected';
import QuizInstances from './components/QuizInstances';
import UsersBrowse from './components/UsersBrowse';
import UsersSearch from './components/UsersSearch';
import UserInsert from './components/UserInsert';
import UserShowSelected from './components/UserShowSelected';
import UserQuizInstances from './components/UserQuizInstances';
import CoursesBrowse from './components/CoursesBrowse';
import CourseInsert from './components/CourseInsert';
import CoursesSearch from './components/CoursesSearch';
import CourseShowSelected from './components/CourseShowSelected';
import MeetingInsert from './components/MeetingInsert';
import MeetingsBrowse from './components/MeetingsBrowse';
import MeetingShowSelected from './components/MeetingShowSelected';
import ErrorLogin from './components/ErrorLogin';
import ChatHome from './components/chat/ChatHome';
import { Route, BrowserRouter as Router, useLocation, useHistory, Redirect} from 'react-router-dom';
import {getMinutesRemaining, getCurrentTimestampString, getPageArray} from './utils/utils';
import {AppStoreProvider, AppStoreConsumer} from './stores/appStore';

class App extends React.Component {

  /*componentDidMount() {
    var timer = setInterval(() => {this.reviseQuizMinsRemaining();}, 60000)
  }*/


    render(){
      return (
        <Router>
          <div>
            <AppStoreProvider>
              <AppStoreConsumer>
                {({state, dispatch})=>
                    (
                      <div>
                          <Route path="/" render={(props)=><Header
                                                              {...props}
                                                              state={state}
                                                              dispatch={dispatch}
                                                            />}
                          />
                          <Route path="/" render={(props)=><DropdownMenuHover
                                                            {...props}
                                                             state={state}
                                                             dispatch={dispatch}
                                                            />
                                                  }
                           />
                           {
                             state.spinner===true?(<div id="spinner" className="loadingContainer"><div className="loading"></div></div>):null
                           }
                          <Route exact path="/" component={ImageSlider} />
                          <Route exact path="/" component={Middle} />
                          <Route path="/problemsBrowse" render={(props)=><ProblemsBrowse {...props}
                                                                          state={state}
                                                                          dispatch={dispatch}
                                                                          />
                                                               }
                          />
                          <Route path="/problemsSearch" render={(props)=><ProblemsSearch {...props}
                                                                          state={state}
                                                                          dispatch={dispatch}
                                                                         />
                                                                }
                          />
                          <Route path="/problemInsert" render={(props)=><ProblemInsert {...props}
                                                                         state={state}
                                                                         dispatch={dispatch}
                                                                        />
                                                              }
                          />
                          <Route path="/problemShowSelected/:id" render={(props)=><ProblemShowSelected {...props}
                                                                                state={state}
                                                                                dispatch={dispatch}
                                                                               />
                                                                     }
                          />
                          <Route path="/quizesBrowse" render={(props)=><QuizesBrowse {...props}
                                                                        state={state}
                                                                        dispatch={dispatch}
                                                                      />
                                                             }
                           />
                           <Route path="/quizesSearch" render={(props)=><QuizesSearch {...props}
                                                                           state={state}
                                                                           dispatch={dispatch}
                                                                          />
                                                                 }
                           />
                          <Route path="/quizInsert" render={(props)=><QuizInsert {...props}
                                                                      state={state}
                                                                      dispatch={dispatch}
                                                                     />
                                                           }
                          />
                          <Route path="/quizShowSelected/:id" render={(props)=><QuizShowSelected {...props}
                                                                                state={state}
                                                                                dispatch={dispatch}
                                                                               />
                                                                     }
                          />
                          <Route path="/quizInstances/:id" render={(props)=><QuizInstances {...props}
                                                                                state={state}
                                                                                dispatch={dispatch}
                                                                            />
                                                                  }
                          />
                          <Route path="/usersBrowse" render={(props)=><UsersBrowse {...props}
                                                                        state={state}
                                                                        dispatch={dispatch}
                                                                      />
                                                            }
                          />
                          <Route path="/usersSearch" render={(props)=><UsersSearch {...props}
                                                                          state={state}
                                                                          dispatch={dispatch}
                                                                         />
                                                                }
                          />
                          <Route path="/userInsert" render={(props)=><UserInsert {...props}
                                                                      state={state}
                                                                      dispatch={dispatch}
                                                                     />
                                                           }
                          />
                          <Route path="/userShowSelected/:id" render={(props)=><UserShowSelected {...props}
                                                                                state={state}
                                                                                dispatch={dispatch}
                                                                               />
                                                                     }
                          />
                          <Route path="/userQuizInstances" render={(props)=><UserQuizInstances {...props}
                                                                              state={state}
                                                                              dispatch={dispatch}
                                                                            />
                                                                  }
                          />
                          <Route path="/coursesBrowse" render={(props)=><CoursesBrowse {...props}
                                                                         state={state}
                                                                         dispatch={dispatch}
                                                                        />
                                                              }
                          />
                          <Route path="/coursesSearch" render={(props)=><CoursesSearch {...props}
                                                                          state={state}
                                                                          dispatch={dispatch}
                                                                         />
                                                                }
                          />
                          <Route path="/courseInsert" render={(props)=><CourseInsert {...props}
                                                                        state={state}
                                                                        dispatch={dispatch}
                                                                        />
                                                             }
                          />
                          <Route path="/CourseShowSelected/:id" render={(props)=><CourseShowSelected {...props}
                                                                                  state={state}
                                                                                  dispatch={dispatch}
                                                                                />
                                                                        }
                          />
                          <Route path="/meetingInsert" render={(props)=><MeetingInsert {...props}
                                                                         state={state}
                                                                         dispatch={dispatch}
                                                                        />
                                                              }
                          />
                          <Route path="/meetingsBrowse" render={(props)=><MeetingsBrowse {...props}
                                                                         state={state}
                                                                         dispatch={dispatch}
                                                                        />
                                                              }
                          />
                          <Route path="/meetingShowSelected/:id/:organiserId" render={(props)=><MeetingShowSelected {...props}
                                                                                                state={state}
                                                                                                dispatch={dispatch}
                                                                                                />
                                                                                      }
                          />
                          {/*this.props.loggedInUser!=="" && <Route path="/videoChat" render={(props)=><ChatHome {...props}
                                                                                  loggedInUser={this.state.loggedInUser}
                                                                                  loggedInUserFullName={this.state.loggedInUserFullName}
                                                                                  admin={this.state.admin}
                                                                                  setErrorMessage={this.setErrorMessage}
                                                           />
                                                           }
                          />
                          */}
                          <PrivateRoute path="/videoChat" loggedInUser={state.loggedInUser}>
                              <ChatHome
                                                                                  state={state}
                                                                                  dispatch={dispatch}
                              />
                          </PrivateRoute>
                          <Route path="/errorLogin" render={(props)=><ErrorLogin {...props}
                                                                      loggedInUser={state.loggedInUser}
                                                                      />
                                                           }
                          />
                      </div>
                   )
                  }
                </AppStoreConsumer>
            </AppStoreProvider>
          </div>
        </Router>
      )
    }


}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, loggedInUser, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedInUser!=="" ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/errorLogin",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}



export default App;
