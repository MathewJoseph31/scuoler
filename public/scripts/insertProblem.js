function validateInsertProblemForm(){

  var answerKey=document.getElementById('answerKey').value;
  if(answerKey==''||isNaN(answerKey)){
     alert("Answerkey should be a number");
    return false;
  }
  return true;
}
