function showQuizResultHandler(ele){
  var decision=confirm('Are you sure you want to view the Quiz Results?');
  if(decision){
    //window.location="startTheQuiz?id="+element.id.substring(12);
    var resultDiv=document.getElementById('AnswerList');
    //document.getElementById(answerId).style.color='blue';
    if(resultDiv.style.display!='block'){
     // document.getElementById(answerId).style.visibility='hidden';
      resultDiv.style.display='block';
      ele.style.display='none';
    }
  }
}
