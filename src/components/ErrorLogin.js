import React from 'react';
import {useLocation, useHistory, Redirect} from 'react-router-dom';

function ErrorLogin({loggedInUser, ...props}) {
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  // /console.log(loggedInUser);

  if(loggedInUser!==""){
    return <Redirect to={from}/>
    // history.replace(from);
  }
  else {
      return (
        <div style={{color:"red", fontSize: "1.5em",
            paddingTop:"1%",
            textAlign:"center"}}>
            Error: User not Logged In!
        </div>
      );
 }
}

export default ErrorLogin;
