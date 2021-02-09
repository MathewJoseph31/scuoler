import React from 'react';
import data from './data';
import {loadQuizes, nextQuizesPageClick,
        prevQuizesPageClick, setQuizesPage} from '../stores/appStoreActions';
import {getPageArray} from '../utils/utils';

class QuizesBrowse extends React.Component{
  constructor(props){
    super(props);
    this.state={
      icons: data.icons
    }
  }

  componentDidMount(){
    let dispatch=this.props.dispatch;
    loadQuizes(dispatch);
  }

  render(){
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    let pageArray=getPageArray(globalState.currentQuizesPage, globalState.quizesArray===undefined||globalState.quizesArray.length<globalState.pageSize);
    return (
      <div>
          <a class="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div class="h1">
            Browse Quizes
          </div>
          <br/>
          <div className="pagination">
           <a href="#" onClick={(e)=>{prevQuizesPageClick(e, globalState, dispatch)}}>&laquo;</a>
            {
              pageArray.map(val=><a onClick={(e)=>{setQuizesPage(val, dispatch)}} className={val===globalState.currentQuizesPage?"active":""} href="#">{val}</a>)
            }
           <a href="#" onClick={(e)=>nextQuizesPageClick(e, globalState, dispatch)}>&raquo;</a>
          </div>
          <br/><br/>
          <div  className='Browse'>
               <table className="displayTable" style={{width:"100%"}}>
                 <tr>
                   <th>Quiz</th><th>Duration(mins)</th><th>Type</th><th>Instructor</th><th>Results</th>
                 </tr>
                 {
                   globalState.quizesArray.map(obj=>(
                     <tr>
                       <td><a href={`./quizShowSelected/${obj.id}`}>{obj.description}</a></td>
                       <td>{obj.duration_minutes}</td>
                       <td>{obj.type==='d'?'Descriptive':'Multiple Choice'}</td>
                       <td>{obj.author_id}</td>
                       <td>
                         {(this.props.loggedInUser===obj.author_id||this.props.admin==="1")?
                            (<input type="button" className="LeftButton"
                             onClick={()=>window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/quizInstances/"+obj.id)}
                             id={`r${obj.id}`} value="Quiz Results"/>):null}
                       </td>
                     </tr>
                     )
                   )
                 }
               </table>
         </div>
         <div className="pagination">
          <a href="#" onClick={(e)=>{prevQuizesPageClick(e, globalState, dispatch)}}>&laquo;</a>
           {
             pageArray.map(val=><a onClick={(e)=>{setQuizesPage(val, dispatch)}} className={val===globalState.currentQuizesPage?"active":""} href="#">{val}</a>)
           }
          <a href="#" onClick={(e)=>nextQuizesPageClick(e, globalState, dispatch)}>&raquo;</a>
         </div>
     </div>
    )
  }

}

export default QuizesBrowse;
