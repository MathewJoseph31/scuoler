import React from 'react';
import '../css/AddToDialog.css';

class ProblemEditDialog extends React.Component{

  constructor(props){
    super(props);
    this.state={
      quizSearchKey: '',
      selectedQuizId:'',
      quizObjectsFiltered:[],
      augmentedQuizObjects:[],
      augmentedQuizObjectsPrior:[]
    }

    this.quizSearchBoxChange=this.quizSearchBoxChange.bind(this);
    this.quizObjectsFilteredClick=this.quizObjectsFilteredClick.bind(this);
    this.checkStatic=this.checkStatic.bind(this);
  }

  quizObjectsFilteredClick(description, id, e){
    this.setState({quizSearchKey: description, selectedQuizId:id, quizObjectsFiltered: [],
      augmentedQuizObjectsPrior: this.state.augmentedQuizObjects, augmentedQuizObjects:[]})
  }


  async checkStatic(currentValue){
    if(currentValue===this.state.quizSearchKey&&currentValue!==''){
      //console.log('static value'+currentValue);
      var reqBody="searchKey="+encodeURIComponent(currentValue);
      let searchResults=await fetch(`/api/searchQuizesForPrefix`, {
              headers:{
                'Accept':'application/json',
                'Content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              body: reqBody
            });
      let prefixSearchResults=await searchResults.json();

      let augmentedObjects=[];
      prefixSearchResults.forEach(ele=>{
        let len=this.state.quizObjectsFiltered.filter(val=>val.id===ele.id).length;
        if(len<=0)
          augmentedObjects.push(ele);
      })
      //console.log(augmentedObjects);
      this.setState({augmentedQuizObjects:augmentedObjects});
    }
  }


  quizSearchBoxChange(e){
    let globalState=this.props.state;
    let strSearchKey=e.target.value;
    var timer = setTimeout(() => {this.checkStatic(strSearchKey);}, 1000);
    let quizObjectsFiltered=e.target.value!==''?globalState.quizesArray.filter((val)=>val.description.toUpperCase().startsWith(strSearchKey.toUpperCase())):[];
    //const quizObjectsFiltered=this.props.quizesArray.filter((val)=>val.description.toUpperCase().startsWith(e.target.value.toUpperCase()));
    this.setState({quizSearchKey: strSearchKey, quizObjectsFiltered: quizObjectsFiltered});
  }

  AddToQuizSubmit(e){
        let globalState=this.props.state;
        let quizObjectsFilteredAugmented=[...globalState.quizesArray];
        quizObjectsFilteredAugmented=quizObjectsFilteredAugmented.concat(this.state.augmentedQuizObjectsPrior);

        const filteredArray=quizObjectsFilteredAugmented.filter((val)=>val.description.toUpperCase()===this.state.quizSearchKey.toUpperCase()&&val.id===this.state.selectedQuizId);
        if(filteredArray.length<1){
          alert('Search key does not match any available  \n\t quiz description');
        }
        else if(filteredArray.length>1){
          alert('Search key matches multiple quizes\' description!\n\t please choose another one');
        }
        else {
          //console.log('filterd quiz object\n'+JSON.stringify(filteredArray[0]));
          this.props.addQuizToQuizesArraySubmit(filteredArray[0]);
        }
  }

  render(){
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    : "simple-dialog-overlay simple-dialog-display-none";

    const obj=this.props.objectForEdit;

    let globalState=this.props.state;

    const quizesArray=globalState.quizesArray;

    let quizObjectsFilteredAugmented=[...this.state.quizObjectsFiltered];
    quizObjectsFilteredAugmented=quizObjectsFilteredAugmented.concat(this.state.augmentedQuizObjects);

    return (
      <div className={visibilityClassName}>
         <div className="simple-dialog" id="ProblemEditDialog">
             <button id = "x" onClick={this.props.handleDismiss}>
              X
             </button>
             <h2>Edit Problem</h2>
             <hr class="rounded"/>
                 <div className="row">
                     <div id="flexColLeft">
                       Problem Type:
                       <select id="problemType" onChange={this.props.problemTypeSelectChange} name="problemType">
                          <option  value="d" selected={obj.type==="d"?true:false}>Descriptive</option>
                          <option  value="m" selected={obj.type==="m"?true:false}>Multiple Choice</option>
                        </select>
                        <br/><br/>
                       Problem Description:<br/>
                         <textarea id="probDescription" name="probDescription" type="text" rows="10"
                         value={obj.description}
                         onChange={this.props.descriptionChange}
                         style={{width:'90%'}}
                         required="true">
                         </textarea><br/><br/>
                         Answer Description:<br/>
                         <textarea id="ansDescription" name="ansDescription" type="text" rows="10"
                         value={obj.solution}
                         onChange={this.props.solutionChange}
                         style={{width:'90%'}}
                         required="true">
                         </textarea>
                        <br/><br/>
                        Quizes:
                         <div id="AddToDialog">
                             <div className="autocomplete">
                                <input id="searchBox" type="text" name="searchBox"
                                value={this.state.quizSearchKey}
                                onChange={this.quizSearchBoxChange} placeholder="Type first letters of quiz "/>
                                <div className="autocomplete-items">
                                {
                                  quizObjectsFilteredAugmented.map(obj=>(<div onClick={(e)=>this.quizObjectsFilteredClick(obj.description, obj.id, e)}><strong>{obj.description.substring(0,this.state.quizSearchKey.length)}</strong>{obj.description.substring(this.state.quizSearchKey.length)}({obj.id})</div>))
                                }
                                </div>
                             </div>
                             <input type="submit" value="Add Quiz" onClick={(e)=>this.AddToQuizSubmit(e)}/>
                         </div>
                         <br/>
                         <div>
                         {
                             obj.quizesArray!==undefined?
                             ( obj.quizesArray.map(objQ=>(
                                 <div id={objQ.id}>| {objQ.description}
                                  <span className="closeBtn"
                                    onClick={(e)=>this.props.removeQuizFromQuizesArray(e, objQ.id)}>&times;</span>&nbsp;|
                                 </div>
                                 )
                               )
                             ):null
                         }
                         </div>
                     </div>
                     <div id="flexColRight">
                     {obj.type==="m"?(<>
                     <br/><br/><br/>
                          Option1: <br/>
                          <input type="text" style={{width:'50%'}}
                                     onChange={this.props.option1Change}
                                     id="option1" value={obj.option1}/><br/>
                          Option2: <br/>
                          <input type="text" style={{width:'50%'}}
                                   onChange={this.props.option2Change}
                                   id="option2" value={obj.option2}/><br/>
                          Option3: <br/>
                          <input type="text" style={{width:'50%'}}
                                   onChange={this.props.option3Change}
                                   id="option3" value={obj.option3}/><br/>
                          Option4: <br/>
                          <input type="text" style={{width:'50%'}}
                                     onChange={this.props.option4Change}
                                     id="option4" value={obj.option4}/><br/>
                          Answer Key: <br/>
                          <input type="text" id="answerKey"
                          onChange={this.props.answerkeyChange}
                          style={{width:'50%'}} value={obj.answerkey}/>
                          <br/>
                          <br/>
                          </>):null
                        }
                          Author:<br/>
                          <input id="authorName" name="authorName" type="text" style={{width:'80%'}}
                          required="true" value={obj.author_id} readonly>
                          </input> <br/><br/><br/><br/>
                         <input type="button" id="x" value="Save" style={{width:'80%', float: "right"}}
                          onClick={this.props.handleSubmit}/><br/><br/>
                         <button id="x" style={{width:'80%', textAlign:'center'}}
                          onClick={(e)=>{
                                        this.setState({
                                          quizSearchKey: '',
                                          selectedQuizId:'',
                                          quizObjectsFiltered:[],
                                          augmentedQuizObjects:[],
                                          augmentedQuizObjectsPrior:[]
                                        });
                                        this.props.handleDismiss(e);
                                        }
                                  }>close
                         </button>
                     </div>
                </div>
         </div>
         <br/>
         <br/>
      </div>
    )
  }

}

export default ProblemEditDialog;
