import React from 'react';
import '../css/Browse.css';
import data from './data';
import {nvl} from '../utils/utils';
import {loadCourses} from '../stores/appStoreActions';

class CoursesSearch extends React.Component{

  componentDidMount(){
    //this.props.loadCourses();
    let dispatch=this.props.dispatch;
    loadCourses(dispatch);
  }

  constructor(props){
    super(props);
    this.state={
      searchKey:'',
      searchResults:[],
      courseObjectsFiltered:[],
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
      let searchResults=await fetch(`/api/searchCourses`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      //console.log(searchJson);
      let searchResultsFiltered=searchJson.filter((val)=>{return this.state.courseObjectsFiltered.every((val1)=>val.id!==val1.id)});
      this.setState({'searchResults':searchResultsFiltered});
    }
    else if(currentValue===''){
      this.setState({courseObjectsFiltered:[], searchResults:[]});
    }
  }

  searchKeyChange(e){
    let globalState=this.props.state;
    const strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStatic(strSearchKey);}, 1000);
    const courseObjectsFiltered=strSearchKey!==''?globalState.coursesArray.filter((val)=>(nvl(val.description).toUpperCase()+nvl(val.name).toUpperCase()).includes(strSearchKey.toUpperCase())):[];
    //console.log(problemObjectsFiltered);
    this.setState({searchKey: strSearchKey, courseObjectsFiltered: courseObjectsFiltered});
  }

  /*async handleSearchSubmit(e){
    if(this.state.searchKey===''){
      alert('Search key is empty/invalid')
    }
    else{
      this.props.showSpinner();
      var reqBody="searchKey="+encodeURIComponent(this.state.searchKey);
      let searchResults=await fetch(`/api/searchCourses`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      console.log(searchJson);
      this.setState({'searchResults':searchJson});
      this.props.hideSpinner();
    }
  }*/

  render(){
    let augmentedSearchResults=[];
    this.state.courseObjectsFiltered.forEach((item, i) => {
      let itemCopy=Object.assign({},item);
      let desc=item.description;
      if(desc!==null&&desc.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=desc.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.description=desc.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+desc.substring(foundIndex+this.state.searchKey.length);
      }
      let name=item.name;
      if(name!==null&&name.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=name.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.name=name.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+name.substring(foundIndex+this.state.searchKey.length);
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
            Search Courses
          </div>
          <div style={{textAlign: 'center'}}>
                <input type="text" id="searchKey" style={{width:'50%'}}
                  onChange={this.searchKeyChange}
                  placeholder="type your search key here"
                  value={this.state.searchKey}></input>
                 {/*<input type="button" value="Search" onClick={this.handleSearchSubmit}/>*/}
           </div>
           <br/><br/>
           {
            augmentedSearchResults.map(obj=>(
             <>
             <hr />
             <div id={`par$,${obj.id}`} className="probParent">
                 <b>Course Name: </b>
                 <a href={`./courseShowSelected/${obj.id}`}>
                     <div id={`courseDescription$,${obj.id}`}
                     dangerouslySetInnerHTML={{__html: obj.name}}
                     className="Question"></div>
                 </a>
                 <br/>
                 <b>Course Description: </b>
                 <a href={`./courseShowSelected/${obj.id}`}>
                     <div id={`solution$,${obj.id}`}
                     dangerouslySetInnerHTML={{__html: obj.description}}
                     className="Question"></div>
                 </a>
                  <br/>
                 {/*<b>Source: </b> <a target="_blank" href={obj.source!==null?"https://"+obj.source:null}>{obj.source}</a>
                 <br/>*/}
                 <b>Author: </b>
                 <a href={`https://${window.location.hostname}:${window.location.port}/userShowSelected/${obj.author_id}`}>
                   <div id={`author$,${obj.id}`} style={{marginLeft:'30px'}} className="Quiz">
                   {obj.author_id}
                   </div>
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

export default CoursesSearch;
