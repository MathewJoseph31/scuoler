import React from 'react';
import '../css/AddToDialog.css';

class QuizAddToCourseDialog extends React.Component{

  constructor(props){
      super(props);
      this.state={
           searchKey: '',
           objectsFiltered:[]
      };

      this.searchBoxChange=this.searchBoxChange.bind(this);
      this.objectsFilteredClick=this.objectsFilteredClick.bind(this);
      this.AddToDialogSubmit=this.AddToDialogSubmit.bind(this);
    }


    objectsFilteredClick(str, e){
      this.setState({searchKey: str, objectsFiltered: []})
    }

  AddToDialogSubmit(e){
        const filteredArray=this.props.objectsArray.filter((val)=>val[this.props.searchAttribute].toUpperCase()===this.state.searchKey.toUpperCase());

        if(filteredArray.length<1){
          alert('Search key does not match any available  '+this.props.searchAttribute);
        }
        else if(filteredArray.length>1){
          alert('Search key matches multiple \' '+ this.props.searchAttribute +'!\n\t please choose another one');
        }
        else {
          //console.log('source quiz object\n'+JSON.stringify(this.props.sourceObject));
          //console.log('filtered course object\n'+JSON.stringify(filteredArray[0]));

          var reqBody="quizId="+encodeURIComponent(this.props.sourceObject.id);
          reqBody+="&courseId="+encodeURIComponent(filteredArray[0].id);
          fetch(`/api/addQuizToCourse`, {
            headers:{
              'Accept':'application/json',
              'Content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: reqBody
          })
          .then(res=>res.json())
          .then(data=>{
             console.log(data);
              if(data.addstatus==="redundant"){
                  alert('quiz already in course');
              }
              else if(data.addstatus==="ok") {
                  alert('quiz added to course');
              }
          })

          this.props.handleDismiss();
        }
  }

  searchBoxChange(e){
    //const countriesFiltered=e.target.value!==''?this.state.countries.filter((val)=>val.toUpperCase().startsWith(e.target.value.toUpperCase())):[];
    //this.setState({searchKey: e.target.value, searchAugments: countriesFiltered});
    const objectsFiltered=e.target.value!==''?this.props.objectsArray.filter((val)=>val[this.props.searchAttribute].toUpperCase().startsWith(e.target.value.toUpperCase())):[];
    this.setState({searchKey: e.target.value, objectsFiltered: objectsFiltered});
  }

  render(){
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    : "simple-dialog-overlay simple-dialog-display-none";

    return (
        <div className={visibilityClassName}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
           <div className="simple-dialog" id="AddToDialog">
               <button id = "x" onClick={this.props.handleDismiss}>
                X
               </button>
               <h2>{this.props.titleMessage}</h2>
               <hr class="rounded"/>
               <div style={{borderStyle: 'solid', color:'darkgray'}}>
                    <h2>{this.props.sourceTitleMessage}</h2>
                     <b>Description:</b><br/>
                     <div id={`Description$,${this.props.sourceObject!==undefined?this.props.sourceObject.id:''}`}
                     dangerouslySetInnerHTML={{__html: this.props.sourceObject!==undefined?this.props.sourceObject.description:""}}
                     className="Question"></div>
                     <br/>
                      <b>Duration (minutes):</b> {this.props.sourceObject.duration_minutes} <br/><br/>
                      <b> Instructor:</b> {this.props.sourceObject.instructorId}
                      <br/><strong>...</strong>
               </div>

               <br/>
               <div className="autocomplete">
                  <input id="searchBox" type="text" name="searchBox"
                  value={this.state.searchKey}
                  onChange={this.searchBoxChange} placeholder="search key"/>
                  <div className="autocomplete-items">
                  {
                    this.state.objectsFiltered.map(obj=>(<div onClick={(e)=>this.objectsFilteredClick(obj[this.props.searchAttribute], e)}><strong>{obj[this.props.searchAttribute].substring(0,this.state.searchKey.length)}</strong>{obj[this.props.searchAttribute].substring(this.state.searchKey.length)}</div>))
                  }
                  </div>
               </div>
               <input type="submit" value={this.props.submitMessage} onClick={this.AddToDialogSubmit}/>
            </div>
        </div>
    )
  }
}

export default QuizAddToCourseDialog;
