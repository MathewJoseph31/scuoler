import React from 'react';
import {  Redirect } from 'react-router-dom';
import data from './data';
import {showSpinner, hideSpinner, setCourses} from '../stores/appStoreActions';

class CourseInsert extends React.Component{

  constructor(props){
    super(props);
    this.state={
      description:'',
      name:'',
      icons: data.icons
    }
    this.baseState=this.state;
    this.descriptionChange=this.descriptionChange.bind(this);
    this.nameChange=this.nameChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleSubmit(){
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;

    if(this.state.name===''||this.state.description===''){
      alert('Name/Description cannot be empty');
      return;
    }
    else{
      showSpinner(dispatch);
      var reqBody='courseName='+encodeURIComponent(this.state.name);
      reqBody+='&courseDescription='+encodeURIComponent(this.state.description);
      reqBody+='&ownerId='+encodeURIComponent(globalState.loggedInUser);

      fetch(`/api/insertCourseAction`, {
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
              let coursesArrayCopy=[...globalState.coursesArray];
              let obj={
                id: data.courseId,
                name:this.state.name,
                description: this.state.description,
                author_id:globalState.loggedInUser
              };
              coursesArrayCopy.push(obj);
              setCourses(coursesArrayCopy, dispatch);
              this.setState(this.baseState);
              hideSpinner(dispatch);
              alert('Course inserted');
              window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/coursesBrowse");
      })

    }

  }

  descriptionChange(e){
    const new_description=e.target.value;
    //console.log(e.target.value);
    this.setState({description:new_description});
  }

  nameChange(e){
    const new_name=e.target.value;
    //console.log(e.target.value);
    this.setState({name:new_name});
  }

  render(){
    let globalState=this.props.state;
    if(globalState.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
    }
    return (
      <div>
      <a class="HomeLink" href="/">
          <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
      {/*back to home*/}
      </a>
      <div class="h1">
        Insert Course
      </div>
      <br/>
        <fieldset>
            Course Name:<br/>
            <input id="courseName" name="courseName" type="text"
            onChange={this.nameChange}
            value={this.state.name}
            >
            </input>
            <br/>
            <br/>
            Course Description:<br/>
            <textarea id="courseDescription" name="courseDescription" type="text"
             value={this.state.description}
              onChange={this.descriptionChange}
             rows="10" style={{width:'90%'}}>
            </textarea>
            <br/>
            <br/>
            Owner:<br/>
            <input id="ownerId" name="ownerId" type="text" required="true"
            style={{width:'100px', textAlign: 'center'}}
            value={globalState.loggedInUser} readonly>
            </input> <br/>
            <br/>
            <input type="button" value="Insert Course" onClick={this.handleSubmit}/>
        </fieldset>
      </div>
    )
  }

}

export default CourseInsert;
