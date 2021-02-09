import React from 'react';
import ReactDOM from 'react-dom'
import data from './data';
import {  Redirect } from 'react-router-dom';
import {showSpinner, hideSpinner, setMeetings} from '../stores/appStoreActions';

class MeetingInsert extends React.Component {

  constructor(props){
    super(props);
    this.state={
      description:'',
      spinner:false,
      icons: data.icons
    }
    this.baseState={
      description:''
    }
  }

  descriptionChange=(e)=>{
    this.setState({description: e.target.value});
  }

  handleMeetingInsert=(e)=>{
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

    if(this.state.description===''){
      alert('Description cannot be empty');
      return;
    }
    else{
      showSpinner(dispatch);
      var reqBody="meetingDescription="+encodeURIComponent(this.state.description);
          reqBody+='&organiserId='+encodeURIComponent(globalState.loggedInUser);

      fetch(`/api/insertMeetingAction`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>res.json())
      .then(data=>{
        //if(data.updatestatus=="ok")
            let meetingsArrayCopy=[...globalState.meetingsArray];
            let obj={
              id: data.meetingId,
              description: this.state.description,
              organiser_id:globalState.loggedInUser
            };
            meetingsArrayCopy.push(obj);
            setMeetings(meetingsArrayCopy, dispatch);
            //console.log(data);
            this.setState(this.baseState);
            hideSpinner(dispatch);
            alert('Meeting inserted');
            window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/meetingsBrowse");
      })
    }
  }

  render(){
    let globalState=this.props.state;
    if(globalState.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
    }

    return (
      <div className="meetingInsert">
          <a class="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div class="h1">
            Insert Meeting
          </div>
          <fieldset>
            <br/>
            Meeting Description:<br/>
            <textarea id="meetingDescription" name="meetingDescription" type="text" rows="10"
             style={{width:'90%'}}
             onChange={this.descriptionChange}
             value={this.state.description}
             >
            </textarea>
            <br/><br/>
            Organiser:<br/>
            <input id="organiserName" name="organiserName" type="text" style={{width:'100px', textAlign: 'center'}}
            required="true" value={globalState.loggedInUser} readonly>
            </input>
            <br/>
            <br/>
            <input type="button" value="Insert Meeting" onClick={this.handleMeetingInsert}/>
          </fieldset>
      </div>
    )
   }
}

export default MeetingInsert;
