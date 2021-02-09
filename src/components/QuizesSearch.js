import React from 'react';
import '../css/Browse.css';
import data from './data';
import {loadQuizes} from '../stores/appStoreActions';

class QuizesSearch extends React.Component{

  componentDidMount(){
    //this.props.loadQuizes();
      let dispatch=this.props.dispatch;
      loadQuizes(dispatch);
  }

  constructor(props){
    super(props);
    this.state={
      searchKey:'',
      searchResults:[],
      quizObjectsFiltered:[],
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
      let searchResults=await fetch(`/api/searchQuizes`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let searchJson=await searchResults.json();
      //console.log(searchJson);
      let searchResultsFiltered=searchJson.filter((val)=>{return this.state.quizObjectsFiltered.every((val1)=>val.id!==val1.id)})

      this.setState({'searchResults':searchResultsFiltered});
    }
    else if(currentValue===''){
      this.setState({quizObjectsFiltered:[], searchResults:[]});
    }
  }

  searchKeyChange(e){
    let globalState=this.props.state;
    const strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStatic(strSearchKey);}, 1000);
    const quizObjectsFiltered=strSearchKey!==''?globalState.quizesArray.filter((val)=>val.description.toUpperCase().includes(strSearchKey.toUpperCase())):[];
    this.setState({searchKey: strSearchKey, quizObjectsFiltered: quizObjectsFiltered});
  }

  /*async handleSearchSubmit(e){
    if(this.state.searchKey===''){
      alert('Search key is empty/invalid')
    }
    else{
      this.props.showSpinner();
      var reqBody="searchKey="+encodeURIComponent(this.state.searchKey);
      let searchResults=await fetch(`/api/searchQuizes`, {
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
    this.state.quizObjectsFiltered.forEach((item, i) => {
      let itemCopy=Object.assign({},item);
      let desc=item.description;
      if(desc.toUpperCase().includes(this.state.searchKey.toUpperCase())){
          let foundIndex=desc.toUpperCase().indexOf(this.state.searchKey.toUpperCase());
          itemCopy.description=desc.substring(0, foundIndex)+'<strong>'+this.state.searchKey+'</strong>'+desc.substring(foundIndex+this.state.searchKey.length);
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
            Search Quizes
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
                 <b>Quiz Description: </b>
                 <a href={`./quizShowSelected/${obj.id}`}>
                     <div id={`quizDescription$,${obj.id}`}
                     dangerouslySetInnerHTML={{__html: obj.description}}
                     className="Question"></div>
                 </a>
                 <br/>
                 <b>Duration: </b> {obj.duration_minutes}
                 <br/>
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

export default QuizesSearch;
