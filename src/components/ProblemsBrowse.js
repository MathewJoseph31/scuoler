import React from 'react';
import '../css/Browse.css';
import data from './data';
import {loadProblems, loadQuizes, nextProblemsPageClick,
        prevProblemsPageClick, setProblemsPage} from '../stores/appStoreActions';
import {getPageArray} from '../utils/utils';

class ProblemsBrowse extends React.Component{

  componentDidMount(){
    let dispatch=this.props.dispatch;
    loadProblems(dispatch);
    loadQuizes(dispatch);
  }


  constructor(props){
    super(props);
    this.state={
      icons: data.icons
    }
  }


  render(){
    let globalState=this.props.state;
    let localState=this.state;
    let dispatch=this.props.dispatch;
    let pageArray=getPageArray(globalState.currentProblemsPage, globalState.problemsArray===undefined||globalState.problemsArray.length<globalState.pageSize);
    return (
      <div>
      <a class="HomeLink" href="/">
          <img class="homeIcon" src={localState.icons.home} alt="back to home"/>
      {/*back to home*/}
      </a>
          <div class="h1">
            Browse Problems
          </div>
          <div className="pagination">
           <a href="#" onClick={(e)=>{prevProblemsPageClick(e, globalState, dispatch)}}>&laquo;</a>
            {
              pageArray.map(val=><a onClick={(e)=>{setProblemsPage(val, dispatch)}} className={val===globalState.currentProblemsPage?"active":""} href="#">{val}</a>)
            }
           <a href="#" onClick={(e)=>nextProblemsPageClick(e, globalState, dispatch)}>&raquo;</a>
          </div>
          <br/><br/>
          {
           globalState.problemsArray.map(obj=>(
            <>
            <hr />
            <div id={`par$,${obj.id}`} className="probParent">
                <b>Problem Description: </b>
                <a href={`./problemShowSelected/${obj.id}`}>
                    <div id={`problemDescription$,${obj.id}`}
                    dangerouslySetInnerHTML={{__html: obj.description}}
                    className="Question"></div>
                </a>
                <br/>
                <b>Source: </b> <a target="_blank" href={obj.source!==null?"https://"+obj.source:null}>{obj.source}</a>
                <br/>
                <b>Author: </b>
                <a href={`https://${window.location.hostname}:${window.location.port}/userShowSelected/${obj.author_id}`}>
                  <div id={`author$,${obj.id}`} style={{marginLeft:'30px'}} className="Quiz">
                  {obj.author_id}
                  </div>
                </a>
                <input type="hidden" id={`quizId$,'${obj.id}`} value={obj.quiz_id}/>
              </div>
              </>
              )
            )
          }
          <hr />
          <div className="pagination">
           <a href="#" onClick={(e)=>{prevProblemsPageClick(e, globalState, dispatch)}}>&laquo;</a>
            {
              pageArray.map(val=><a onClick={(e)=>{setProblemsPage(val, dispatch)}} className={val===globalState.currentProblemsPage?"active":""} href="#">{val}</a>)
            }
           <a href="#" onClick={(e)=>nextProblemsPageClick(e, globalState, dispatch)}>&raquo;</a>
          </div>
     </div>
    )
  }

}

export default ProblemsBrowse;
