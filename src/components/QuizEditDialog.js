import React from 'react';
import ReactDOM from 'react-dom';
import {loadCourses} from '../stores/appStoreActions';

class QuizEditDialog extends React.Component{

  componentDidMount(){
    let dispatch=this.props.dispatch
    loadCourses(dispatch);
  }


  constructor(props){
    super(props);
    this.state={
      courseSearchKey: '',
      selectedCourseId:'',
      courseObjectsFiltered:[],
      augmentedCourseObjects:[],
      augmentedCourseObjectsPrior:[],
      problemSearchKey:'',
      problemSearchResults:[],
    }

    this.checkStaticCourse=this.checkStaticCourse.bind(this);
    this.courseSearchBoxChange=this.courseSearchBoxChange.bind(this);
    this.courseObjectsFilteredClick=this.courseObjectsFilteredClick.bind(this);

    this.problemSearchKeyChange=this.problemSearchKeyChange.bind(this);
    this.checkStaticProblem=this.checkStaticProblem.bind(this);
    this.handleDialogCancel=this.handleDialogCancel.bind(this);
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
      console.log(searchJson);
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
      this.setState({augmentedCourseObjects:[], augmentedCourseObjectsPrior:[]})
    }
  }

  AddToCourseSubmit(e){
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
          this.props.addCourseToCoursesArraySubmit(filteredArray[0]);
          this.setState({courseSearchKey:'', selectedCourseId:''})
        }
  }

  handleDialogCancel(e){
    this.setState({
      courseSearchKey: '',
      selectedCourseId:'',
      courseObjectsFiltered:[],
      augmentedCourseObjects:[],
      augmentedCourseObjectsPrior:[],
      problemSearchKey:'',
      problemSearchResults:[],
    });
    this.props.handleDismiss(e);
  }

  render(){
    //console.log(this.props.coursesArray);
    //console.log(this.props.objectForEdit);
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    :"simple-dialog-overlay simple-dialog-display-none";

    let courseObjectsFilteredAugmented=[...this.state.courseObjectsFiltered];
    courseObjectsFilteredAugmented=courseObjectsFilteredAugmented.concat(this.state.augmentedCourseObjects);


    return (
      <div className={visibilityClassName}>
         <div className="simple-dialog">
         <button id = "x" onClick={this.handleDialogCancel}>
          X
         </button>
           <h2>Edit Profile</h2>
           <hr class="rounded"/>
                          Quiz Id:<br/>
                          <input type="text" id="userId" style={{marginLeft:'23px'}}
                          value={this.props.objectForEdit.id}
                          readonly></input>
                           <br/><br/>
                          Quiz Type:
                          <select id="quizType" onChange={this.props.quizTypeSelectChange} name="quizType">
                             <option selected={this.props.objectForEdit.type==="d"?true:false} value="d">Descriptive</option>
                             <option selected={this.props.objectForEdit.type==="m"?true:false} value="m">Multiple Choice</option>
                           </select>
                          <br/><br/>
                          Duration (minutes):<br/>
                          <input type="text" id="durationMinutes" style={{marginLeft:'23px'}}
                          onChange={this.props.durationChange}
                          value={this.props.objectForEdit.duration_minutes}></input>
                          <br/><br/>
                         Description:<br/>
                         <textarea id="description" style={{marginLeft:'25px', width:'90%'}} type="text" rows="10"
                          onChange={this.props.descriptionChange}
                         value={this.props.objectForEdit.description}></textarea>
                         <br/><br/>
                         Courses:
                         <div id="AddToDialog">
                             <div className="autocomplete">
                                <input id="searchBox" type="text" name="searchBox"
                                value={this.state.courseSearchKey}
                                onChange={this.courseSearchBoxChange} placeholder="Type first letters of quiz "/>
                                <div className="autocomplete-items">
                                {
                                  courseObjectsFilteredAugmented.map(obj=>(<div onClick={(e)=>this.courseObjectsFilteredClick(obj.name, obj.id, e)}><strong>{obj.name.substring(0,this.state.courseSearchKey.length)}</strong>{obj.name.substring(this.state.courseSearchKey.length)}({obj.id})</div>))
                                }
                                </div>
                             </div>
                             <input type="submit" value="Add Course" onClick={(e)=>this.AddToCourseSubmit(e)}/>
                         </div>
                         <br/>
                         <div>
                         {
                             this.props.objectForEdit.coursesArray!==undefined?
                             ( this.props.objectForEdit.coursesArray.map(objQ=>(
                                 <div   id={objQ.id} >|{objQ.name}
                                  <span className="closeBtn"
                                    onClick={(e)=>this.props.removeCourseFromCoursesArray(e, objQ.id)}>&times;</span>&nbsp;|
                                 </div>
                                 )
                               )
                             ):null
                         }
                         </div>
                         <br/><br/>
                         Creator:<br/>
                         <input type="text" id="creator" style={{marginLeft:'23px'}}
                         value={this.props.objectForEdit.instructorId}
                         readonly></input>
                         <br/><br/>
                         Quiz Problems:<br/>
                         {
                           this.props.problemsArrayForEdit!==undefined?
                           ( this.props.problemsArrayForEdit.map((obj, i, arr)=>{
                             return (
                               <>
                               <hr/>
                                  {i===arr.length-1?
                                   (<div className="probParent" id="quizProblems" ref = "quizProblems" tabIndex={0}>
                                   <b>Description</b>:
                                    <input type="button" id={'b'+obj.id} value="remove from quiz" onClick={(e)=>this.props.removeProblemFromProblemsArray(e,obj.id)} className="EditButton"/>
                                   <span id={'P'+obj.id}
                                    dangerouslySetInnerHTML={{
                                      __html: obj.description
                                    }}/>
                                    <b>Author</b>: {obj.author_id} <br/><br/>
                                    <b>Type</b>: {obj.type==="m"?"Multiple Choice":"Descriptive"}
                                   </div>
                                  ):
                                  (<div className="probParent">
                                  <b>Description</b>:
                                   <input type="button" id={'b'+obj.id} value="remove from quiz" onClick={(e)=>this.props.removeProblemFromProblemsArray(e,obj.id)} className="EditButton"/>
                                  <span id={'P'+obj.id}
                                   dangerouslySetInnerHTML={{
                                     __html: obj.description
                                   }}/>
                                   <b>Author</b>: {obj.author_id}<br/>
                                   <b>Type</b>: {obj.type==="m"?"Multiple Choice":"Descriptive"}
                                  </div>
                                 )
                               }
                               </>)
                           })
                           ):null
                         }
                         <hr/>
                         <br/><br/>
                         <b>Add Problem</b>:
                         <div style={{textAlign: 'center'}}>
                               <input type="text" id="problemSearchKey"
                                 className="searchBox"
                               onChange={this.problemSearchKeyChange}
                               placeholder="type a word that is likely to be in the problem text"
                               value={this.state.problemSearchKey}/>
                          </div>
                          <br/>
                          {
                            this.state.problemSearchResults!==undefined&&this.state.problemSearchResults.length>0?(<div style={{textAlign: 'center', fontSize: '1.5em'}}>Search Results</div>):null
                          }
                          {
                           this.state.problemSearchResults.map(obj=>(
                            <div id={`par$,${obj.id}`} className="probParent">
                                <input type="button" id={'a'+obj.id} value="add to quiz"
                                onClick={(e)=>{
                                                this.props.addProblemToProblemsArray(e,obj);
                                                //ReactDOM.findDOMNode(this.refs.quizProblems).focus();
                                              }
                                        }
                                 className="EditButton"/>
                                <b>Problem Description: </b>
                                <a href={`./problemShowSelected/${obj.id}`}>
                                    <div id={`problemDescription$,${obj.id}`}
                                    dangerouslySetInnerHTML={{__html: obj.description}}
                                    className="Question"></div>
                                </a>
                                <br/>
                                {/*<b>Solution: </b>
                                <a href={`./problemShowSelected/${obj.id}`}>
                                    <div id={`solution$,${obj.id}`}
                                    dangerouslySetInnerHTML={{__html: obj.solution}}
                                    className="Question"></div>
                                </a>
                                 <br/>
                                <b>Source: </b> <a target="_blank" href={obj.source!==null?"https://"+obj.source:null}>{obj.source}</a>
                                <br/>*/}
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
            <br/><br/><br/><br/><br/><br/>
           <input type="button" id="x" value="Save" style={{width:'100px', float: "right"}}
               onClick={(e)=>{
                 this.setState({
                   courseSearchKey: '',
                   selectedCourseId:'',
                   problemSearchKey:''
                 });
                 this.props.handleSubmit(e);
               }}/>
           <br/><br/>
           <button id="x" style={{width:'100px'}}
            onClick={this.handleDialogCancel}
           >close
           </button>
         </div>
    </div>)
  }
}

export default QuizEditDialog;
