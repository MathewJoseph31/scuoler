document.body.onload=changeHandler;


function startQuizHandler(element){
  var decision=confirm('Your answers may be stored/recorded. Are you sure you want to start the Quiz ');
  if(decision){
    //window.location="startTheQuiz?id="+element.id.substring(12);
    var problemDiv=document.getElementById('ProblemList');
    //document.getElementById(answerId).style.color='blue';
    if(problemDiv.style.display!='block'){
     // document.getElementById(answerId).style.visibility='hidden';
      problemDiv.style.display='block';
      element.style.display='none';
    }
  }
}
