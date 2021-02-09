import React from 'react';

class QuizResultsDialog extends React.Component{

  constructor(props){
    super(props);
    this.state={
      quizResultsArray:[]
    }
  }

/*  async componentDidMount(){

    var reqBody="quizId="+encodeURIComponent(this.props.quizId);
    let res=await fetch(`http://localhost:5000/api/quizGetScores`, {
                   headers:{
                     'Accept':'application/json',
                     'Content-type': 'application/x-www-form-urlencoded'
                   },
                   method: 'POST',
                   body: reqBody
                 });

   const data=await res.json();
   console.log(data);
   this.setState({quizResultsArray:data});
 }*/

  render(){
    if(this.props.quizResultsArray!==undefined&&this.props.quizResultsArray.length>0)
      console.log(this.props.quizResultsArray);
    //console.log(this.props.objectForEdit);
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    :"simple-dialog-overlay simple-dialog-display-none";

    return (
      <div className={visibilityClassName}>
         <div className="simple-dialog">
               <button id = "x" onClick={this.props.handleDismiss}>
                X
               </button>
               <h2>Quiz Results</h2>
               <hr class="rounded"/>
               <div  className='Browse'>
                    <table className="displayTable" style={{width:"100%"}}>
                      <tr>
                        <th>Marks Scored</th><th>User</th><th>Start Timestamp</th>
                      </tr>
                      {
                        this.props.quizResultsArray.map(obj=>(
                          <tr>
                            <td>{obj.marks_scored}/{obj.maxmarks}</td>
                            <td>{obj.user_id}</td>
                            <td>{obj.start_timestamp}</td>
                          </tr>
                          )
                        )
                      }
                    </table>
              </div>
         </div>
      </div>
    )
  }
}

export default QuizResultsDialog;
