document.body.onload=changeHandler;
/*
document.getElementById('showButton').onclick=makeVisible;

function makeVisible(){
	var qEle=document.getElementById('question');
	var aEle=document.getElementById('answer');
	var html1=qEle.innerHTML;
	var html2=aEle.innerHTML;

	qEle.innerHTML=html2;
	aEle.innerHTML=html1;
	
	document.getElementById('test').appendChild(qEle);
	
	document.getElementById('question').style.visibility='visible';
	document.getElementById('answer').style.visibility='visible';
	return true;
}*/

function changeHandler(){

var i;
var answerElements=document.getElementsByClassName('Answer');
        for(i=0;i<answerElements.length;i++){
             answerElements[i].style.display='none';
         }
var showAnswerElements=document.getElementsByClassName('showAnswer');

}



function showAnswerHandler(id){
 var answerId='d'+id.id.charAt(1);
 //document.getElementById(answerId).style.color='blue';
 if(document.getElementById(answerId).style.display==='none'){
  // document.getElementById(answerId).style.visibility='hidden';
 document.getElementById(answerId).style.display='block';
 }
 else{
   document.getElementById(answerId).style.display='none';
 }
}


