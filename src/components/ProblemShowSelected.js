import React from 'react';
import EditProblemDialog from './ProblemEditDialog';
import data from './data';
import {  Redirect } from 'react-router-dom';
import {showSpinner, hideSpinner, loadProblems, loadQuizes, setProblems} from '../stores/appStoreActions';

class ProblemShowSelected extends React.Component{
  constructor(props){
    super(props);
    this.state={
      problemObj:{},
      problemObjectForEdit:{},
      showEditProblemDialog:false,
      icons: data.icons
    }
    this.problemTypeSelectChange=this.problemTypeSelectChange.bind(this)
    this.descriptionChange=this.descriptionChange.bind(this);
    this.solutionChange=this.solutionChange.bind(this);
    this.option1Change=this.option1Change.bind(this);
    this.option2Change=this.option2Change.bind(this);
    this.option3Change=this.option3Change.bind(this);
    this.option4Change=this.option4Change.bind(this);
    this.answerkeyChange=this.answerkeyChange.bind(this);
    this.removeQuizFromQuizesArray=this.removeQuizFromQuizesArray.bind(this);
    this.addQuizToQuizesArraySubmit=this.addQuizToQuizesArraySubmit.bind(this);

    this.editProblemHandler=this.editProblemHandler.bind(this);
    this.handleEditProblemDialogDismiss=this.handleEditProblemDialogDismiss.bind(this);
    this.saveUpdateHandler=this.saveUpdateHandler.bind(this);
  }

  componentDidMount(){
     let dispatch=this.props.dispatch;
     showSpinner(dispatch);
     loadProblems(dispatch);
     loadQuizes(dispatch);
     const {params}= this.props.match;

     var reqBody="problemId="+encodeURIComponent(params.id);
     fetch(`/api/getTheProblem`, {
       headers:{
         'Accept':'application/json',
         'Content-type': 'application/x-www-form-urlencoded'
       },
       method: 'POST',
       body: reqBody
     })
     .then(res=>res.json())
     .then(data=>{
        this.setState({problemObj: data});
        hideSpinner(dispatch);
      })
  }

  problemTypeSelectChange(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.type=e.target.value;
    this.setState({problemObjectForEdit:copied});
  }


  descriptionChange(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.description=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  solutionChange(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.solution=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  answerkeyChange(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.answerkey=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  option1Change(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.option1=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  option2Change(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.option2=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  option3Change(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.option3=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  option4Change(e){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    copied.option4=e.target.value;
    //console.log(e.target.value);
    this.setState({problemObjectForEdit:copied});
  }

  removeQuizFromQuizesArray(e,quizId){
    const copied = Object.assign({}, this.state.problemObjectForEdit)
    let quizesArray=copied.quizesArray.filter(val=>val.id!==quizId);
    copied.quizesArray=quizesArray;
    this.setState({problemObjectForEdit:copied});
    //console.log(quizesArray);
  }

  addQuizToQuizesArraySubmit(quizObject){
    const copied = Object.assign({}, this.state.problemObjectForEdit);
    let quizesArray= [...copied.quizesArray];

    if(quizesArray.filter(val=>val.id===quizObject.id).length>0){
      alert('Quiz redundant')
    }
    else if(quizObject.type!==this.state.problemObjectForEdit.type){
      alert('Quiz and Problem should of the same type');
    }
    else {
       quizesArray.push(quizObject);
       copied.quizesArray=quizesArray;
       this.setState({problemObjectForEdit:copied});
    }
    //console.log(quizObject);
  }


  saveUpdateHandler(){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

     if(this.state.problemObjectForEdit.type==="m"&&![1,2,3,4].includes(parseInt(this.state.problemObjectForEdit.answerkey))){
       alert('Answer key should be numeric value in (1,2,3,4) for problem type (Multiple Choice)');
       return;
     }
     else{
          showSpinner(dispatch);
          var reqBody="id="+encodeURIComponent(this.state.problemObjectForEdit.id);
          reqBody+='&description='+encodeURIComponent(this.state.problemObjectForEdit.description);
          reqBody+='&type='+encodeURIComponent(this.state.problemObjectForEdit.type);
          reqBody+='&option1='+encodeURIComponent(this.state.problemObjectForEdit.option1);
          reqBody+='&option2='+encodeURIComponent(this.state.problemObjectForEdit.option2);
          reqBody+='&option3='+encodeURIComponent(this.state.problemObjectForEdit.option3);
          reqBody+='&option4='+encodeURIComponent(this.state.problemObjectForEdit.option4);
          reqBody+='&answerkey='+encodeURIComponent(this.state.problemObjectForEdit.answerkey);
          reqBody+='&quizesArray='+encodeURIComponent(JSON.stringify(this.state.problemObjectForEdit.quizesArray));

          var solution=this.state.problemObjectForEdit.solution.replace(/%20/g, '+');
          reqBody+='&solution='+encodeURIComponent(solution);
          reqBody+='&authorId='+encodeURIComponent(this.state.problemObjectForEdit.author_id);

          fetch(`/updateProblem`, {
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
                  let problemsArrayCopy=JSON.parse(JSON.stringify(globalState.problemsArray));
                  problemsArrayCopy.forEach((obj)=>{
                    if(obj.id===this.state.problemObjectForEdit.id){
                       obj.description=this.state.problemObjectForEdit.description;
                       obj.option1=this.state.problemObjectForEdit.option1;
                       obj.option2=this.state.problemObjectForEdit.option2;
                       obj.option3=this.state.problemObjectForEdit.option3;
                       obj.option4=this.state.problemObjectForEdit.option4;
                       obj.answerkey=this.state.problemObjectForEdit.answerkey;
                       obj.author_id=this.state.problemObjectForEdit.author_id;
                       obj.solution=this.state.problemObjectForEdit.solution;
                    }
                  });
                  this.setState({showEditProblemDialog:false, problemObj: this.state.problemObjectForEdit});
                  setProblems(problemsArrayCopy, dispatch);
                  hideSpinner(dispatch);
                  alert('problem updated');
              }
          });
      }//end of else

  }

  handleEditProblemDialogDismiss(){
    this.setState({showEditProblemDialog:false});
  }


  editProblemHandler(problemObj){
    this.setState({showEditProblemDialog:true, problemObjectForEdit:problemObj});
  }



  deleteProblemHandler(id){
      let dispatch=this.props.dispatch;
      let globalState=this.props.state;

      let b=window.confirm('Are you sure you want to delete');
      if(b===true){
          showSpinner(dispatch);
          console.log(id);
          var reqBody="id="+encodeURIComponent(id);
          fetch(`/api/deleteProblem`, {
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
                  let problemsArrayCopy=globalState.problemsArray.filter((obj)=>obj.id!==id);
                  setProblems(problemsArrayCopy, dispatch);
                  hideSpinner(dispatch);
                  alert('problem deleted');
                  window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/problemsBrowse");
              }
          })
      }//end of if b==true
  }

  showAnswerHandler(divId){
      if(document.getElementById(divId).style.display!=='block'){
      // document.getElementById(answerId).style.visibility='hidden';
        document.getElementById(divId).style.display='block';
      }
      else  if(document.getElementById(divId).style.display==='block'){
        document.getElementById(divId).style.display='none';
      }
  }

  render(){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;
    return (
      <div>
          <a className="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div className="h1">
            Problem Details
          </div>
          <div className="Panel">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
              <div className="row">
                  <div id="flexColLeft">
                    <b>Quizes: </b>
                    {this.state.problemObj.quizesArray!==undefined?
                      (
                        this.state.problemObj.quizesArray.map(quizObj=>(
                                        <a href={`https://${window.location.hostname}:${window.location.port}/quizShowSelected/${quizObj.id}`}>
                                          <div id={`quizDescription$,${quizObj.id}`}  className="Quiz" style={{marginLeft:'2em'}}>
                                          {quizObj.description}
                                          </div>
                                        </a>
                                                                        )
                        )
                      ):null
                    }
                    <br/><br/>
                    {(globalState.loggedInUser===this.state.problemObj.author_id||globalState.admin==="1")?
                    (<div>
                      <input type="button" className="LeftButton"
                      onClick={()=>this.deleteProblemHandler(this.state.problemObj.id)}
                      id={`delete${this.state.problemObj.id}`} value="Delete Problem"/><br/>
                    <input type="button" className="LeftButton"
                      onClick={()=>this.editProblemHandler(this.state.problemObj)}
                      id={`e${this.state.problemObj.id}`} value="Edit Problem"/></div>)
                    :null}
                  <br/>
                  <b>Author</b> : <label id={`authorId$,${this.state.problemObj.id}`}>{this.state.problemObj.author_id}</label>
                  <br/><br/>
                  <b>Type</b> : {this.state.problemObj.type==='d'?'Descriptive':'Multiple Choice'}
                  <br/><br/>
                  <b>Source: </b> <a target="_blank" href={this.state.problemObj.source!==null?"https://"+this.state.problemObj.source:null}>{this.state.problemObj.source}</a>
                  <br/><br/>
                    <div id={`par$,${this.state.problemObj.id}`} className="probParent">
                          <b>Problem Description:</b><br/>
                          <div id={`problemDescription$,${this.state.problemObj.id}`}
                          dangerouslySetInnerHTML={{__html: this.state.problemObj.description}}
                          className="Question"></div>
                          <br/><br/>
                          <b>Options:</b>
                          <br/> 1) <label id={`option1$,${this.state.problemObj.id}`}>{this.state.problemObj.option1}</label>
                          <br/> 2) <label id={`option2$,${this.state.problemObj.id}`}>{this.state.problemObj.option2}</label>
                          <br/> 3) <label id={`option3$,${this.state.problemObj.id}`}>{this.state.problemObj.option3}</label>
                          <br/> 4) <label id={`option4$,${this.state.problemObj.id}`}>{this.state.problemObj.option4}</label>
                          <br/><br/>
                          <input type="button" className="showAnswer" onClick={()=>this.showAnswerHandler(`d${this.state.problemObj.id}`)} id={`b${this.state.problemObj.id}`} value="view solution">
                          </input>
                          <br/>
                          <br/>
                          <div id={`d${this.state.problemObj.id}`} name={`d${this.state.problemObj.id}`} className="Answer"><b>Solution: </b>
                              <label id={`solution$,${this.state.problemObj.id}`}
                                dangerouslySetInnerHTML={{__html: this.state.problemObj.solution}}
                              ></label><br/>
                              Ans Key: <label id={`answerkey$,${this.state.problemObj.id}`}>{this.state.problemObj.answerkey}</label>
                          </div>
                    </div>{/*end of probParent div*/}
                  </div>
                  <div id="flexColRight">
                  </div>
             </div>
             <EditProblemDialog
                     objectForEdit={this.state.problemObjectForEdit}
                     show={this.state.showEditProblemDialog}
                     handleDismiss={this.handleEditProblemDialogDismiss}
                     handleSubmit={this.saveUpdateHandler}
                     problemTypeSelectChange={this.problemTypeSelectChange}
                     descriptionChange={this.descriptionChange}
                     solutionChange={this.solutionChange}
                     option1Change={this.option1Change}
                     option2Change={this.option2Change}
                     option3Change={this.option3Change}
                     option4Change={this.option4Change}
                     answerkeyChange={this.answerkeyChange}
                     removeQuizFromQuizesArray={this.removeQuizFromQuizesArray}
                     addQuizToQuizesArraySubmit={this.addQuizToQuizesArraySubmit}
                     state={this.props.state}
                     />
          </div>
      </div>
    )
  }

}


export default ProblemShowSelected;
