import React from 'react';
import data from './data';
import '../css/Browse.css';
import {loadUsers, nextUsersPageClick,
        prevUsersPageClick, setUsersPage} from '../stores/appStoreActions';
import {getPageArray} from '../utils/utils';

class UsersBrowse extends React.Component{
  componentDidMount(){
    //this.props.loadUsers();
    let dispatch=this.props.dispatch;
    loadUsers(dispatch);
  }

  constructor(props){
    super(props);
    this.state={
      avatar: data.avatar,
      icons: data.icons
    }
  }


  render(){
    let globalState=this.props.state;
    let dispatch=this.props.dispatch;
    let pageArray=getPageArray(globalState.currentUsersPage, globalState.usersArray===undefined||globalState.usersArray.length<globalState.pageSize);
    return (
      <div>
          <a class="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div className="h1">
            Browse Users
          </div>
          <br/>
          <div className="pagination">
           <a href="#" onClick={(e)=>{prevUsersPageClick(e, globalState, dispatch)}}>&laquo;</a>
            {
              pageArray.map(val=><a onClick={(e)=>{setUsersPage(val, dispatch)}} className={val===globalState.currentUsersPage?"active":""} href="#">{val}</a>)
            }
           <a href="#" onClick={(e)=>nextUsersPageClick(e, globalState, dispatch)}>&raquo;</a>
          </div>
          <br/><br/>
          <div  className='Browse'>
          <table className="displayTable">
           <tr>
             <th style={{width:'20em'}}>image</th><th>user name</th><th>full name</th><th>city</th><th>zip</th><th>email</th>
           </tr>
             {
               globalState.usersArray.map(obj=>(
                 <tr>
                   <td style={{width:'20em'}}>
                   <a href={`./userShowSelected/${obj.id}`}>
                   <div className="profileCard">
                      <img src={obj.profile_image_url!=null?obj.profile_image_url:(obj.sex_male?this.state.avatar.male:this.state.avatar.female)} style={{width:'150%'}} alt="Avatar"/>
                   </div>
                   </a>
                   </td>
                   <td><a href={`./userShowSelected/${obj.id}`}>{obj.id}</a></td>
                   <td><a href={`./userShowSelected/${obj.id}`}>{obj.first_name+' '+obj.last_name}</a></td>
                   <td>{obj.city}</td>
                   <td>{obj.zip}</td>
                   <td>{obj.email}</td>
                 </tr>
                 )
               )
             }

         </table>
         </div>
         <div className="pagination">
          <a href="#" onClick={(e)=>{prevUsersPageClick(e, globalState, dispatch)}}>&laquo;</a>
           {
             pageArray.map(val=><a onClick={(e)=>{setUsersPage(val, dispatch)}} className={val===globalState.currentUsersPage?"active":""} href="#">{val}</a>)
           }
          <a href="#" onClick={(e)=>nextUsersPageClick(e, globalState, dispatch)}>&raquo;</a>
         </div>
     </div>
    )
  }


}

export default UsersBrowse;
