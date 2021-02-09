import React from 'react';
import '../css/Browse.css';
import data from './data';
import {nvl} from '../utils/utils';
import {loadUsers} from '../stores/appStoreActions';

class UsersSearch extends React.Component{

  componentDidMount(){
    //this.props.loadUsers();
    let dispatch=this.props.dispatch;
    loadUsers(dispatch);
  }

  constructor(props){
    super(props);
    this.state={
      searchKey:'',
      searchResults:[],
      userObjectsFiltered:[],
      icons: data.icons
    }
    this.searchKeyChange=this.searchKeyChange.bind(this);
    //this.handleSearchSubmit=this.handleSearchSubmit.bind(this);
    this.checkStatic=this.checkStatic.bind(this);
  }

  async checkStatic(currentValue){
    if(currentValue===this.state.searchKey&&currentValue!==''){
      //console.log('static value'+currentValue);
      var reqBody="searchKey="+encodeURIComponent(this.state.searchKey);
      let searchResults=await fetch(`/api/searchUsers`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      //console.log(searchJson);
      let searchResultsFiltered=searchJson.filter((val)=>{return this.state.userObjectsFiltered.every((val1)=>val.id!==val1.id)});
      this.setState({'searchResults':searchResultsFiltered});
    }
    else if(currentValue===''){
      this.setState({userObjectsFiltered:[], searchResults:[]});
    }
  }


  searchKeyChange(e){
    let globalState=this.props.state;
    const strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStatic(strSearchKey);}, 1000);
    const userObjectsFiltered=strSearchKey!==''?globalState.usersArray.filter((val)=>(nvl(val.first_name).toUpperCase()+nvl(val.last_name).toUpperCase()+nvl(val.address1).toUpperCase()+nvl(val.address2).toUpperCase()+nvl(val.city).toUpperCase()+nvl(val.zip).toUpperCase()+nvl(val.phone).toUpperCase()+nvl(val.mobile).toUpperCase()+nvl(val.email).toUpperCase()).includes(strSearchKey.toUpperCase())):[];
    //console.log(problemObjectsFiltered);
    this.setState({searchKey: strSearchKey, userObjectsFiltered: userObjectsFiltered});
  }

  /*async handleSearchSubmit(e){
    if(this.state.searchKey===''){
      alert('Search key is empty/invalid')
    }
    else{
      this.props.showSpinner();
      var reqBody="searchKey="+encodeURIComponent(this.state.searchKey);
      let searchResults=await fetch(`/api/searchUsers`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      //console.log(searchJson);
      this.setState({'searchResults':searchJson});
      this.props.hideSpinner();
    }
  }*/

  render(){
    let augmentedSearchResults=[];
    this.state.userObjectsFiltered.forEach((item, i) => {
      let itemCopy=Object.assign({},item);
      let first_name=item.first_name;
      if(first_name!==null&&first_name.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=first_name.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.first_name=first_name.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+first_name.substring(foundIndex+this.state.searchKey.length);
      }
      let last_name=item.last_name;
      if(last_name!==null&&last_name.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=last_name.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.last_name=last_name.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+last_name.substring(foundIndex+this.state.searchKey.length);
      }
      let address1=item.address1;
      if(address1!==null&&address1.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=address1.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.address1=address1.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+address1.substring(foundIndex+this.state.searchKey.length);
      }
      let address2=item.address2;
      if(address2!==null&&address2.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=address2.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.address2=address2.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+address2.substring(foundIndex+this.state.searchKey.length);
      }
      let city=item.city;
      if(city!==null&&city.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=city.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.city=city.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+city.substring(foundIndex+this.state.searchKey.length);
      }
      let zip=item.zip;
      if(zip!==null&&zip.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=zip.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.zip=zip.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+zip.substring(foundIndex+this.state.searchKey.length);
      }
      let phone=item.phone;
      if(phone!==null&&phone.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=phone.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.phone=phone.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+phone.substring(foundIndex+this.state.searchKey.length);
      }
      let mobile=item.mobile;
      if(mobile!==null&&mobile.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=mobile.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.mobile=mobile.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+mobile.substring(foundIndex+this.state.searchKey.length);
      }
      let email=item.email;
      if(email!==null&&email.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=email.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.email=email.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+email.substring(foundIndex+this.state.searchKey.length);
      }
      augmentedSearchResults.push(itemCopy);
    });
    augmentedSearchResults=augmentedSearchResults.concat(this.state.searchResults);

    return (
      <div>
      <a class="HomeLink" href="/">
          <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
      {/*back to home*/}
      </a>
          <div class="h1">
            Search Users
          </div>
          <div style={{textAlign: 'center'}}>
                <input type="text" id="searchKey" style={{width:'50%'}}
                onChange={this.searchKeyChange} placeholder="type your search key here"
                value={this.state.searchKey}></input>
                 {/*<input type="button" value="Search" onClick={this.handleSearchSubmit}/>*/}
           </div>
           <br/><br/>
           {
            augmentedSearchResults.map(obj=>(
             <>
             <hr />
             <div id={`par$,${obj.id}`} className="probParent">
                 <b>User Name: </b>
                 <a href={`./userShowSelected/${obj.id}`}>
                  <label
                    dangerouslySetInnerHTML={{__html: obj.first_name+' '+obj.last_name}}
                  ></label>
                 </a>
                 <br/>
                 <b>Address: </b>
                 <a href={`./userShowSelected/${obj.id}`}>
                 <label
                   dangerouslySetInnerHTML={{__html: obj.address1+' '+obj.address2+ ' '+obj.city+' '+
                    obj.zip}}
                 ></label>
                 </a>
                  <br/>
                 {/*<b>Source: </b> <a target="_blank" href={obj.source!==null?"https://"+obj.source:null}>{obj.source}</a>
                 <br/>*/}
                 <b>Phone/Mobile: </b>
                 <a href={`https://${window.location.hostname}:${window.location.port}/userShowSelected/${obj.author_id}`}>
                   <label
                     dangerouslySetInnerHTML={{__html: obj.phone+'/'+obj.mobile}}
                   ></label>
                 </a>
                 <br/>
                 <b>Email: </b>
                 <a href={`https://${window.location.hostname}:${window.location.port}/userShowSelected/${obj.author_id}`}>
                   <label
                     dangerouslySetInnerHTML={{__html: obj.email}}
                   ></label>
                 </a>
               </div>
               </>
               )
             )
           }
      </div>
    )
  }

}

export default UsersSearch;
