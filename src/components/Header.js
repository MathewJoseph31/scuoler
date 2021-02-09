import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import configurationLogins from '../ConfigurationLogins'
import {getMinutesRemaining} from '../utils/utils';
import data from './data';
import {userIdChange, passwordChange, setErrorMessage, onLogin, onLogout,
  setStartedQuiz, submitQuiz, submitStartedQuiz} from '../stores/appStoreActions';

class Header extends Component{
  constructor(props){
    super(props);
    this.state={
      icons: data.icons
    }
  }

  componentDidMount() {
    var timer = setInterval(() => {this.reviseQuizMinsRemaining();}, 60000)
  }

  /*startedQuizSubmit=()=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
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
              submitStartedQuiz(dispatch);
              alert('Quiz Submitted');
            }
          }
        );
  }*/

  reviseQuizMinsRemaining=()=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    if(globalState.startedQuiz!==null){
          var mins_remaining= getMinutesRemaining(globalState.startedQuiz.start_time, globalState.startedQuiz.duration_minutes);

          if(mins_remaining>0){
            console.log(mins_remaining);
            const copied = Object.assign({}, globalState.startedQuiz);
            copied['mins_remaining']=mins_remaining;
            setStartedQuiz(copied, dispatch);
            //this.setState({startedQuiz:copied});
            //localStorage.setItem('startedQuiz', JSON.stringify(copied));
         }
         else{
           submitQuiz(globalState, dispatch);
           //this.startedQuizSubmit();
         }
    }
  }

  handleAltLogin=(strSource, response)=>{
    const AltLoginInitiate=(firstName, lastName, email, id, picture_url, dispatch)=>{
      var reqBody="userId="+encodeURIComponent(id);
      reqBody+='&firstName='+encodeURIComponent(firstName);
      reqBody+='&lastName='+encodeURIComponent(lastName);
      reqBody+='&email='+encodeURIComponent(email);
      reqBody+='&pictureUrl='+encodeURIComponent(picture_url);

      fetch(`/api/mergeUser`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>res.json())
      .then(data=>{
          //console.log(data);
       });
       onLogin({errorMessage:null,
                     loggedInUser: id,
                     loggedInUserFullName: firstName+' '+lastName,
                     admin: '0'
                   }, dispatch);
       //console.log(firstName+' '+lastName+' '+email+' '+id+' '+picture_url);
    };
    if(strSource==='facebook' && response.id!==undefined){
      let fullName=response.name;
      let firstName=fullName;
      let lastName="";
      let arrName=fullName.split(" ");
      if(arrName.length>1){
        firstName=arrName[0];
        lastName=arrName[1];
      }
      let email=response.email;
      let id=response.id;
      let picture_url=response.picture.data.url;
      AltLoginInitiate(firstName, lastName, email, id, picture_url, this.props.dispatch);
    }
    else if(strSource==='google' && response.googleId!==undefined){
      let id=response.googleId;
      let picture_url=response.profileObj.imageUrl;
      let email=response.profileObj.email;
      let firstName=response.profileObj.givenName;
      let lastName=response.profileObj.familyName;
      AltLoginInitiate(firstName, lastName, email, id, picture_url, this.props.dispatch);
      //console.log(response);
    }
    //alert(strSource);
  }

  handleLoginSubmit=(event)=>{
      let globalState=this.props.state;
      let dispatch=this.props.dispatch;
      if(globalState.userId===null
          ||globalState.password===null
          ||globalState.password.length===0
          ||globalState.userId.length===0)
      {
        event.preventDefault();
        setErrorMessage("UserId/password cannot be empty", dispatch);
        return;
      }
      var reqBody="userId="+encodeURIComponent(globalState.userId);
          reqBody+='&password='+encodeURIComponent(globalState.password);

          fetch(`/api/login`, {
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
              console.log(data);
              if(data.login==="ok"){
                /*localStorage.setItem('loggedInUser', globalState.userId);
                localStorage.setItem('loggedInUserFullName', data.full_name);
                localStorage.setItem('admin', data.admin);*/
                onLogin({errorMessage:null,
                              loggedInUser: globalState.userId,
                              loggedInUserFullName: data.full_name,
                              admin: data.admin
                            }, dispatch);
              }
              else {
                setErrorMessage("Login Failed: UserId/password Mismatch", dispatch);
              }
            }
          );
      event.preventDefault();

  }

  logoutUser=(e)=>{
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    let confirmMsg='Are you sure you want to logout?';
    if(globalState.startedQuiz!==null){
        confirmMsg+='There is an unsubmitted quiz: \r\n'+globalState.startedQuiz.description;
    }
    let b=window.confirm(confirmMsg)
    if(b===true){
      if(globalState.startedQuiz!==null)
         submitQuiz(globalState, dispatch);
      /*localStorage.setItem('loggedInUser', '');
      localStorage.setItem('loggedInUserFullName','');
      localStorage.setItem('admin', "0");
      localStorage.removeItem('startedQuiz');
      localStorage.removeItem('startedQuizAnswers');*/
      onLogout({errorMessage:null, loggedInUser: '', admin:"0",
                      startedQuiz:null, startedQuizAnswers:null}, dispatch);
    }
    else{
      e.preventDefault();
    }
  }

  render(){
        let globalState=this.props.state;
        let dispatch=this.props.dispatch;
        return (globalState.loggedInUser===""?(
              <div className="Header">
                <form method="post" action="login" onSubmit={(event)=>this.handleLoginSubmit(event)} noValidate>
                <div className="row">
                      <div id="flexColLeft">
                        <span id="logo">Schools.com</span><br/>
                        {globalState.startedQuiz!==null?
                                                (
                                                  <label style={{color:'maroon', textDecoration:'underline', cursor: 'pointer' }}
                                                  onClick={(e)=>window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizShowSelected/"+globalState.startedQuiz.id)}>
                                                  <br/>{globalState.startedQuiz.description} started ({getMinutesRemaining(globalState.startedQuiz.start_time, globalState.startedQuiz.duration_minutes)} mins left) </label>
                                                 ):null}
                        <label style={{color:"red", paddingRight:"50px"}}>{globalState.errorMessage}</label>
                      </div>
                      <div id="flexColRight">
                              <a  id="HeaderRightLink" href='/userInsert'>Register User</a><br/><br/><br/>
                              <label for="userId">user id</label>
                              <input type="text" id="userName" name="userName" tabindex="1"
                                    onChange={(e)=>userIdChange(e, dispatch)} value={globalState.userId}
                               ></input>
                               <label for="password">password</label>
                               <input type="password" id="password" name="password" tabindex="2"
                                  onChange={(e)=>passwordChange(e, dispatch)} value={globalState.password}
                               ></input>
                               <input type="submit" value="Login" tabindex="3"/><br/><br/>
                               <div className='alt-login-container'>
                               <GoogleLogin className='alt-login-component'
                                style={{fontSize:'10pt'}}
                                className='alt-login-component'
                                clientId={configurationLogins.google_client_id} //CLIENTID NOT CREATED YET
                                buttonText="LOGIN WITH GOOGLE"
                                onSuccess={(response)=>this.handleAltLogin("google",response)}
                                onFailure={(response)=>this.handleAltLogin("google",response)}
                                />
                                <FacebookLogin
                                //className='alt-login-component'
                                 cssClass='alt-login-component alt-login-component-fb'
                                 icon={this.state.icons.facebook}
                                 appId={configurationLogins.facebook_api_key} //APP ID NOT CREATED YET
                                 disableMobileRedirect={true}
                                 fields="name,email,picture"
                                 callback={(response)=>this.handleAltLogin("facebook",response)}
                                 />
                              </div>
                      </div>
                </div>
                </form>
              </div>
        ):
        (
          <div className="Header" noValidate>
          <form method="post">
              <div className="row">
                    <div id="flexColLeft">
                        <span id="logo">Schools.com</span>
                        {globalState.startedQuiz!==null?
                                                (
                                                  <label style={{color:'maroon', textDecoration:'underline', cursor: 'pointer' }}
                                                  onClick={(e)=>window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizShowSelected/"+globalState.startedQuiz.id)}>
                                                  <br/>{globalState.startedQuiz.description} started ({getMinutesRemaining(globalState.startedQuiz.start_time, globalState.startedQuiz.duration_minutes)} mins left) </label>
                                                 ):null}
                    </div>
                    <div id="flexColRight">
                        <span id="loginStatus">
                            <a id="HeaderRightLink" href="/" style={{textDecoration:"underline"}} onClick={this.logoutUser}>Logout</a>
                            <br/><br/><br/>
                            <label>Logged in as: </label>
                            <label id="userId">
                            {globalState.loggedInUserFullName}
                            </label>
                        </span>
                    </div>
              </div>
          </form>
          </div>
        ))
  }

}

export default Header;
