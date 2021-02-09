import React from 'react';
import data from './data';
import {loadMeetings, nextMeetingsPageClick,
        prevMeetingsPageClick, setMeetingsPage} from '../stores/appStoreActions';
import {getPageArray} from '../utils/utils';

class MeetingsBrowse extends React.Component{
  constructor(props){
    super(props);
    this.state={
      icons: data.icons
    }
  }

  componentDidMount(){
    //this.props.loadMeetings();
    let dispatch=this.props.dispatch;
    loadMeetings(dispatch);
  }

  meetingClick=(e, obj)=>{
    if(this.props.loggedInUser==='')
      alert('Error! User Not Logged In, Please Login to join the meeting');
    else{
      let b=window.confirm('Are you sure you want to join the meeting: '+obj.description+'?');
      if(b===true){
         //let prefix=window.location.hostname==='localhost'?'https://localhost':'https://'+window.location.hostname
         window.location.assign('https://'+window.location.hostname+':'+window.location.port+"/meetingShowSelected/"+obj.id+"/"+obj.organiser_id);
      }
    }
  }

  render(){
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    let pageArray=getPageArray(globalState.currentMeetingsPage, globalState.meetingsArray===undefined||globalState.meetingsArray.length<globalState.pageSize);

    return (
      <div>
          <a class="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div class="h1">
            Browse Meetings
          </div>
          <br/>
          <div className="pagination">
           <a href="#" onClick={(e)=>{prevMeetingsPageClick(e, globalState, dispatch)}}>&laquo;</a>
            {
              pageArray.map(val=><a onClick={(e)=>{setMeetingsPage(val, dispatch)}} className={val===globalState.currentMeetingsPage?"active":""} href="#">{val}</a>)
            }
           <a href="#" onClick={(e)=>nextMeetingsPageClick(e, globalState, dispatch)}>&raquo;</a>
          </div>
          <br/><br/>
          <div  className='Browse'>
               <table className="displayTable" style={{width:"100%"}}>
                 <tr>
                   <th>Meeting</th><th>Organiser</th><th></th>
                 </tr>
                 {
                   globalState.meetingsArray.map(obj=>(
                     <tr>
                       {/*<td><a href={`./meetingShowSelected/${obj.id}`}>{obj.description}</a></td>*/}
                       <td><a style={{textDecoration: "underline", cursor: "pointer", color: "blueviolet"}} onClick={(e)=>this.meetingClick(e, obj)}>{obj.description}</a></td>
                       <td>{obj.organiser_id}</td>
                       <td><input type="button" value="Join Meeting" onClick={(e)=>this.meetingClick(e, obj)}/></td>
                     </tr>
                     )
                   )
                 }
               </table>
         </div>
         <div className="pagination">
          <a href="#" onClick={(e)=>{prevMeetingsPageClick(e, globalState, dispatch)}}>&laquo;</a>
           {
             pageArray.map(val=><a onClick={(e)=>{setMeetingsPage(val, dispatch)}} className={val===globalState.currentMeetingsPage?"active":""} href="#">{val}</a>)
           }
          <a href="#" onClick={(e)=>nextMeetingsPageClick(e, globalState, dispatch)}>&raquo;</a>
         </div>
     </div>
    )
  }

}

export default MeetingsBrowse;
