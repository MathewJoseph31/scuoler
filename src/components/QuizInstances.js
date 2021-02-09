import React from 'react';
import data from './data';
import {  Redirect } from 'react-router-dom';
import QuizInstanceProblemsDialog from './QuizInstanceProblemsDialog';
import {showSpinner, hideSpinner} from '../stores/appStoreActions';

class QuizInstances extends React.Component{
  constructor(props){
    super(props);
    this.state={
      quizObj:{},
      quizInstancesArray:[],
      quizInstanceObjectSelected:{},
      quizInstanceProblemsArray:[],
      quizInstanceProblemsArrayForEdit:[],
      showInstanceProblemsDialog:false,
      icons: data.icons
    }
    this.handleQuizInstanceProblemsDialogDismiss=this.handleQuizInstanceProblemsDialogDismiss.bind(this);
    this.showQuizInstanceProblemsHandler=this.showQuizInstanceProblemsHandler.bind(this);
    this.marksAwardedChanged=this.marksAwardedChanged.bind(this);
    this.handleQuizInstanceProblemsSave=this.handleQuizInstanceProblemsSave.bind(this);
  }

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

    let promise2=fetch(`/api/quizGetScores`, {
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
          //console.log(jsons[0]);
           this.setState({
              quizObj: jsons[0],
              quizInstancesArray:jsons[1]
           });
           hideSpinner(dispatch);
      })
    });


  }

  handleQuizInstanceProblemsDialogDismiss(e){
     this.setState({showQuizInstanceProblemsDialog:false});
  }


  showQuizInstanceProblemsHandler(e, obj){
    //alert(obj.quiz_instance_id);
    var reqBody="quizInstanceId="+encodeURIComponent(obj.quiz_instance_id);

    fetch(`/api/getQuizInstanceProblems`, {
      headers:{
        'Accept':'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: reqBody
    })
    .then(res=>res.json())
    .then(data=>{
        this.setState({quizInstanceProblemsArray:data, quizInstanceProblemsArrayForEdit: data, quizInstanceObjectSelected:obj, showQuizInstanceProblemsDialog:true});
     });

  }



  marksAwardedChanged(e, obj){
    let quizInstanceProblemsArray=[];
    this.state.quizInstanceProblemsArrayForEdit.forEach(val=>{
      if(val.problem_id!==obj.problem_id)
          quizInstanceProblemsArray.push(val);
      else{
        let newObj=Object.assign({}, val);
        newObj.marks_awarded=e.target.value;
        quizInstanceProblemsArray.push(newObj);
        //console.log(newObj);
      }
    })
    this.setState({quizInstanceProblemsArrayForEdit:quizInstanceProblemsArray});

  }

  handleQuizInstanceProblemsSave(e){
        let dispatch=this.props.dispatch;
        let valid=true;
        let arrObj=[];
        let sum_marks_awarded=0;
        this.state.quizInstanceProblemsArrayForEdit.forEach((item, i) => {
          if(isNaN(item.marks_awarded)||item.marks_awarded<0||item.marks_awarded>item.maxmarks)
            valid=false;
          let obj={};
          obj.problem_id=item.problem_id;
          obj.marks_awarded=item.marks_awarded;
          sum_marks_awarded+=parseInt(item.marks_awarded);
          arrObj.push(obj);
        });
        if(!valid)
        {
            alert('Invalid value for marks awarded should be a number between 0 and maxmarks');
        }
        else
        {
            //console.log(this.state.quizInstanceObjectSelected);
            //console.log(arrObj);
            showSpinner(dispatch);
            var reqBody="quizInstanceId="+encodeURIComponent(this.state.quizInstanceObjectSelected.quiz_instance_id);
            reqBody+='&marksAwardedArray='+encodeURIComponent(JSON.stringify(arrObj));

            fetch(`/api/updateQuizMarksAwarded`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            })
            .then(res=>res.json())
            .then(data=>{
               let resultObj=JSON.parse(data);
                if(resultObj.updatestatus==="ok"){
                    //console.log(data);
                    let quizInstancesArrayCopy=JSON.parse(JSON.stringify(this.state.quizInstancesArray));
                     quizInstancesArrayCopy.forEach((obj)=>{
                      if(obj.quiz_instance_id===this.state.quizInstanceObjectSelected.quiz_instance_id){
                         obj.marks_scored=sum_marks_awarded;
                      }
                    });
                    this.setState({quizInstanceProblemsArray:this.state.quizInstanceProblemsArrayForEdit, showQuizInstanceProblemsDialog: false, quizInstancesArray: quizInstancesArrayCopy});
                }
                hideSpinner(dispatch);
            })
        }

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
            Quiz Instances Details
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
                 <br/><br/>
                 <b> Quiz Type:</b> {this.state.quizObj.type==="d"?"Descriptive": "Multiple Choice"}
                 <br/><br/>
                <b> Instructor:</b> {this.state.quizObj.instructorId}
          </div>
          <div class="h2">
            Quiz Results
          </div>
          <div  className='Browse'>
               <table className="displayTable" style={{width:"100%"}}>
                 <tr>
                   <th>Marks Scored</th><th>User</th>
                   {/*<th>Start Time</th>*/}
                   <th>Timestamp</th><th>Evaluate</th>
                 </tr>
                 {
                   this.state.quizInstancesArray.map(obj=>(
                     <tr>
                       <td>{obj.marks_scored}/{obj.maxmarks}</td>
                       <td>{obj.user_id}</td>
                       {/*<td>{obj.start_timestamp}</td>*/}
                       <td>{obj.end_timestamp}</td>
                       <td><input type="button" className="LeftButton" value="show problems" onClick={(e)=>this.showQuizInstanceProblemsHandler(e, obj)}/></td>
                     </tr>
                     )
                   )
                 }
               </table>
         </div>
         <QuizInstanceProblemsDialog
                 quizInstance={this.state.quizInstanceObjectSelected}
                 quizInstanceProblemsArray={this.state.quizInstanceProblemsArrayForEdit}
                 marksAwardedChanged={this.marksAwardedChanged}
                 show={this.state.showQuizInstanceProblemsDialog}
                 handleDismiss={this.handleQuizInstanceProblemsDialogDismiss}
                 handleSave={this.handleQuizInstanceProblemsSave}
                 allowEdit={true}
          />
      </div>
    )
  }


}

export default QuizInstances;
