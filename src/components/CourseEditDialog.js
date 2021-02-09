import React from 'react';

class CourseEditDialog extends React.Component{

  constructor(props){
    super(props);
    this.state={
      quizSearchKey:'',
      quizSearchResults:[]
    }
    this.quizSearchKeyChange=this.quizSearchKeyChange.bind(this);
    this.checkStaticQuiz=this.checkStaticQuiz.bind(this);
    this.handleDialogCancel=this.handleDialogCancel.bind(this);
  }

  quizSearchKeyChange(e){
    const strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStaticQuiz(strSearchKey);}, 1000);
    this.setState({quizSearchKey: strSearchKey});
  }

  async checkStaticQuiz(currentValue){
    if(currentValue===this.state.quizSearchKey&&currentValue!==''){
      //console.log('static value'+currentValue);
      var reqBody="searchKey="+encodeURIComponent(this.state.quizSearchKey);
      let searchResults=await fetch(`/api/searchQuizes`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      console.log(searchJson);
      this.setState({quizSearchResults:searchJson});
    }
  }

  handleDialogCancel(e){
    this.setState({
      quizSearchKey:'',
      quizSearchResults:[]
    });
    this.props.handleDismiss(e);
  }

  render(){
    //console.log(this.props.objectForEdit);
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    : "simple-dialog-overlay simple-dialog-display-none";

    return (
          <div className={visibilityClassName}>
              <div className="simple-dialog">
                 <button id = "x" onClick={this.handleDialogCancel}>
                  X
                 </button>
                 <h2>Edit Course</h2>
                 <hr class="rounded"/>
                  Course Id:
                  <input type="text" id="courseId" value={this.props.objectForEdit.courseId} readonly></input>
                  <br/><br/>
                   Name:
                   <input type="text" id="courseName" style={{marginLeft:'20px'}}
                   onChange={this.props.nameChange}
                   value={this.props.courseNameEdited}></input>
                   <br/><br/>
                   Description:<br/>
                   <textarea id="courseDescription" name="courseDescription" type="text" rows="10"
                   style={{width:'90%'}}
                    onChange={this.props.descriptionChange}
                    value={this.props.courseDescriptionEdited}></textarea>
                    <br/><br/>
                    Creator:
                    <input type="text" id="Creator" value={this.props.objectForEdit.ownerId} readonly></input>
                    <br/><br/>
                    Course Quizes:<br/>
                    {
                      this.props.quizesArrayForEdit!==undefined?
                      ( this.props.quizesArrayForEdit.map(obj=>{
                        return (
                          <>
                          <hr/>
                          <b>Description</b>:
                           <input type="button" id={'b'+obj.id} value="remove from course" onClick={(e)=>this.props.removeQuizFromQuizesArray(e,obj.id)} className="EditButton"/>
                           <br/>
                          <span id={'P'+obj.id}
                           dangerouslySetInnerHTML={{
                             __html: obj.description
                           }}/>
                           <br/><br/>
                           <b>Author</b>: {obj.author_id}
                          </>)
                      })
                      ):null
                    }
                    <hr/>
                    <br/><br/>
                    <b>Add Quiz</b>:
                    <div style={{textAlign: 'center'}}>
                          <input type="text" id="quizSearchKey" style={{width:'50%'}}
                          onChange={this.quizSearchKeyChange}
                          placeholder="type your search key here"
                          value={this.state.quizSearchKey}></input>
                     </div>
                     <br/>
                     {
                       this.state.quizSearchResults!==undefined&&this.state.quizSearchResults.length>0?(<div style={{textAlign: 'center', fontSize: '1.5em'}}>Search Results</div>):null
                     }
                     {
                      this.state.quizSearchResults.map(obj=>(
                       <>
                       <div id={`par$,${obj.id}`} className="probParent">
                         <input type="button" id={'a'+obj.id} value="add to course" onClick={(e)=>this.props.addQuizToQuizesArray(e,obj)} className="EditButton"/>
                           <b>Quiz Description: </b>
                           <a href={`./quizShowSelected/${obj.id}`}>
                               <div id={`quizDescription$,${obj.id}`}
                               dangerouslySetInnerHTML={{__html: obj.description}}
                               className="Question"></div>
                           </a>
                           <br/>
                           <b>Author: </b>
                           <a href={`https://${window.location.hostname}:${window.location.port}/userShowSelected/${obj.author_id}`}>
                             <div id={`author$,${obj.id}`} style={{marginLeft:'30px'}} className="Quiz">
                             {obj.author_id}
                             </div>
                           </a>
                           <br/>
                         </div>
                         <hr />
                         </>
                         )
                       )
                     }
                    <br/><br/><br/><br/><br/><br/>
                   <input type="button" value="Save Updates"
                       onClick={(e)=>{
                         this.setState({
                           quizSearchKey:''
                         });
                         this.props.handleSubmit(e);
                       }}
                   />
                   <button id="x" style={{width:'100px', textAlign:'center'}}
                     onClick={this.handleDialogCancel}>close
                   </button>
             </div>
        </div>
  )
  }
}

export default CourseEditDialog;
