document.body.onload=changeHandler;


function startQuizHandler(element){
  var decision=confirm('Your answers may be stored/recorded. Are you sure you want to start the Quiz ');
  if(decision){
    window.location="startTheQuiz?id="+element.id.substring(12);
  }
}
