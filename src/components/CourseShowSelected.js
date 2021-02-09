import React from 'react';
import CourseEditDialog from './CourseEditDialog';
import {  Redirect } from 'react-router-dom';
import data from "./data";
import {showSpinner, hideSpinner, loadCourses, setCourses} from '../stores/appStoreActions';

class CourseShowSelected extends React.Component{
  constructor(props){
    super(props);
    this.state={
      courseObj:{},
      courseNameEdited:'',
      courseDescriptionEdited:'',
      quizesArray:[],
      quizesArrayForEdit:[],
      showEditCourseDialog:false,
      icons: data.icons
    }
    this.handleEditCourseDialogDismiss=this.handleEditCourseDialogDismiss.bind(this);
    this.editCourseHandler=this.editCourseHandler.bind(this);
    this.descriptionChange=this.descriptionChange.bind(this);
    this.nameChange=this.nameChange.bind(this);
    this.saveUpdateHandler=this.saveUpdateHandler.bind(this);
    this.removeQuizFromQuizesArray=this.removeQuizFromQuizesArray.bind(this);
    this.addQuizToQuizesArray=this.addQuizToQuizesArray.bind(this);
  }


  componentDidMount(){
    const {params}= this.props.match;
    let dispatch=this.props.dispatch;

    showSpinner(dispatch);
    var reqBody="courseId="+encodeURIComponent(params.id);
    let coursePromise=fetch(`/api/getTheCourse`, {
      headers:{
        'Accept':'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: reqBody
    });
    let quizesPromise= fetch(`/api/getQuizListForCourse`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      });
      Promise.all([coursePromise, quizesPromise]).then(
        (responses)=>{
          Promise.all(responses.map((response)=>response.json())).then(
            (jsons)=>{
              jsons[0].courseId=params.id;
              console.log(jsons);
              this.setState({
                  courseObj: jsons[0],
                  courseNameEdited:jsons[0].name,
                  courseDescriptionEdited: jsons[0].description,
                  quizesArray: jsons[1],
                  quizesArrayForEdit: jsons[1]
              })
              hideSpinner(dispatch);
            }
          )
        }
      );
  }


  editCourseHandler(e){
     this.setState({showEditCourseDialog:true});
  }

  deleteCourseHandler(id){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

    let b=window.confirm('Are you sure you want to delete')
    if(b===true){
      showSpinner(dispatch);
        var reqBody="id="+encodeURIComponent(id);
        fetch(`/api/deleteCourse`, {
          headers:{
            'Accept':'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          body: reqBody
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.deletestatus==="ok"){
                let coursesArrayCopy=globalState.coursesArray.filter((obj)=>obj.id!==id);
                setCourses(coursesArrayCopy, dispatch);
                hideSpinner(dispatch);
                alert('Course deleted');
                window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/coursesBrowse");
            }
        })
    }//end of if b==true
  }

  descriptionChange(e){
    this.setState({courseDescriptionEdited: e.target.value})
  }

  nameChange(e){
    this.setState({courseNameEdited: e.target.value})
  }

  handleEditCourseDialogDismiss(e){
     this.setState({showEditCourseDialog:false,
       courseNameEdited:this.state.courseObj.name,
       courseDescriptionEdited:this.state.courseObj.description,
       quizesArrayForEdit: this.state.quizesArray
     });
  }

  saveUpdateHandler(e){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

     showSpinner(dispatch);
     const newCourseObj = Object.assign({}, this.state.courseObj)
     newCourseObj.name=this.state.courseNameEdited;
     newCourseObj.description=this.state.courseDescriptionEdited;
     //console.log(newCourseObj);
     var reqBody="courseId="+encodeURIComponent(newCourseObj.courseId);
     reqBody+='&name='+encodeURIComponent(newCourseObj.name);
     reqBody+='&description='+encodeURIComponent(newCourseObj.description);
     reqBody+='&quizesArray='+encodeURIComponent(JSON.stringify(this.state.quizesArrayForEdit));

     fetch(`/api/updateCourse`, {
       headers:{
         'Accept':'application/json',
         'Content-type': 'application/x-www-form-urlencoded'
       },
       method: 'POST',
       body: reqBody
     })
     .then(res=>res.json())
     .then(data=>{
         if(data.updatestatus==="ok"){
             loadCourses(dispatch);
             let coursesArrayCopy=JSON.parse(JSON.stringify(globalState.coursesArray));
             coursesArrayCopy.forEach((obj)=>{
               if(obj.courseId===newCourseObj.courseId){
                  obj.description=newCourseObj.description;
                  obj.name=newCourseObj.name;
               }
             });
             setCourses(coursesArrayCopy, dispatch);
             this.setState({courseObj: newCourseObj,
               quizesArray: this.state.quizesArrayForEdit,
               showEditCourseDialog:false});
             hideSpinner(dispatch);
             alert('Course updated');
         }
     })
  }

  removeQuizFromQuizesArray(e,quizId){
    let quizesArray =  this.state.quizesArrayForEdit.filter(val=>val.id!==quizId)
    this.setState({quizesArrayForEdit:quizesArray});
    //console.log(quizesArray);
  }

  addQuizToQuizesArray(e,quizObj){
    let quizesArray =  [...this.state.quizesArrayForEdit];
    if(quizesArray.filter(val=>val.id===quizObj.id).length>0){
      alert('Quiz redundant')
    }
    else {
       quizesArray.push(quizObj);
       this.setState({quizesArrayForEdit:quizesArray});
    }
  }

  render(){
    {/*if(this.props.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
    }*/}
    let globalState=this.props.state;

    return (
      <div>
          <a class="HomeLink" href="/">
              <img className="homeIcon" src={this.state.icons.home} alt="back to home"/>
              {/*back to home*/}
          </a>
          <div className="h1">
            Course Details
          </div>
      <div className="Panel">
          <br/>
          <div className="h1">
              {this.state.courseObj.name}
          </div>
          <p style={{textAlign:'left'}}> <b>Description</b>: {this.state.courseObj.description} <br/></p>
          {(globalState.loggedInUser===this.state.courseObj.ownerId||globalState.admin==="1")?
          (<div>
          <input type="button" className="LeftButton"
            onClick={()=>this.editCourseHandler()}
            id={`e${this.state.courseObj.id}`} value="Edit Course"/><br/>
          <input type="button" className="LeftButton"
            onClick={()=>this.deleteCourseHandler(this.state.courseObj.courseId)}
            id={`d${this.state.courseObj.id}`} value="Delete Course"/>
          </div>):null}
          <br/>
          <b> Creator</b>: {this.state.courseObj.ownerId}
          <div class="row">
             <div><br/><b>List of Quizes:</b><br/><br/>
             {
               this.state.quizesArray.map(obj=>(
                  <div>
                     <a href={`https://${window.location.hostname}:${window.location.port}/quizShowSelected/${obj.id}`}>{obj.description}</a><br/>
                  </div>
                 )
               )
             }
             </div>{/*end of LeftWindow*/}
          </div>{/*end of row*/}
          <CourseEditDialog
                  objectForEdit={this.state.courseObj}
                  courseNameEdited={this.state.courseNameEdited}
                  courseDescriptionEdited={this.state.courseDescriptionEdited}
                  show={this.state.showEditCourseDialog}
                  descriptionChange={this.descriptionChange}
                  nameChange={this.nameChange}
                  handleDismiss={this.handleEditCourseDialogDismiss}
                  handleSubmit={this.saveUpdateHandler}
                  quizesArrayForEdit={this.state.quizesArrayForEdit}
                  removeQuizFromQuizesArray={this.removeQuizFromQuizesArray}
                  addQuizToQuizesArray={this.addQuizToQuizesArray}
          />
     </div>
     </div>
    )
  }


}

export default CourseShowSelected;
