import React from 'react';

class QuizInstanceProblemsDialog extends React.Component{

  constructor(props){
    super(props);
    this.getJsxForDescriptive=this.getJsxForDescriptive.bind(this);
    this.getJsxForMultiple=this.getJsxForMultiple.bind(this);
  }

  getJsxForDescriptive(){
    let totalMarksAwarded=0;
    return (
            <>
            {
            this.props.quizInstanceProblemsArray.map((obj, index, arr)=>{
              totalMarksAwarded+=parseInt(obj.marks_awarded);
              return (
                    <div>
                        <div id={`par$,${obj.id}`} className="probParent">
                            <b>Problem Description: </b>
                            <div id={`problemDescription$,${obj.id}`}
                            dangerouslySetInnerHTML={{__html: obj.problem_description}}
                            className="Question"></div>
                            <br/><br/>
                            <b>Correct Solution: </b>
                            <div id={`answerDescription$,${obj.id}`}
                            dangerouslySetInnerHTML={{__html: obj.problem_solution}}
                            className="Question"></div>
                            <br/><br/>
                            <b>User Solution: </b>
                            <div id={`answerDescriptionUser$,${obj.id}`}
                            dangerouslySetInnerHTML={{__html: obj.user_solution}}
                            className="Question"></div>
                            <br/>
                            <b>User</b>: {obj.user_id}<br/>
                            <b>Maximum Marks</b>:{obj.maxmarks}<br/>
                            <b>Marks Awarded</b>:
                            {this.props.allowEdit?(<input type="text" style={{width:'40px'}} value={obj.marks_awarded}
                                                    onChange={(e)=>this.props.marksAwardedChanged(e, obj)}>
                                                   </input>):obj.marks_awarded
                             }
                            <br/><br/>
                          </div>
                      <hr/>
                    </div>
              )
            }
            )
          }
          <h2>Total</h2>
          <b>Max Marks</b>:{this.props.quizInstance.maxmarks} <br/>
          <b> Marks Awarded</b>: {totalMarksAwarded.toString()}
          </>
    )
  }

  getJsxForMultiple(){
          return (
                 <>
                 {
                  this.props.quizInstanceProblemsArray.map(obj=>(
                    <>
                       <br/>
                        <div id={`par$,${obj.id}`} className="probParent">
                            <b>Problem Description: </b>
                            <div id={`problemDescription$,${obj.id}`}
                            dangerouslySetInnerHTML={{__html: obj.problem_description}}
                            className="Question"></div>
                            <br/><br/>
                            <b>Correct Solution: </b>
                            <div id={`answerDescription$,${obj.id}`}
                            dangerouslySetInnerHTML={{__html: obj.problem_solution}}
                            className="Question"></div>
                            <br/><br/>
                            <b>Options</b><br/>
                            <input type="radio" id={`${obj.id}$option1`}
                            checked={obj.marked_answerkey==="1"} readonly
                             name={`${obj.id}$option1`} value="1" ></input>
                            <span  dangerouslySetInnerHTML={{__html: obj.option1}}/><br/>
                            <input type="radio" id={`${obj.id}$option2`}
                            checked={obj.marked_answerkey==="2"} readonly
                             name={`${obj.id}$option2`} value="2"></input>
                            <span  dangerouslySetInnerHTML={{__html: obj.option2}}/><br/>
                            <input type="radio" id={`${obj.id}$option3`}
                              checked={obj.marked_answerkey==="3"} readonly
                             name={`${obj.id}$option3`} value="3"></input>
                            <span  dangerouslySetInnerHTML={{__html: obj.option3}}/><br/>
                            <input type="radio" id={`${obj.id}$option4`}
                              checked={obj.marked_answerkey==="4"} readonly
                             name={`${obj.id}$option4`} value="4"></input>
                            <span  dangerouslySetInnerHTML={{__html: obj.option4}}/><br/>
                            <br/>
                            <b>Answer Key</b>:{obj.answerkey}<br/>
                            <b>Maximum Marks</b>:{obj.maxmarks}<br/>
                            {/*<b>Marks Awarded</b>:{obj.marked_answerkey===obj.answerkey?obj.maxmarks:0}<br/>*/}
                            <b>Marks Scored</b>:{obj.marks_scored}<br/>
                            <br/>
                          </div>
                    </>
                    )
                  )
            }
            <h2>Total:</h2>
            <b>Max Marks</b>: {this.props.quizInstance.maxmarks} <br/>
            <b>Marks Scored</b>: {this.props.quizInstance.marks_scored}
           </>
        )
  }


  render(){
    //if(this.props.quizInstanceProblemsArray!==undefined&&this.props.quizInstanceProblemsArray.length>0)
    //  console.log(this.props.quizInstanceProblemsArray);
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    :"simple-dialog-overlay simple-dialog-display-none";

    //if(this.props.quizInstance!==null)
      //console.log(this.props.quizInstance);

    return (
      <div className={visibilityClassName}>
         <div className="simple-dialog">
               <button id = "x" onClick={this.props.handleDismiss}>
                X
               </button>
               <h2>Quiz Instance Problems</h2>
               <hr class="rounded"/>
                  {
                    this.props.quizInstance.quiz_type==="d"?this.getJsxForDescriptive():this.getJsxForMultiple()
                  }
                  <br/><br/>
                  {this.props.quizInstance.quiz_type==="d"&&this.props.allowEdit?(<input type="button" id="x" onClick={this.props.handleSave} value="Save" style={{width:'100px', float: "right"}}/>):null}
                  <br/><br/>
                  <button id="x" style={{width:'100px'}}
                   onClick={this.props.handleDismiss}
                  >close
                  </button>
         </div>
      </div>
    )
  }
}

export default QuizInstanceProblemsDialog;
