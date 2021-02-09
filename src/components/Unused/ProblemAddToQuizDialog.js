import React from 'react';
import '../css/AddToDialog.css';

class ProblemAddToQuizDialog extends React.Component{

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
          const filteredArray=this.props.objectsArray.filter((val)=>val.description.toUpperCase()===this.state.searchKey.toUpperCase());
          if(filteredArray.length<1){
            alert('Search key does not match any available  \n\t quiz description');
          }
          else if(filteredArray.length>1){
            alert('Search key matches multiple quizes\' description!\n\t please choose another one');
          }
          else {
            //console.log('source problem object\n'+JSON.stringify(this.props.sourceObject));
            //console.log('filterd quiz object\n'+JSON.stringify(filteredArray[0]));

            var reqBody="problemId="+encodeURIComponent(this.props.sourceObject.id);
            reqBody+="&quizId="+encodeURIComponent(filteredArray[0].id);
            fetch(`/api/addProblemToQuiz`, {
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
                    alert('problem already in quiz');
                }
                else if(data.addstatus==="ok") {
                    alert('problem added to quiz');
                }
            })

            this.props.handleDismiss();
          }
    }

  searchBoxChange(e){
    //const countriesFiltered=e.target.value!==''?this.state.countries.filter((val)=>val.toUpperCase().startsWith(e.target.value.toUpperCase())):[];
    //this.setState({searchKey: e.target.value, searchAugments: countriesFiltered});
    const objectsFiltered=e.target.value!==''?this.props.objectsArray.filter((val)=>val.description.toUpperCase().startsWith(e.target.value.toUpperCase())):[];
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
                     <b>Options:</b>
                     <br/> 1) <label>{this.props.sourceObject!==null?this.props.sourceObject.option1:''}</label>
                     <br/> 2) <label>{this.props.sourceObject!==null?this.props.sourceObject.option2:''}</label>
                     <br/> 3) <label>{this.props.sourceObject!==null?this.props.sourceObject.option3:''}</label>
                     <br/> 4) <label>{this.props.sourceObject!==null?this.props.sourceObject.option4:''}</label>
                      <br/><strong>...</strong>
               </div>

               <br/>
               <div className="autocomplete">
                  <input id="searchBox" type="text" name="searchBox"
                  value={this.state.searchKey}
                  onChange={this.searchBoxChange} placeholder="search key"/>
                  <div className="autocomplete-items">
                  {
                    this.state.objectsFiltered.map(obj=>(<div onClick={(e)=>this.objectsFilteredClick(obj.description, e)}><strong>{obj.description.substring(0,this.state.searchKey.length)}</strong>{obj.description.substring(this.state.searchKey.length)}</div>))
                  }
                  </div>
               </div>
               <input type="submit" value={this.props.submitMessage} onClick={this.AddToDialogSubmit}/>
            </div>
        </div>
    )
  }
}

export default ProblemAddToQuizDialog;
