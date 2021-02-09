import React from 'react';
import QuizEditDialog from './QuizEditDialog';
import {  Redirect } from 'react-router-dom';
import data from './data';
import {showSpinner, hideSpinner, loadQuizes, setQuizes, setStartedQuiz,
  setStartedQuizAnswers, submitQuiz} from '../stores/appStoreActions';
import {getMinutesRemaining, getCurrentTimestampString} from '../utils/utils';

class QuizShowSelected extends React.Component{
  constructor(props){
    super(props);
    this.state={
      quizObj:{},
      problemsArray:[],
      problemsArrayForEdit:[],
      showEditQuizDialog:false,
      quizObjForEdit:{},
      icons: data.icons
    }
    this.editQuizHandler=this.editQuizHandler.bind(this);
    this.handleEditQuizDialogDismiss=this.handleEditQuizDialogDismiss.bind(this);
    this.saveUpdateHandler=this.saveUpdateHandler.bind(this);
    this.descriptionChange=this.descriptionChange.bind(this);
    this.courseNameChange=this.courseNameChange.bind(this);
    this.durationChange=this.durationChange.bind(this);
    this.quizTypeSelectChange=this.quizTypeSelectChange.bind(this);
    this.removeCourseFromCoursesArray=this.removeCourseFromCoursesArray.bind(this);
    this.addCourseToCoursesArraySubmit=this.addCourseToCoursesArraySubmit.bind(this);
    this.removeProblemFromProblemsArray=this.removeProblemFromProblemsArray.bind(this);
    this.addProblemToProblemsArray=this.addProblemToProblemsArray.bind(this);
  }



  handleEditQuizDialogDismiss(e){
     this.setState({showEditQuizDialog:false, quizObjForEdit: this.state.quizObj,
                    problemsArrayForEdit: this.state.problemsArray});
  }


  saveUpdateHandler(e){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

    let conflictArray=this.state.problemsArrayForEdit.filter((val)=>val.type!==this.state.quizObjForEdit.type);
    if(conflictArray.length>0){
      alert('Error! A problem exists for the quiz whose type is different from the selected type');
      return;
    }
    else{
        showSpinner(dispatch);
        //console.log(newCourseObj);
        var reqBody="id="+encodeURIComponent(this.state.quizObjForEdit.id);
        reqBody+='&coursesArray='+encodeURIComponent(JSON.stringify(this.state.quizObjForEdit.coursesArray));
        reqBody+='&problemsArray='+encodeURIComponent(JSON.stringify(this.state.problemsArrayForEdit));
        reqBody+='&description='+encodeURIComponent(this.state.quizObjForEdit.description);
        reqBody+='&type='+encodeURIComponent(this.state.quizObjForEdit.type);
        reqBody+='&duration_minutes='+encodeURIComponent(this.state.quizObjForEdit.duration_minutes);

        fetch(`/api/updateQuiz`, {
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
            if(data.updatestatus==="ok"){
                loadQuizes(dispatch);
                let quizesArrayCopy=JSON.parse(JSON.stringify(globalState.quizesArray));
                quizesArrayCopy.forEach((obj)=>{
                  if(obj.id===this.state.quizObjForEdit.id){
                     obj.description=this.state.quizObjForEdit.description;
                     obj.duration_minutes=this.state.quizObjForEdit.duration_minutes;
                  }
                });
                setQuizes(quizesArrayCopy, dispatch);
                this.setState({quizObj: this.state.quizObjForEdit, problemsArray: this.state.problemsArrayForEdit,
                  showEditQuizDialog:false});
                hideSpinner(dispatch);
                alert('Quiz updated');
            }
            else{
              alert('Quiz updation failed!');
            }
        })
    }//end of else
  }

  quizTypeSelectChange(e){
        const copied = Object.assign({}, this.state.quizObjForEdit)
        var new_quizType=e.target.value;
        var new_quizTypeDescription=e.target.options[e.target.selectedIndex].text;
        copied.type=new_quizType;
        //console.log(new_quizType);
        this.setState({quizObjForEdit:copied});
  }

  descriptionChange(e){
    const copied = Object.assign({}, this.state.quizObjForEdit)
    copied.description=e.target.value;
    this.setState({quizObjForEdit:copied});
  }

  courseNameChange(e){
    const copied = Object.assign({}, this.state.quizObjForEdit)
    copied.courseName=e.target.value;
    this.setState({quizObjForEdit:copied});
  }

  durationChange(e){
    const copied = Object.assign({}, this.state.quizObjForEdit)
    copied.duration_minutes=e.target.value;
    this.setState({quizObjForEdit:copied});
  }

/*  async componentDidMount(){
    this.props.showSpinner();
    const {params}= this.props.match;

    var reqBody="quizId="+encodeURIComponent(params.id);
    let res1=await fetch(`/api/getTheQuiz`, {
      headers:{
        'Accept':'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: reqBody
    });
    let data=await res1.json()
    data.id=params.id;
      //console.log(data);
    let res2=await fetch(`/api/getProblemListForQuiz`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      });
    let data1=await res2.json()

    let res3=await fetch(`http://localhost:5000/api/quizGetScores`, {
                   headers:{
                     'Accept':'application/json',
                     'Content-type': 'application/x-www-form-urlencoded'
                   },
                   method: 'POST',
                   body: reqBody
                 });

   const data2=await res3.json();
   console.log(data2);
   this.setState({quizObj: data, quizObjForEdit: data, problemsArray: data1, quizResultsArray:data2});
  }*/

  componentDidMount(){
    let dispatch=this.props.dispatch;

    showSpinner(dispatch);
    const {params}= this.props.match;

    var reqBody="quizId="+encodeURIComponent(params.id);
    let promise1=fetch(`/api/getTheQuiz`, {
      headers:{
        'Accept':'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: reqBody
    });

    let promise2=fetch(`/api/getProblemListForQuiz`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      });


    Promise.all([promise1, promise2]).then(responses=>{
      Promise.all(responses.map(res=>res.json())).then(jsons=>{
          jsons[0].id=params.id;
          console.log(jsons[0]);
           this.setState({
              quizObj: jsons[0], quizObjForEdit: jsons[0],
              problemsArray: jsons[1], problemsArrayForEdit: jsons[1],
              });
           })
    });
    hideSpinner(dispatch);
  }

  editQuizHandler(){
    this.setState({showEditQuizDialog:true});
  }

  removeProblemFromProblemsArray(e,problemId){
    let problemsArray =  this.state.problemsArrayForEdit.filter(val=>val.id!==problemId)
    this.setState({problemsArrayForEdit:problemsArray});
    //console.log(quizesArray);
  }

  addProblemToProblemsArray(e,probObj){
    let problemsArray =  [...this.state.problemsArrayForEdit];
    if(problemsArray.filter(val=>val.id===probObj.id).length>0){
      alert('Problem redundant')
    }
    else if(probObj.type!==this.state.quizObjForEdit.type){
      alert('Problem and Quiz should be of the same type')
    }
    else {
       problemsArray.push(probObj);
       this.setState({problemsArrayForEdit:problemsArray});
    }
  }


  removeCourseFromCoursesArray(e,courseId){
    const copied = Object.assign({}, this.state.quizObjForEdit)
    let coursesArray=copied.coursesArray.filter(val=>val.id!==courseId);
    copied.coursesArray=coursesArray;
    this.setState({quizObjForEdit:copied});
    //console.log(quizesArray);
  }

  addCourseToCoursesArraySubmit(courseObject){
    const copied = Object.assign({}, this.state.quizObjForEdit);
    let coursesArray= [...copied.coursesArray];

    if(coursesArray.filter(val=>val.id===courseObject.id).length>0){
      alert('Course redundant')
    }
    else {
       coursesArray.push(courseObject);
       copied.coursesArray=coursesArray;
       this.setState({quizObjForEdit:copied});
    }
    //console.log(quizObject);
  }


  deleteQuizHandler(id){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

    let b=window.confirm('Are you sure you want to delete');
    if(b===true){
        showSpinner(dispatch);
          var reqBody="id="+encodeURIComponent(id);
          fetch(`/api/deleteQuiz`, {
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
                  let quizesArrayCopy=globalState.quizesArray.filter((obj)=>obj.id!==id);
                  setQuizes(quizesArrayCopy, dispatch);
                  hideSpinner(dispatch);
                  alert('Quiz deleted');
                  window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizesBrowse");
              }
          })
    }//end of if
  }

  /* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
 toggleNavDisplay() {
   var x = document.getElementById("TopNav");
  if (x.className === "TopNav") {
    x.className += " responsive";
  } else {
    x.className = "TopNav";
  }
}

showQuizResultsHandler(){
   window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizInstances/"+this.state.quizObjForEdit.id);
   //this.setState({showQuizResultsDialog:true});
}

startedQuizOptionChange=(problemId, optionSelectedValue)=>{
  let globalState=this.props.state;
  let dispatch=this.props.dispatch;
  const copied = Object.assign({}, globalState.startedQuizAnswers);
  copied[problemId]=optionSelectedValue;
  //this.setState({startedQuizAnswers:copied});
  //console.log(copied);
  //localStorage.setItem('startedQuizAnswers', JSON.stringify(copied));
  setStartedQuizAnswers(copied, dispatch);
}

startedQuizSolutionChange=(problemId, e)=>{
  let globalState=this.props.state;
  let dispatch=this.props.dispatch;
  const copied = Object.assign({}, globalState.startedQuizAnswers);
  copied[problemId]=e.target.value;
  //this.setState({startedQuizAnswers:copied});
  //localStorage.setItem('startedQuizAnswers', JSON.stringify(copied));
  setStartedQuizAnswers(copied, dispatch);
}

isQuizStarted=(quizId)=>{
  let globalState=this.props.state;
  if(globalState.startedQuiz!==null&&globalState.startedQuiz.id===quizId)
      return true;
  else
      return false;
}

startQuiz=()=>{
  let globalState=this.props.state;
  let dispatch=this.props.dispatch;
  let quizObj=this.state.quizObj;
  if(globalState.startedQuiz===null){
    if(window.confirm('Are you sure you want to start the quiz:\r\n'+quizObj.description)===true){
      quizObj['start_time']=getCurrentTimestampString();
      var reqBody="quizId="+encodeURIComponent(quizObj.id);
          reqBody+='&startTime='+encodeURIComponent(quizObj.start_time);
          reqBody+='&userId='+encodeURIComponent(globalState.loggedInUser);

      fetch(`/api/quizStart`, {
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
          if(data.insertstatus=== "ok"){
            quizObj['quizInstanceId']=data.quizInstanceId;
            //this.setState({startedQuiz:quizObj});
            //localStorage.setItem('startedQuiz', JSON.stringify(quizObj));
            setStartedQuiz(quizObj, dispatch);
          }
          else{
            alert('An error occurred in connecting to the server to start the quiz');
          }
        });
    }
  }
  else{
    alert('There is already a started quiz:\r\n'+
           globalState.startedQuiz.description+
          '\r\n Please submit this quiz to start a new quiz')
  }
   console.log(globalState.startedQuiz);
}

  render(){
    {/*if(this.props.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
      }*/}
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    return (
      <div>
      <a class="HomeLink" href="/">
          <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
      {/*back to home*/}
      </a>
      <div class="h1">
        Quiz Details
      </div>
      <div className="Panel">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
          <div className="h1">
            {this.state.quizObj.description}
          </div>
           <b>Course:</b><br/>
           {this.state.quizObj.coursesArray!==undefined?
             (
               this.state.quizObj.coursesArray.map(courseObj=>(
                               <a href={`https://${window.location.hostname}:${window.location.port}/courseShowSelected/${courseObj.id}`}>
                                 <div id={`courseName$,${courseObj.id}`}  className="Course" style={{marginLeft:'2em'}}>
                                 {courseObj.name}
                                 </div>
                               </a>
                                                               )
               )
             ):null
           }
           <br/>
           <b>Duration (minutes):</b> {this.state.quizObj.duration_minutes}
           <div className="TopNavParent" style={{ width:'100%', textAlign:'right'}}>
               <div id="TopNav" className="TopNav">
                <a href="javascript:void(0);" class="HamIcon" onClick={()=>this.toggleNavDisplay()}>
                    <i class="fa fa-bars"></i>
                </a>
               <input type="button" className="LeftButton"
                onClick={()=>this.startQuiz()}
                id={`s${this.state.quizObj.id}`} value="Start Quiz"/>
               {(globalState.loggedInUser===this.state.quizObj.instructorId||globalState.admin==="1")?
               (<>
                  <input type="button"
                   className="LeftButton"
                   onClick={()=>this.editQuizHandler()}
                   id={`e${this.state.quizObj.id}`} value="Edit Quiz"/>
                  <input type="button" className="LeftButton"
                   onClick={()=>this.deleteQuizHandler(this.state.quizObj.id)}
                   id={`d${this.state.quizObj.id}`} value="Delete Quiz"/>
                   <input type="button" className="LeftButton"
                    onClick={()=>this.showQuizResultsHandler()}
                    id={`r${this.state.quizObj.id}`} value="Quiz Results"/>
               </>):null}
                </div>
            </div>
           <br/>
           <b> Quiz Type:</b> {this.state.quizObj.type==="d"?"Descriptive": "Multiple Choice"}
           <br/><br/>
          <b> Instructor:</b> {this.state.quizObj.instructorId}
          <br/><br/>
          {this.isQuizStarted(this.state.quizObj.id)?(
            <form>
            {(this.state.problemsArray.map(obj=>(
              <div className="probParent">
                  <hr/>
                  <b>Question: </b>
                  <div className="Question"
                        dangerouslySetInnerHTML={{
                       __html: obj.description
                       }}
                  ></div>
                  {obj.type==="d"?(<>Answer Description:<br/>
                                      <textarea id="ansDescription" name="ansDescription" type="text" rows="10"
                                      value={globalState.startedQuizAnswers!==null?globalState.startedQuizAnswers[obj.id]:''}
                                      onChange={(e)=>this.startedQuizSolutionChange(obj.id,e)}
                                      style={{width:'90%'}}>
                                      </textarea>
                                  </>):null
                  }
                  {obj.type==="m"?(<>
                                      <b>Options</b><br/>
                                      <input type="radio" id={`${obj.id}$option1`} onChange={(e)=>this.startedQuizOptionChange(obj.id,e.target.value)}
                                      checked={globalState.startedQuizAnswers!=null&&globalState.startedQuizAnswers[obj.id]==="1"}
                                       name={`${obj.id}$`} value="1" ></input>
                                      <span  dangerouslySetInnerHTML={{__html: obj.option1}}/><br/>
                                      <input type="radio" id={`${obj.id}$option2`} onChange={(e)=>this.startedQuizOptionChange(obj.id,e.target.value)}
                                      checked={globalState.startedQuizAnswers!=null&&globalState.startedQuizAnswers[obj.id]==="2"}
                                       name={`${obj.id}$`} value="2"></input>
                                      <span  dangerouslySetInnerHTML={{__html: obj.option2}}/><br/>
                                      <input type="radio" id={`${obj.id}$option3`} onChange={(e)=>this.startedQuizOptionChange(obj.id,e.target.value)}
                                        checked={globalState.startedQuizAnswers!=null&&globalState.startedQuizAnswers[obj.id]==="3"}
                                       name={`${obj.id}$`} value="3"></input>
                                      <span  dangerouslySetInnerHTML={{__html: obj.option3}}/><br/>
                                      <input type="radio" id={`${obj.id}$option4`} onChange={(e)=>this.startedQuizOptionChange(obj.id,e.target.value)}
                                        checked={globalState.startedQuizAnswers!=null&&globalState.startedQuizAnswers[obj.id]==="4"}
                                       name={`${obj.id}$`} value="4"></input>
                                      <span  dangerouslySetInnerHTML={{__html: obj.option4}}/><br/>
                                  </>
                                ):null
                }
              </div>
            )
          ))}
           <br/>
           <input type="button" className="LeftButton"
           onClick={e=>{
                         if(window.confirm('Are you sure you want to submit the quiz:'+this.state.quizObj.description)===true)
                           submitQuiz(globalState, dispatch);
                       }
                   }
           value="Submit Quiz"/>
          </form>
        ):null}
        <QuizEditDialog
                objectForEdit={this.state.quizObjForEdit}
                show={this.state.showEditQuizDialog}
                handleDismiss={this.handleEditQuizDialogDismiss}
                handleSubmit={this.saveUpdateHandler}
                descriptionChange={this.descriptionChange}
                courseNameChange={this.courseNameChange}
                problemsArrayForEdit={this.state.problemsArrayForEdit}
                durationChange={this.durationChange}
                quizTypeSelectChange={this.quizTypeSelectChange}
                removeCourseFromCoursesArray={this.removeCourseFromCoursesArray}
                addCourseToCoursesArraySubmit={this.addCourseToCoursesArraySubmit}
                removeProblemFromProblemsArray={this.removeProblemFromProblemsArray}
                addProblemToProblemsArray={this.addProblemToProblemsArray}
                state={this.props.state}
                dispatch={this.props.dispatch}
        />
     </div>
     </div>
    )
  }


}

export default QuizShowSelected;
