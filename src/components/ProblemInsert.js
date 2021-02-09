import React from 'react';
import {  Redirect } from 'react-router-dom';
import data from "./data";
import {showSpinner, hideSpinner, setProblems, loadQuizes} from '../stores/appStoreActions';

class ProblemInsert extends React.Component{

  constructor(props){
    super(props);
    this.state={
      quizSearchKey:'',
      selectedQuizId:'',
      quizObjectsFiltered:[],
      augmentedQuizObjects:[],
      augmentedQuizObjectsPrior:[],
      quizesAddedArray:[],
      /*quiz_id:null,
      quizType:null,
      quiz_description:"UnAssigned",*/
      description:"",
      solution:"",
      option1:"",
      option2:"",
      option3:"",
      option4:"",
      answerkey:"",
      problemType: "d",
      icons: data.icons
    }
    //this.baseState=this.state;
    //this.quizSelectChange=this.quizSelectChange.bind(this);
    this.descriptionChange=this.descriptionChange.bind(this);
    this.solutionChange=this.solutionChange.bind(this);
    this.option1Change=this.option1Change.bind(this);
    this.option2Change=this.option2Change.bind(this);
    this.option3Change=this.option3Change.bind(this);
    this.option4Change=this.option4Change.bind(this);
    this.answerkeyChange=this.answerkeyChange.bind(this);
    this.handleProblemInsert=this.handleProblemInsert.bind(this);
    this.problemTypeSelectChange=this.problemTypeSelectChange.bind(this);
    this.quizSearchBoxChange=this.quizSearchBoxChange.bind(this);
    this.quizObjectsFilteredClick=this.quizObjectsFilteredClick.bind(this);
    this.checkStatic=this.checkStatic.bind(this);
    this.AddQuizToQuizesArray=this.AddQuizToQuizesArray.bind(this);
    this.removeQuizFromQuizesArray=this.removeQuizFromQuizesArray.bind(this);
  }

  /*quizSelectChange(e){
    let new_quiz_id=e.target.value;
    let new_quiz_description=e.target.options[e.target.selectedIndex].text;
    let new_quiz_type=e.target.options[e.target.selectedIndex].attributes.quiztype.value;
    this.setState({quiz_id:new_quiz_id, quiz_description:new_quiz_description,
                  quizType: new_quiz_type});
  }*/

  quizObjectsFilteredClick(description, id, type, e){
    this.setState({quizSearchKey: description, selectedQuizId:id, selectedQuizType:type, quizObjectsFiltered: [],
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
    else if(currentValue===''){
      this.setState({augmentedQuizObjects:[]});
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

  AddQuizToQuizesArray(e){
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

        if(filteredArray.length>0 && filteredArray[0].type!==this.state.problemType){
            alert('Quiz and Problem should of the same type');
            this.setState({quizSearchKey: '', selectedQuizId: '',
              augmentedQuizObjectsPrior: []})
        }
        else if (filteredArray.length>0){
          let quizesArrayCopy=[...this.state.quizesAddedArray];
          //console.log('filterd quiz object\n'+JSON.stringify(filteredArray[0]));
          quizesArrayCopy.push(filteredArray[0]);
          this.setState({quizesAddedArray: quizesArrayCopy, quizSearchKey: '', selectedQuizId: '',
            augmentedQuizObjectsPrior: []});
        }
  }

  removeQuizFromQuizesArray(e,quizId){
    let quizesArray=this.state.quizesAddedArray.filter(val=>val.id!==quizId);
    this.setState({quizesAddedArray:quizesArray});
    //console.log(quizesArray);
  }

  problemTypeSelectChange(e){
    var new_problemType=e.target.value;
    var new_problemTypeDescription=e.target.options[e.target.selectedIndex].text;
    this.setState({problemType:new_problemType});
    //console.log(new_problemType);
  }

  descriptionChange(e){
    const new_description=e.target.value;
    //console.log(e.target.value);
    this.setState({description:new_description});
  }

  solutionChange(e){
    const new_solution=e.target.value;
    //console.log(e.target.value);
    this.setState({solution:new_solution});
  }

  answerkeyChange(e){
    const new_answerkey=e.target.value;
    //console.log(e.target.value);
    this.setState({answerkey:new_answerkey});
  }

  option1Change(e){
    const new_option1=e.target.value;
    //console.log(e.target.value);
    this.setState({option1:new_option1});
  }

  option2Change(e){
    const new_option2=e.target.value;
    //console.log(e.target.value);
    this.setState({option2:new_option2});
  }

  option3Change(e){
    const new_option3=e.target.value;
    //console.log(e.target.value);
    this.setState({option3:new_option3});
  }

  option4Change(e){
    const new_option4=e.target.value;
    //console.log(e.target.value);
    this.setState({option4:new_option4});
  }

  handleProblemInsert(e){
     let dispatch=this.props.dispatch;
     let globalState=this.props.state;
     if(this.state.problemType==="m" && ![1,2,3,4].includes(parseInt(this.state.answerkey))){
       alert('Answer key should be numeric value in (1,2,3,4) for problem type (Multiple Choice)');
       return;
     }
     /*else if(this.state.quizType!==null&&this.state.quizType!==this.state.problemType){
       alert('Error! selected quiz and problem should  be of the same types');
       return;
     }*/
     else{
       showSpinner(dispatch);
       var reqBody='probDescription='+encodeURIComponent(this.state.description);
       reqBody+='&option1='+encodeURIComponent(this.state.option1);
       reqBody+='&option2='+encodeURIComponent(this.state.option2);
       reqBody+='&option3='+encodeURIComponent(this.state.option3);
       reqBody+='&option4='+encodeURIComponent(this.state.option4);
       reqBody+='&problemType='+encodeURIComponent(this.state.problemType);
       reqBody+='&answerKey='+encodeURIComponent(this.state.answerkey);
       reqBody+='&quizesArray='+encodeURIComponent(JSON.stringify(this.state.quizesAddedArray));
       //reqBody+='&quizId='+encodeURIComponent(this.state.quiz_id);

       var solution=this.state.solution.replace(/%20/g, '+');
       reqBody+='&ansDescription='+encodeURIComponent(solution);
       reqBody+='&authorName='+encodeURIComponent(globalState.loggedInUser);

       fetch(`/api/insertProblemAction`, {
         headers:{
           'Accept':'application/json',
           'Content-type': 'application/x-www-form-urlencoded'
         },
         method: 'POST',
         body: reqBody
       })
       .then(res=>res.json())
       .then(data=>{
             let problemsArrayCopy=[...globalState.problemsArray];
             let obj={
               id: data.problemId,
               //quiz_id: this.state.quiz_id,
               //quiz_description: this.state.quiz_description,
               description:this.state.description,
               solution:this.state.solution,
               option1:this.state.option1,
               option2:this.state.option2,
               option3:this.state.option3,
               option4:this.state.option4,
               answerKey:this.state.answerkey,
               author_id:globalState.loggedInUser
             };
             problemsArrayCopy.push(obj);
             setProblems(problemsArrayCopy, dispatch);
             this.setState({
                           description:"",
                           solution:"",
                           option1:"",
                           option2:"",
                           option3:"",
                           option4:"",
                           answerkey:""}
                         );
            hideSpinner(dispatch);
           //if(data.updatestatus=="ok")
               alert('problem inserted');
               window.location.assign("https://"+window.location.hostname+':'+window.location.port+"/problemsBrowse");
       })
     }//end of else

  }

  render(){
    let globalState=this.props.state;

    if(globalState.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
    }
    let quizObjectsFilteredAugmented=[...this.state.quizObjectsFiltered];
    quizObjectsFilteredAugmented=quizObjectsFilteredAugmented.concat(this.state.augmentedQuizObjects);

    return (
      <div class="InsertWindow">
          <a class="HomeLink" href="/">
              <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
          </a>
          <div class="h1">
            Insert Problem
          </div>
          <fieldset>
              <div className="row">
                  <div id="flexColLeft">
                     Problem Type:
                     <select id="problemType" onChange={this.problemTypeSelectChange} name="problemType">
                        <option value="d">Descriptive</option>
                        <option value="m">Multiple Choice</option>
                      </select>
                      <br/><br/>
                      Problem Description:<br/>
                      <textarea id="probDescription" name="probDescription" rows="10" type="text" style={{width:'90%'}}
                      value={this.state.description}
                      onChange={this.descriptionChange}
                      >
                      </textarea><br/>
                      Answer Description:<br/>
                      <textarea id="ansDescription" name="ansDescription" rows="10" type="text" style={{width:'90%'}}
                      value={this.state.solution}
                      onChange={this.solutionChange}
                      >
                      </textarea>
                      <br/><br/>
                      Quizes:
                      <br/><br/>
                      <div id="AddToDialog">
                          <div className="autocomplete">
                             <input id="searchBox" type="text" name="searchBox"
                             value={this.state.quizSearchKey}
                             onChange={this.quizSearchBoxChange} placeholder="Type first letters of quiz "/>
                             <div className="autocomplete-items">
                             {
                               quizObjectsFilteredAugmented.map(obj=>(<div onClick={(e)=>this.quizObjectsFilteredClick(obj.description, obj.id, obj.type, e)}><strong>{obj.description.substring(0,this.state.quizSearchKey.length)}</strong>{obj.description.substring(this.state.quizSearchKey.length)}({obj.id})</div>))
                             }
                             </div>
                          </div>
                          <input type="submit" value="Add Quiz" onClick={(e)=>this.AddQuizToQuizesArray(e)}/>
                      </div>
                      <br/>
                      <div>
                      {
                          this.state.quizesAddedArray!==undefined?
                          ( this.state.quizesAddedArray.map(objQ=>(
                              <div id={objQ.id}>| {objQ.description}
                               <span className="closeBtn"
                                 onClick={(e)=>this.removeQuizFromQuizesArray(e, objQ.id)}>&times;</span>&nbsp;|
                              </div>
                              )
                            )
                          ):null
                      }
                      </div>
                      {/*<select id="quizId" onChange={this.quizSelectChange} name="quizId">
                          <option value="null" quiztype="null">UnAssigned</option>
                      {
                          this.props.quizesArray.map((objQ, index)=>(
                                     <option value={objQ.id} quiztype={objQ.type}>{objQ.description}</option>
                            )
                          )
                      }
                      </select>*/}
                  </div>
                  <div id="flexColRight">
                          {this.state.problemType==="m"?(<>
                            <br/><br/>
                        Option1: <input type="text" style={{width:'100px'}}
                         onChange={this.option1Change}
                         id="option1" value={this.state.option1}/><br/><br/>
                        Option2: <input type="text" style={{width:'100px'}}
                             onChange={this.option2Change}
                             id="option2" value={this.state.option2}/><br/><br/>
                        Option3: <input type="text" style={{width:'100px'}}
                             onChange={this.option3Change}
                             id="option3" value={this.state.option3}/><br/><br/>
                        Option4: <input type="text" style={{width:'100px'}}
                               onChange={this.option4Change}
                               id="option4" value={this.state.option4}/><br/><br/>
                        Answer Key: <br/>
                        <input type="text" id="answerKey"
                        onChange={this.answerkeyChange}
                        style={{width:'100px'}} value={this.state.answerkey}/></>):null}
                        <br/>
                        <br/>
                        Author:<br/>
                        <input id="authorName" name="authorName" type="text" style={{width:'100px'}}
                        value={globalState.loggedInUser} readonly>
                        </input> <br/><br/><br/>
                        <input type="button"  value="Insert Problem" onClick={this.handleProblemInsert}/>
                  </div>
              </div>
              <div style={{display:'block', paddingTop:'30px', width:'100%'}}>

               </div>
               <div style={{display:'block', paddingTop:'10px', width:'100%'}}>

               </div>
           </fieldset>
      </div>
    )
  }

  componentDidMount(){
    loadQuizes(this.props.dispatch);
    /*if(this.state.quiz_id===undefined&& this.props.quizesArray.length>0)
        this.setState({quiz_id:this.props.quizesArray[0].id, quiz_description:this.props.quizesArray[0].description});*/

  }


}

export default ProblemInsert;
