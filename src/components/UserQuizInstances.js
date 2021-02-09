import React from 'react';
import data from './data';
import {  Redirect } from 'react-router-dom';
import QuizInstanceProblemsDialog from './QuizInstanceProblemsDialog';
import {showSpinner, hideSpinner} from '../stores/appStoreActions';


class UserQuizInstances extends React.Component{
  constructor(props){
    super(props);
    this.state={
      quizInstancesArray:[],
      quizInstanceObjectSelected:{},
      quizInstanceProblemsArray:[],
      showInstanceProblemsDialog:false,
      icons: data.icons
    }
    this.handleQuizInstanceProblemsDialogDismiss=this.handleQuizInstanceProblemsDialogDismiss.bind(this);
    this.showQuizInstanceProblemsHandler=this.showQuizInstanceProblemsHandler.bind(this);
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
        this.setState({quizInstanceProblemsArray:data, quizInstanceObjectSelected:obj, showQuizInstanceProblemsDialog:true});
     });
  }

    async componentDidMount(){
      let dispatch=this.props.dispatch;
      let globalState=this.props.state;
      showSpinner(dispatch);

      var reqBody="userId="+encodeURIComponent(globalState.loggedInUser);

      let res=await fetch(`/api/quizGetScoresForUser`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      });

      let resJson=await res.json();
      console.log(resJson);

      this.setState({
         quizInstancesArray:resJson
      });
      hideSpinner(dispatch);
    }

    render(){
      let globalState=this.props.state;
      return (
        <div>
            <a class="HomeLink" href="/">
                <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
            {/*back to home*/}
            </a>
            <div class="h1">
              Quiz Results for User {globalState.loggedInUser}
            </div>
            <div  className='Browse'>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <br/>
                 <table className="displayTable" style={{width:"100%"}}>
                   <tr>
                     <th>Quiz</th>
                     <th>Marks Scored</th>
                     <th>Author</th>
                     {/*<th>Start Time</th>*/}
                    <th>Evaluate</th>
                     <th>Timestamp</th>
                   </tr>
                   {
                     this.state.quizInstancesArray.map(obj=>(
                       <tr>
                         <td>{obj.description}</td>
                         <td>{obj.marks_scored}/{obj.maxmarks}</td>
                         <td>{obj.author_id}</td>
                         {/*<td>{obj.start_timestamp}</td>*/}
                         <td><input type="button" className="LeftButton" value="show problems" onClick={(e)=>this.showQuizInstanceProblemsHandler(e, obj)}/></td>
                         <td>{obj.end_timestamp}</td>
                       </tr>
                       )
                     )
                   }
                 </table>
           </div>
           <QuizInstanceProblemsDialog
                   quizInstance={this.state.quizInstanceObjectSelected}
                   quizInstanceProblemsArray={this.state.quizInstanceProblemsArray}
                   show={this.state.showQuizInstanceProblemsDialog}
                   handleDismiss={this.handleQuizInstanceProblemsDialogDismiss}
                   allowEdit={false}
            />
        </div>
      )
    }
}

export default UserQuizInstances;
