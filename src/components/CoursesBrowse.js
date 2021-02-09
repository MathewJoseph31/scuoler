
import React from 'react';
import data from './data';
import {loadCourses, nextCoursesPageClick,
        prevCoursesPageClick, setCoursesPage} from '../stores/appStoreActions';
import {getPageArray} from '../utils/utils';

class CoursesBrowse extends React.Component{

  constructor(props){
    super(props);
    this.state={
      icons: data.icons
    }
  }

  componentDidMount(){
    //this.props.loadCourses();
    let dispatch=this.props.dispatch;
    loadCourses(dispatch);
  }

  render(){
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    let pageArray=getPageArray(globalState.currentCoursesPage, globalState.coursesArray===undefined||globalState.coursesArray.length<globalState.pageSize);
    return (
      <div>
          <a class="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div class="h1">
            Browse Courses
          </div>
          <br/>
          <div className="pagination">
           <a href="#" onClick={(e)=>{prevCoursesPageClick(e, globalState, dispatch)}}>&laquo;</a>
            {
              pageArray.map(val=><a onClick={(e)=>{setCoursesPage(val, dispatch)}} className={val===globalState.currentCoursesPage?"active":""} href="#">{val}</a>)
            }
           <a href="#" onClick={(e)=>nextCoursesPageClick(e, globalState, dispatch)}>&raquo;</a>
          </div>
          <br/><br/>
         <table className="displayTable" style={{width:"100%"}}>
           <tr>
              <th>Course name</th><th>Description</th><th>Owner</th>
           </tr>
           {
             globalState.coursesArray.map(obj=>(
               <tr>
                 <td><a href={`./courseShowSelected/${obj.id}`}>{obj.name}</a></td>
                 <td>{obj.description}</td>
                 <td>{obj.author_id}</td>
               </tr>
               )
             )
           }
         </table>
         <div className="pagination">
          <a href="#" onClick={(e)=>{prevCoursesPageClick(e, globalState, dispatch)}}>&laquo;</a>
           {
             pageArray.map(val=><a onClick={(e)=>{setCoursesPage(val, dispatch)}} className={val===globalState.currentCoursesPage?"active":""} href="#">{val}</a>)
           }
          <a href="#" onClick={(e)=>nextCoursesPageClick(e, globalState, dispatch)}>&raquo;</a>
         </div>
     </div>

    )
  }

}

export default CoursesBrowse;
