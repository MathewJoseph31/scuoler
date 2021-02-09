import React from 'react';
import ReactDOM from 'react-dom'
import data from './data';
import {  Redirect } from 'react-router-dom';
import {showSpinner, hideSpinner, setQuizes, loadCourses} from '../stores/appStoreActions';

class QuizInsert extends React.Component{

  constructor(props){
    super(props);
    this.state={
      spinner:false,
      duration_minutes:30,
      description:'',
      quizType: "d",
      courseSearchKey: '',
      selectedCourseId:'',
      courseObjectsFiltered:[],
      coursesAddedArray:[],
      augmentedCourseObjects:[],
      augmentedCourseObjectsPrior:[],
      problemSearchKey:'',
      problemSearchResults:[],
      problemsAddedArray:[],
      /*courseId:null,
      courseName:'UnAssigned',*/
      icons: data.icons
    }
    this.baseState={
      description:''
    }
    this.descriptionChange=this.descriptionChange.bind(this);
    //this.selectChange=this.selectChange.bind(this);
    this.handleQuizInsert=this.handleQuizInsert.bind(this);
    this.durationChange=this.durationChange.bind(this);
    this.quizTypeSelectChange=this.quizTypeSelectChange.bind(this);

    this.checkStaticCourse=this.checkStaticCourse.bind(this);
    this.courseSearchBoxChange=this.courseSearchBoxChange.bind(this);
    this.courseObjectsFilteredClick=this.courseObjectsFilteredClick.bind(this);
    this.AddCourseToCoursesArray=this.AddCourseToCoursesArray.bind(this);
    this.problemSearchKeyChange=this.problemSearchKeyChange.bind(this);
    this.checkStaticProblem=this.checkStaticProblem.bind(this);
    this.removeProblemFromProblemsArray=this.removeProblemFromProblemsArray.bind(this);
    this.addProblemToProblemsArray=this.addProblemToProblemsArray.bind(this);
  }

  quizTypeSelectChange(e){
    var new_quizType=e.target.value;
    var new_quizTypeDescription=e.target.options[e.target.selectedIndex].text;
    this.setState({quizType:new_quizType});
    console.log(new_quizType);
  }

  removeProblemFromProblemsArray(e,problemId){
    let problemsArray =  this.state.problemsAddedArray.filter(val=>val.id!==problemId)
    this.setState({problemsAddedArray:problemsArray});
    //console.log(quizesArray);
  }

  addProblemToProblemsArray(e,probObj){
    console.log(probObj.type);
    let problemsArray =  [...this.state.problemsAddedArray];
    if(problemsArray.filter(val=>val.id===probObj.id).length>0){
      alert('Problem redundant')
    }
    else if(probObj.type!==this.state.quizType){
        alert('Quiz and Problem should of the same type');
    }
    else {
       problemsArray.push(probObj);
       this.setState({problemsAddedArray:problemsArray});
       //alert('Problem Added');
    }
  }

  problemSearchKeyChange(e){
    const strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStaticProblem(strSearchKey);}, 1000);
    this.setState({problemSearchKey: strSearchKey});
  }

  async checkStaticProblem(currentValue){
    if(currentValue===this.state.problemSearchKey&&currentValue!==''){
      //console.log('static value'+currentValue);
      var reqBody="searchKey="+encodeURIComponent(this.state.problemSearchKey);
      let searchResults=await fetch(`/api/searchProblems`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      //console.log(searchJson);
      this.setState({problemSearchResults:searchJson});
    }
    else if(currentValue===this.state.problemSearchKey && currentValue===''){
      this.setState({problemSearchResults:[]})
    }
  }

  courseObjectsFilteredClick(str, courseId, e){
    this.setState({courseSearchKey: str, selectedCourseId: courseId, courseObjectsFiltered: [],
        augmentedCourseObjectsPrior: this.state.augmentedCourseObjects, augmentedCourseObjects:[]});
  }

  courseSearchBoxChange(e){
    let globalState=this.props.state;
    let strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStaticCourse(strSearchKey);}, 1000);
    const courseObjectsFiltered=e.target.value!==''?globalState.coursesArray.filter((val)=>val.name.toUpperCase().startsWith(strSearchKey.toUpperCase())):[];
    //const courseObjectsFiltered=this.props.coursesArray.filter((val)=>val.description.toUpperCase().startsWith(e.target.value.toUpperCase()));
    this.setState({courseSearchKey: e.target.value, courseObjectsFiltered: courseObjectsFiltered});
  }

  async checkStaticCourse(currentValue){
    if(currentValue===this.state.courseSearchKey && currentValue!==''){
      //console.log('static value'+currentValue);
      var reqBody="searchKey="+encodeURIComponent(this.state.courseSearchKey);
      let searchResults=await fetch(`/api/searchCoursesForPrefix`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let prefixSearchResults=await searchResults.json();

      let augmentedCourseObjects=[];
      prefixSearchResults.forEach(ele=>{
        let len=this.state.courseObjectsFiltered.filter(val=>val.id===ele.id).length;
        if(len<=0)
          augmentedCourseObjects.push(ele);
      })
      //console.log(augmentedCourseObjects);
      this.setState({augmentedCourseObjects:augmentedCourseObjects});
    }
    else if(currentValue===this.state.courseSearchKey && currentValue===''){
            this.setState({augmentedCourseObjects:[]})
    }
  }

  AddCourseToCoursesArray(e){
        let globalState=this.props.state;
        let courseObjectsFilteredAugmented=[...globalState.coursesArray];
        courseObjectsFilteredAugmented=courseObjectsFilteredAugmented.concat(this.state.augmentedCourseObjectsPrior);

        const filteredArray=courseObjectsFilteredAugmented.filter((val)=>val.name.toUpperCase()===this.state.courseSearchKey.toUpperCase()&&val.id===this.state.selectedCourseId);
        if(filteredArray.length<1){
          alert('Search key does not match any available  \n\t quiz description');
        }
        else if(filteredArray.length>1){
          alert('Search key matches multiple quizes\' description!\n\t please choose another one');
        }
        else {
          console.log('filtered course object\n'+JSON.stringify(filteredArray[0]));
          let coursesArray=[...this.state.coursesAddedArray];
          coursesArray.push(filteredArray[0]);
          //this.props.addCourseToCoursesArraySubmit(filteredArray[0]);
          this.setState({courseSearchKey:'', selectedCourseId:'', coursesAddedArray: coursesArray})
        }
  }

  removeCourseFromCoursesArray(e, courseId){
    let coursesArray=this.state.coursesAddedArray.filter(val=>val.id!==courseId);
    this.setState({coursesAddedArray:coursesArray});
  }

  handleQuizInsert(){
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    if(this.state.description===''){
      alert('Description cannot be empty');
      return;
    }
    else if(this.state.duration_minutes===''){
      alert('Duration cannot be empty');
      return;
    }
    else if(isNaN(this.state.duration_minutes)){
      alert('Duration has to be a number');
      return;
    }
    else{
      showSpinner(dispatch);
      var reqBody="quizDescription="+encodeURIComponent(this.state.description);
          reqBody+="&duration_minutes="+encodeURIComponent(this.state.duration_minutes);
          reqBody+="&coursesArray="+encodeURIComponent(JSON.stringify(this.state.coursesAddedArray));
          reqBody+="&problemsArray="+encodeURIComponent(JSON.stringify(this.state.problemsAddedArray));
          //reqBody+="&courseId="+encodeURIComponent(this.state.courseId);
          reqBody+='&authorName='+encodeURIComponent(globalState.loggedInUser);

      fetch(`/api/insertQuizAction`, {
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
              let quizesArrayCopy=[...globalState.quizesArray];
              let obj={
                id: data.quizId,
                description: this.state.description,
                duration_minutes: this.state.duration_minutes,
                name:this.state.courseName,
                author_id:globalState.loggedInUser
              };
              quizesArrayCopy.push(obj);
              setQuizes(quizesArrayCopy, dispatch);
              this.setState(this.baseState);
              hideSpinner(dispatch);
              alert('Quiz inserted');
              window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizesBrowse");
      })

    }

  }

  durationChange(e){
    this.setState({duration_minutes:e.target.value})
  }

  descriptionChange(e){
    //console.log(this.state.courseId+' '+this.state.courseName);
    const new_description=e.target.value;
    //console.log(e.target.value);
    this.setState({description:new_description});
  }

  componentDidMount(){
    loadCourses(this.props.dispatch);
    /*if(this.state.courseId===undefined && this.props.coursesArray.length>0)
        this.setState({courseId:this.props.coursesArray[0].id, courseName:this.props.coursesArray[0].name});*/
  }

  /*selectChange(e){
    //console.log(e.target.value);
    var new_courseId=e.target.value;
    var new_courseName=e.target.options[e.target.selectedIndex].text;
    this.setState({courseId:new_courseId, courseName:new_courseName});
  }*/

  render(){
    let globalState=this.props.state;
    if(globalState.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
    }

    let courseObjectsFilteredAugmented=[...this.state.courseObjectsFiltered];
    courseObjectsFilteredAugmented=courseObjectsFilteredAugmented.concat(this.state.augmentedCourseObjects);

    return (
      <div className="quizInsert">
      <a class="HomeLink" href="/">
          <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
      {/*back to home*/}
      </a>
      <div class="h1">
        Insert Quiz
      </div>
        <fieldset>
        <br/>
        Quiz Type:
        <select id="quizType" onChange={this.quizTypeSelectChange} name="quizType">
           <option value="d">Descriptive</option>
           <option value="m">Multiple Choice</option>
         </select>
         <br/><br/>
        Duration (minutes):<br/>
        <input type="text" id="durationMinutes" style={{marginLeft:'23px'}}
        onChange={this.durationChange}
        value={this.state.duration_minutes}></input>
        <br/><br/>
          Quiz Description:<br/>
          <textarea id="quizDescription" name="quizDescription" type="text" rows="10"
          style={{width:'90%'}}
          onChange={this.descriptionChange}
          value={this.state.description}
           >
          </textarea>
          <br/><br/>
          Author:<br/>
          <input id="authorName" name="authorName" type="text" style={{width:'100px', textAlign: 'center'}}
          required="true" value={globalState.loggedInUser} readonly>
          </input>
          <br/>
          <br/>
          Courses:<br/>
          {/*<select id="courseId" onChange={this.selectChange}  name="courseId" required="true">
              <option value="null">UnAssigned</option>
          {
              this.props.coursesArray.map(obj=>(
                <option value={obj.id}>{obj.name}</option>
                )
              )
          }
          </select>*/}
          <div id="AddToDialog">
              <div className="autocomplete">
                 <input id="searchBox" type="text" name="searchBox"
                    className="searchBox"
                   value={this.state.courseSearchKey}
                   onChange={this.courseSearchBoxChange}
                  placeholder="Type first letters of course "/>
                 <div className="autocomplete-items">
                   {
                     courseObjectsFilteredAugmented.map(obj=>(<div onClick={(e)=>this.courseObjectsFilteredClick(obj.name, obj.id, e)}><strong>{obj.name.substring(0,this.state.courseSearchKey.length)}</strong>{obj.name.substring(this.state.courseSearchKey.length)}({obj.id})</div>))
                   }
                 </div>
              </div>
              <input type="submit" value="Add Course" onClick={(e)=>this.AddCourseToCoursesArray(e)}/>
          </div>
          <br/>
          <div>
          {
              this.state.coursesAddedArray!==undefined?
              ( this.state.coursesAddedArray.map(objQ=>(
                  <div   id={objQ.id} >|{objQ.name}
                   <span className="closeBtn"
                     onClick={(e)=>this.removeCourseFromCoursesArray(e, objQ.id)}>&times;</span>&nbsp;|
                  </div>
                  )
                )
              ):null
          }
          </div>
          <br/><br/>
          Quiz Problems:<br/>
          <div>
          {
            this.state.problemsAddedArray!==undefined?
            ( this.state.problemsAddedArray.map((obj, i, arr)=>{
              return (
                <>
                <hr/>
                {i===arr.length-1?
                      (<div id={`par$,${obj.id}`} ref = "quizProblems" tabIndex={0} className="probParent">
                      <b>Description</b>:
                       <input type="button" id={'b'+obj.id} value="remove from quiz" onClick={(e)=>this.removeProblemFromProblemsArray(e,obj.id)} className="EditButton"/>
                      <span id={'P'+obj.id}
                       dangerouslySetInnerHTML={{
                         __html: obj.description
                       }}/>
                       <b>Author</b>: {obj.author_id}
                      </div>
                      ):
                      (
                        <div id={`par$,${obj.id}`} className="probParent">
                        <b>Description</b>:
                         <input type="button" id={'b'+obj.id} value="remove from quiz" onClick={(e)=>this.removeProblemFromProblemsArray(e,obj.id)} className="EditButton"/>
                        <span id={'P'+obj.id}
                         dangerouslySetInnerHTML={{
                           __html: obj.description
                         }}/>
                         <b>Author</b>: {obj.author_id}
                        </div>
                      )
                }
                </>)
            })
            ):null
          }
          </div>
          <hr/>
          <br/>
          <b>Add Problem</b>:
           <div style={{textAlign: 'center'}}>
                <input type="text" id="problemSearchKey" className="searchBox"
                onChange={this.problemSearchKeyChange}
                placeholder="type a word that is likely to be in the problem text"
                value={this.state.problemSearchKey}></input>
           </div>
           <br/>
           {
             this.state.problemSearchResults!==undefined&&this.state.problemSearchResults.length>0?(<div style={{textAlign: 'center', fontSize: '1.5em'}}>Search Results</div>):null
           }
           <div>
           {
            this.state.problemSearchResults.map(obj=>(
             <div id={`par$,${obj.id}`} className="probParent">
                  <br/>
                   <input type="button" id={'a'+obj.id} value="add to quiz"
                          onClick={(e)=>{
                                         this.addProblemToProblemsArray(e,obj);
                                         if(this.state.problemsAddedArray.length>0)
                                            ReactDOM.findDOMNode(this.refs.quizProblems).focus();
                                        }
                                  }
                          className="EditButton"
                   />
                   <b>Problem Description: </b>
                   <a href={`./problemShowSelected/${obj.id}`}>
                      <div id={`problemDescription$,${obj.id}`}
                       dangerouslySetInnerHTML={{__html: obj.description}}
                       className="Question">
                       </div>
                   </a>
                   <br/>
                   <b>Author: </b>
                   <a href={`https://${window.location.hostname}:${window.location.port}/userShowSelected/${obj.author_id}`}>
                     <div id={`author$,${obj.id}`} style={{marginLeft:'30px'}} className="Quiz">
                     {obj.author_id}
                     </div>
                   </a>
                   <input type="hidden" id={`quizId$,'${obj.id}`} value={obj.quiz_id}/>
                   <br/>
                   <hr />
               </div>
               )
             )
           }
           <hr/>
          </div>
          <br/><br/>
          <br/>
           <input type="button" value="Insert Quiz" onClick={this.handleQuizInsert}/>
        </fieldset>
      </div>
    )
  }

}

export default QuizInsert;
